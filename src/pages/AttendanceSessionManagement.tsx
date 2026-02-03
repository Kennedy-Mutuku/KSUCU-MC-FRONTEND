import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import styles from '../styles/attendanceSession.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getApiUrl, getBaseUrl } from '../config/environment';
import { formatDateTime } from '../utils/timeUtils';
import { downloadAttendancePDF } from '../utils/attendanceReport';
import {
    faUsers,
    faPlay,
    faStop,
    faDownload,
    faArrowLeft,
    faLink,
    faClock,
    faTrash,
    faHistory,
    faRotateRight
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
    const [leadershipRole, setLeadershipRole] = useState<string>('');
    const [activeSessions, setActiveSessions] = useState<AttendanceSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
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
    const [showArchive, setShowArchive] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get('role');
        if (!role) {
            setMessage('No leadership role provided. Please access through admin dashboard.');
            return;
        }

        const decodedRole = decodeURIComponent(role).trim();
        setLeadershipRole(decodedRole);
        loadSessionData();

        const refreshInterval = setInterval(loadSessionData, 5000);
        return () => clearInterval(refreshInterval);
    }, []);

    // Socket.IO for real-time updates
    useEffect(() => {
        if (!selectedSession?._id) return;

        const socket = io(getBaseUrl(), { withCredentials: true });

        socket.on('newAttendance', (data: { record: AttendanceRecord, sessionId: string }) => {
            if (data.sessionId === selectedSession._id) {
                setAttendanceRecords(prev => {
                    if (prev.find(r => r._id === data.record._id)) return prev;
                    return [data.record, ...prev];
                });
                // Also update the count in activeSessions
                setActiveSessions(prev => prev.map(s =>
                    s._id === data.sessionId ? { ...s, attendanceCount: s.attendanceCount + 1 } : s
                ));
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [selectedSession?._id]);

    const loadSessionData = async () => {
        try {
            const timestamp = Date.now();
            const response = await fetch(`${getApiUrl('attendanceSessionStatus')}?t=${timestamp}`, {
                credentials: 'include',
                headers: { 'Cache-Control': 'no-cache' }
            });

            if (response.ok) {
                const data = await response.json();
                const sessions = data.sessions || [];
                setAllSessions(sessions);
                setActiveSessions(sessions.filter((s: AttendanceSession) => s.isActive));

                if (selectedSession) {
                    const updated = sessions.find((s: AttendanceSession) => s._id === selectedSession._id);
                    if (updated) {
                        setSelectedSession(updated);
                        fetchRecords(updated._id);
                    } else if (selectedSession.isActive) {
                        setSelectedSession(null);
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
            const timestamp = Date.now();
            const recordsResponse = await fetch(`${getApiUrl('attendanceRecords')}/${sessionId}?t=${timestamp}&role=${encodeURIComponent(leadershipRole)}`, {
                credentials: 'include'
            });
            if (recordsResponse.ok) {
                const data = await recordsResponse.json();
                // ONLY update records if it's still for the currently selected session
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
                const data = await response.json();
                setMessage('Session opened successfully!');
                setShowStartForm(false);
                setNewSessionData({ title: '', durationMinutes: 60, ministry: 'General' });
                loadSessionData();
                setSelectedSession(data.session);
            } else {
                const err = await response.json();
                setMessage(err.message || 'Error opening session');
            }
        } catch (error) {
            setMessage('Network error starting session');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    const closeSession = async (sessionId: string) => {
        if (!confirm('Are you sure you want to close this session?')) return;
        setLoading(true);
        try {
            const response = await fetch(getApiUrl('attendanceSessionClose'), {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, leadershipRole })
            });
            if (response.ok) {
                setMessage('Session closed successfully!');
                loadSessionData();
                if (selectedSession?._id === sessionId) {
                    setSelectedSession(null);
                    setAttendanceRecords([]);
                }
            }
        } catch (error) {
            setMessage('Error closing session');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    const deleteSession = async (sessionId: string) => {
        if (!confirm('WARNING: This will permanently delete the session and ALL its records. Continue?')) return;
        setLoading(true);
        try {
            const response = await fetch(getApiUrl('attendanceSessionDelete'), {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId })
            });
            if (response.ok) {
                setMessage('Session and records deleted!');
                loadSessionData();
                if (selectedSession?._id === sessionId) {
                    setSelectedSession(null);
                    setAttendanceRecords([]);
                }
            }
        } catch (error) {
            setMessage('Error deleting session');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 5000);
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
        } catch (error) {
            setMessage('Error re-opening session');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    const extendSession = async (sessionId: string) => {
        const mins = prompt('How many minutes to add?', '30');
        if (!mins || isNaN(parseInt(mins))) return;

        try {
            const response = await fetch(getApiUrl('attendanceSessionExtend'), {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, additionalMinutes: parseInt(mins) })
            });
            if (response.ok) {
                setMessage('Session extended!');
                loadSessionData();
            }
        } catch (error) {
            setMessage('Error extending session');
        }
    };

    const copyLink = (shortId: string) => {
        const url = `${window.location.origin}/sign-attendance/${shortId}`;
        navigator.clipboard.writeText(url);
        alert('Shareable link copied to clipboard!');
    };

    const handleDownloadPDF = async () => {
        if (!selectedSession?._id) return;

        setLoading(true);
        setMessage('⚙️ Preparing PDF (fetching high-quality signature data)...');

        try {
            const response = await fetch(`${getApiUrl('attendanceRecords')}/${selectedSession._id}?signatures=true&role=${encodeURIComponent(leadershipRole)}`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                downloadAttendancePDF(data.records || [], leadershipRole, selectedSession as any);
                setMessage('✅ PDF Generated!');
            } else {
                setMessage('❌ Error fetching full signature data');
            }
        } catch (err) {
            setMessage('❌ Network error generating PDF');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <>
            <UniversalHeader />
            <div className={styles.pageWrapper}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <button onClick={() => navigate('/worship-docket-admin')} className={styles.backButton}>
                            <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
                        </button>
                        <h1><FontAwesomeIcon icon={faUsers} /> Attendance Management</h1>
                        <p>Centralized control for all church meeting sessions</p>
                    </div>

                    {message && (
                        <div className={`${styles.message} ${message.includes('error') || message.includes('❌') ? styles.errorMessage : ''}`}>
                            {message}
                        </div>
                    )}

                    <div className={styles.adminActions}>
                        {!showStartForm ? (
                            <button onClick={() => setShowStartForm(true)} className={styles.startButton}>
                                <FontAwesomeIcon icon={faPlay} /> Create New Attendance Session
                            </button>
                        ) : (
                            <div className={styles.startForm}>
                                <h3>Start New Meeting</h3>
                                <div className={styles.formGroup}>
                                    <label>Session Title (e.g., Sunday Service)</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        value={newSessionData.title}
                                        onChange={(e) => setNewSessionData({ ...newSessionData, title: e.target.value })}
                                        placeholder="What meeting is this?"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Duration (Minutes)</label>
                                    <input
                                        type="number"
                                        className={styles.formInput}
                                        value={newSessionData.durationMinutes}
                                        onChange={(e) => setNewSessionData({ ...newSessionData, durationMinutes: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className={styles.formActions}>
                                    <button onClick={startSession} disabled={loading} className={styles.submitButton}>
                                        {loading ? 'Starting...' : 'Start Session Now'}
                                    </button>
                                    <button onClick={() => setShowStartForm(false)} className={styles.cancelButton}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.sessionsOverview}>
                        <div className={styles.sectionHeader}>
                            <h2>Active Sessions</h2>
                            <div className={styles.headerActions}>
                                <span className={styles.badge}>{activeSessions.length}</span>
                                <button
                                    className={`${styles.archiveToggle} ${showArchive ? styles.activeToggle : ''}`}
                                    onClick={() => setShowArchive(!showArchive)}
                                    title="Session Archive"
                                >
                                    <FontAwesomeIcon icon={faHistory} /> {showArchive ? 'Hide Archive' : 'Show Archive'}
                                </button>
                            </div>
                        </div>
                        {activeSessions.length === 0 ? (
                            <div className={styles.emptyText}>
                                <FontAwesomeIcon icon={faClock} style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.3 }} />
                                <p>No sessions currently active.</p>
                            </div>
                        ) : (
                            <div className={styles.sessionList}>
                                {activeSessions.map(session => (
                                    <div
                                        key={session._id}
                                        className={`${styles.sessionPill} ${selectedSession?._id === session._id ? styles.selectedPill : ''}`}
                                        onClick={() => {
                                            setSelectedSession(session);
                                            fetchRecords(session._id);
                                        }}
                                    >
                                        <div className={styles.pillInfo}>
                                            <h4>{session.title}</h4>
                                            <div className={styles.pillMeta}>
                                                <span>{session.attendanceCount} signed in</span>
                                                <span className={styles.timeTag}>
                                                    <FontAwesomeIcon icon={faClock} /> {formatDateTime(session.startTime).split(',')[1]}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.pillActions}>
                                            <button onClick={(e) => { e.stopPropagation(); copyLink(session.shortId); }} title="Copy Link"><FontAwesomeIcon icon={faLink} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); extendSession(session._id); }} title="Extend Time"><FontAwesomeIcon icon={faClock} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); closeSession(session._id); }} className={styles.stopIcon} title="Close Session"><FontAwesomeIcon icon={faStop} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); deleteSession(session._id); }} className={styles.deleteIcon} title="Delete Full Session"><FontAwesomeIcon icon={faTrash} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {showArchive && (
                        <div className={styles.archiveSection}>
                            <div className={styles.sectionHeader}>
                                <h2>Previous Attendances</h2>
                                <span className={styles.badge}>{allSessions.filter(s => !s.isActive).length}</span>
                            </div>
                            <div className={styles.archiveList}>
                                {allSessions.filter(s => !s.isActive).length === 0 ? (
                                    <p className={styles.emptyText}>No historical records found.</p>
                                ) : (
                                    allSessions.filter(s => !s.isActive).map(session => (
                                        <div
                                            key={session._id}
                                            className={`${styles.archivePill} ${selectedSession?._id === session._id ? styles.selectedPill : ''}`}
                                            onClick={() => {
                                                setSelectedSession(session);
                                                fetchRecords(session._id);
                                            }}
                                        >
                                            <div className={styles.pillInfo}>
                                                <h4>{session.title}</h4>
                                                <div className={styles.pillMeta}>
                                                    <span>{formatDateTime(session.startTime).split(',')[0]}</span>
                                                    <span>{session.attendanceCount} members</span>
                                                </div>
                                            </div>
                                            <div className={styles.pillActions}>
                                                <button onClick={(e) => { e.stopPropagation(); reopenSession(session._id); }} title="Re-open Session"><FontAwesomeIcon icon={faRotateRight} /></button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedSession(session);
                                                        handleDownloadPDF();
                                                    }}
                                                    className={styles.downloadIcon}
                                                    title="Quick PDF Export"
                                                >
                                                    <FontAwesomeIcon icon={faDownload} />
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); deleteSession(session._id); }} className={styles.deleteIcon} title="Delete Record"><FontAwesomeIcon icon={faTrash} /></button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {selectedSession && (
                        <div className={styles.recordsSection}>
                            <div className={styles.recordsHeader}>
                                <div>
                                    <h2>{selectedSession.title}</h2>
                                    <p>{attendanceRecords.length} attendees recorded</p>
                                </div>
                                <button onClick={handleDownloadPDF} className={styles.downloadButton} disabled={loading}>
                                    <FontAwesomeIcon icon={faDownload} /> {loading ? 'Processing...' : 'Export PDF'}
                                </button>
                            </div>
                            <div className={styles.tableWrapper}>
                                <table className={styles.recordsTable}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Type</th>
                                            <th>Reg No</th>
                                            <th>Course</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceRecords.map(record => (
                                            <tr key={record._id}>
                                                <td><strong>{record.userName}</strong></td>
                                                <td><span className={styles.typeBadge}>{record.userType || 'student'}</span></td>
                                                <td><span className={styles.regBadge}>{record.regNo}</span></td>
                                                <td><span className={styles.courseTag}>{record.course || 'N/A'}</span></td>
                                                <td className={styles.timeCell}>{record.signedAt ? formatDateTime(record.signedAt).split(',')[1] : 'N/A'}</td>
                                            </tr>
                                        ))}
                                        {attendanceRecords.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className={styles.noRecords}>No one has signed in yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AttendanceSessionManagement;