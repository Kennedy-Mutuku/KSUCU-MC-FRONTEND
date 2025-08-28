import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import styles from '../styles/ministriesAdmin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUsers, 
    faLock, 
    faUnlock,
    faCheckCircle,
    faTimes,
    faDownload,
    faList,
    faFileSignature
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface CommitmentForm {
    _id: string;
    userId: {
        _id: string;
        username: string;
        email: string;
    };
    fullName: string;
    phoneNumber: string;
    regNo: string;
    yearOfStudy: string;
    ministry: string;
    reasonForJoining: string;
    date: string;
    signature: string;
    croppedImage: string;
    status: 'pending' | 'approved' | 'revoked';
    submittedAt: string;
    reviewedBy?: {
        _id: string;
        username: string;
    };
    reviewedAt?: string;
}

const MinistriesAdmin: React.FC = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [message, setMessage] = useState('');
    
    // Ministry selection and view mode
    const [selectedMinistry, setSelectedMinistry] = useState<'' | MinistryKey>('');
    const [viewMode, setViewMode] = useState<'attendance' | 'commitments'>('commitments');
    const [commitmentForms, setCommitmentForms] = useState<CommitmentForm[]>([]);
    const [loading, setLoading] = useState(false);

    type MinistryKey = 'wananzambe' | 'compassion' | 'pw' | 'intercessory' | 'cs' | 'hs' | 'ushering' | 'creativity' | 'choir';

    const ministries: MinistryKey[] = [
        'wananzambe',
        'compassion', 
        'pw',
        'intercessory',
        'cs',
        'hs',
        'ushering',
        'creativity',
        'choir'
    ];

    const ministryNames: Record<MinistryKey, string> = {
        'wananzambe': 'Wananzambe (Instrumentalists)',
        'compassion': 'Compassion Ministry',
        'pw': 'Praise & Worship',
        'intercessory': 'Intercessory Prayer',
        'cs': 'Church School',
        'hs': 'High School Ministry',
        'ushering': 'Ushering Ministry',
        'creativity': 'Creativity Ministry',
        'choir': 'Choir Ministry'
    };

    // Authentication
    const handleAuth = async () => {
        if (password === 'ksucu-ministries-admin-2024') {
            setAuthenticated(true);
            setAuthError('');
        } else {
            setAuthError('Incorrect password');
            setTimeout(() => setAuthError(''), 3000);
        }
    };

    // Load commitment forms for selected ministry
    const loadCommitmentForms = async () => {
        if (!selectedMinistry) return;
        
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:3000/commitmentForm/ministry/${selectedMinistry}`, 
                { withCredentials: true }
            );
            setCommitmentForms(response.data.commitments);
        } catch (error) {
            console.error('Error loading commitment forms:', error);
            setMessage('Error loading commitment forms');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    // Approve commitment form
    const approveCommitment = async (commitmentId: string) => {
        try {
            await axios.put(
                `http://localhost:3000/commitmentForm/approve/${commitmentId}`, 
                {}, 
                { withCredentials: true }
            );
            setMessage('Commitment form approved successfully');
            setTimeout(() => setMessage(''), 3000);
            await loadCommitmentForms(); // Reload the list
        } catch (error) {
            console.error('Error approving commitment:', error);
            setMessage('Error approving commitment form');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    // Revoke commitment form
    const revokeCommitment = async (commitmentId: string) => {
        try {
            await axios.put(
                `http://localhost:3000/commitmentForm/revoke/${commitmentId}`, 
                {}, 
                { withCredentials: true }
            );
            setMessage('Commitment form revoked');
            setTimeout(() => setMessage(''), 3000);
            await loadCommitmentForms(); // Reload the list
        } catch (error) {
            console.error('Error revoking commitment:', error);
            setMessage('Error revoking commitment form');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    // Download commitment form as PDF
    const downloadCommitmentPDF = (commitment: CommitmentForm) => {
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>KSUCU - ${selectedMinistry ? ministryNames[selectedMinistry] : ''} - Commitment Form</title>
                <style>
                    @page { size: A4; margin: 20mm; }
                    body { font-family: 'Times New Roman', serif; margin: 0; padding: 0; }
                    .letterhead { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                    .letterhead h1 { margin: 0; color: #730051; font-size: 24px; }
                    .letterhead h2 { margin: 5px 0; color: #333; font-size: 18px; }
                    .form-section { margin: 20px 0; }
                    .form-row { display: flex; justify-content: space-between; margin: 10px 0; }
                    .form-field { flex: 1; margin-right: 20px; }
                    .form-field:last-child { margin-right: 0; }
                    label { font-weight: bold; display: block; margin-bottom: 5px; }
                    .value { border-bottom: 1px solid #333; padding-bottom: 2px; min-height: 20px; }
                    .signature-img { max-width: 200px; max-height: 100px; border: 1px solid #ccc; }
                    .status { padding: 10px; text-align: center; font-weight: bold; margin: 20px 0; }
                    .status.approved { background-color: #dcfce7; color: #166534; }
                    .status.pending { background-color: #fef3c7; color: #92400e; }
                    .status.revoked { background-color: #fef2f2; color: #dc2626; }
                </style>
            </head>
            <body>
                <div class="letterhead">
                    <h1>KSUCU - MAIN CAMPUS</h1>
                    <h2>${selectedMinistry ? ministryNames[selectedMinistry] : ''} - Commitment Form</h2>
                </div>
                
                <div class="status ${commitment.status}">
                    Status: ${commitment.status.toUpperCase()}
                </div>

                <div class="form-section">
                    <div class="form-row">
                        <div class="form-field">
                            <label>Full Name:</label>
                            <div class="value">${commitment.fullName}</div>
                        </div>
                        <div class="form-field">
                            <label>Registration Number:</label>
                            <div class="value">${commitment.regNo}</div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-field">
                            <label>Phone Number:</label>
                            <div class="value">${commitment.phoneNumber}</div>
                        </div>
                        <div class="form-field">
                            <label>Year of Study:</label>
                            <div class="value">${commitment.yearOfStudy}</div>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-field">
                            <label>Ministry:</label>
                            <div class="value">${ministryNames[commitment.ministry as MinistryKey] || commitment.ministry}</div>
                        </div>
                        <div class="form-field">
                            <label>Date Submitted:</label>
                            <div class="value">${new Date(commitment.submittedAt).toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div style="margin: 20px 0;">
                        <label>Reason for Joining:</label>
                        <div class="value" style="min-height: 100px; padding: 10px; border: 1px solid #333;">
                            ${commitment.reasonForJoining}
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-field">
                            <label>Signature:</label>
                            <img src="${commitment.signature}" class="signature-img" alt="Signature" />
                        </div>
                        ${commitment.croppedImage ? `
                        <div class="form-field">
                            <label>Photo:</label>
                            <img src="${commitment.croppedImage}" style="max-width: 150px; max-height: 150px; border: 1px solid #ccc;" alt="Photo" />
                        </div>` : ''}
                    </div>
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => printWindow.print(), 100);
        }
    };

    useEffect(() => {
        if (authenticated && selectedMinistry && viewMode === 'commitments') {
            loadCommitmentForms();
        }
    }, [authenticated, selectedMinistry, viewMode]);

    if (!authenticated) {
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.authContainer}>
                    <div className={styles.authCard}>
                        <FontAwesomeIcon icon={faLock} className={styles.lockIcon} />
                        <h2 className={styles.authTitle}>Ministries Administration</h2>
                        <p className={styles.authSubtitle}>Enter password to access admin panel</p>
                        
                        <div className={styles.inputGroup}>
                            <input
                                type="password"
                                className={styles.passwordInput}
                                placeholder="Enter admin password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                            />
                        </div>
                        
                        {authError && <div className={styles.errorMessage}>{authError}</div>}
                        
                        <button 
                            className={styles.authButton}
                            onClick={handleAuth}
                        >
                            <FontAwesomeIcon icon={faUnlock} /> Access Admin Panel
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.adminContainer}>
                <div className={styles.adminHeader}>
                    <h1 className={styles.adminTitle}>
                        <FontAwesomeIcon icon={faUsers} /> Ministries Administration
                    </h1>
                    {message && (
                        <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.success}`}>
                            {message}
                        </div>
                    )}
                </div>

                <div className={styles.controlPanel}>
                    <div className={styles.ministrySelector}>
                        <label htmlFor="ministry-select" className={styles.selectorLabel}>
                            <FontAwesomeIcon icon={faList} /> Select Ministry:
                        </label>
                        <select
                            id="ministry-select"
                            className={styles.select}
                            value={selectedMinistry}
                            onChange={(e) => setSelectedMinistry(e.target.value as '' | MinistryKey)}
                        >
                            <option value="">Choose a ministry...</option>
                            {ministries.map(ministry => (
                                <option key={ministry} value={ministry}>
                                    {ministryNames[ministry]}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedMinistry && (
                        <div className={styles.viewModeSelector}>
                            <label className={styles.selectorLabel}>View:</label>
                            <div className={styles.tabButtons}>
                                <button
                                    className={`${styles.tabButton} ${viewMode === 'commitments' ? styles.active : ''}`}
                                    onClick={() => setViewMode('commitments')}
                                >
                                    <FontAwesomeIcon icon={faFileSignature} /> Commitment Forms
                                </button>
                                <button
                                    className={`${styles.tabButton} ${viewMode === 'attendance' ? styles.active : ''}`}
                                    onClick={() => setViewMode('attendance')}
                                >
                                    <FontAwesomeIcon icon={faUsers} /> Attendance
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {selectedMinistry && viewMode === 'commitments' && (
                    <div className={styles.contentArea}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                {selectedMinistry && ministryNames[selectedMinistry]} - Commitment Forms
                            </h2>
                        </div>

                        {loading ? (
                            <div className={styles.loading}>Loading commitment forms...</div>
                        ) : (
                            <div className={styles.commitmentsList}>
                                {commitmentForms.length === 0 ? (
                                    <div className={styles.noData}>
                                        No commitment forms found for this ministry.
                                    </div>
                                ) : (
                                    commitmentForms.map((commitment, index) => (
                                        <div key={commitment._id} className={styles.commitmentCard}>
                                            <div className={styles.commitmentHeader}>
                                                <div className={styles.commitmentInfo}>
                                                    <h3 className={styles.commitmentName}>
                                                        {index + 1}. {commitment.fullName}
                                                    </h3>
                                                    <p className={styles.commitmentDetails}>
                                                        Reg: {commitment.regNo} | Year: {commitment.yearOfStudy}
                                                    </p>
                                                </div>
                                                <div className={styles.commitmentActions}>
                                                    <span className={`${styles.statusBadge} ${styles[commitment.status]}`}>
                                                        {commitment.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className={styles.commitmentMeta}>
                                                <p><strong>Phone:</strong> {commitment.phoneNumber}</p>
                                                <p><strong>Submitted:</strong> {new Date(commitment.submittedAt).toLocaleDateString()}</p>
                                                {commitment.reviewedAt && (
                                                    <p><strong>Reviewed:</strong> {new Date(commitment.reviewedAt).toLocaleDateString()}</p>
                                                )}
                                            </div>

                                            <div className={styles.commitmentActions}>
                                                {commitment.status === 'pending' && (
                                                    <>
                                                        <button
                                                            className={`${styles.actionButton} ${styles.approve}`}
                                                            onClick={() => approveCommitment(commitment._id)}
                                                        >
                                                            <FontAwesomeIcon icon={faCheckCircle} /> Approve
                                                        </button>
                                                        <button
                                                            className={`${styles.actionButton} ${styles.revoke}`}
                                                            onClick={() => revokeCommitment(commitment._id)}
                                                        >
                                                            <FontAwesomeIcon icon={faTimes} /> Revoke
                                                        </button>
                                                    </>
                                                )}
                                                
                                                {commitment.status === 'approved' && (
                                                    <button
                                                        className={`${styles.actionButton} ${styles.revoke}`}
                                                        onClick={() => revokeCommitment(commitment._id)}
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} /> Revoke
                                                    </button>
                                                )}

                                                {commitment.status === 'revoked' && (
                                                    <button
                                                        className={`${styles.actionButton} ${styles.approve}`}
                                                        onClick={() => approveCommitment(commitment._id)}
                                                    >
                                                        <FontAwesomeIcon icon={faCheckCircle} /> Approve
                                                    </button>
                                                )}

                                                <button
                                                    className={`${styles.actionButton} ${styles.download}`}
                                                    onClick={() => downloadCommitmentPDF(commitment)}
                                                >
                                                    <FontAwesomeIcon icon={faDownload} /> Download PDF
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}

                {selectedMinistry && viewMode === 'attendance' && (
                    <div className={styles.contentArea}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                {selectedMinistry && ministryNames[selectedMinistry]} - Attendance Records
                            </h2>
                        </div>
                        <div className={styles.noData}>
                            Attendance management feature coming soon...
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MinistriesAdmin;