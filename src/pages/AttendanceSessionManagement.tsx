import { useState, useEffect } from 'react';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import styles from '../styles/attendanceSession.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getApiUrl } from '../config/environment';
import { formatDateTime, formatSessionDuration } from '../utils/timeUtils';
import { downloadAttendancePDF } from '../utils/attendanceReport';
import {
    faUsers,
    faPlay,
    faStop,
    faDownload,
    faCalendar,
    faArrowLeft,
    faSync
} from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client';
import { getBaseUrl } from '../config/environment';

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
    const [globalActiveSession, setGlobalActiveSession] = useState<{ leadershipRole: string; isActive: boolean; startTime?: string; sessionId?: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get('role');
        if (!role) {
            setMessage('No leadership role provided. Please access through admin dashboard.');
            return;
        }

        const decodedRole = decodeURIComponent(role).trim();
        setLeadershipRole(decodedRole);
        loadSessionData(decodedRole);

        const refreshInterval = setInterval(() => loadSessionData(decodedRole), 5000);
        return () => clearInterval(refreshInterval);
    }, []);

    // Socket.IO for real-time updates
    useEffect(() => {
        if (!attendanceSession?._id) return;

        const socket = io(getBaseUrl(), { withCredentials: true });

        socket.on('newAttendance', (data: { record: AttendanceRecord, sessionId: string }) => {
            if (data.sessionId === attendanceSession._id) {
                setAttendanceRecords(prev => {
                    if (prev.find(r => r._id === data.record._id)) return prev;
                    return [data.record, ...prev];
                });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [attendanceSession?._id]);

    const loadSessionData = async (role: string) => {
        try {
            const timestamp = Date.now();
            const response = await fetch(`${getApiUrl('attendanceSessionStatus')}?t=${timestamp}&role=${encodeURIComponent(role)}`, {
                credentials: 'include',
                headers: { 'Cache-Control': 'no-cache' }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.session) {
                    setGlobalActiveSession({
                        leadershipRole: data.session.leadershipRole,
                        isActive: data.session.isActive,
                        startTime: data.session.startTime,
                        sessionId: data.session._id
                    });

                    if (data.session.isOwnedByRequester) {
                        setAttendanceSession(data.session);
                        fetchRecords(data.session._id, role);
                    } else {
                        setAttendanceSession(null);
                        setAttendanceRecords([]);
                    }
                } else {
                    setAttendanceSession(null);
                    setGlobalActiveSession(null);
                    setAttendanceRecords([]);
                }
            }
        } catch (error) {
            console.error('Error loading session data:', error);
        }
    };

    const fetchRecords = async (sessionId: string, role: string) => {
        try {
            const timestamp = Date.now();
            const recordsResponse = await fetch(`${getApiUrl('attendanceRecords')}/${sessionId}?t=${timestamp}&role=${encodeURIComponent(role)}`, {
                credentials: 'include'
            });
            if (recordsResponse.ok) {
                const data = await recordsResponse.json();
                setAttendanceRecords(data.records || []);
            }
        } catch (err) {
            console.error('Error fetching records:', err);
        }
    };

    const startSession = async () => {
        setLoading(true);
        try {
            const response = await fetch(getApiUrl('attendanceSessionOpen'), {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadershipRole, ministry: 'General' })
            });

            if (response.ok) {
                setMessage('Session opened successfully!');
                setTimeout(() => loadSessionData(leadershipRole), 500);
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

    const closeSession = async () => {
        if (!confirm('Are you sure you want to close the session?')) return;
        setLoading(true);
        try {
            const response = await fetch(getApiUrl('attendanceSessionClose'), {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadershipRole, totalAttendees: attendanceRecords.length })
            });
            if (response.ok) {
                setMessage('Session closed successfully!');
                loadSessionData(leadershipRole);
            }
        } catch (error) {
            setMessage('Error closing session');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

    const handleDownloadPDF = async () => {
        if (!attendanceSession?._id) return;

        setLoading(true);
        setMessage('⚙️ Preparing PDF (fetching high-quality signature data)...');

        try {
            // Fetch records WITH signatures only when needed
            const response = await fetch(`${getApiUrl('attendanceRecords')}/${attendanceSession._id}?signatures=true&role=${encodeURIComponent(leadershipRole)}`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                downloadAttendancePDF(data.records || [], leadershipRole, attendanceSession);
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
            <div className={styles.container}>
                <div className={styles.header}>
                    <button onClick={() => window.location.href = '/dashboard'} className={styles.backButton}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
                    </button>
                    <h1><FontAwesomeIcon icon={faUsers} /> Attendance Management</h1>
                    <p>Managing attendance for <strong>{leadershipRole}</strong></p>
                </div>

                {message && <div className={styles.message}>{message}</div>}

                <div className={styles.sessionControls}>
                    <div className={styles.sessionStatus}>
                        {attendanceSession?.isActive ? (
                            <div className={`${styles.statusCard} ${styles.active}`}>
                                <h3>✅ Session Active</h3>
                                <p><strong>Started:</strong> {formatDateTime(attendanceSession.startTime)}</p>
                                <p><strong>Total Attendees:</strong> {attendanceRecords.length}</p>
                                <p><strong>Duration:</strong> {formatSessionDuration(attendanceSession.startTime)}</p>
                            </div>
                        ) : globalActiveSession?.isActive ? (
                            <div className={`${styles.statusCard} ${styles.blocked}`}>
                                <h3>Access Blocked</h3>
                                <p><strong>Active Owner:</strong> {globalActiveSession.leadershipRole}</p>
                                <p>Please wait for them to finish or coordinate.</p>
                            </div>
                        ) : (
                            <div className={`${styles.statusCard} ${styles.inactive}`}>
                                <h3>⚪ Ready to Start</h3>
                                <p><strong>Leader:</strong> {leadershipRole}</p>
                                <button onClick={startSession} disabled={loading} className={styles.startButton}>
                                    <FontAwesomeIcon icon={faPlay} /> Open Session
                                </button>
                            </div>
                        )}
                    </div>

                    {attendanceSession?.isActive && (
                        <div className={styles.controlButtons}>
                            <button onClick={closeSession} disabled={loading} className={styles.stopButton}>
                                <FontAwesomeIcon icon={faStop} /> Close Session
                            </button>
                            <button onClick={handleDownloadPDF} className={styles.downloadButton}>
                                <FontAwesomeIcon icon={faDownload} /> Download PDF
                            </button>
                        </div>
                    )}
                </div>

                <div className={styles.recordsSection}>
                    <h2><FontAwesomeIcon icon={faCalendar} /> Recent Sign-ins ({attendanceRecords.length})</h2>
                    <table className={styles.recordsTable}>
                        <thead>
                            <tr>
                                <th>Name</th><th>Reg No</th><th>Signed At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceRecords.map(record => (
                                <tr key={record._id}>
                                    <td>{record.userName}</td>
                                    <td>{record.regNo}</td>
                                    <td>{formatDateTime(record.signedAt, { format: 'short' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AttendanceSessionManagement;