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
    faFileSignature,
    faRedo,
    faPlay,
    faStop,
    faCalendarAlt
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

interface AttendanceSession {
    _id: string;
    ministry: string;
    isActive: boolean;
    startTime: string;
    endTime?: string;
}

interface AttendanceRecord {
    _id: string;
    userId: {
        _id: string;
        username: string;
        email: string;
    };
    sessionId: string;
    ministry: string;
    signedAt: string;
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
    
    // Attendance state
    const [attendanceSession, setAttendanceSession] = useState<AttendanceSession | null>(null);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

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

    // Load attendance session and records
    const loadAttendanceData = async () => {
        if (!selectedMinistry) return;
        
        console.log('Loading attendance data for:', selectedMinistry);
        setLoading(true);
        try {
            // Load session info
            const sessionResponse = await axios.get(
                `http://localhost:3000/attendance/session/${selectedMinistry}`,
                { withCredentials: true }
            );
            console.log('Session response:', sessionResponse.data);
            setAttendanceSession(sessionResponse.data.session);
            
            // Load attendance records if there's an active session
            if (sessionResponse.data.session) {
                const recordsResponse = await axios.get(
                    `http://localhost:3000/attendance/records/${sessionResponse.data.session._id}`,
                    { withCredentials: true }
                );
                console.log('Records response:', recordsResponse.data);
                setAttendanceRecords(recordsResponse.data.records || []);
            } else {
                setAttendanceRecords([]);
            }
        } catch (error: any) {
            console.error('Error loading attendance data:', error);
            // Don't show error message for non-existent sessions, that's normal
            if (error.response?.status !== 404) {
                setMessage('Error loading attendance data');
                setTimeout(() => setMessage(''), 3000);
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Start attendance session
    const startAttendanceSession = async () => {
        if (!selectedMinistry) return;
        
        setLoading(true);
        try {
            const response = await axios.post(
                `http://localhost:3000/attendance/start-session`,
                { ministry: selectedMinistry },
                { withCredentials: true }
            );
            setAttendanceSession(response.data.session);
            setAttendanceRecords([]);
            setMessage('✅ Attendance session opened - Users can now sign attendance');
            setTimeout(() => setMessage(''), 5000);
        } catch (error) {
            console.error('Error starting session:', error);
            setMessage('❌ Error opening attendance session');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };
    
    // End attendance session
    const endAttendanceSession = async () => {
        if (!attendanceSession) return;
        
        if (!confirm('Are you sure you want to close the attendance session? Users will no longer be able to sign attendance.')) {
            return;
        }
        
        setLoading(true);
        try {
            await axios.post(
                `http://localhost:3000/attendance/end-session`,
                { sessionId: attendanceSession._id },
                { withCredentials: true }
            );
            // Keep the session but mark as inactive
            setAttendanceSession({...attendanceSession, isActive: false, endTime: new Date().toISOString()});
            setMessage('🔒 Attendance session closed - Users can no longer sign attendance');
            setTimeout(() => setMessage(''), 5000);
        } catch (error) {
            console.error('Error ending session:', error);
            setMessage('❌ Error closing attendance session');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };
    
    // Reset attendance (clear records and end session)
    const resetAttendance = async () => {
        if (!selectedMinistry) {
            setMessage('Please select a ministry first');
            setTimeout(() => setMessage(''), 3000);
            return;
        }
        
        if (!confirm('Are you sure you want to reset attendance? This will clear all records for the current session and allow users to sign up again.')) {
            return;
        }
        
        setLoading(true);
        try {
            // First end the current session if it exists and is active
            if (attendanceSession && attendanceSession.isActive) {
                await axios.post(
                    `http://localhost:3000/attendance/end-session`,
                    { sessionId: attendanceSession._id },
                    { withCredentials: true }
                );
            }
            
            // Then start a new session
            const response = await axios.post(
                `http://localhost:3000/attendance/start-session`,
                { ministry: selectedMinistry },
                { withCredentials: true }
            );
            
            setAttendanceSession(response.data.session);
            setAttendanceRecords([]);
            setMessage('🔄 Attendance has been reset - All previous records cleared, users can sign again');
            setTimeout(() => setMessage(''), 5000);
        } catch (error: any) {
            console.error('Error resetting attendance:', error);
            setMessage(`Error resetting attendance: ${error.response?.data?.message || error.message}`);
            setTimeout(() => setMessage(''), 5000);
        } finally {
            setLoading(false);
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
                    @page { size: A4; margin: 15mm; }
                    body { font-family: 'Times New Roman', serif; margin: 0; padding: 0; }
                    .letterhead-img { width: 100%; max-width: 800px; height: auto; margin: 0 auto 20px; display: block; }
                    .document-title { text-align: center; margin: 20px 0; }
                    .document-title h2 { color: #730051; font-size: 20px; margin: 0; text-transform: uppercase; }
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
                    @media print {
                        .letterhead-img { max-height: 150px; }
                    }
                </style>
            </head>
            <body>
                <img src="/img/letterhead.png" class="letterhead-img" alt="KSUCU-MC Letterhead" />
                
                <div class="document-title">
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
                    
                    ${commitment.reviewedBy ? `
                    <div style="margin-top: 30px; border-top: 1px solid #ccc; padding-top: 15px;">
                        <div class="form-row">
                            <div class="form-field">
                                <label>Reviewed By:</label>
                                <div class="value">${commitment.reviewedBy.username}</div>
                            </div>
                            <div class="form-field">
                                <label>Review Date:</label>
                                <div class="value">${new Date(commitment.reviewedAt || '').toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                </div>
                
                <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #666;">
                    <hr style="border: none; border-top: 1px solid #ccc; margin-bottom: 10px;" />
                    <p style="margin: 5px 0;">KSUCU-MC | P.O BOX 408-40200, KISII, KENYA</p>
                    <p style="margin: 5px 0;">www.ksucumc.org | ksuchristianunion@gmail.com</p>
                    <p style="margin: 5px 0; font-style: italic;">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
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
        if (authenticated && selectedMinistry) {
            if (viewMode === 'commitments') {
                loadCommitmentForms();
            } else if (viewMode === 'attendance') {
                loadAttendanceData();
            }
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
                                {selectedMinistry && ministryNames[selectedMinistry]} - Attendance Management
                            </h2>
                            {/* Debug info */}
                            {import.meta.env.DEV && (
                                <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
                                    DEBUG: Selected Ministry: {selectedMinistry}, View Mode: {viewMode}, Session: {attendanceSession ? 'EXISTS' : 'NONE'}, Active: {attendanceSession?.isActive ? 'YES' : 'NO'}
                                </div>
                            )}
                            <div className={styles.sessionControls}>
                                {/* ALWAYS VISIBLE BUTTONS FOR TESTING */}
                                <div style={{display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap'}}>
                                    <button
                                        className={`${styles.actionButton} ${styles.startSession}`}
                                        onClick={startAttendanceSession}
                                        disabled={loading}
                                        style={{backgroundColor: '#10b981', color: 'white', padding: '12px 24px', fontSize: '16px'}}
                                    >
                                        <FontAwesomeIcon icon={faPlay} /> Open Session
                                    </button>
                                    <button
                                        className={`${styles.actionButton} ${styles.resetSession}`}
                                        onClick={resetAttendance}
                                        disabled={loading}
                                        style={{backgroundColor: '#f59e0b', color: 'white', padding: '12px 24px', fontSize: '16px'}}
                                    >
                                        <FontAwesomeIcon icon={faRedo} /> Reset Attendance
                                    </button>
                                    <button
                                        className={`${styles.actionButton} ${styles.endSession}`}
                                        onClick={endAttendanceSession}
                                        disabled={loading}
                                        style={{backgroundColor: '#ef4444', color: 'white', padding: '12px 24px', fontSize: '16px'}}
                                    >
                                        <FontAwesomeIcon icon={faStop} /> Close Session
                                    </button>
                                </div>
                                
                                {/* Show open button when no active session */}
                                {(!attendanceSession || !attendanceSession.isActive) && (
                                    <div style={{padding: '10px', background: '#f0f0f0', margin: '10px 0', borderRadius: '8px'}}>
                                        <p><strong>Status:</strong> No active session - Click button above to open session</p>
                                    </div>
                                )}
                                
                                {/* Show session controls when active */}
                                {attendanceSession && attendanceSession.isActive && (
                                    <>
                                        <div className={styles.sessionInfo}>
                                            <span className={`${styles.sessionStatus} ${styles.active}`}>
                                                Session Open - Users can sign attendance
                                            </span>
                                            <span className={styles.sessionTime}>
                                                Opened: {new Date(attendanceSession.startTime).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <div className={styles.sessionActions}>
                                            <button
                                                className={`${styles.actionButton} ${styles.resetSession}`}
                                                onClick={resetAttendance}
                                                disabled={loading}
                                                title="Reset attendance - clears all records and restarts session"
                                            >
                                                <FontAwesomeIcon icon={faRedo} /> Reset Attendance
                                            </button>
                                            <button
                                                className={`${styles.actionButton} ${styles.endSession}`}
                                                onClick={endAttendanceSession}
                                                disabled={loading}
                                            >
                                                <FontAwesomeIcon icon={faStop} /> Close Session
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <div className={styles.loading}>Loading attendance data...</div>
                        ) : (
                            <div className={styles.attendanceContent}>
                                {attendanceSession && attendanceRecords.length > 0 ? (
                                    <>
                                        <div className={styles.attendanceStats}>
                                            <div className={styles.statCard}>
                                                <FontAwesomeIcon icon={faUsers} className={styles.statIcon} />
                                                <div className={styles.statNumber}>{attendanceRecords.length}</div>
                                                <div className={styles.statLabel}>Total Attendees</div>
                                            </div>
                                        </div>
                                        
                                        <div className={styles.attendanceList}>
                                            <h3 className={styles.listTitle}>
                                                <FontAwesomeIcon icon={faCalendarAlt} /> Attendance List
                                            </h3>
                                            <div className={styles.attendeeGrid}>
                                                {attendanceRecords.map((record, index) => (
                                                    <div key={record._id} className={styles.attendeeCard}>
                                                        <div className={styles.attendeeNumber}>{index + 1}</div>
                                                        <div className={styles.attendeeInfo}>
                                                            <div className={styles.attendeeName}>
                                                                {record.userId.username}
                                                            </div>
                                                            <div className={styles.attendeeEmail}>
                                                                {record.userId.email}
                                                            </div>
                                                            <div className={styles.attendeeTime}>
                                                                Signed: {new Date(record.signedAt).toLocaleTimeString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : attendanceSession ? (
                                    <div className={styles.noData}>
                                        <FontAwesomeIcon icon={faUsers} className={styles.noDataIcon} />
                                        {attendanceSession.isActive ? (
                                            <>
                                                <p>No attendance records yet.</p>
                                                <p className={styles.noDataSubtext}>
                                                    Session is open - waiting for users to sign attendance...
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p>Session closed - Final attendance count: {attendanceRecords.length}</p>
                                                <p className={styles.noDataSubtext}>
                                                    Session was closed at {attendanceSession.endTime ? new Date(attendanceSession.endTime).toLocaleString() : 'unknown time'}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className={styles.noData}>
                                        <FontAwesomeIcon icon={faCalendarAlt} className={styles.noDataIcon} />
                                        <p>No attendance session started.</p>
                                        <p className={styles.noDataSubtext}>
                                            Click "Open Attendance Session" to allow users to sign attendance.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MinistriesAdmin;