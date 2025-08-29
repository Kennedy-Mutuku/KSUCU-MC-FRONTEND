import React, { useState, useEffect } from 'react';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import styles from '../styles/attendanceSession.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUsers, 
    faPlay,
    faStop,
    faRedo,
    faDownload,
    faCalendar,
    faFileSignature,
    faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

interface AttendanceRecord {
    _id: string;
    fullName: string;
    registrationNumber: string;
    course: string;
    yearOfStudy: string;
    phoneNumber: string;
    signedAt: string;
    signature: string;
}

interface AttendanceSession {
    _id: string;
    leadershipRole: string;
    isActive: boolean;
    startTime: string;
    endTime?: string;
    totalAttendees: number;
}

const AttendanceSessionManagement: React.FC = () => {
    const [leadershipRole, setLeadershipRole] = useState<string>('');
    const [attendanceSession, setAttendanceSession] = useState<AttendanceSession | null>(null);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [globalActiveSession, setGlobalActiveSession] = useState<{leadershipRole: string; isActive: boolean} | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Get role from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get('role');
        if (role) {
            setLeadershipRole(decodeURIComponent(role));
            loadSessionData(role);
        }
    }, []);

    const loadSessionData = async (role: string) => {
        setLoading(true);
        try {
            // In a real app, this would be an API call
            // For now, using localStorage simulation
            const sessionData = localStorage.getItem(`attendance-session-${role}`);
            const recordsData = localStorage.getItem(`attendance-records-${role}`);
            
            if (sessionData) {
                const session = JSON.parse(sessionData);
                setAttendanceSession(session);
                console.log('Loaded session:', session);
            }
            if (recordsData) {
                const records = JSON.parse(recordsData);
                setAttendanceRecords(records);
                console.log('Loaded records:', records);
            }
            
            // Check for session conflicts with other leaders
            const globalSession = localStorage.getItem('global-active-session');
            if (globalSession) {
                const globalSessionData = JSON.parse(globalSession);
                setGlobalActiveSession(globalSessionData);
                if (globalSessionData.isActive && globalSessionData.leadershipRole !== role) {
                    setMessage(`⚠️ Notice: ${globalSessionData.leadershipRole} currently has an active session. Only one leader can manage attendance at a time.`);
                    setTimeout(() => setMessage(''), 10000);
                } else if (globalSessionData.leadershipRole === role && globalSessionData.isActive) {
                    console.log('Global session active for', role);
                }
            } else {
                setGlobalActiveSession(null);
            }
        } catch (error) {
            console.error('Error loading session data:', error);
        } finally {
            setLoading(false);
        }
    };

    const startSession = async () => {
        setLoading(true);
        try {
            // First, check if any other leader already has an active session
            const existingGlobalSession = localStorage.getItem('global-active-session');
            
            if (existingGlobalSession) {
                const existingSession = JSON.parse(existingGlobalSession);
                if (existingSession.isActive && existingSession.leadershipRole !== leadershipRole) {
                    setMessage(`❌ Cannot open session: ${existingSession.leadershipRole} already has an active session. Please coordinate with them to close their session first.`);
                    setTimeout(() => setMessage(''), 8000);
                    setLoading(false);
                    return;
                }
            }
            
            const newSession: AttendanceSession = {
                _id: Date.now().toString(),
                leadershipRole,
                isActive: true,
                startTime: new Date().toISOString(),
                totalAttendees: 0
            };
            
            // Double-check right before setting (race condition prevention)
            const lastMinuteCheck = localStorage.getItem('global-active-session');
            if (lastMinuteCheck) {
                const lastMinuteSession = JSON.parse(lastMinuteCheck);
                if (lastMinuteSession.isActive && lastMinuteSession.leadershipRole !== leadershipRole) {
                    setMessage(`❌ Session conflict detected: ${lastMinuteSession.leadershipRole} opened a session just now. Please refresh and try again.`);
                    setTimeout(() => setMessage(''), 8000);
                    setLoading(false);
                    return;
                }
            }
            
            // Save to localStorage (in real app, would be API call)
            localStorage.setItem(`attendance-session-${leadershipRole}`, JSON.stringify(newSession));
            // Store global active session for landing page
            const globalSessionData = {
                leadershipRole,
                isActive: true,
                startTime: newSession.startTime,
                sessionId: newSession._id
            };
            localStorage.setItem('global-active-session', JSON.stringify(globalSessionData));
            
            setAttendanceSession(newSession);
            setGlobalActiveSession(globalSessionData);
            setMessage('✅ Attendance session opened - Users can now sign attendance');
            setTimeout(() => setMessage(''), 5000);
        } catch (error) {
            setMessage('❌ Error opening attendance session');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const closeSession = async () => {
        if (!attendanceSession) return;
        
        if (!confirm('Are you sure you want to close the attendance session?')) return;
        
        setLoading(true);
        try {
            const updatedSession = {
                ...attendanceSession,
                isActive: false,
                endTime: new Date().toISOString(),
                totalAttendees: attendanceRecords.length
            };
            
            localStorage.setItem(`attendance-session-${leadershipRole}`, JSON.stringify(updatedSession));
            // Remove global active session
            localStorage.removeItem('global-active-session');
            
            setAttendanceSession(updatedSession);
            setGlobalActiveSession(null);
            setMessage('🔒 Attendance session closed');
            setTimeout(() => setMessage(''), 5000);
        } catch (error) {
            setMessage('❌ Error closing attendance session');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const resetSession = async () => {
        if (!confirm('Are you sure you want to reset attendance? This will clear all records.')) return;
        
        setLoading(true);
        try {
            // Clear all records
            localStorage.removeItem(`attendance-records-${leadershipRole}`);
            setAttendanceRecords([]);
            
            // Create new session
            const newSession: AttendanceSession = {
                _id: Date.now().toString(),
                leadershipRole,
                isActive: true,
                startTime: new Date().toISOString(),
                totalAttendees: 0
            };
            
            localStorage.setItem(`attendance-session-${leadershipRole}`, JSON.stringify(newSession));
            // Update global active session
            const globalSessionData = {
                leadershipRole,
                isActive: true,
                startTime: newSession.startTime,
                sessionId: newSession._id
            };
            localStorage.setItem('global-active-session', JSON.stringify(globalSessionData));
            
            setAttendanceSession(newSession);
            setGlobalActiveSession(globalSessionData);
            setMessage('🔄 Attendance has been reset - All records cleared');
            setTimeout(() => setMessage(''), 5000);
        } catch (error) {
            setMessage('❌ Error resetting attendance');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const forceStartSession = async () => {
        const existingGlobalSession = localStorage.getItem('global-active-session');
        if (!existingGlobalSession) {
            // No conflict, just start normally
            startSession();
            return;
        }

        const existingSession = JSON.parse(existingGlobalSession);
        if (!confirm(`⚠️ WARNING: ${existingSession.leadershipRole} currently has an active session.\n\nThis will FORCEFULLY close their session and take over control.\n\nOnly use this in emergencies or if you've coordinated with them.\n\nAre you absolutely sure you want to proceed?`)) {
            return;
        }

        setLoading(true);
        try {
            // Clear the existing leader's session
            localStorage.removeItem(`attendance-session-${existingSession.leadershipRole}`);
            
            const newSession: AttendanceSession = {
                _id: Date.now().toString(),
                leadershipRole,
                isActive: true,
                startTime: new Date().toISOString(),
                totalAttendees: 0
            };
            
            // Take over global control
            localStorage.setItem(`attendance-session-${leadershipRole}`, JSON.stringify(newSession));
            const globalSessionData = {
                leadershipRole,
                isActive: true,
                startTime: newSession.startTime,
                sessionId: newSession._id
            };
            localStorage.setItem('global-active-session', JSON.stringify(globalSessionData));
            
            setAttendanceSession(newSession);
            setGlobalActiveSession(globalSessionData);
            setMessage(`🔄 Session taken over from ${existingSession.leadershipRole}. You now have control of attendance.`);
            setTimeout(() => setMessage(''), 8000);
        } catch (error) {
            setMessage('❌ Error taking over session');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = () => {
        if (attendanceRecords.length === 0) {
            setMessage('No attendance records to download');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>KSUCU - ${leadershipRole} - Attendance Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .session-info { background: #f5f5f5; padding: 15px; margin: 20px 0; }
                    .record { border: 1px solid #ddd; padding: 10px; margin: 10px 0; }
                    .signature { max-width: 100px; max-height: 50px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>KSUCU Attendance Report</h1>
                    <h2>Leadership Role: ${leadershipRole}</h2>
                </div>
                
                <div class="session-info">
                    <p><strong>Session Started:</strong> ${attendanceSession ? new Date(attendanceSession.startTime).toLocaleString() : 'N/A'}</p>
                    <p><strong>Session Ended:</strong> ${attendanceSession?.endTime ? new Date(attendanceSession.endTime).toLocaleString() : 'Session still active'}</p>
                    <p><strong>Total Attendees:</strong> ${attendanceRecords.length}</p>
                </div>
                
                <h3>Attendance Records</h3>
                ${attendanceRecords.map((record, index) => `
                    <div class="record">
                        <p><strong>${index + 1}. ${record.fullName}</strong></p>
                        <p>Registration: ${record.registrationNumber}</p>
                        <p>Course: ${record.course} - Year ${record.yearOfStudy}</p>
                        <p>Phone: ${record.phoneNumber || 'Not provided'}</p>
                        <p>Signed at: ${new Date(record.signedAt).toLocaleString()}</p>
                    </div>
                `).join('')}
                
                <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #666;">
                    <p>Generated on ${new Date().toLocaleString()}</p>
                    <p>KSUCU-MC | Kisii University Main Campus Christian Union</p>
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

    const goBack = () => {
        window.location.href = '/worship-docket-admin';
    };

    return (
        <>
            <UniversalHeader />
            <div className={styles.container}>
                <div className={styles.header}>
                    <button onClick={goBack} className={styles.backButton}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Back to Leadership Selection
                    </button>
                    
                    {/* Active Leadership Role Indicator */}
                    <div className={styles.activeRoleIndicator}>
                        <span className={styles.activeRoleIcon}>👑</span>
                        <div className={styles.activeRoleText}>
                            <strong>{leadershipRole}</strong> Control Active
                        </div>
                    </div>
                    
                    <h1>
                        <FontAwesomeIcon icon={faUsers} />
                        Centralized Attendance Management
                    </h1>
                    <p className={styles.roleInfo}>Managing attendance for all KSUCU members</p>
                </div>

                {message && (
                    <div className={styles.message}>
                        {message}
                    </div>
                )}

                {/* Session Controls */}
                <div className={styles.sessionControls}>
                    <h2>
                        <FontAwesomeIcon icon={faFileSignature} />
                        Session Management
                    </h2>
                    
                    <div className={styles.sessionStatus}>
                        {attendanceSession && attendanceSession.isActive ? (
                            <div className={`${styles.statusCard} ${styles.active}`}>
                                <h3>✅ Session Active</h3>
                                <p><strong>Your Role:</strong> {leadershipRole}</p>
                                <p>Started: {new Date(attendanceSession.startTime).toLocaleString()}</p>
                                {attendanceSession.endTime && (
                                    <p>Ended: {new Date(attendanceSession.endTime).toLocaleString()}</p>
                                )}
                                <p>Total Attendees: {attendanceRecords.length}</p>
                            </div>
                        ) : globalActiveSession && globalActiveSession.isActive ? (
                            <div className={`${styles.statusCard} ${styles.inactive}`}>
                                <h3>⚠️ Another Session Active</h3>
                                <p><strong>{globalActiveSession.leadershipRole}</strong> currently has an active session</p>
                                <p>Only one leader can manage attendance at a time</p>
                                <p>Use "Force Takeover" only in emergencies</p>
                            </div>
                        ) : attendanceSession && !attendanceSession.isActive ? (
                            <div className={`${styles.statusCard} ${styles.inactive}`}>
                                <h3>🔒 Your Session Closed</h3>
                                <p>Started: {new Date(attendanceSession.startTime).toLocaleString()}</p>
                                <p>Ended: {attendanceSession.endTime ? new Date(attendanceSession.endTime).toLocaleString() : 'Unknown'}</p>
                                <p>Total Attendees: {attendanceRecords.length}</p>
                            </div>
                        ) : (
                            <div className={`${styles.statusCard} ${styles.inactive}`}>
                                <h3>⚪ No Active Session</h3>
                                <p>Click "Open Session" to start collecting attendance</p>
                            </div>
                        )}
                    </div>

                    <div className={styles.controlButtons}>
                        <button
                            onClick={startSession}
                            disabled={loading || (attendanceSession?.isActive ?? false)}
                            className={`${styles.controlButton} ${styles.startButton}`}
                        >
                            <FontAwesomeIcon icon={faPlay} />
                            Open Session
                        </button>
                        
                        {/* Force Takeover Button - only show if there's a conflict */}
                        {(() => {
                            const globalSession = localStorage.getItem('global-active-session');
                            if (globalSession) {
                                const sessionData = JSON.parse(globalSession);
                                if (sessionData.isActive && sessionData.leadershipRole !== leadershipRole && !attendanceSession?.isActive) {
                                    return (
                                        <button
                                            onClick={forceStartSession}
                                            disabled={loading}
                                            className={`${styles.controlButton} ${styles.forceButton}`}
                                            title={`Take over from ${sessionData.leadershipRole}`}
                                        >
                                            <FontAwesomeIcon icon={faUsers} />
                                            Force Takeover
                                        </button>
                                    );
                                }
                            }
                            return null;
                        })()}
                        
                        <button
                            onClick={resetSession}
                            disabled={loading}
                            className={`${styles.controlButton} ${styles.resetButton}`}
                        >
                            <FontAwesomeIcon icon={faRedo} />
                            Reset Attendance
                        </button>
                        
                        <button
                            onClick={closeSession}
                            disabled={loading || !attendanceSession?.isActive}
                            className={`${styles.controlButton} ${styles.stopButton}`}
                        >
                            <FontAwesomeIcon icon={faStop} />
                            Close Session
                        </button>
                    </div>
                </div>

                {/* Attendance Records */}
                <div className={styles.attendanceRecords}>
                    <div className={styles.recordsHeader}>
                        <h2>
                            <FontAwesomeIcon icon={faCalendar} />
                            Attendance Records ({attendanceRecords.length})
                        </h2>
                        {attendanceRecords.length > 0 && (
                            <button
                                onClick={downloadPDF}
                                className={styles.downloadButton}
                            >
                                <FontAwesomeIcon icon={faDownload} />
                                Download PDF
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className={styles.loading}>Loading...</div>
                    ) : attendanceRecords.length > 0 ? (
                        <div className={styles.recordsList}>
                            {attendanceRecords.map((record, index) => (
                                <div key={record._id} className={styles.recordCard}>
                                    <div className={styles.recordNumber}>{index + 1}</div>
                                    <div className={styles.recordInfo}>
                                        <h3>{record.fullName}</h3>
                                        <p><strong>Reg:</strong> {record.registrationNumber}</p>
                                        <p><strong>Course:</strong> {record.course}</p>
                                        <p><strong>Year:</strong> {record.yearOfStudy}</p>
                                        <p><strong>Phone:</strong> {record.phoneNumber || 'Not provided'}</p>
                                        <p><strong>Signed:</strong> {new Date(record.signedAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noRecords}>
                            <FontAwesomeIcon icon={faUsers} className={styles.noRecordsIcon} />
                            <h3>No attendance records yet</h3>
                            <p>
                                {attendanceSession?.isActive 
                                    ? 'Session is open - waiting for users to sign attendance...'
                                    : 'Open a session to start collecting attendance'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AttendanceSessionManagement;