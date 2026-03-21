import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from '../styles/attendanceSession.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getApiUrl, getBaseUrl } from '../config/environment';
import { formatDateTime } from '../utils/timeUtils';
import { downloadAttendancePDF } from '../utils/attendanceReport';
import {
    faUsers,
    faPlay,
    faEye,
    faDownload,
    faArrowLeft,
    faLink,
    faClock,
    faTrash,
    faHistory,
    faRotateRight,
    faStop,
    faTimes
} from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client';

interface AttendanceRecord {
    _id: string;
    userName: string;
    regNo: string;
    year: number;
    course?: string;
    phoneNumber: string;
    signedAt: string;
    signature: string;
    ministry: string;
    userType?: string;
}

interface AttendanceSession {
    _id: string;
    title: string;
    leadershipRole: string;
    isActive: boolean;
    startTime: string;
    endTime?: string;
    durationMinutes: number;
    shortId: string;
    attendanceCount: number;
}

const AttendanceSessionManagement: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [leadershipRole, setLeadershipRole] = useState<string>('');
    const [activeSessions, setActiveSessions] = useState<AttendanceSession[]>([]);
    const [viewingSession, setViewingSession] = useState<AttendanceSession | null>(null);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showStartForm, setShowStartForm] = useState(false);
    const [newSessionData, setNewSessionData] = useState({
        title: '',
        durationMinutes: 60,
        ministry: 'General'
    });
    const [allSessions, setAllSessions] = useState<AttendanceSession[]>([]);

    const closedSessions = allSessions.filter(s => !s.isActive);

    useEffect(() => {
        const role = searchParams.get('role');
        if (!role) {
            setMessage('No leadership role provided. Please access through admin dashboard.');
            return;
        }

        const decodedRole = decodeURIComponent(role).trim();
        setLeadershipRole(decodedRole);
        loadSessionData();

        const refreshInterval = setInterval(loadSessionData, 5000);
        return () => clearInterval(refreshInterval);
    }, [searchParams]);

    // Socket.IO for real-time updates on viewed session
    useEffect(() => {
        if (!viewingSession?._id) return;

        const socket = io(getBaseUrl(), { withCredentials: true });

        socket.on('newAttendance', (data: { record: AttendanceRecord, sessionId: string }) => {
            if (data.sessionId === viewingSession._id) {
                setAttendanceRecords(prev => {
                    if (prev.find(r => r._id === data.record._id)) return prev;
                    return [data.record, ...prev];
                });
                setActiveSessions(prev => prev.map(s =>
                    s._id === data.sessionId ? { ...s, attendanceCount: s.attendanceCount + 1 } : s
                ));
                setAllSessions(prev => prev.map(s =>
                    s._id === data.sessionId ? { ...s, attendanceCount: s.attendanceCount + 1 } : s
                ));
            }
        });

        return () => { socket.disconnect(); };
    }, [viewingSession?._id]);

    const loadSessionData = async () => {
        try {
            const response = await fetch(`${getApiUrl('attendanceSessionStatus')}?all=true&t=${Date.now()}`, {
                credentials: 'include',
                headers: { 'Cache-Control': 'no-cache' }
            });

            if (response.ok) {
                const data = await response.json();
                const sessions: AttendanceSession[] = data.sessions || [];
                setAllSessions(sessions);
                setActiveSessions(sessions.filter(s => s.isActive));

                // Update viewed session if still exists
                if (viewingSession) {
                    const updated = sessions.find(s => s._id === viewingSession._id);
                    if (updated) {
                        setViewingSession(updated);
                        fetchRecords(updated._id);
                    } else {
                        setViewingSession(null);
                        setAttendanceRecords([]);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading session data:', error);
        }
    };

    const fetchRecords = async (sessionId: string) => {
        if (!sessionId) return;
        try {
            const res = await fetch(`${getApiUrl('attendanceRecords')}/${sessionId}?t=${Date.now()}&role=${encodeURIComponent(leadershipRole)}`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setAttendanceRecords(data.records || []);
            }
        } catch (err) {
            console.error('Error fetching records:', err);
        }
    };

    const startSession = async () => {
        if (!newSessionData.title) return setMessage('Please enter a session title');
        setLoading(true);
        try {
            const response = await fetch(getApiUrl('attendanceSessionOpen'), {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newSessionData.title,
                    durationMinutes: newSessionData.durationMinutes,
                    leadershipRole,
                    ministry: newSessionData.ministry
                })
            });

            if (response.ok) {
                setMessage('Session created!');
                setShowStartForm(false);
                setNewSessionData({ title: '', durationMinutes: 60, ministry: 'General' });
                loadSessionData();
            } else {
                const err = await response.json();
                setMessage(err.message || 'Error opening session');
            }
        } catch {
            setMessage('Network error starting session');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 4000);
        }
    };

    // "Delete" from active = close session + move to history (stops users from seeing it)
    const deactivateSession = async (sessionId: string) => {
        if (!confirm('Remove this session from active? It will stop for users and move to history.')) return;
        setLoading(true);
        try {
            const response = await fetch(getApiUrl('attendanceSessionClose'), {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, leadershipRole })
            });
            if (response.ok) {
                setMessage('Session stopped and moved to history.');
                if (viewingSession?._id === sessionId) {
                    setViewingSession(null);
                    setAttendanceRecords([]);
                }
                loadSessionData();
            } else {
                const err = await response.json();
                setMessage(err.message || 'Error closing session');
            }
        } catch {
            setMessage('Error closing session');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 4000);
        }
    };

    // "Delete" from history = permanent delete
    const permanentlyDelete = async (sessionId: string) => {
        if (!confirm('Permanently delete this session and all its records? This cannot be undone.')) return;
        setLoading(true);
        try {
            const response = await fetch(getApiUrl('attendanceSessionDelete'), {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId })
            });
            if (response.ok) {
                setMessage('Session permanently deleted.');
                if (viewingSession?._id === sessionId) {
                    setViewingSession(null);
                    setAttendanceRecords([]);
                }
                loadSessionData();
            }
        } catch {
            setMessage('Error deleting session');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 4000);
        }
    };

    const reopenSession = async (sessionId: string) => {
        if (!confirm('Re-open this session for signing?')) return;
        setLoading(true);
        try {
            const response = await fetch(getApiUrl('attendanceSessionReopen'), {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId })
            });
            if (response.ok) {
                setMessage('Session re-opened!');
                loadSessionData();
            }
        } catch {
            setMessage('Error re-opening session');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 4000);
        }
    };

    const copyLink = (shortId: string) => {
        const url = `${window.location.origin}/sign-attendance/${shortId}`;
        navigator.clipboard.writeText(url);
        setMessage('Link copied to clipboard!');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleDownloadPDF = async (session: AttendanceSession) => {
        if (!session?._id) return;
        setLoading(true);
        setMessage('Generating PDF...');

        try {
            const response = await fetch(`${getApiUrl('attendanceRecords')}/${session._id}?signatures=true&role=${encodeURIComponent(leadershipRole)}`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                downloadAttendancePDF(data.records || [], leadershipRole, session as any);
                setMessage('PDF downloaded!');
            } else {
                setMessage('Error generating PDF');
            }
        } catch {
            setMessage('Network error generating PDF');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const viewSession = (session: AttendanceSession) => {
        setViewingSession(session);
        fetchRecords(session._id);
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <button onClick={() => navigate('/worship-docket-admin')} className={styles.backButton}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Back
                    </button>
                    <h1><FontAwesomeIcon icon={faUsers} /> Attendance Management</h1>
                </div>

                {message && (
                    <div className={`${styles.message} ${message.toLowerCase().includes('error') ? styles.errorMessage : ''}`}>
                        {message}
                    </div>
                )}

                {/* Create Session */}
                <div className={styles.adminActions}>
                    {!showStartForm ? (
                        <button onClick={() => setShowStartForm(true)} className={styles.startButton}>
                            <FontAwesomeIcon icon={faPlay} /> Create New Attendance Session
                        </button>
                    ) : (
                        <div className={styles.startForm}>
                            <h3>New Session</h3>
                            <div className={styles.formGroup}>
                                <label>Session Title</label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    value={newSessionData.title}
                                    onChange={(e) => setNewSessionData({ ...newSessionData, title: e.target.value })}
                                    placeholder="e.g. Sunday Service, Bible Study"
                                    onKeyDown={(e) => e.key === 'Enter' && startSession()}
                                />
                            </div>
                            <div className={styles.formActions}>
                                <button onClick={startSession} disabled={loading} className={styles.submitButton}>
                                    {loading ? 'Starting...' : 'Start Session'}
                                </button>
                                <button onClick={() => setShowStartForm(false)} className={styles.cancelButton}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Active Sessions */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2><FontAwesomeIcon icon={faPlay} className={styles.sectionIcon} /> Active Sessions</h2>
                        <span className={styles.badge}>{activeSessions.length}</span>
                    </div>

                    {activeSessions.length === 0 ? (
                        <div className={styles.emptyText}>
                            <p>No active sessions. Create one above.</p>
                        </div>
                    ) : (
                        <div className={styles.sessionList}>
                            {activeSessions.map(session => (
                                <div key={session._id} className={`${styles.sessionCard} ${viewingSession?._id === session._id ? styles.selectedCard : ''}`}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardLiveDot} />
                                        <h4>{session.title}</h4>
                                        <span className={styles.countBadge}>{session.attendanceCount} signed</span>
                                    </div>
                                    <div className={styles.cardMeta}>
                                        <span><FontAwesomeIcon icon={faClock} /> {formatDateTime(session.startTime).split(',')[1]?.trim()}</span>
                                    </div>
                                    <div className={styles.cardActions}>
                                        <button className={styles.btnView} onClick={() => viewSession(session)}>
                                            <FontAwesomeIcon icon={faEye} /> View
                                        </button>
                                        <button className={styles.btnLink} onClick={() => copyLink(session.shortId)}>
                                            <FontAwesomeIcon icon={faLink} /> Copy Link
                                        </button>
                                        <button className={styles.btnPdf} onClick={() => handleDownloadPDF(session)}>
                                            <FontAwesomeIcon icon={faDownload} /> PDF
                                        </button>
                                        <button className={styles.btnDelete} onClick={() => deactivateSession(session._id)} title="Stop & move to history">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Session History - always visible */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2><FontAwesomeIcon icon={faHistory} className={styles.sectionIcon} /> Session History</h2>
                        <span className={styles.badge}>{closedSessions.length}</span>
                    </div>

                    {closedSessions.length === 0 ? (
                        <div className={styles.emptyText}><p>No past sessions yet.</p></div>
                    ) : (
                        <div className={styles.sessionList}>
                            {closedSessions.map(session => (
                                <div key={session._id} className={`${styles.historyCard} ${viewingSession?._id === session._id ? styles.selectedCard : ''}`}>
                                    <div className={styles.cardHeader}>
                                        <h4>{session.title}</h4>
                                        <span className={styles.countBadge}>{session.attendanceCount} members</span>
                                    </div>
                                    <div className={styles.cardMeta}>
                                        <span><FontAwesomeIcon icon={faClock} /> {formatDateTime(session.startTime)}</span>
                                    </div>
                                    <div className={styles.cardActions}>
                                        <button className={styles.btnView} onClick={() => viewSession(session)}>
                                            <FontAwesomeIcon icon={faEye} /> View
                                        </button>
                                        <button className={styles.btnPdf} onClick={() => handleDownloadPDF(session)}>
                                            <FontAwesomeIcon icon={faDownload} /> PDF
                                        </button>
                                        <button className={styles.btnReopen} onClick={() => reopenSession(session._id)} title="Re-activate">
                                            <FontAwesomeIcon icon={faRotateRight} />
                                        </button>
                                        <button className={styles.btnDeletePerm} onClick={() => permanentlyDelete(session._id)} title="Delete permanently">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Live View Panel */}
                {viewingSession && (
                    <div className={styles.recordsSection}>
                        <div className={styles.recordsHeader}>
                            <div>
                                <h2>
                                    {viewingSession.isActive && <span className={styles.liveBadge}>LIVE</span>}
                                    {viewingSession.title}
                                </h2>
                                <p>{attendanceRecords.length} attendees</p>
                            </div>
                            <div className={styles.recordsActions}>
                                <button onClick={() => handleDownloadPDF(viewingSession)} className={styles.downloadButton} disabled={loading}>
                                    <FontAwesomeIcon icon={faDownload} /> {loading ? '...' : 'PDF'}
                                </button>
                                <button onClick={() => { setViewingSession(null); setAttendanceRecords([]); }} className={styles.closeViewBtn} title="Close view">
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                        </div>
                        <div className={styles.tableWrapper}>
                            <table className={styles.recordsTable}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Reg No</th>
                                        <th>Type</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceRecords.map((record, idx) => (
                                        <tr key={record._id} className={idx === 0 && viewingSession.isActive ? styles.newRow : ''}>
                                            <td className={styles.numCell}>{idx + 1}</td>
                                            <td><strong>{record.userName}</strong></td>
                                            <td><span className={styles.regBadge}>{record.regNo}</span></td>
                                            <td><span className={styles.typeBadge}>{record.userType || 'student'}</span></td>
                                            <td className={styles.timeCell}>{record.signedAt ? formatDateTime(record.signedAt).split(',')[1]?.trim() : '—'}</td>
                                        </tr>
                                    ))}
                                    {attendanceRecords.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className={styles.noRecords}>
                                                {viewingSession.isActive ? 'Waiting for members to sign in...' : 'No records found.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceSessionManagement;
