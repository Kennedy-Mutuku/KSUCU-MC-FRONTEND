<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import Footer from '../components/footer';
import styles from '../styles/overseerDashboard.module.css';
import oldStyles from '../styles/attendanceSession.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getApiUrl, getBaseUrl } from '../config/environment';
import { formatDateTime, formatSessionDuration } from '../utils/timeUtils';
=======
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/attendanceSession.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getApiUrl, getBaseUrl } from '../config/environment';
import { formatDateTime } from '../utils/timeUtils';
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
import { downloadAttendancePDF } from '../utils/attendanceReport';
import cuLogo from '../assets/cuLogoUAR.png';
import {
    faUsers,
    faPlay,
    faStop,
    faDownload,
    faArrowLeft,
<<<<<<< HEAD
    faClipboardList,
    faUserPlus,
    faEnvelope,

    faBell,
    faChevronRight,
    faHome,
    faBars,
    faTimes
} from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client';
import { useSearchParams, useNavigate } from 'react-router-dom';
import WorshipCoordinatorCommitmentsView from '../components/WorshipCoordinatorCommitmentsView';
import MinistryRegistrationsView from '../components/MinistryRegistrationsView';
import MinistryMessagesView from '../components/MinistryMessagesView';
import axiosInstance from '../config/axios';
=======
    faLink,
    faClock,
    faTrash,
    faHistory,
    faRotateRight
} from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client';
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79

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

type ViewType = 'overview' | 'attendance' | 'commitments' | 'registrations' | 'messages';

const AttendanceSessionManagement: React.FC = () => {
    const navigate = useNavigate();
    const [leadershipRole, setLeadershipRole] = useState<string>('');
    const [activeSessions, setActiveSessions] = useState<AttendanceSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
<<<<<<< HEAD
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const currentView = (searchParams.get('view') as ViewType) || 'overview';
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [stats, setStats] = useState({
        commitments: 0,
        registrations: 0,
        messages: 0
    });
=======
    const [showStartForm, setShowStartForm] = useState(false);
    const [newSessionData, setNewSessionData] = useState({
        title: '',
        durationMinutes: 60,
        ministry: 'General'
    });
    const [allSessions, setAllSessions] = useState<AttendanceSession[]>([]);
    const [showArchive, setShowArchive] = useState(false);
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentView]);

    useEffect(() => {
        const role = searchParams.get('role');
        if (!role) {
            setMessage('No leadership role provided. Please access through admin dashboard.');
            return;
        }

        const decodedRole = decodeURIComponent(role).trim();
        setLeadershipRole(decodedRole);
<<<<<<< HEAD
        loadSessionData(decodedRole);
        fetchStats(decodedRole);
        const refreshInterval = setInterval(() => loadSessionData(decodedRole), 5000);
=======
        loadSessionData();

        const refreshInterval = setInterval(loadSessionData, 5000);
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
        return () => clearInterval(refreshInterval);
    }, [searchParams]);

    // Handle View Switching
    const handleViewChange = (view: ViewType) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('view', view);
        setSearchParams(newParams);
        setIsSidebarOpen(false);
    };

    const fetchStats = async (role: string) => {
        try {
            // Fetch Commitments Count
            const commRes = await fetch(`${getApiUrl('commitmentFormByRole')}/${encodeURIComponent(role)}`, { credentials: 'include' });
            if (commRes.ok) {
                const data = await commRes.json();
                setStats(prev => ({ ...prev, commitments: data.commitments?.filter((c: any) => c.status === 'pending').length || 0 }));
            }

            // Fetch Registrations Count
            const regRes = await axiosInstance.get(`/api/ministry-registration/by-role/${encodeURIComponent(role)}`);
            if (Array.isArray(regRes.data)) {
                setStats(prev => ({ ...prev, registrations: regRes.data.filter((r: any) => r.status === 'pending').length || 0 }));
            }

            // Fetch Messages Count
            const msgRes = await axiosInstance.get(`/messages/overseer/${encodeURIComponent(role)}`);
            if (Array.isArray(msgRes.data?.messages)) {
                setStats(prev => ({ ...prev, messages: msgRes.data.messages.filter((m: any) => m.status === 'new').length || 0 }));
            }
        } catch (err: any) {
            console.error('Error fetching stats:', err);
        }
    };

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

