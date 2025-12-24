import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import styles from '../styles/Requisitions.module.css';

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

const Requisitions: React.FC = () => {
    const [formData, setFormData] = useState<RequisitionForm>({
        recipientName: '',
        recipientPhone: '',
        items: [
            { id: Date.now().toString() + '-1', itemName: '', quantity: 0 }
        ],
        timeReceived: '',
        timeToReturn: '',
        totalAmount: 0,
        purpose: '',
        status: 'pending',
        submittedAt: ''
    });

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isToastFading, setIsToastFading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [adminContactPhone, setAdminContactPhone] = useState<string>('');
    const [userRequisitions, setUserRequisitions] = useState<RequisitionForm[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUserName, setCurrentUserName] = useState('');
    const backEndURL = 'https://ksucu-mc.co.ke';

    // Helper function to show toast with auto-hide
    const showToast = (message: string, type: 'success' | 'error', duration: number = 3000) => {
        setIsToastFading(false);
        if (type === 'success') {
            setSuccess(message);
            setError('');
        } else {
            setError(message);
            setSuccess('');
        }

        // Start fade out animation before removing
        setTimeout(() => {
            setIsToastFading(true);
        }, duration - 500);

        // Remove message after fade out completes
        setTimeout(() => {
            setSuccess('');
            setError('');
            setIsToastFading(false);
        }, duration);
    };


    useEffect(() => {
        // No authentication required - allow public access
        setIsAuthenticated(true);
        // Load admin contact phone from API first
        loadAdminContactPhone();
        
        // Check if user is logged in and load their requisitions
        const userData = localStorage.getItem('user-data');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setIsLoggedIn(true);
                setCurrentUserName(user.name || user.username || '');
                loadUserRequisitions(user.name || user.username || '');
            } catch (error) {
                console.log('No user data found');
            }
        }

        // Refresh phone number periodically (every 30 seconds)
        const phoneRefreshInterval = setInterval(() => {
            loadAdminContactPhone();
        }, 30000);

        // Refresh when user focuses on the page
        const handleFocus = () => {
            loadAdminContactPhone();
        };

        window.addEventListener('focus', handleFocus);

        // Cleanup
        return () => {
            clearInterval(phoneRefreshInterval);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    const loadAdminContactPhone = async () => {
        try {
            console.log('Loading admin contact phone from API...');
            const response = await axios.get(`${backEndURL}/api/settings/admin-contact-phone`, {
                withCredentials: true,
                timeout: 5000 // 5 second timeout
            });
            console.log('Admin phone API response:', response.data);
            const phoneNumber = response.data.value || '';
            
            // Only update state if phone number has changed
            const currentPhone = localStorage.getItem('admin-contact-phone') || '';
            if (phoneNumber !== currentPhone || phoneNumber !== adminContactPhone) {
                console.log('Phone number changed from:', currentPhone, 'to:', phoneNumber);
                setAdminContactPhone(phoneNumber);
                // Update localStorage with latest value
                localStorage.setItem('admin-contact-phone', phoneNumber);
                console.log('Admin phone updated successfully:', phoneNumber);
            } else {
                console.log('Phone number unchanged:', phoneNumber);
            }
        } catch (error) {
            console.error('Error loading admin contact phone from API:', error);
            // Fallback to localStorage
            const savedPhone = localStorage.getItem('admin-contact-phone') || '';
            console.log('Using fallback phone from localStorage:', savedPhone);
            if (savedPhone !== adminContactPhone) {
                setAdminContactPhone(savedPhone);
            }
            
            // Try to load from API again after a delay if initial load failed
            if (!savedPhone) {
                setTimeout(async () => {
                    try {
                        console.log('Retrying admin phone API call...');
                        const retryResponse = await axios.get(`${backEndURL}/api/settings/admin-contact-phone`, {
                            withCredentials: true,
                            timeout: 10000
                        });
                        const phoneNumber = retryResponse.data.value || '';
                        if (phoneNumber && phoneNumber !== adminContactPhone) {
                            setAdminContactPhone(phoneNumber);
                            localStorage.setItem('admin-contact-phone', phoneNumber);
                            console.log('Admin phone loaded on retry:', phoneNumber);
                        }
                    } catch (retryError) {
                        console.error('Retry failed for admin phone:', retryError);
                    }
                }, 3000);
            }
        }
    };

    const loadUserRequisitions = async (userName: string) => {
        try {
            const response = await axios.get(`${backEndURL}/api/requisitions`, {
                withCredentials: true
            });
            const userReqs = response.data.filter((req: RequisitionForm) => 
                req.recipientName.toLowerCase() === userName.toLowerCase()
            );
            setUserRequisitions(userReqs);
        } catch (error) {
            console.error('Error loading requisitions:', error);
            // Fallback to localStorage
            const allRequisitions = JSON.parse(localStorage.getItem('ksucu-requisitions') || '[]');
            const userReqs = allRequisitions.filter((req: RequisitionForm) => 
                req.recipientName.toLowerCase() === userName.toLowerCase()
            );
            setUserRequisitions(userReqs);
        }
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { 
                id: Date.now().toString(), 
                itemName: '', 
                quantity: 0 
            }]
        }));
    };

    const removeItem = (id: string) => {
        if (formData.items.length > 1) {
            setFormData(prev => ({
                ...prev,
                items: prev.items.filter(item => item.id !== id)
            }));
        }
    };

    const updateItem = (id: string, field: keyof RequisitionItem, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map(item => 
                item.id === id ? { ...item, [field]: value } : item
            )
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!formData.recipientName || !formData.recipientPhone || !formData.timeReceived || !formData.timeToReturn || !formData.purpose) {
            showToast('❗ Please fill in all required fields', 'error');
            return;
        }

        // Filter out empty items and validate only filled items
        const filledItems = formData.items.filter(item => item.itemName.trim() !== '');
        
        if (filledItems.length === 0) {
            showToast('❗ Please add at least one item to your requisition', 'error');
            return;
        }

        if (filledItems.some(item => item.quantity <= 0)) {
            showToast('❗ Please enter valid quantities for all items', 'error');
            return;
        }

        if (new Date(formData.timeToReturn) <= new Date(formData.timeReceived)) {
            showToast('❗ Return time must be after received time', 'error');
            return;
        }

        setShowConfirmation(true);
    };

    const confirmSubmission = async () => {
        setLoading(true);
        
        // Only save filled items
        const filledItems = formData.items.filter(item => item.itemName.trim() !== '');
        const requisition: RequisitionForm = {
            ...formData,
            items: filledItems,
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };

        try {
            // Save to API
            await axios.post(`${backEndURL}/api/requisitions`, requisition, {
                withCredentials: true
            });

            // Update user's requisition list if logged in
            if (isLoggedIn) {
                await loadUserRequisitions(currentUserName);
            }

            showToast('✅ Requisition submitted successfully! You will be notified when it\'s processed.', 'success');
        } catch (error) {
            console.error('Error submitting requisition:', error);
            
            // Fallback to localStorage
            requisition.id = Date.now().toString();
            const existingRequisitions = JSON.parse(localStorage.getItem('ksucu-requisitions') || '[]');
            existingRequisitions.push(requisition);
            localStorage.setItem('ksucu-requisitions', JSON.stringify(existingRequisitions));

            // Dispatch custom event for admin synchronization
            window.dispatchEvent(new CustomEvent('requisitionsUpdated', { 
                detail: existingRequisitions 
            }));

            // Update user's requisition list if logged in
            if (isLoggedIn) {
                await loadUserRequisitions(currentUserName);
            }

            showToast('✅ Requisition submitted successfully! You will be notified when it\'s processed.', 'success');
        }

        setLoading(false);
        setShowConfirmation(false);

        // Reset form
        setFormData({
            recipientName: '',
            recipientPhone: '',
            items: [
                { id: Date.now().toString() + '-1', itemName: '', quantity: 0 }
            ],
            timeReceived: '',
            timeToReturn: '',
            totalAmount: 0,
            purpose: '',
            status: 'pending',
            submittedAt: ''
        });

    };

    if (!isAuthenticated) {
        return (
            <>
                <UniversalHeader />
                <div className={styles.container}>
                    <div className={styles.errorMessage}>
                        {error || 'Checking authentication...'}
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
                    <h1>Equipment Requisition</h1>
                    <p>Request equipment or items for your events and activities</p>
                    {adminContactPhone && (
                        <div className={styles.contactInfo}>
                            <p><strong>For more information, contact:</strong> <a href={`tel:${adminContactPhone}`}>{adminContactPhone}</a></p>
                        </div>
                    )}
                </div>

                {/* User Requisition Status */}
                {isLoggedIn && (
                    <div className={styles.userStatusSection}>
                        <h3>Your Requisition Status</h3>
                        {userRequisitions.length === 0 ? (
                            <p className={styles.noRequisitions}>No requisitions found for {currentUserName}</p>
                        ) : (
                            <div className={styles.statusGrid}>
                                <div className={styles.statusColumn}>
                                    <h4>Pending</h4>
                                    {userRequisitions.filter(req => req.status === 'pending').map((req) => (
                                        <div key={req._id || req.id} className={styles.statusItem}>
                                            <strong>{req.items.map(item => item.itemName).join(', ')}</strong>
                                            <span>Submitted: {new Date(req.submittedAt).toLocaleDateString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.statusColumn}>
                                    <h4>Approved</h4>
                                    {userRequisitions.filter(req => req.status === 'approved').map((req) => (
                                        <div key={req._id || req.id} className={styles.statusItem}>
                                            <strong>{req.items.map(item => item.itemName).join(', ')}</strong>
                                            <span>Submitted: {new Date(req.submittedAt).toLocaleDateString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.statusColumn}>
                                    <h4>Rejected</h4>
                                    {userRequisitions.filter(req => req.status === 'rejected').map((req) => (
                                        <div key={req._id || req.id} className={styles.statusItem}>
                                            <strong>{req.items.map(item => item.itemName).join(', ')}</strong>
                                            <span>Submitted: {new Date(req.submittedAt).toLocaleDateString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {error && (
                    <div className={`${styles.errorAlert} ${isToastFading ? styles.fadeOut : ''}`}>
                        {error}
                    </div>
                )}

                {success && (
                    <div className={`${styles.successAlert} ${isToastFading ? styles.fadeOut : ''}`}>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.requisitionForm}>
                    {/* Recipient Information */}
                    <div className={styles.section}>
                        <h3>Recipient Information</h3>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="recipientName">Full Name *</label>
                                <input
                                    id="recipientName"
                                    type="text"
                                    value={formData.recipientName}
                                    onChange={(e) => setFormData(prev => ({...prev, recipientName: e.target.value}))}
                                    placeholder="Enter recipient's full name"
                                    required
                                    autoComplete="name"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="recipientPhone">Phone Number *</label>
                                <input
                                    id="recipientPhone"
                                    type="tel"
                                    value={formData.recipientPhone}
                                    onChange={(e) => setFormData(prev => ({...prev, recipientPhone: e.target.value}))}
                                    placeholder="Enter phone number"
                                    required
                                    autoComplete="tel"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Items Section */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3>Items to Requisition</h3>
                        </div>

                        <div className={styles.itemsGrid}>
                            {/* Grid Header */}
                            <div className={styles.gridHeader}>
                                <div className={styles.gridHeaderCell}>#</div>
                                <div className={styles.gridHeaderCell}>Commodity Name *</div>
                                <div className={styles.gridHeaderCell}>Quantity *</div>
                                <div className={styles.gridHeaderCell}>Description</div>
                                <div className={styles.gridHeaderCell}>Action</div>
                            </div>

                            {/* Grid Items */}
                            {formData.items.map((item, index) => (
                                <div key={item.id} className={styles.gridRow}>
                                    <div className={styles.gridCell}>
                                        <div className={styles.itemNumber}>{index + 1}</div>
                                    </div>
                                    <div className={styles.gridCell} data-label="Commodity Name *">
                                        <input
                                            id={`itemName-${item.id}`}
                                            type="text"
                                            value={item.itemName}
                                            onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                                            placeholder="e.g., Projector, Microphone, Chairs"
                                            autoComplete="off"
                                            className={styles.gridInput}
                                        />
                                    </div>
                                    <div className={styles.gridCell} data-label="Quantity *">
                                        <input
                                            id={`quantity-${item.id}`}
                                            type="number"
                                            min="1"
                                            value={item.quantity || ''}
                                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                            placeholder="0"
                                            autoComplete="off"
                                            className={styles.gridInput}
                                        />
                                    </div>
                                    <div className={styles.gridCell} data-label="Description">
                                        <input
                                            id={`description-${item.id}`}
                                            type="text"
                                            value={item.description || ''}
                                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                            placeholder="Optional details"
                                            autoComplete="off"
                                            className={styles.gridInput}
                                        />
                                    </div>
                                    <div className={styles.gridCell}>
                                        {formData.items.length > 1 && (
                                            <button 
                                                type="button" 
                                                onClick={() => removeItem(item.id)}
                                                className={styles.removeButton}
                                                aria-label={`Remove item ${index + 1}`}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.addButtonContainer}>
                            <button type="button" onClick={addItem} className={styles.addButton}>
                                + Add More Items
                            </button>
                        </div>
                    </div>

                    {/* Time and Cost Section */}
                    <div className={styles.section}>
                        <h3>Schedule & Cost</h3>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="timeReceived">Time to Receive *</label>
                                <input
                                    id="timeReceived"
                                    type="datetime-local"
                                    value={formData.timeReceived}
                                    onChange={(e) => setFormData(prev => ({...prev, timeReceived: e.target.value}))}
                                    required
                                    autoComplete="off"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="timeToReturn">Time to Return *</label>
                                <input
                                    id="timeToReturn"
                                    type="datetime-local"
                                    value={formData.timeToReturn}
                                    onChange={(e) => setFormData(prev => ({...prev, timeToReturn: e.target.value}))}
                                    required
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="totalAmount">Expected Amount (KES)</label>
                                <input
                                    id="totalAmount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.totalAmount}
                                    onChange={(e) => setFormData(prev => ({...prev, totalAmount: parseFloat(e.target.value) || 0}))}
                                    placeholder="0.00"
                                    autoComplete="off"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="purpose">Purpose/Event *</label>
                                <input
                                    id="purpose"
                                    type="text"
                                    value={formData.purpose}
                                    onChange={(e) => setFormData(prev => ({...prev, purpose: e.target.value}))}
                                    placeholder="e.g., Sunday Service, Bible Study, Conference"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Terms and Conditions Section */}
                    <div className={styles.section}>
                        <h3>Terms and Conditions</h3>
                        <div className={styles.termsContainer}>
                            <div className={styles.termsContent}>
                                <h4>Equipment Care & Responsibility</h4>
                                <ul>
                                    <li><strong>Damage Liability:</strong> Any damage to equipment must be reported immediately and costs for repair/replacement will be charged to the requisitioner on or before the return date.</li>
                                    <li><strong>Loss Policy:</strong> Full replacement cost will be charged for any lost equipment.</li>
                                    <li><strong>Condition Check:</strong> Equipment will be inspected upon return. Any damage beyond normal wear will incur charges.</li>
                                </ul>

                                <h4>Payment & Return Policy</h4>
                                <ul>
                                    <li><strong>Payment Due:</strong> All fees must be settled on or before the equipment return date.</li>
                                    <li><strong>Late Return Penalty:</strong> Late returns will incur additional daily charges of KES 200 per item per day.</li>
                                    <li><strong>Extended Use:</strong> Equipment needed beyond the agreed return time requires prior approval and additional fees.</li>
                                </ul>

                                <h4>Usage Guidelines</h4>
                                <ul>
                                    <li><strong>Authorized Use Only:</strong> Equipment is strictly for the stated purpose and may not be loaned to third parties.</li>
                                    <li><strong>Proper Handling:</strong> Equipment must be handled with care according to manufacturer guidelines.</li>
                                    <li><strong>Return Condition:</strong> All items must be returned clean and in proper working condition.</li>
                                </ul>

                                <h4>Compliance & Restrictions</h4>
                                <ul>
                                    <li><strong>Agreement Binding:</strong> By submitting this form, you agree to all terms and accept full responsibility.</li>
                                    <li><strong>Future Access:</strong> Failure to comply may result in restricted access to future equipment requisitions.</li>
                                    <li><strong>KSUCU Rights:</strong> KSUCU reserves the right to refuse equipment requests or modify terms as necessary.</li>
                                </ul>
                            </div>
                            
                            <div className={styles.agreementSection}>
                                <label className={styles.agreementLabel}>
                                    <input 
                                        type="checkbox" 
                                        required
                                        className={styles.agreementCheckbox}
                                    />
                                    <span className={styles.checkmark}></span>
                                    I have read, understood, and agree to abide by all the terms and conditions stated above. I accept full responsibility for any damage, loss, or late return penalties.
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className={styles.submitSection}>
                        <button type="submit" className={styles.submitButton} disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Requisition'}
                        </button>
                    </div>
                </form>

                {/* Confirmation Modal */}
                {showConfirmation && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.confirmationModal}>
                            <h3>Confirm Requisition</h3>
                            <div className={styles.confirmationDetails}>
                                <p><strong>Recipient:</strong> {formData.recipientName}</p>
                                <p><strong>Items:</strong> {formData.items.length} item(s)</p>
                                <p><strong>Purpose:</strong> {formData.purpose}</p>
                                <p><strong>Pick-up:</strong> {new Date(formData.timeReceived).toLocaleString()}</p>
                                <p><strong>Return:</strong> {new Date(formData.timeToReturn).toLocaleString()}</p>
                                {formData.totalAmount > 0 && (
                                    <p><strong>Amount:</strong> KES {formData.totalAmount.toFixed(2)}</p>
                                )}
                            </div>
                            <div className={styles.modalActions}>
                                <button onClick={confirmSubmission} className={styles.confirmButton}>
                                    Confirm & Submit
                                </button>
                                <button onClick={() => setShowConfirmation(false)} className={styles.cancelButton}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Requisitions;