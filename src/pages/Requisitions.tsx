import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import styles from '../styles/Requisitions.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBox, 
    faPlus, 
    faMinus, 
    faCalendarAlt, 
    faUser, 
    faCheck
} from '@fortawesome/free-solid-svg-icons';
import { getApiUrl } from '../config/environment';

interface RequisitionItem {
    id: string;
    itemName: string;
    quantity: number;
    description?: string;
}

interface RequisitionForm {
    id?: string;
    recipientName: string;
    recipientPhone: string;
    items: RequisitionItem[];
    timeReceived: string;
    timeToReturn: string;
    totalAmount: number;
    purpose: string;
    status: 'pending' | 'approved' | 'released' | 'returned';
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
        items: [{ id: Date.now().toString(), itemName: '', quantity: 1 }],
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
    const [showConfirmation, setShowConfirmation] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        checkAuthentication();
    }, []);

    const checkAuthentication = async () => {
        try {
            const response = await fetch(getApiUrl('users'), {
                credentials: 'include'
            });

            if (response.ok) {
                setIsAuthenticated(true);
            } else {
                setError('Please login to access requisitions');
                setTimeout(() => {
                    navigate('/signIn');
                }, 2000);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setError('Please login to access requisitions');
            setTimeout(() => {
                navigate('/signIn');
            }, 2000);
        }
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { 
                id: Date.now().toString(), 
                itemName: '', 
                quantity: 1 
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
            setError('Please fill in all required fields');
            return;
        }

        if (formData.items.some(item => !item.itemName || item.quantity <= 0)) {
            setError('Please fill in all item details with valid quantities');
            return;
        }

        if (new Date(formData.timeToReturn) <= new Date(formData.timeReceived)) {
            setError('Return time must be after received time');
            return;
        }

        setShowConfirmation(true);
    };

    const confirmSubmission = () => {
        setLoading(true);
        
        const requisition: RequisitionForm = {
            ...formData,
            id: Date.now().toString(),
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };

        // Save to localStorage
        const existingRequisitions = JSON.parse(localStorage.getItem('ksucu-requisitions') || '[]');
        existingRequisitions.push(requisition);
        localStorage.setItem('ksucu-requisitions', JSON.stringify(existingRequisitions));

        // Dispatch custom event for admin synchronization
        window.dispatchEvent(new CustomEvent('requisitionsUpdated', { 
            detail: existingRequisitions 
        }));

        setLoading(false);
        setShowConfirmation(false);
        setSuccess('Requisition submitted successfully! You will be notified when it\'s processed.');

        // Reset form
        setFormData({
            recipientName: '',
            recipientPhone: '',
            items: [{ id: Date.now().toString(), itemName: '', quantity: 1 }],
            timeReceived: '',
            timeToReturn: '',
            totalAmount: 0,
            purpose: '',
            status: 'pending',
            submittedAt: ''
        });

        setTimeout(() => setSuccess(''), 5000);
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
                    <h1>
                        <FontAwesomeIcon icon={faBox} />
                        Equipment Requisition
                    </h1>
                    <p>Request equipment or items for your events and activities</p>
                </div>

                {error && (
                    <div className={styles.errorAlert}>
                        {error}
                    </div>
                )}

                {success && (
                    <div className={styles.successAlert}>
                        <FontAwesomeIcon icon={faCheck} />
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.requisitionForm}>
                    {/* Recipient Information */}
                    <div className={styles.section}>
                        <h3><FontAwesomeIcon icon={faUser} /> Recipient Information</h3>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    value={formData.recipientName}
                                    onChange={(e) => setFormData(prev => ({...prev, recipientName: e.target.value}))}
                                    placeholder="Enter recipient's full name"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    value={formData.recipientPhone}
                                    onChange={(e) => setFormData(prev => ({...prev, recipientPhone: e.target.value}))}
                                    placeholder="Enter phone number"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Items Section */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3><FontAwesomeIcon icon={faBox} /> Items to Requisition</h3>
                            <button type="button" onClick={addItem} className={styles.addButton}>
                                <FontAwesomeIcon icon={faPlus} />
                                Add Item
                            </button>
                        </div>

                        {formData.items.map((item, index) => (
                            <div key={item.id} className={styles.itemRow}>
                                <div className={styles.itemNumber}>{index + 1}</div>
                                <div className={styles.formGroup}>
                                    <label>Item Name *</label>
                                    <input
                                        type="text"
                                        value={item.itemName}
                                        onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                                        placeholder="e.g., Projector, Microphone, Chairs"
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Quantity *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Description</label>
                                    <input
                                        type="text"
                                        value={item.description || ''}
                                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                        placeholder="Optional details"
                                    />
                                </div>
                                {formData.items.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => removeItem(item.id)}
                                        className={styles.removeButton}
                                    >
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Time and Cost Section */}
                    <div className={styles.section}>
                        <h3><FontAwesomeIcon icon={faCalendarAlt} /> Schedule & Cost</h3>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Time to Receive *</label>
                                <input
                                    type="datetime-local"
                                    value={formData.timeReceived}
                                    onChange={(e) => setFormData(prev => ({...prev, timeReceived: e.target.value}))}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Time to Return *</label>
                                <input
                                    type="datetime-local"
                                    value={formData.timeToReturn}
                                    onChange={(e) => setFormData(prev => ({...prev, timeToReturn: e.target.value}))}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Expected Amount (KES)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.totalAmount}
                                    onChange={(e) => setFormData(prev => ({...prev, totalAmount: parseFloat(e.target.value) || 0}))}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Purpose/Event *</label>
                                <input
                                    type="text"
                                    value={formData.purpose}
                                    onChange={(e) => setFormData(prev => ({...prev, purpose: e.target.value}))}
                                    placeholder="e.g., Sunday Service, Bible Study, Conference"
                                    required
                                />
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