<<<<<<< HEAD
                    // isOwnedByRequester lives at the TOP LEVEL of the response, not inside data.session
                    if (data.isOwnedByRequester) {
                        setAttendanceSession(data.session);
                        fetchRecords(data.session._id, role);
                    } else {
                        setAttendanceSession(null);
=======
                if (selectedSession) {
                    const updated = sessions.find((s: AttendanceSession) => s._id === selectedSession._id);
                    if (updated) {
                        setSelectedSession(updated);
                        fetchRecords(updated._id);
                    } else if (selectedSession.isActive) {
                        setSelectedSession(null);
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
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
            // Map leadership role to ministry enum if possible
            const ministryMapping: Record<string, string> = {
                'Choir': 'Choir',
                'Praise and Worship': 'Praise and Worship',
                'Wananzambe': 'Wananzambe',
                'Ushering': 'Ushering',
                'Creativity': 'Creativity',
                'Compassion': 'Compassion',
                'Intercessory': 'Intercessory',
                'High School': 'High School',
                'Church School': 'Church School'
            };

            let ministry = 'General';
            for (const key in ministryMapping) {
                if (leadershipRole.includes(key)) {
                    ministry = ministryMapping[key];
                    break;
                }
            }

            const response = await fetch(getApiUrl('attendanceSessionOpen'), {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
<<<<<<< HEAD
                    leadershipRole,
                    ministry,
                    title: `${leadershipRole} Session - ${new Date().toLocaleDateString()}`,
                    durationMinutes: 60
=======
                    title: newSessionData.title,
                    durationMinutes: newSessionData.durationMinutes,
                    leadershipRole,
                    ministry: newSessionData.ministry
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
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

<<<<<<< HEAD
    const closeSession = async () => {
        if (!attendanceSession?._id) {
            setMessage('No active session to close.');
            return;
        }
        if (!confirm('Are you sure you want to close the session?')) return;
=======
    const closeSession = async (sessionId: string) => {
        if (!confirm('Are you sure you want to close this session?')) return;
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
        setLoading(true);
        try {
            const response = await fetch(getApiUrl('attendanceSessionClose'), {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
<<<<<<< HEAD
                body: JSON.stringify({ sessionId: attendanceSession._id, leadershipRole, totalAttendees: attendanceRecords.length })
=======
                body: JSON.stringify({ sessionId, leadershipRole })
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
            });
            if (response.ok) {
                // Immediately clear state so UI reflects closed status right away
                setAttendanceSession(null);
                setGlobalActiveSession(null);
                setAttendanceRecords([]);
                setMessage('Session closed successfully!');
<<<<<<< HEAD
                // Then re-poll after 1s to confirm from the server
                setTimeout(() => loadSessionData(leadershipRole), 1000);
            } else {
                const err = await response.json();
                setMessage(err.message || 'Error closing session');
=======
                loadSessionData();
                if (selectedSession?._id === sessionId) {
                    setSelectedSession(null);
                    setAttendanceRecords([]);
                }
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
            }
        } catch (error) {
            setMessage('Error closing session');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 5000);
        }
    };

<<<<<<< HEAD

=======
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
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79

    const handleDownloadPDF = async () => {
        if (!selectedSession?._id) return;

        setLoading(true);
        setMessage('⚙️ Preparing PDF (fetching high-quality signature data)...');

        try {
<<<<<<< HEAD
            const response = await fetch(`${getApiUrl('attendanceRecords')}/${attendanceSession._id}?signatures=true&role=${encodeURIComponent(leadershipRole)}`, {
=======
            const response = await fetch(`${getApiUrl('attendanceRecords')}/${selectedSession._id}?signatures=true&role=${encodeURIComponent(leadershipRole)}`, {
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
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

<<<<<<< HEAD
    const navItems = [
        { id: 'overview', label: 'Home', icon: faHome },
        { id: 'attendance', label: 'Attendance', icon: faUsers },
        { id: 'commitments', label: 'Forms', icon: faClipboardList },
        { id: 'registrations', label: 'Joins', icon: faUserPlus },
        { id: 'messages', label: 'Messages', icon: faEnvelope },
    ];

    const Breadcrumbs = () => {
        const viewLabel = navItems.find(item => item.id === currentView)?.label || 'Overview';

        return (
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 mb-0">
                <button onClick={() => handleViewChange('overview')} className="hover:text-primary transition-colors flex items-center gap-1">
                    <FontAwesomeIcon icon={faHome} className="text-[10px]" />
                    <span>Dashboard</span>
                </button>
                {currentView !== 'overview' && (
                    <>
                        <FontAwesomeIcon icon={faChevronRight} className="text-[8px] opacity-50" />
                        <span className="text-gray-800 font-semibold">{viewLabel}</span>
                    </>
                )}
            </div>
        );
    };

    const getOverviewContent = () => (
        <div className={styles.content}>
            <div className={styles.statsGrid}>
                <div className={styles.statCard} onClick={() => handleViewChange('attendance')}>
                    <div className={`${styles.statIcon} bg-blue-100 text-blue-600`}>
                        <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <div className={styles.statInfo}>
                        <h4>Today's Attendance</h4>
                        <p className={styles.value}>{attendanceRecords.length}</p>
                    </div>
                </div>
                <div className={styles.statCard} onClick={() => handleViewChange('commitments')}>
                    <div className={`${styles.statIcon} bg-purple-100 text-purple-600`}>
                        <FontAwesomeIcon icon={faClipboardList} />
                    </div>
                    <div className={styles.statInfo}>
                        <h4>Pending Forms</h4>
                        <p className={styles.value}>{stats.commitments}</p>
                    </div>
                </div>
                <div className={styles.statCard} onClick={() => handleViewChange('registrations')}>
                    <div className={`${styles.statIcon} bg-green-100 text-green-600`}>
                        <FontAwesomeIcon icon={faUserPlus} />
                    </div>
                    <div className={styles.statInfo}>
                        <h4>Join Requests</h4>
                        <p className={styles.value}>{stats.registrations}</p>
                    </div>
                </div>
                <div className={styles.statCard} onClick={() => handleViewChange('messages')}>
                    <div className={`${styles.statIcon} bg-red-100 text-red-600`}>
                        <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <div className={styles.statInfo}>
                        <h4>Unread Messages</h4>
                        <p className={styles.value}>{stats.messages}</p>
                    </div>
                </div>
            </div>

            <div className={styles.sectionContainer}>
                <div className={styles.sectionHeader}>
                    <h3>Quick Actions</h3>
                </div>
                <div className="flex gap-4">
                    {!attendanceSession?.isActive ? (
                        <button onClick={startSession} className={styles.btnPrimary}>
                            <FontAwesomeIcon icon={faPlay} /> Open New Session
                        </button>
                    ) : (
                        <button onClick={closeSession} className={styles.btnPrimary} style={{ backgroundColor: 'var(--danger)' }}>
                            <FontAwesomeIcon icon={faStop} /> Close Current Session
                        </button>
                    )}
                    <button onClick={handleDownloadPDF} disabled={!attendanceSession} className={styles.btnSecondary}>
                        <FontAwesomeIcon icon={faDownload} /> Export Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h3>Recent Activity</h3>
                        <button className="text-sm font-semibold text-primary" onClick={() => handleViewChange('attendance')}>View All</button>
                    </div>
                    <div className={styles.tableWrapper}>
                        <table className={styles.modernTable}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Reg No</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceRecords.slice(0, 5).map(record => (
                                    <tr key={record._id}>
                                        <td className="font-semibold">{record.userName}</td>
                                        <td className="text-muted">{record.regNo}</td>
                                        <td className="text-muted">{formatDateTime(record.signedAt, { format: 'short' })}</td>
                                    </tr>
                                ))}
                                {attendanceRecords.length === 0 && (
                                    <tr><td colSpan={3} className="text-center py-8 text-muted">No recent sign-ins</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h3>Session Summary</h3>
=======
    return (
        <>
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
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
                    </div>
                    {attendanceSession?.isActive ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-100">
                                <span className="text-green-700 font-semibold">Status</span>
                                <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold uppercase">Active</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Started At</span>
                                <span className="font-semibold">{formatDateTime(attendanceSession.startTime)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Duration</span>
                                <span className="font-semibold">{formatSessionDuration(attendanceSession.startTime)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Total Attendees</span>
                                <span className="text-xl font-bold">{attendanceRecords.length}</span>
                            </div>

<<<<<<< HEAD
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 mt-4">
                                <h4 className="text-purple-900 font-bold mb-2">Share With Members</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-purple-700">Short ID:</span>
                                        <span className="font-mono bg-white px-2 py-0.5 rounded border">
                                            {attendanceSession._id ? attendanceSession._id.slice(-6).toUpperCase() : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="text-xs text-purple-600 bg-white p-2 rounded border break-all">
                                        {`${window.location.origin}/Home#attendance`}
                                    </div>
                                    <p className="text-[10px] text-purple-500 italic">Tell members to go to the Attendance Center on the home page.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted">
                            <p>No active session at the moment.</p>
                            <button onClick={startSession} className="mt-4 text-primary font-bold hover:underline">Start Session Now</button>
=======
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
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
                        </div>
                    )}
                </div>
            </div>
<<<<<<< HEAD
        </div>
    );

    const renderView = () => {
        switch (currentView) {
            case 'overview': return getOverviewContent();
            case 'attendance': return (
                <div className={styles.content}>
                    <div className={styles.sectionContainer}>
                        <div className={styles.sectionHeader}>
                            <h3>Attendance Management</h3>
                        </div>
                        {/* Attendance Content (Old logic preserved) */}
                        <div className={oldStyles.sessionControls}>
                            <div className={oldStyles.sessionStatus}>
                                {attendanceSession?.isActive ? (
                                    <div className={`${oldStyles.statusCard} ${oldStyles.active}`}>
                                        <h3>✅ Session Active</h3>
                                        <p><strong>Started:</strong> {formatDateTime(attendanceSession.startTime)}</p>
                                        <p><strong>Total Attendees:</strong> {attendanceRecords.length}</p>
                                        <p><strong>Duration:</strong> {formatSessionDuration(attendanceSession.startTime)}</p>
                                    </div>
                                ) : globalActiveSession?.isActive ? (
                                    <div className={`${oldStyles.statusCard} ${oldStyles.blocked}`}>
                                        <h3>Access Blocked</h3>
                                        <p><strong>Active Owner:</strong> {globalActiveSession.leadershipRole}</p>
                                        <p>Please wait for them to finish or coordinate.</p>
                                    </div>
                                ) : (
                                    <div className={`${oldStyles.statusCard} ${oldStyles.inactive}`}>
                                        <h3>⚪ Ready to Start</h3>
                                        <p><strong>Leader:</strong> {leadershipRole}</p>
                                        <button onClick={startSession} disabled={loading} className={oldStyles.startButton}>
                                            <FontAwesomeIcon icon={faPlay} /> Open Session
                                        </button>
                                    </div>
                                )}
                            </div>

                            {attendanceSession?.isActive && (
                                <div className={oldStyles.controlButtons}>
                                    <button onClick={closeSession} disabled={loading} className={oldStyles.stopButton}>
                                        <FontAwesomeIcon icon={faStop} /> Close Session
                                    </button>
                                    <button onClick={handleDownloadPDF} className={oldStyles.downloadButton}>
                                        <FontAwesomeIcon icon={faDownload} /> Download PDF
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className={oldStyles.recordsSection}>
                            <h2><FontAwesomeIcon icon={faCalendar} /> Recent Sign-ins ({attendanceRecords.length})</h2>
                            <table className={oldStyles.recordsTable}>
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
                </div>
            );
            case 'commitments': return <div className={styles.content}><WorshipCoordinatorCommitmentsView role={leadershipRole} /></div>;
            case 'registrations': return <div className={styles.content}><MinistryRegistrationsView role={leadershipRole} /></div>;
            case 'messages': return <div className={styles.content}><MinistryMessagesView role={leadershipRole} /></div>;
            default: return getOverviewContent();
        }
    };

    if (!leadershipRole) return <div className={oldStyles.container}>{message}</div>;

    return (
        <div className={styles.dashboardLayout}>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarLogo}>
                    <div className="flex items-center gap-3">
                        <img src={cuLogo} alt="KSUCU Logo" />
                        <h2>OVERSEER</h2>
                    </div>
                    <button
                        className={styles.sidebarClose}
                        onClick={() => setIsSidebarOpen(false)}
                        aria-label="Close sidebar"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <nav className={styles.sidebarNav}>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleViewChange(item.id as ViewType)}
                            className={`${styles.navItem} ${currentView === item.id ? styles.navItemActive : ''}`}
                        >
                            <FontAwesomeIcon icon={item.icon} className={styles.navIcon} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="p-4 mt-auto">
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className={styles.exitItem}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <span>Exit Portal</span>
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main className={styles.mainContainer}>
                <header className={styles.topHeader}>
                    <div className={styles.headerLeft}>
                        <button
                            className={styles.menuToggle}
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
                        </button>
                        <button onClick={() => navigate(-1)} className={styles.backBtn}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                            <span>Back</span>
                        </button>
                        <div className="flex flex-col ml-2">
                            <Breadcrumbs />
                            <span className={styles.ministryName}>{leadershipRole}<span className="hidden md:inline"> Portal</span></span>
                        </div>
                    </div>

                    <div className={styles.headerRight}>
                        <button className="text-gray-400 hover:text-primary transition-colors">
                            <FontAwesomeIcon icon={faBell} />
                        </button>
                        <div className={styles.profileInfo}>
                            <div className={styles.avatar}>
                                {leadershipRole.charAt(0)}
                            </div>
                            <div className="hidden md:block">
                                <p className="text-xs font-bold m-0">{leadershipRole}</p>
                                <p className="text-[10px] text-gray-500 m-0">Overseer</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Status Messages */}
                {message && (
                    <div style={{
                        padding: '0.75rem 1.5rem',
                        margin: '0 2rem 1rem',
                        borderRadius: '8px',
                        background: message.includes('✅') || message.includes('success') ? '#e8f5e8' : message.includes('⚙️') ? '#fff3cd' : '#fce4ec',
                        color: message.includes('✅') || message.includes('success') ? '#2d5a2d' : message.includes('⚙️') ? '#856404' : '#c62828',
                        borderLeft: `4px solid ${message.includes('✅') || message.includes('success') ? '#4caf50' : message.includes('⚙️') ? '#ffc107' : '#ef5350'}`,
                        fontSize: '0.9rem',
                        fontWeight: 500
                    }}>
                        {message}
                    </div>
                )}

                {/* Dynamic View */}
                {renderView()}

                <Footer />
            </main>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className={styles.sidebarOverlay}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
=======
        </>
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
    );
};

export default AttendanceSessionManagement;