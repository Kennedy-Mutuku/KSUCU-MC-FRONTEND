import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import styles from '../styles/RequisitionsAdmin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPackage, 
    faEye, 
    faEdit, 
    faTrash, 
    faCheck, 
    faTimes,
    faDownload,
    faCalendarAlt,
    faUser,
    faClock,
    faFileAlt,
    faFilter
} from '@fortawesome/free-solid-svg-icons';

interface RequisitionItem {
    id: string;
    itemName: string;
    quantity: number;
    description?: string;
}

interface RequisitionForm {
    id: string;
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
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [releasedBy, setReleasedBy] = useState('');
    const [comments, setComments] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        loadRequisitions();
        
        // Listen for requisitions updates from user side
        const handleRequisitionsUpdated = (e: CustomEvent) => {
            setRequisitions(e.detail);
            filterRequisitions(e.detail, filterStatus, searchTerm);
        };

        // Listen for localStorage changes (cross-tab sync)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'ksucu-requisitions' && e.newValue) {
                try {
                    const updatedRequisitions = JSON.parse(e.newValue);
                    setRequisitions(updatedRequisitions);
                    filterRequisitions(updatedRequisitions, filterStatus, searchTerm);
                } catch (error) {
                    console.error('Error parsing updated requisitions:', error);
                }
            }
        };

        window.addEventListener('requisitionsUpdated', handleRequisitionsUpdated as EventListener);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('requisitionsUpdated', handleRequisitionsUpdated as EventListener);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [filterStatus, searchTerm]);

    const loadRequisitions = () => {
        const savedRequisitions = JSON.parse(localStorage.getItem('ksucu-requisitions') || '[]');
        setRequisitions(savedRequisitions);
        filterRequisitions(savedRequisitions, filterStatus, searchTerm);
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

    const updateRequisition = (updatedReq: RequisitionForm) => {
        const updatedRequisitions = requisitions.map(req => 
            req.id === updatedReq.id ? updatedReq : req
        );
        setRequisitions(updatedRequisitions);
        localStorage.setItem('ksucu-requisitions', JSON.stringify(updatedRequisitions));
        
        // Dispatch event for sync
        window.dispatchEvent(new CustomEvent('requisitionsUpdated', { 
            detail: updatedRequisitions 
        }));

        filterRequisitions(updatedRequisitions, filterStatus, searchTerm);
    };

    const handleStatusUpdate = (requisition: RequisitionForm, newStatus: 'approved' | 'rejected' | 'released' | 'returned') => {
        const updatedReq = { ...requisition, status: newStatus };

        if (newStatus === 'released' && releasedBy) {
            updatedReq.releasedBy = releasedBy;
            updatedReq.releasedAt = new Date().toISOString();
        }

        if (newStatus === 'returned') {
            updatedReq.returnedAt = new Date().toISOString();
        }

        if (comments) {
            updatedReq.comments = comments;
        }

        updateRequisition(updatedReq);
        setReleasedBy('');
        setComments('');
        setEditingRequisition(null);
    };

    const deleteRequisition = (id: string) => {
        if (window.confirm('Are you sure you want to delete this requisition?')) {
            const updatedRequisitions = requisitions.filter(req => req.id !== id);
            setRequisitions(updatedRequisitions);
            localStorage.setItem('ksucu-requisitions', JSON.stringify(updatedRequisitions));
            filterRequisitions(updatedRequisitions, filterStatus, searchTerm);
            setShowDetails(false);
        }
    };

    const downloadPDF = (requisition: RequisitionForm) => {
        // Create a simple PDF-like content
        const content = `
KSUCU-MC EQUIPMENT REQUISITION

Requisition ID: ${requisition.id}
Date Submitted: ${new Date(requisition.submittedAt).toLocaleDateString()}
Status: ${requisition.status.toUpperCase()}

RECIPIENT INFORMATION:
Name: ${requisition.recipientName}
Phone: ${requisition.recipientPhone}

ITEMS REQUESTED:
${requisition.items.map((item, index) => 
    `${index + 1}. ${item.itemName} (Qty: ${item.quantity})${item.description ? ` - ${item.description}` : ''}`
).join('\n')}

SCHEDULE:
Purpose: ${requisition.purpose}
Time to Receive: ${new Date(requisition.timeReceived).toLocaleString()}
Time to Return: ${new Date(requisition.timeToReturn).toLocaleString()}
Expected Amount: KES ${requisition.totalAmount.toFixed(2)}

${requisition.releasedBy ? `Released By: ${requisition.releasedBy}` : ''}
${requisition.releasedAt ? `Released At: ${new Date(requisition.releasedAt).toLocaleString()}` : ''}
${requisition.returnedAt ? `Returned At: ${new Date(requisition.returnedAt).toLocaleString()}` : ''}
${requisition.comments ? `Comments: ${requisition.comments}` : ''}

------------------------------------------
Generated by KSUCU-MC Admin System
        `;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `requisition_${requisition.id}_${requisition.recipientName.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#ffc107';
            case 'approved': return '#28a745';
            case 'released': return '#17a2b8';
            case 'returned': return '#6c757d';
            case 'rejected': return '#dc3545';
            default: return '#6c757d';
        }
    };

    return (
        <>
            <UniversalHeader />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>
                        <FontAwesomeIcon icon={faPackage} />
                        Requisitions Management
                    </h1>
                    <p>Manage equipment and item requisition requests</p>
                </div>

                {/* Filters and Search */}
                <div className={styles.filtersSection}>
                    <div className={styles.filterRow}>
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
                        <div className={styles.filterGroup}>
                            <FontAwesomeIcon icon={faFilter} />
                            <select
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    filterRequisitions(requisitions, e.target.value, searchTerm);
                                }}
                                className={styles.filterSelect}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="released">Released</option>
                                <option value="returned">Returned</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Requisitions List */}
                <div className={styles.requisitionsList}>
                    <div className={styles.statsBar}>
                        <span>Total Requisitions: {filteredRequisitions.length}</span>
                        <span>Pending: {filteredRequisitions.filter(r => r.status === 'pending').length}</span>
                        <span>Released: {filteredRequisitions.filter(r => r.status === 'released').length}</span>
                    </div>

                    {filteredRequisitions.length === 0 ? (
                        <div className={styles.emptyState}>
                            <FontAwesomeIcon icon={faPackage} size="3x" />
                            <h3>No Requisitions Found</h3>
                            <p>No requisitions match your current filters</p>
                        </div>
                    ) : (
                        <div className={styles.requisitionsGrid}>
                            {filteredRequisitions.map((requisition) => (
                                <div key={requisition.id} className={styles.requisitionCard}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardTitle}>
                                            <h4>{requisition.recipientName}</h4>
                                            <span 
                                                className={styles.statusBadge}
                                                style={{ backgroundColor: getStatusColor(requisition.status) }}
                                            >
                                                {requisition.status}
                                            </span>
                                        </div>
                                        <div className={styles.cardMeta}>
                                            <span><FontAwesomeIcon icon={faCalendarAlt} /> {new Date(requisition.submittedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className={styles.cardBody}>
                                        <p><strong>Purpose:</strong> {requisition.purpose}</p>
                                        <p><strong>Items:</strong> {requisition.items.length} item(s)</p>
                                        <p><strong>Pick-up:</strong> {new Date(requisition.timeReceived).toLocaleDateString()}</p>
                                        {requisition.totalAmount > 0 && (
                                            <p><strong>Amount:</strong> KES {requisition.totalAmount.toFixed(2)}</p>
                                        )}
                                    </div>

                                    <div className={styles.cardActions}>
                                        <button
                                            onClick={() => {
                                                setSelectedRequisition(requisition);
                                                setShowDetails(true);
                                            }}
                                            className={styles.viewButton}
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        <button
                                            onClick={() => setEditingRequisition(requisition)}
                                            className={styles.editButton}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                            onClick={() => downloadPDF(requisition)}
                                            className={styles.downloadButton}
                                        >
                                            <FontAwesomeIcon icon={faDownload} />
                                        </button>
                                        <button
                                            onClick={() => deleteRequisition(requisition.id)}
                                            className={styles.deleteButton}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                            ))}
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
                                        <h4><FontAwesomeIcon icon={faPackage} /> Items</h4>
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
                                        <div className={styles.actionButtons}>
                                            <button
                                                onClick={() => handleStatusUpdate(editingRequisition, 'approved')}
                                                className={styles.approveButton}
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
                                    )}

                                    {editingRequisition.status === 'approved' && (
                                        <div className={styles.releaseSection}>
                                            <div className={styles.formGroup}>
                                                <label>Released By (Your Name)</label>
                                                <input
                                                    type="text"
                                                    value={releasedBy}
                                                    onChange={(e) => setReleasedBy(e.target.value)}
                                                    placeholder="Enter your name"
                                                    required
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleStatusUpdate(editingRequisition, 'released')}
                                                className={styles.releaseButton}
                                                disabled={!releasedBy}
                                            >
                                                <FontAwesomeIcon icon={faCheck} /> Mark as Released
                                            </button>
                                        </div>
                                    )}

                                    {editingRequisition.status === 'released' && (
                                        <button
                                            onClick={() => handleStatusUpdate(editingRequisition, 'returned')}
                                            className={styles.returnButton}
                                        >
                                            <FontAwesomeIcon icon={faCheck} /> Mark as Returned
                                        </button>
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