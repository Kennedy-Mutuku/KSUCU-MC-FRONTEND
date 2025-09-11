import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import styles from '../styles/RequisitionsAdmin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBox, 
    faEdit, 
    faCheck, 
    faTimes,
    faDownload,
    faUser,
    faClock,
    faFileAlt
} from '@fortawesome/free-solid-svg-icons';

interface RequisitionItem {
    id: string;
    itemName: string;
    quantity: number;
    description?: string;
}

interface RequisitionForm {
    _id?: string;
    id?: string;
    recipientName: string;
    recipientPhone: string;
    items: RequisitionItem[];
    timeReceived: string;
    timeToReturn: string;
    totalAmount: number;
    purpose: string;
    status: 'pending' | 'approved' | 'released' | 'returned' | 'rejected';
    submittedAt: string;
    releasedBy?: string;
    releasedAt?: string;
    returnedAt?: string;
    comments?: string;
}

const RequisitionsAdmin: React.FC = () => {
    const [requisitions, setRequisitions] = useState<RequisitionForm[]>([]);
    const [filteredRequisitions, setFilteredRequisitions] = useState<RequisitionForm[]>([]);
    const [selectedRequisition, setSelectedRequisition] = useState<RequisitionForm | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [editingRequisition, setEditingRequisition] = useState<RequisitionForm | null>(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [adminPhone, setAdminPhone] = useState<string>('');

    React.useEffect(() => {
        const adminAuth = sessionStorage.getItem('adminAuth');
        if (adminAuth === 'Overseer') {
            setAuthenticated(true);
        }
        // Load admin phone number from API first, fallback to localStorage
        loadAdminPhone();
    }, []);

    const loadAdminPhone = async () => {
        try {
            console.log('Admin loading phone from API...');
            const response = await axios.get(`${backEndURL}/api/settings/admin-contact-phone`, {
                withCredentials: true,
                timeout: 5000
            });
            console.log('Admin phone API response:', response.data);
            setAdminPhone(response.data.value || '');
            // Update localStorage with latest value
            localStorage.setItem('admin-contact-phone', response.data.value || '');
            console.log('Admin phone loaded successfully:', response.data.value);
        } catch (error) {
            console.error('Error loading admin phone from API:', error);
            // Fallback to localStorage
            const savedPhone = localStorage.getItem('admin-contact-phone') || '';
            console.log('Admin using fallback phone from localStorage:', savedPhone);
            setAdminPhone(savedPhone);
        }
    };
    const [filterStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [releasedBy, setReleasedBy] = useState('');
    const [comments, setComments] = useState('');
    const [loading, setLoading] = useState(true);

    const backEndURL = 'https://ksucu-mc.co.ke';

    useEffect(() => {
        loadRequisitions();
        // Refresh requisitions every 30 seconds
        const interval = setInterval(loadRequisitions, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        filterRequisitions(requisitions, filterStatus, searchTerm);
    }, [requisitions, filterStatus, searchTerm]);

    const loadRequisitions = async () => {
        try {
            const response = await axios.get(`${backEndURL}/api/requisitions`, {
                withCredentials: true
            });
            setRequisitions(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading requisitions:', error);
            // Fallback to localStorage if API fails
            const savedRequisitions = JSON.parse(localStorage.getItem('ksucu-requisitions') || '[]');
            setRequisitions(savedRequisitions);
            setLoading(false);
        }
    };

    const filterRequisitions = (reqs: RequisitionForm[], status: string, search: string) => {
        let filtered = reqs;

        if (status !== 'all') {
            filtered = filtered.filter(req => req.status === status);
        }

        if (search) {
            filtered = filtered.filter(req => 
                req.recipientName.toLowerCase().includes(search.toLowerCase()) ||
                req.purpose.toLowerCase().includes(search.toLowerCase()) ||
                req.items.some(item => item.itemName.toLowerCase().includes(search.toLowerCase()))
            );
        }

        setFilteredRequisitions(filtered.sort((a, b) => 
            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        ));
    };

    const updateRequisition = async (updatedReq: RequisitionForm) => {
        try {
            const reqId = updatedReq._id || updatedReq.id;
            await axios.put(
                `${backEndURL}/api/requisitions/${reqId}`,
                updatedReq,
                { withCredentials: true }
            );
            
            // Reload all requisitions to ensure consistency
            await loadRequisitions();
        } catch (error) {
            console.error('Error updating requisition:', error);
            // Fallback to localStorage update
            const updatedRequisitions = requisitions.map(req => 
                (req._id === updatedReq._id || req.id === updatedReq.id) ? updatedReq : req
            );
            setRequisitions(updatedRequisitions);
            localStorage.setItem('ksucu-requisitions', JSON.stringify(updatedRequisitions));
        }
    };

    const handleStatusUpdate = async (requisition: RequisitionForm, newStatus: 'approved' | 'rejected' | 'pending') => {
        try {
            const reqId = requisition._id || requisition.id;
            const updateData: any = { status: newStatus };

            // For approved/rejected status, include overseer details
            if ((newStatus === 'approved' || newStatus === 'rejected') && releasedBy) {
                updateData.releasedBy = releasedBy;
                updateData.releasedAt = new Date().toISOString();
            }
            
            // For rejected status without overseer name, use default
            if (newStatus === 'rejected' && !releasedBy) {
                updateData.releasedBy = 'System Admin';
                updateData.releasedAt = new Date().toISOString();
            }
            
            // For reset to pending, clear processing data
            if (newStatus === 'pending') {
                updateData.releasedBy = undefined;
                updateData.releasedAt = undefined;
            }

            if (comments) {
                updateData.comments = comments;
            }

            await axios.patch(
                `${backEndURL}/api/requisitions/${reqId}/status`,
                updateData,
                { withCredentials: true }
            );
            
            // Reload all requisitions
            await loadRequisitions();
            setReleasedBy('');
            setComments('');
            setEditingRequisition(null);
        } catch (error) {
            console.error('Error updating status:', error);
            // Fallback to local update
            const updatedReq = { ...requisition, status: newStatus };
            if ((newStatus === 'approved' || newStatus === 'rejected') && releasedBy) {
                updatedReq.releasedBy = releasedBy;
                updatedReq.releasedAt = new Date().toISOString();
            }
            if (newStatus === 'rejected' && !releasedBy) {
                updatedReq.releasedBy = 'System Admin';
                updatedReq.releasedAt = new Date().toISOString();
            }
            if (newStatus === 'pending') {
                updatedReq.releasedBy = undefined;
                updatedReq.releasedAt = undefined;
            }
            if (comments) {
                updatedReq.comments = comments;
            }
            await updateRequisition(updatedReq);
            setEditingRequisition(null);
        }
    };

    const saveAdminPhone = async () => {
        if (!adminPhone.trim()) {
            alert('Please enter a phone number before saving.');
            return;
        }
        
        try {
            console.log('Saving admin phone to API:', adminPhone);
            console.log('Using backend URL:', backEndURL);
            
            // Save to backend API first
            const response = await axios.put(`${backEndURL}/api/settings/admin-contact-phone`, {
                value: adminPhone,
                description: 'Admin contact phone number for requisition inquiries'
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: false, // Try without credentials first
                timeout: 15000
            });
            
            console.log('Save response:', response.data);
            
            // Also save to localStorage as backup
            localStorage.setItem('admin-contact-phone', adminPhone);
            alert('✅ Contact phone number saved successfully! It will now be visible to users on the requisition page.');
        } catch (error: any) {
            console.error('Error saving admin phone:', error);
            console.error('Error details:', error.response?.data || error.message);
            
            // Try fallback approach with different configuration
            try {
                console.log('Trying fallback API call...');
                const fallbackResponse = await axios({
                    method: 'PUT',
                    url: `${backEndURL}/api/settings/admin-contact-phone`,
                    data: {
                        value: adminPhone,
                        description: 'Admin contact phone number for requisition inquiries'
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    timeout: 20000
                });
                
                console.log('Fallback response:', fallbackResponse.data);
                localStorage.setItem('admin-contact-phone', adminPhone);
                alert('✅ Contact phone number saved successfully via fallback method!');
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
                // Final fallback to localStorage only
                localStorage.setItem('admin-contact-phone', adminPhone);
                alert('⚠️ Phone number saved locally only. There was an issue connecting to the server, but users can still see the number from cache.');
            }
        }
    };

    const downloadPDF = (requisition: RequisitionForm) => {
        const submissionDate = new Date(requisition.submittedAt).toLocaleDateString('en-GB');
        const receiveDate = new Date(requisition.timeReceived).toLocaleDateString('en-GB');
        const returnDate = new Date(requisition.timeToReturn).toLocaleDateString('en-GB');
        
        // Create a compact, one-page official requisition document with official letterhead
        const content = `
================================================================================
                    KISII UNIVERSITY CHRISTIAN UNION - MAIN CAMPUS
                                 KSUCU-MC
                              
         P.O BOX 408-40200, KISII, KENYA • www.ksucumc.org
              ksuchristianunion@gmail.com • Tel: ${adminPhone || '+254 712 345 678'}
================================================================================
                         EQUIPMENT REQUISITION FORM
                          REF: KSUCU/EQP/${(requisition._id || requisition.id)?.toString().slice(-8).toUpperCase()}
================================================================================

APPLICANT DETAILS:
Name: ${requisition.recipientName.toUpperCase()}    Phone: ${requisition.recipientPhone}
Purpose: ${requisition.purpose}
Date Applied: ${submissionDate}    Status: ${requisition.status.toUpperCase()}

ITEMS REQUESTED:
${requisition.items.map((item, index) => 
    `${index + 1}. ${item.itemName} - Qty: ${item.quantity}${item.description ? ` (${item.description})` : ''}`
).join('\n')}

SCHEDULE:
Collection: ${receiveDate} at ${new Date(requisition.timeReceived).toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'})}
Return: ${returnDate} at ${new Date(requisition.timeToReturn).toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'})}
Est. Cost: KES ${requisition.totalAmount.toLocaleString('en-KE', {minimumFractionDigits: 2})}

PROCESSING INFO:
${requisition.releasedBy ? `Processed by: ${requisition.releasedBy}` : 'Awaiting Processing'}
${requisition.releasedAt ? `Date: ${new Date(requisition.releasedAt).toLocaleDateString('en-GB')}` : ''}
Overseer Phone: ${adminPhone || 'N/A'}
Comments: ${requisition.comments || 'None'}

================================================================================
                              AUTHORIZATIONS
================================================================================

APPLICANT:
I hereby apply for the above equipment and agree to all terms and conditions.

Signature: _____________________  Date: _________  Name: ${requisition.recipientName}

COMMITTEE REVIEW:
Name: ________________________  Signature: _______________  Date: _________

FINAL APPROVAL (OVERSEER/CHAIRMAN):
Name: ${requisition.releasedBy || '________________________'}  Phone: ${adminPhone || '___________'}
Signature: ____________________  Date: _________  [OFFICIAL STAMP]

EQUIPMENT HANDLING:
Released by: ___________________  Date/Time: _______  Condition: ___________
Returned by: __________________  Date/Time: _______  Condition: ___________
Received by: __________________  Signature: ______________

================================================================================
TERMS: 1) Full responsibility from collection to return 2) Report damage immediately
3) Return on time (KES 200/day penalty) 4) Handle with care 5) No transfers
6) Committee resolves disputes

Generated: ${new Date().toLocaleString('en-GB')} | Auth: ${Math.random().toString(36).substr(2, 6).toUpperCase()}
© ${new Date().getFullYear()} KSUCU-MC. All Rights Reserved.
================================================================================
        `;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `KSUCU_Official_Requisition_${(requisition._id || requisition.id)?.toString().slice(-8).toUpperCase()}_${requisition.recipientName.replace(/\s+/g, '_').toUpperCase()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#ffc107';
            case 'approved': return '#28a745';
            case 'rejected': return '#dc3545';
            default: return '#6c757d';
        }
    };

    if (!authenticated) {
        return (
            <>
                <UniversalHeader />
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1>Requisitions Admin - Authentication Required</h1>
                        <p>Please access this page through the Password Overseer dashboard.</p>
                        <button 
                            onClick={() => window.location.href = '/worship-docket-admin'}
                            style={{
                                padding: '10px 20px',
                                background: '#730051',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Go to Admin Dashboard
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <UniversalHeader />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>
                        <FontAwesomeIcon icon={faBox} />
                        Requisitions Management
                    </h1>
                    <p>Manage equipment and item requisition requests</p>
                </div>

                {/* Admin Phone Setting */}
                <div className={styles.adminSettings}>
                    <div className={styles.phoneSettingRow}>
                        <label>Contact Phone Number (for requisition inquiries):</label>
                        <div className={styles.phoneInputGroup}>
                            <input
                                type="tel"
                                placeholder="Enter admin contact phone"
                                value={adminPhone}
                                onChange={(e) => setAdminPhone(e.target.value)}
                                className={styles.phoneInput}
                            />
                            <button onClick={saveAdminPhone} className={styles.savePhoneButton}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className={styles.filtersSection}>
                    <div className={styles.searchGroup}>
                        <input
                            type="text"
                            placeholder="Search by name, purpose, or item..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                filterRequisitions(requisitions, filterStatus, e.target.value);
                            }}
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                {/* Requisitions Table */}
                <div className={styles.requisitionsTable}>
                    <div className={styles.statsBar}>
                        <span>Total: {filteredRequisitions.length}</span>
                        <span>Pending: {filteredRequisitions.filter(r => r.status === 'pending').length}</span>
                        <span>Approved: {filteredRequisitions.filter(r => r.status === 'approved').length}</span>
                        <span>Rejected: {filteredRequisitions.filter(r => r.status === 'rejected').length}</span>
                    </div>

                    {filteredRequisitions.length === 0 ? (
                        <div className={styles.emptyState}>
                            <FontAwesomeIcon icon={faBox} size="3x" />
                            <h3>No Requisitions Found</h3>
                            <p>{loading ? 'Loading requisitions...' : 'No requisitions match your current search'}</p>
                        </div>
                    ) : (
                        <div className={styles.tableContainer}>
                            <table className={styles.requisitionsGrid}>
                                <thead>
                                    <tr>
                                        <th>Pending</th>
                                        <th>Approved</th>
                                        <th>Rejected</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className={styles.statusColumn}>
                                            {filteredRequisitions.filter(r => r.status === 'pending').map((requisition) => (
                                                <div 
                                                    key={requisition._id || requisition.id} 
                                                    className={styles.requisitionItem}
                                                    onClick={() => {
                                                        setSelectedRequisition(requisition);
                                                        setShowDetails(true);
                                                    }}
                                                >
                                                    <div className={styles.itemHeader}>
                                                        <div className={styles.commodityTitle}>
                                                            {requisition.items.map(item => item.itemName).join(', ')}
                                                        </div>
                                                    </div>
                                                    <div className={styles.itemMeta}>
                                                        <span>By: {requisition.recipientName}</span>
                                                        <span>Submitted: {new Date(requisition.submittedAt).toLocaleDateString()}</span>
                                                        <span>Time: {new Date(requisition.submittedAt).toLocaleTimeString()}</span>
                                                    </div>
                                                    <div className={styles.itemActions}>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditingRequisition(requisition);
                                                            }}
                                                            className={styles.actionButton}
                                                        >
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                downloadPDF(requisition);
                                                            }}
                                                            className={styles.actionButton}
                                                        >
                                                            <FontAwesomeIcon icon={faDownload} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </td>
                                        <td className={styles.statusColumn}>
                                            {filteredRequisitions.filter(r => r.status === 'approved').map((requisition) => (
                                                <div 
                                                    key={requisition._id || requisition.id} 
                                                    className={styles.requisitionItem}
                                                    onClick={() => {
                                                        setSelectedRequisition(requisition);
                                                        setShowDetails(true);
                                                    }}
                                                >
                                                    <div className={styles.itemHeader}>
                                                        <div className={styles.commodityTitle}>
                                                            {requisition.items.map(item => item.itemName).join(', ')}
                                                        </div>
                                                    </div>
                                                    <div className={styles.itemMeta}>
                                                        <span>By: {requisition.recipientName}</span>
                                                        <span>Submitted: {new Date(requisition.submittedAt).toLocaleDateString()}</span>
                                                        <span>Time: {new Date(requisition.submittedAt).toLocaleTimeString()}</span>
                                                    </div>
                                                    <div className={styles.itemActions}>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditingRequisition(requisition);
                                                            }}
                                                            className={styles.actionButton}
                                                        >
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                downloadPDF(requisition);
                                                            }}
                                                            className={styles.actionButton}
                                                        >
                                                            <FontAwesomeIcon icon={faDownload} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </td>
                                        <td className={styles.statusColumn}>
                                            {filteredRequisitions.filter(r => r.status === 'rejected').map((requisition) => (
                                                <div 
                                                    key={requisition._id || requisition.id} 
                                                    className={styles.requisitionItem}
                                                    onClick={() => {
                                                        setSelectedRequisition(requisition);
                                                        setShowDetails(true);
                                                    }}
                                                >
                                                    <div className={styles.itemHeader}>
                                                        <div className={styles.commodityTitle}>
                                                            {requisition.items.map(item => item.itemName).join(', ')}
                                                        </div>
                                                    </div>
                                                    <div className={styles.itemMeta}>
                                                        <span>By: {requisition.recipientName}</span>
                                                        <span>Submitted: {new Date(requisition.submittedAt).toLocaleDateString()}</span>
                                                        <span>Time: {new Date(requisition.submittedAt).toLocaleTimeString()}</span>
                                                    </div>
                                                    <div className={styles.itemActions}>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                downloadPDF(requisition);
                                                            }}
                                                            className={styles.actionButton}
                                                        >
                                                            <FontAwesomeIcon icon={faDownload} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Details Modal */}
                {showDetails && selectedRequisition && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.detailsModal}>
                            <div className={styles.modalHeader}>
                                <h3>Requisition Details</h3>
                                <button onClick={() => setShowDetails(false)} className={styles.closeButton}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            <div className={styles.modalBody}>
                                <div className={styles.detailsGrid}>
                                    <div className={styles.detailSection}>
                                        <h4><FontAwesomeIcon icon={faUser} /> Recipient Information</h4>
                                        <p><strong>Name:</strong> {selectedRequisition.recipientName}</p>
                                        <p><strong>Phone:</strong> {selectedRequisition.recipientPhone}</p>
                                        <p><strong>Purpose:</strong> {selectedRequisition.purpose}</p>
                                    </div>

                                    <div className={styles.detailSection}>
                                        <h4><FontAwesomeIcon icon={faBox} /> Items</h4>
                                        {selectedRequisition.items.map((item, index) => (
                                            <div key={item.id} className={styles.itemDetail}>
                                                <p><strong>{index + 1}. {item.itemName}</strong></p>
                                                <p>Quantity: {item.quantity}</p>
                                                {item.description && <p>Description: {item.description}</p>}
                                            </div>
                                        ))}
                                    </div>

                                    <div className={styles.detailSection}>
                                        <h4><FontAwesomeIcon icon={faClock} /> Schedule</h4>
                                        <p><strong>Pick-up Time:</strong> {new Date(selectedRequisition.timeReceived).toLocaleString()}</p>
                                        <p><strong>Return Time:</strong> {new Date(selectedRequisition.timeToReturn).toLocaleString()}</p>
                                        <p><strong>Expected Amount:</strong> KES {selectedRequisition.totalAmount.toFixed(2)}</p>
                                    </div>

                                    <div className={styles.detailSection}>
                                        <h4><FontAwesomeIcon icon={faFileAlt} /> Status Information</h4>
                                        <p><strong>Status:</strong> 
                                            <span 
                                                className={styles.statusBadge}
                                                style={{ backgroundColor: getStatusColor(selectedRequisition.status) }}
                                            >
                                                {selectedRequisition.status}
                                            </span>
                                        </p>
                                        <p><strong>Submitted:</strong> {new Date(selectedRequisition.submittedAt).toLocaleString()}</p>
                                        {selectedRequisition.releasedBy && (
                                            <p><strong>Released By:</strong> {selectedRequisition.releasedBy}</p>
                                        )}
                                        {selectedRequisition.releasedAt && (
                                            <p><strong>Released At:</strong> {new Date(selectedRequisition.releasedAt).toLocaleString()}</p>
                                        )}
                                        {selectedRequisition.returnedAt && (
                                            <p><strong>Returned At:</strong> {new Date(selectedRequisition.returnedAt).toLocaleString()}</p>
                                        )}
                                        {selectedRequisition.comments && (
                                            <p><strong>Comments:</strong> {selectedRequisition.comments}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {editingRequisition && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.editModal}>
                            <div className={styles.modalHeader}>
                                <h3>Update Requisition Status</h3>
                                <button onClick={() => setEditingRequisition(null)} className={styles.closeButton}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            <div className={styles.modalBody}>
                                <div className={styles.editForm}>
                                    <div className={styles.formGroup}>
                                        <label>Current Status: <strong>{editingRequisition.status}</strong></label>
                                    </div>

                                    {editingRequisition.status === 'pending' && (
                                        <>
                                            <div className={styles.formGroup}>
                                                <label>Overseer/Reviewer Name</label>
                                                <input
                                                    type="text"
                                                    value={releasedBy}
                                                    onChange={(e) => setReleasedBy(e.target.value)}
                                                    placeholder="Enter your name for approval"
                                                    required
                                                />
                                            </div>
                                            <div className={styles.actionButtons}>
                                                <button
                                                    onClick={() => handleStatusUpdate(editingRequisition, 'approved')}
                                                    className={styles.approveButton}
                                                    disabled={!releasedBy}
                                                >
                                                    <FontAwesomeIcon icon={faCheck} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(editingRequisition, 'rejected')}
                                                    className={styles.rejectButton}
                                                >
                                                    <FontAwesomeIcon icon={faTimes} /> Reject
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {(editingRequisition.status === 'approved' || editingRequisition.status === 'rejected') && (
                                        <div className={styles.statusInfo}>
                                            <p><strong>Status:</strong> {editingRequisition.status.toUpperCase()}</p>
                                            {editingRequisition.releasedBy && (
                                                <p><strong>Processed by:</strong> {editingRequisition.releasedBy}</p>
                                            )}
                                            {editingRequisition.releasedAt && (
                                                <p><strong>Date:</strong> {new Date(editingRequisition.releasedAt).toLocaleString()}</p>
                                            )}
                                            <div className={styles.actionButtons}>
                                                <button
                                                    onClick={() => handleStatusUpdate(editingRequisition, 'pending')}
                                                    className={styles.pendingButton}
                                                >
                                                    ↻ Reset to Pending
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className={styles.formGroup}>
                                        <label>Comments (Optional)</label>
                                        <textarea
                                            value={comments}
                                            onChange={(e) => setComments(e.target.value)}
                                            placeholder="Add any comments or notes..."
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default RequisitionsAdmin;