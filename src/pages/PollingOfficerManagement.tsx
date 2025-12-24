import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/pollingManagement.module.css';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import ConfirmDialog from '../components/ConfirmDialog';
import ToastContainer from '../components/ToastContainer';
import { getApiUrl } from '../config/environment';

interface PollingOfficer {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    status: 'active' | 'suspended' | 'deleted';
    createdAt: string;
    lastLogin?: string;
    registeredCount?: number;
    votedCount?: number;
}

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

interface ConfirmDialogState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'info' | 'warning' | 'danger' | 'success';
}

interface CreatedOfficerData {
    email: string;
    password: string;
}

const PollingOfficerManagement: React.FC = () => {
    const [officers, setOfficers] = useState<PollingOfficer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        type: 'info'
    });
    const [, setCreatedOfficer] = useState<CreatedOfficerData | null>(null);

    // Create form state
    const [formData, setFormData] = useState({
        name: '',
        password: ''
    });

    // Auto-generate email from name
    const generatedEmail = formData.name
        ? `officer${formData.name.toLowerCase().replace(/\s+/g, '')}@ksucu.co.ke`
        : '';

    const backEndURL = getApiUrl('users').replace('/users/data', '/polling-officer');

    // Toast helper functions
    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // Dialog helper functions
    const showConfirmDialog = (
        title: string,
        message: string,
        onConfirm: () => void,
        type: 'info' | 'warning' | 'danger' | 'success' = 'info'
    ) => {
        setConfirmDialog({
            isOpen: true,
            title,
            message,
            onConfirm,
            type
        });
    };

    const closeConfirmDialog = () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
    };

    // Copy to clipboard helper
    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`${label} copied to clipboard!`, 'success');
        }).catch(() => {
            showToast('Failed to copy. Please copy manually.', 'error');
        });
    };

    useEffect(() => {
        fetchOfficers();
    }, []);

    const fetchOfficers = async () => {
        try {
            const response = await axios.get(`${backEndURL}/list`, { withCredentials: true });
            setOfficers(response.data);
        } catch (err: any) {
            console.error('Error fetching officers:', err);
            setError(err.response?.data?.message || 'Failed to fetch polling officers');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateOfficer = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate name (no spaces, only letters)
        const namePattern = /^[a-zA-Z]+$/;
        if (!formData.name || !namePattern.test(formData.name)) {
            showToast('Name is required and must be a single word (letters only, no spaces)', 'warning');
            return;
        }

        if (!formData.password) {
            showToast('Password is required', 'warning');
            return;
        }

        // Generate unique phone number using timestamp
        // Format: 07 + last 8 digits of timestamp
        const uniquePhone = '07' + Date.now().toString().slice(-8);

        // Prepare data for backend
        const officerData = {
            fullName: formData.name,
            email: generatedEmail,
            phone: uniquePhone,
            password: formData.password
        };

        try {
            await axios.post(`${backEndURL}/create`, officerData, { withCredentials: true });

            // Store created officer credentials
            setCreatedOfficer({
                email: generatedEmail,
                password: formData.password
            });

            // Show success dialog with credentials
            const message = `Polling officer created successfully!\n\n` +
                           `Email: ${generatedEmail}\n` +
                           `Password: ${formData.password}\n\n` +
                           `⚠️ IMPORTANT: Copy and save these credentials now!\n` +
                           `The password will not be shown again.\n\n` +
                           `Click OK, then use the copy buttons to copy credentials.`;

            showConfirmDialog(
                'Officer Created Successfully!',
                message,
                () => {
                    closeConfirmDialog();
                    // Clear created officer after dialog closes
                    setCreatedOfficer(null);
                },
                'success'
            );

            // Reset form
            setFormData({
                name: '',
                password: ''
            });
            setShowCreateForm(false);

            // Refresh list
            fetchOfficers();
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Failed to create polling officer', 'error');
        }
    };

    const handleUpdateStatus = (id: string, status: 'active' | 'suspended' | 'deleted') => {
        const confirmMessage = status === 'deleted'
            ? 'Are you sure you want to delete this officer?'
            : `Are you sure you want to ${status === 'active' ? 'activate' : 'suspend'} this officer?`;

        const dialogType = status === 'deleted' ? 'danger' : status === 'suspended' ? 'warning' : 'success';

        showConfirmDialog(
            'Confirm Action',
            confirmMessage,
            async () => {
                closeConfirmDialog();
                try {
                    await axios.put(`${backEndURL}/status/${id}`, { status }, { withCredentials: true });
                    showToast(`Officer ${status === 'deleted' ? 'deleted' : status} successfully!`, 'success');

                    // Refresh list
                    fetchOfficers();
                } catch (err: any) {
                    showToast(err.response?.data?.message || 'Failed to update officer status', 'error');
                }
            },
            dialogType
        );
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className={styles.error}>{error}</p>;
    }

    return (
        <>
            <UniversalHeader />
            <ToastContainer toasts={toasts} onClose={removeToast} />
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={closeConfirmDialog}
                type={confirmDialog.type}
            />
            <div className={styles.container}>
                <h2>Polling Officer Management</h2>

                {/* Create Officer Button */}
                <div className={styles.createSection}>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className={styles.createBtn}
                    >
                        {showCreateForm ? 'Hide Form' : 'Create New Officer'}
                    </button>

                    {showCreateForm && (
                        <form onSubmit={handleCreateOfficer} className={styles.createForm}>
                            <h4>Create New Polling Officer</h4>
                            <p className={styles.formHint}>Enter a single name (no spaces). Email will be auto-generated as: officer[name]@ksucu.co.ke</p>

                            <div className={styles.formGroup}>
                                <label>Name (single word, no spaces) *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Kiptash"
                                    pattern="[a-zA-Z]+"
                                    title="Name must contain only letters with no spaces"
                                    required
                                />
                                {formData.name && (
                                    <div className={styles.emailPreview}>
                                        <span>Generated email: <strong>{generatedEmail}</strong></span>
                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(generatedEmail, 'Email')}
                                            className={styles.copyBtnSmall}
                                            title="Copy email"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label>Password *</label>
                                <div className={styles.passwordInputWrapper}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className={styles.passwordToggle}
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className={styles.submitBtn}>
                                Create Officer
                            </button>
                        </form>
                    )}
                </div>

                {/* Officers Table */}
                <div className={styles.tableSection}>
                    <h4>All Polling Officers ({officers.length})</h4>
                    {officers.length === 0 ? (
                        <p className={styles.noOfficers}>No polling officers found.</p>
                    ) : (
                        <table className={styles.officerTable}>
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Registered</th>
                                    <th>Voted</th>
                                    <th>Last Login</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {officers.map(officer => (
                                    <tr key={officer._id}>
                                        <td>{officer.fullName}</td>
                                        <td>
                                            <div className={styles.emailCell}>
                                                <span>{officer.email}</span>
                                                <button
                                                    onClick={() => copyToClipboard(officer.email, 'Email')}
                                                    className={styles.copyBtn}
                                                    title="Copy email"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                        <td>{officer.phone}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles[officer.status]}`}>
                                                {officer.status}
                                            </span>
                                        </td>
                                        <td>{officer.registeredCount || 0}</td>
                                        <td>{officer.votedCount || 0}</td>
                                        <td>
                                            {officer.lastLogin
                                                ? new Date(officer.lastLogin).toLocaleString()
                                                : 'Never'}
                                        </td>
                                        <td className={styles.actions}>
                                            {officer.status === 'active' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(officer._id, 'suspended')}
                                                    className={styles.suspendBtn}
                                                >
                                                    Suspend
                                                </button>
                                            )}
                                            {officer.status === 'suspended' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(officer._id, 'active')}
                                                    className={styles.activateBtn}
                                                >
                                                    Activate
                                                </button>
                                            )}
                                            {officer.status !== 'deleted' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(officer._id, 'deleted')}
                                                    className={styles.deleteBtn}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PollingOfficerManagement;
