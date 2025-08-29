import React, { useState, useEffect } from 'react';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import styles from '../styles/attendanceSession.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getApiUrl } from '../config/environment';
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
    userName: string;
    regNo: string;
    year: number;
    phoneNumber: string;
    signedAt: string;
    signature: string;
    ministry: string;
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
    const [globalActiveSession, setGlobalActiveSession] = useState<{leadershipRole: string; isActive: boolean; startTime?: string; sessionId?: string} | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Get role from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get('role');
        if (role) {
            setLeadershipRole(decodeURIComponent(role));
            loadSessionData(role);
            
            // Set up periodic refresh for attendance records every 5 seconds
            const refreshInterval = setInterval(() => {
                loadSessionData(role);
            }, 5000);
            
            return () => clearInterval(refreshInterval);
        }
    }, []);

    const loadSessionData = async (role: string) => {
        setLoading(true);
        try {
            // Check backend for active session status
            const response = await fetch(getApiUrl('attendanceSessionStatus'), {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.session) {
                    console.log('Active session found:', data.session);
                    setAttendanceSession(data.session);
                    setGlobalActiveSession({
                        leadershipRole: data.session.leadershipRole,
                        isActive: data.session.isActive,
                        startTime: data.session.startTime,
                        sessionId: data.session._id
                    });
                    
                    // Load attendance records if session exists
                    if (data.session._id) {
                        try {
                            const recordsResponse = await fetch(`${getApiUrl('attendanceRecords')}/${data.session._id}`, {
                                method: 'GET',
                                credentials: 'include',
                            });
                            if (recordsResponse.ok) {
                                const recordsData = await recordsResponse.json();
                                const records = recordsData.records || [];
                                console.log(`Loaded ${records.length} attendance records for session ${data.session._id}`);
                                setAttendanceRecords(records);
                                
                                // Update the session attendance count with actual records count
                                if (data.session.isActive) {
                                    setAttendanceSession({
                                        ...data.session,
                                        totalAttendees: records.length
                                    });
                                }
                            } else {
                                console.error('Failed to load attendance records:', recordsResponse.statusText);
                                setAttendanceRecords([]);
                            }
                        } catch (error) {
                            console.error('Error loading attendance records:', error);
                            setAttendanceRecords([]);
                        }
                    } else {
                        setAttendanceRecords([]);
                    }
                    
                    if (data.session.leadershipRole !== role && data.session.isActive) {
                        setMessage(`⚠️ Notice: ${data.session.leadershipRole} currently has an active session. Only one leader can manage attendance at a time.`);
                        setTimeout(() => setMessage(''), 10000);
                    }
                } else {
                    console.log('No active session');
                    setAttendanceSession(null);
                    setGlobalActiveSession(null);
                    setAttendanceRecords([]);
                }
            }
        } catch (error) {
            console.error('Error loading session data:', error);
            setMessage('⚠️ Unable to connect to server. Session management may be limited.');
            setTimeout(() => setMessage(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    const startSession = async () => {
        setLoading(true);
        try {
            console.log('🚀 Starting session via backend API...');
            
            // Call backend API to start session
            const response = await fetch(getApiUrl('attendanceSessionOpen'), {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    leadershipRole: leadershipRole,
                    ministry: 'General'
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Session started successfully:', data);
                
                const newSession: AttendanceSession = {
                    _id: data.session._id || Date.now().toString(),
                    leadershipRole,
                    isActive: true,
                    startTime: data.session.startTime || new Date().toISOString(),
                    totalAttendees: 0
                };
                
                // Backend-only mode - no localStorage backup needed for cross-device functionality
                
                setAttendanceSession(newSession);
                setGlobalActiveSession({
                    leadershipRole,
                    isActive: true,
                    startTime: newSession.startTime,
                    sessionId: newSession._id
                });
                setMessage('✅ Attendance session opened - Users across all devices can now sign attendance');
                setTimeout(() => setMessage(''), 5000);
            } else {
                const errorData = await response.json();
                console.error('❌ Failed to start session:', errorData);
                
                if (response.status === 409) {
                    // Session conflict
                    setMessage(`❌ Cannot open session: ${errorData.activeSession?.leadershipRole || 'Another leader'} already has an active session. Please coordinate with them to close their session first.`);
                } else {
                    setMessage(`❌ ${errorData.message || 'Error opening attendance session'}`);
                }
                setTimeout(() => setMessage(''), 8000);
            }
        } catch (error) {
            console.error('❌ Error starting session:', error);
            setMessage('❌ Error opening attendance session - Check network connection');
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
            console.log('🔒 Closing session via backend API...');
            
            // Try backend API first, fallback to localStorage if not available
            try {
                const response = await fetch(getApiUrl('attendanceSessionClose'), {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        leadershipRole: leadershipRole,
                        totalAttendees: attendanceRecords.length
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ Session closed successfully via backend:', data);
                    
                    const updatedSession = {
                        ...attendanceSession,
                        isActive: false,
                        endTime: data.session.endTime || new Date().toISOString(),
                        totalAttendees: attendanceRecords.length
                    };
                    
                    // Backend-only mode - session closed centrally
                    
                    setAttendanceSession(updatedSession);
                    setGlobalActiveSession(null);
                    setMessage('🔒 Attendance session closed - No longer accepting new attendance across all devices');
                    setTimeout(() => setMessage(''), 5000);
                    return; // Exit early on success
                } else {
                    console.log('Backend API failed, falling back to localStorage...');
                    throw new Error('Backend API failed');
                }
            } catch (backendError) {
                console.error('❌ Error closing session:', backendError);
                setMessage('❌ Error closing session. Please check your connection.');
                setTimeout(() => setMessage(''), 5000);
            }
        } catch (error) {
            console.error('❌ Error closing session:', error);
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
                    @page { size: A4; margin: 10mm; }
                    body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; font-size: 12px; }
                    .letterhead-img { width: 100%; max-width: 100%; height: auto; margin: 0 auto 15px; display: block; }
                    .header { text-align: center; margin-bottom: 15px; }
                    .header h2 { color: #730051; font-size: 18px; margin: 5px 0; font-weight: bold; }
                    .session-info { 
                        background: linear-gradient(135deg, #730051, #00C6FF); 
                        color: white; 
                        padding: 8px 15px; 
                        border-radius: 5px; 
                        margin: 10px 0;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .session-left { text-align: left; }
                    .session-right { text-align: right; }
                    .attendance-table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin: 10px 0; 
                        font-size: 11px;
                    }
                    .attendance-table th { 
                        background: linear-gradient(135deg, #730051, #8e1a6b); 
                        color: white; 
                        padding: 8px 4px; 
                        text-align: center; 
                        font-weight: bold; 
                        border: 1px solid #fff;
                        font-size: 10px;
                    }
                    .attendance-table td { 
                        padding: 4px; 
                        text-align: center; 
                        border: 1px solid #ddd; 
                        vertical-align: middle;
                    }
                    .signature-cell img {
                        max-width: 100%;
                        max-height: 26px;
                        object-fit: contain;
                        border: none;
                    }
                    .attendance-table tr:nth-child(even) { background: #f0f8ff; }
                    .attendance-table tr:nth-child(odd) { background: #fff; }
                    .attendance-table tr:hover { background: #e6f3ff; }
                    .name-col { text-align: left !important; font-weight: bold; color: #730051; }
                    .number-col { background: #00C6FF !important; color: white; font-weight: bold; }
                    .footer { 
                        margin-top: 15px; 
                        text-align: center; 
                        font-size: 9px; 
                        color: #666; 
                        border-top: 2px solid #730051; 
                        padding-top: 10px; 
                    }
                    .signature-section {
                        margin-top: 20px;
                        display: flex;
                        justify-content: space-between;
                    }
                    .signature-box {
                        width: 45%;
                        text-align: center;
                        border: 2px solid #730051;
                        padding: 15px;
                        border-radius: 5px;
                    }
                    .signature-line { 
                        border-bottom: 2px solid #730051; 
                        margin: 10px 0; 
                        height: 30px;
                    }
                </style>
            </head>
            <body>
                <img src="${window.location.origin}/img/letterhead.png" class="letterhead-img" alt="KSUCU-MC Letterhead" />
                
                <div class="header">
                    <h2>${leadershipRole} - Attendance Report</h2>
                </div>
                
                <div class="session-info">
                    <div class="session-left">
                        <strong>Ministry Session</strong><br>
                        <strong>Leader:</strong> ${leadershipRole}
                    </div>
                    <div class="session-right">
                        <strong>${attendanceRecords.length} Attendees</strong><br>
                        <strong>Date:</strong> ${attendanceSession ? new Date(attendanceSession.startTime).toLocaleDateString() : new Date().toLocaleDateString()}
                    </div>
                </div>

                <table class="attendance-table">
                    <thead>
                        <tr>
                            <th style="width: 6%;">#</th>
                            <th style="width: 28%;">NAME</th>
                            <th style="width: 22%;">REGISTRATION NO.</th>
                            <th style="width: 8%;">YEAR</th>
                            <th style="width: 15%;">PHONE</th>
                            <th style="width: 15%;">SIGN TIME</th>
                            <th style="width: 6%;">SIGNATURE</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${attendanceRecords.map((record, index) => `
                            <tr>
                                <td class="number-col">${index + 1}</td>
                                <td class="name-col">${record.userName}</td>
                                <td>${record.regNo}</td>
                                <td>${record.year}</td>
                                <td>${record.phoneNumber || 'N/A'}</td>
                                <td>${new Date(record.signedAt).toLocaleString('en-US', {
                                    month: 'short', 
                                    day: 'numeric', 
                                    hour: '2-digit', 
                                    minute: '2-digit'
                                })}</td>
                                <td style="height: 30px; border: 1px solid #ccc; padding: 2px; text-align: center;">
                                    ${record.signature && record.signature.startsWith('data:image') ? 
                                        `<img src="${record.signature}" style="max-width: 100%; max-height: 26px; object-fit: contain;" alt="Signature" />` : 
                                        '<span style="font-size: 10px; color: #999;">No signature</span>'
                                    }
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="signature-section">
                    <div class="signature-box">
                        <strong style="color: #730051;">LEADER SIGNATURE</strong>
                        <div class="signature-line"></div>
                        <p>Name: _______________________</p>
                        <p>Date: _______________________</p>
                    </div>
                    <div class="signature-box">
                        <strong style="color: #730051;">MINISTRY COORDINATOR</strong>
                        <div class="signature-line"></div>
                        <p>Name: _______________________</p>
                        <p>Date: _______________________</p>
                    </div>
                </div>
                
                <div class="footer">
                    <p style="color: #730051; font-weight: bold;">KSUCU-MC | P.O BOX 408-40200, KISII, KENYA</p>
                    <p>www.ksucumc.org | ksuchristianunion@gmail.com</p>
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
                                        <p>
                                            <strong>{record.userName}</strong> | 
                                            <strong>Reg:</strong> {record.regNo} | 
                                            <strong>Ministry:</strong> {record.ministry} | 
                                            <strong>Year:</strong> {record.year} | 
                                            <strong>Phone:</strong> {record.phoneNumber || 'Not provided'} | 
                                            <strong>Signed:</strong> {new Date(record.signedAt).toLocaleString()}
                                        </p>
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