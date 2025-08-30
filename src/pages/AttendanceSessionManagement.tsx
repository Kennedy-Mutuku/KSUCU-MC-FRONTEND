import React, { useState, useEffect } from 'react';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import styles from '../styles/attendanceSession.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getApiUrl } from '../config/environment';
import { formatDateTime, getTimeAgo, formatSessionDuration, isRecentTime } from '../utils/timeUtils';
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
            
            // Set up periodic refresh for attendance records every 2 seconds for real-time updates
            const refreshInterval = setInterval(() => {
                console.log('🔄 Auto-refreshing session data...');
                loadSessionData(role);
            }, 2000); // Reduced to 2 seconds for faster updates
            
            return () => clearInterval(refreshInterval);
        }
    }, []);

    const loadSessionData = async (role: string) => {
        console.log(`📡 Loading session data for role: "${role}"`);
        // Don't set loading true during auto-refresh to avoid UI flicker
        // setLoading(true);
        try {
            // Check backend for active session status (with cache-busting)
            const timestamp = Date.now();
            const response = await fetch(`${getApiUrl('attendanceSessionStatus')}?t=${timestamp}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.session) {
                    console.log('Active session found:', data.session);
                    setGlobalActiveSession({
                        leadershipRole: data.session.leadershipRole,
                        isActive: data.session.isActive,
                        startTime: data.session.startTime,
                        sessionId: data.session._id
                    });
                    
                    // Check if this admin owns the current session
                    console.log(`🔍 Session ownership check: "${data.session.leadershipRole}" === "${role}" ?`, data.session.leadershipRole === role);
                    if (data.session.leadershipRole === role) {
                        console.log(`✅ ${role} owns the current session - loading records`);
                        // This admin owns the session - load their records
                        setAttendanceSession(data.session);
                        
                        if (data.session._id) {
                            try {
                                // Force fresh data by adding timestamp and no-cache headers
                                const recordsUrl = `${getApiUrl('attendanceRecords')}/${data.session._id}?t=${timestamp}&refresh=${Math.random()}`;
                                console.log(`📊 Fetching attendance records from: ${recordsUrl}`);
                                
                                const recordsResponse = await fetch(recordsUrl, {
                                    method: 'GET',
                                    credentials: 'include',
                                    headers: {
                                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                                        'Pragma': 'no-cache',
                                        'Expires': '0'
                                    }
                                });
                                
                                if (recordsResponse.ok) {
                                    const recordsData = await recordsResponse.json();
                                    const records = recordsData.records || [];
                                    console.log(`✅ ${role} loaded ${records.length} attendance records from session ${data.session._id}`);
                                    console.log('Records data:', recordsData);
                                    console.log('Individual records:', records);
                                    console.log('Record IDs:', records.map((r: { _id: string }) => r._id));
                                    
                                    // Always update records to ensure we have the latest data
                                    // Force React to update by creating completely new array with mapped objects
                                    const processedRecords = records.map((record: AttendanceRecord) => ({
                                        _id: record._id,
                                        userName: record.userName,
                                        regNo: record.regNo,
                                        year: record.year,
                                        phoneNumber: record.phoneNumber || '',
                                        ministry: record.ministry,
                                        signedAt: record.signedAt,
                                        signature: record.signature || ''
                                    }));
                                    
                                    console.log('📝 Updating attendance records state with', processedRecords.length, 'records');
                                    console.log('📝 Processed records:', processedRecords);
                                    
                                    // Force a state update with a completely new reference
                                    setAttendanceRecords(prevRecords => {
                                        console.log('📝 Previous records:', prevRecords.length);
                                        console.log('📝 New records:', processedRecords.length);
                                        return processedRecords;
                                    });
                                    
                                    // Update the session with actual record count
                                    setAttendanceSession({
                                        ...data.session,
                                        attendanceCount: records.length,
                                        totalAttendees: records.length
                                    });
                                    
                                    console.log('📝 State update complete. Records should now display.');
                                } else {
                                    console.error(`❌ Failed to load records for ${role}:`, recordsResponse.status, recordsResponse.statusText);
                                    const errorText = await recordsResponse.text();
                                    console.error('Error response:', errorText);
                                    setAttendanceRecords([]);
                                }
                            } catch (error) {
                                console.error('Error loading attendance records:', error);
                                setAttendanceRecords([]);
                            }
                        }
                    } else {
                        console.log(`🔒 ${role} does NOT own the session - session belongs to ${data.session.leadershipRole}`);
                        // Another admin owns the session
                        setAttendanceSession(null);
                        setAttendanceRecords([]);
                        setMessage(`🔒 ${data.session.leadershipRole} currently has an active session. You must wait for them to close it, or force close it to start your own session.`);
                    }
                } else {
                    console.log('No active session - admin can start new session');
                    setAttendanceSession(null);
                    setGlobalActiveSession(null);
                    setAttendanceRecords([]);
                    setMessage('');
                }
            }
        } catch (error) {
            console.error('Error loading session data:', error);
            setMessage('⚠️ Unable to connect to server. Session management may be limited.');
            setTimeout(() => setMessage(''), 5000);
        } finally {
            // Don't set loading false here since we removed setLoading(true)
            // setLoading(false);
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
            
            // Close session via backend API
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
        if (!confirm('⚠️ RESET WARNING!\n\nThis will permanently DELETE ALL attendance records from all sessions and create a fresh start.\n\nThis action cannot be undone!\n\nAre you sure you want to proceed?')) return;
        
        setLoading(true);
        try {
            console.log('🔄 RESETTING entire attendance system...');
            
            // Call the dedicated reset endpoint that clears everything
            const response = await fetch(getApiUrl('attendanceSessionReset'), {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    leadershipRole: leadershipRole
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ System reset completed:', data);
                
                const newSession: AttendanceSession = {
                    _id: data.session._id,
                    leadershipRole,
                    isActive: true,
                    startTime: data.session.startTime,
                    totalAttendees: 0
                };
                
                // Clear all local state
                setAttendanceRecords([]);
                setAttendanceSession(newSession);
                setGlobalActiveSession({
                    leadershipRole,
                    isActive: true,
                    startTime: newSession.startTime,
                    sessionId: newSession._id
                });
                
                setMessage(`🔄 Complete system reset successful! Cleared ${data.recordsCleared} attendance records and created fresh session.`);
                setTimeout(() => setMessage(''), 8000);
                
                // Refresh data from backend to confirm clean state
                setTimeout(() => {
                    loadSessionData(leadershipRole);
                }, 1000);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to reset system');
            }
        } catch (error) {
            console.error('❌ Error resetting attendance system:', error);
            setMessage('❌ Error resetting attendance system. Please try again.');
            setTimeout(() => setMessage(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    const forceCloseSession = async () => {
        if (!globalActiveSession || !globalActiveSession.leadershipRole) {
            setMessage('❌ No active session found to force close');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        if (!confirm(`⚠️ FORCE CLOSE WARNING!\n\n${globalActiveSession.leadershipRole} currently has an active session.\n\nThis will FORCEFULLY close their session and allow you to start your own.\n\n⚠️ Only use this in emergencies or if you've coordinated with them.\n\nAre you absolutely sure you want to proceed?`)) {
            return;
        }

        setLoading(true);
        try {
            console.log(`🚨 Force closing session owned by ${globalActiveSession.leadershipRole}`);
            
            const response = await fetch(getApiUrl('attendanceSessionForceClose'), {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newLeadershipRole: leadershipRole
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Session forcefully closed:', data);
                
                // Clear current session data
                setAttendanceSession(null);
                setGlobalActiveSession(null);
                setAttendanceRecords([]);
                
                setMessage(`🔄 ${data.closedSession.leadershipRole}'s session has been forcefully closed. You can now start your own session.`);
                setTimeout(() => setMessage(''), 8000);
                
                // Refresh data to show updated state
                loadSessionData(leadershipRole);
            } else {
                const errorData = await response.json();
                console.error('❌ Failed to force close session:', errorData);
                setMessage(`❌ ${errorData.message || 'Error force closing session'}`);
                setTimeout(() => setMessage(''), 5000);
            }
        } catch (error) {
            console.error('❌ Error force closing session:', error);
            setMessage('❌ Error force closing session - Check network connection');
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
                        <strong>Date:</strong> ${attendanceSession ? formatDateTime(attendanceSession.startTime, { format: 'medium' }) : formatDateTime(new Date(), { format: 'medium' })}
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
                                <td>${formatDateTime(record.signedAt, { format: 'short', includeSeconds: false })}</td>
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

    console.log('🔄 Component render - attendanceRecords.length:', attendanceRecords.length);
    console.log('🔄 Component render - attendanceRecords:', attendanceRecords);

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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ margin: 0 }}>
                            <FontAwesomeIcon icon={faFileSignature} />
                            Session Management
                        </h2>
                        <button
                            onClick={() => {
                                console.log('🔄 Manual refresh requested');
                                loadSessionData(leadershipRole);
                            }}
                            disabled={loading}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            🔄 Refresh
                        </button>
                    </div>
                    
                    <div className={styles.sessionStatus}>
                        {attendanceSession && attendanceSession.isActive ? (
                            <div className={`${styles.statusCard} ${styles.active}`}>
                                <h3>✅ Your Session Active</h3>
                                <p><strong>Leader:</strong> {leadershipRole}</p>
                                <p><strong>Started:</strong> {formatDateTime(attendanceSession.startTime, { format: 'medium', includeSeconds: true })} {isRecentTime(attendanceSession.startTime, 15) && <span className={styles.recentBadge}>Recently opened</span>}</p>
                                <p><strong>Total Attendees:</strong> {attendanceRecords.length}</p>
                                <p><strong>Status:</strong> Accepting new attendance</p>
                                <p><strong>Duration:</strong> {formatSessionDuration(attendanceSession.startTime)}</p>
                            </div>
                        ) : globalActiveSession && globalActiveSession.isActive && globalActiveSession.leadershipRole !== leadershipRole ? (
                            <div className={`${styles.statusCard} ${styles.blocked}`}>
                                <h3>🔒 Session Blocked</h3>
                                <p><strong>Active Session Owner:</strong> {globalActiveSession.leadershipRole}</p>
                                <p><strong>Started:</strong> {formatDateTime(globalActiveSession.startTime || '', { format: 'medium', includeSeconds: true })} ({getTimeAgo(globalActiveSession.startTime || '')})</p>
                                <p><strong>Your Access:</strong> BLOCKED - Another admin is managing attendance</p>
                                <p>You must wait for them to close their session or force close it to start yours</p>
                            </div>
                        ) : attendanceSession && !attendanceSession.isActive ? (
                            <div className={`${styles.statusCard} ${styles.inactive}`}>
                                <h3>🔒 Your Previous Session</h3>
                                <p><strong>Started:</strong> {formatDateTime(attendanceSession.startTime, { format: 'medium', includeSeconds: true })}</p>
                                <p><strong>Ended:</strong> {attendanceSession.endTime ? `${formatDateTime(attendanceSession.endTime, { format: 'medium', includeSeconds: true })} (${getTimeAgo(attendanceSession.endTime)})` : 'Unknown'}</p>
                                <p><strong>Session Duration:</strong> {formatSessionDuration(attendanceSession.startTime, attendanceSession.endTime)}</p>
                                <p><strong>Final Attendees:</strong> {attendanceRecords.length}</p>
                            </div>
                        ) : (
                            <div className={`${styles.statusCard} ${styles.inactive}`}>
                                <h3>⚪ Ready to Start</h3>
                                <p><strong>Leader:</strong> {leadershipRole}</p>
                                <p>Click "Open Session" to start collecting attendance</p>
                                <p>You will have exclusive control once started</p>
                            </div>
                        )}
                    </div>

                    <div className={styles.controlButtons}>
                        {/* Show different UI based on session ownership */}
                        {globalActiveSession && globalActiveSession.leadershipRole !== leadershipRole ? (
                            // Another admin has an active session
                            <>
                                <div className={styles.blockedSessionInfo}>
                                    <p><strong>🔒 Session Blocked</strong></p>
                                    <p><strong>{globalActiveSession.leadershipRole}</strong> has an active session</p>
                                    <p>Started: {formatDateTime(globalActiveSession.startTime || '', { format: 'medium', includeSeconds: true })} ({getTimeAgo(globalActiveSession.startTime || '')})</p>
                                </div>
                                
                                <button
                                    onClick={forceCloseSession}
                                    disabled={loading}
                                    className={`${styles.controlButton} ${styles.forceButton}`}
                                    title={`Force close ${globalActiveSession.leadershipRole}'s session`}
                                >
                                    <FontAwesomeIcon icon={faStop} />
                                    Force Close Their Session
                                </button>
                            </>
                        ) : (
                            // No conflict OR this admin owns the session
                            <>
                                <button
                                    onClick={startSession}
                                    disabled={loading || (attendanceSession?.isActive ?? false)}
                                    className={`${styles.controlButton} ${styles.startButton}`}
                                >
                                    <FontAwesomeIcon icon={faPlay} />
                                    Open Session
                                </button>
                                
                                <button
                                    onClick={resetSession}
                                    disabled={loading || !attendanceSession?.isActive}
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
                            </>
                        )}
                    </div>
                </div>

                {/* Attendance Records */}
                <div className={styles.attendanceRecords}>
                    <div className={styles.recordsHeader}>
                        <h2>
                            <FontAwesomeIcon icon={faCalendar} />
                            Attendance Records ({attendanceRecords.length})
                            <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal', marginLeft: '10px' }}>
                                Last updated: {new Date().toLocaleTimeString()}
                            </span>
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
                            {attendanceRecords.map((record, index) => {
                                console.log(`Rendering record ${index + 1}:`, record.userName, record._id);
                                return (
                                    <div key={`${record._id}-${index}`} className={styles.recordCard}>
                                        <div className={styles.recordNumber}>{index + 1}</div>
                                        <div className={styles.recordInfo}>
                                            <p>
                                                <strong>{record.userName}</strong> | 
                                                <strong>Reg:</strong> {record.regNo} | 
                                                <strong>Ministry:</strong> {record.ministry} | 
                                                <strong>Year:</strong> {record.year} | 
                                                <strong>Phone:</strong> {record.phoneNumber || 'Not provided'} | 
                                                <strong>Signed:</strong> {formatDateTime(record.signedAt, { format: 'medium', includeSeconds: true })} ({getTimeAgo(record.signedAt)})
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
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