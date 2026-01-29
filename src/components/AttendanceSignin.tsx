import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/attendanceSignin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faExclamationTriangle,
    faClock,
    faUsers,
    faSearch,
    faUserCheck,
    faTimes,
    faSignature
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { getApiUrl } from '../config/environment';
import { formatDateTime, getTimeAgo, isRecentTime } from '../utils/timeUtils';

interface AttendanceSession {
    _id: string;
    ministry: string;
    isActive: boolean;
    startTime: string;
    endTime?: string;
    leadershipRole?: string;
}

interface UserSearchResult {
    _id: string;
    username: string;
    reg: string;
    course: string;
    yos: string;
    phone: string;
}

interface AttendanceSigninProps {
    ministry: string;
}

const AttendanceSignin: React.FC<AttendanceSigninProps> = ({ ministry }) => {
    const [session, setSession] = useState<AttendanceSession | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [sessionClosedAgo, setSessionClosedAgo] = useState('');
    const [attendanceFormData, setAttendanceFormData] = useState({ name: '', regNo: '', course: '', year: '', phoneNumber: '', signature: '', userType: 'student' });
    const [deviceAttendance, setDeviceAttendance] = useState<any[]>([]);

    // Quick Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
    const searchTimeoutRef = useRef<any>(null);

    useEffect(() => {
        checkActiveSession();

        // Check for session updates every 10 seconds for cross-device sync
        const interval = setInterval(() => {
            checkActiveSession();
        }, 10000);

        return () => {
            clearInterval(interval);
        };
    }, [ministry]);


    useEffect(() => {
        if (session && session.endTime) {
            updateClosedTime();
            const timeInterval = setInterval(updateClosedTime, 60000); // Update every minute
            return () => clearInterval(timeInterval);
        }
    }, [session]);

    const updateClosedTime = () => {
        if (session?.endTime) {
            const timeAgo = getTimeAgo(session.endTime);
            const exactTime = formatDateTime(session.endTime, { format: 'medium', includeSeconds: true });
            setSessionClosedAgo(`${timeAgo} (${exactTime})`);
        }
    };


    const checkActiveSession = async () => {
        try {
            console.log('🔍 Checking for active attendance session...');

            // Add cache-busting parameters for real-time sync
            const timestamp = Date.now();
            const sessionResponse = await axios.get(
                `${getApiUrl('attendanceSessionStatus')}?t=${timestamp}&refresh=${Math.random()}`,
                {
                    withCredentials: true,
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                }
            );

            if (sessionResponse.data.session) {
                const sessionData = sessionResponse.data.session;
                console.log('✅ Active session found:', {
                    id: sessionData._id,
                    ministry: sessionData.ministry,
                    leader: sessionData.leadershipRole,
                    isActive: sessionData.isActive
                });

                // Set session regardless of ministry - global attendance
                setSession(sessionData);

                // Load current signed attendees for this device
                try {
                    const recordsResponse = await axios.get(
                        `${getApiUrl('attendanceRecords')}/${sessionData._id}?t=${timestamp}`,
                        {
                            withCredentials: true,
                            headers: {
                                'Cache-Control': 'no-cache, no-store, must-revalidate',
                                'Pragma': 'no-cache',
                                'Expires': '0'
                            }
                        }
                    );
                    const sessionAttendance = recordsResponse.data.records || [];
                    console.log(`📊 Loaded ${sessionAttendance.length} attendance records from session`);
                    setDeviceAttendance(sessionAttendance);
                } catch (recordsError) {
                    console.log('⚠️ No attendance records found or error loading records');
                    setDeviceAttendance([]);
                }
            } else {
                console.log('No active session found');
                setSession(null);
                setDeviceAttendance([]);
            }
        } catch (error: any) {
            console.error('Error checking session:', error.message);
            setSession(null);
            setDeviceAttendance([]);
            if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
                setError('⚠️ Cannot connect to attendance server. Please check your internet connection.');
            } else {
                setError('⚠️ Error connecting to attendance system. Please try again.');
            }
            setTimeout(() => setError(''), 5000);
        }
    };

    // Handle Search Logic
    const handleSearch = (value: string) => {
        setSearchQuery(value);
        if (value.length < 3) {
            setSearchResults([]);
            return;
        }

        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        searchTimeoutRef.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const response = await axios.get(`${getApiUrl('usersSearch')}?query=${encodeURIComponent(value)}`, {
                    withCredentials: true
                });
                setSearchResults(response.data);
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setIsSearching(false);
            }
        }, 500);
    };

    const handleSelectUser = (user: UserSearchResult) => {
        setSelectedUser(user);
        setAttendanceFormData({
            name: user.username,
            regNo: user.reg,
            course: user.course,
            year: user.yos,
            phoneNumber: user.phone,
            signature: '',
            userType: 'student'
        });
        setSearchQuery('');
        setSearchResults([]);
    };

    const resetSelection = () => {
        setSelectedUser(null);
        setAttendanceFormData({
            name: '',
            regNo: '',
            course: '',
            year: '',
            phoneNumber: '',
            signature: '',
            userType: 'student'
        });
    };

    const signAttendance = async () => {
        // Validate form data based on user type
        if (!attendanceFormData.name || !attendanceFormData.phoneNumber || !attendanceFormData.signature) {
            setError('Please fill in name, phone number, and signature');
            setTimeout(() => setError(''), 3000);
            return;
        }

        // Student-specific validation
        if (attendanceFormData.userType === 'student') {
            if (!attendanceFormData.regNo || !attendanceFormData.course || !attendanceFormData.year) {
                setError('Students must fill in registration number, course, and year');
                setTimeout(() => setError(''), 3000);
                return;
            }
        }

        // Validate phone number (minimum 10 digits)
        const phoneDigits = attendanceFormData.phoneNumber.replace(/\D/g, ''); // Remove all non-digits
        if (phoneDigits.length < 10) {
            setError('Phone number must have at least 10 digits');
            setTimeout(() => setError(''), 3000);
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // CRITICAL: Always get the latest active session before signing
            console.log('🔄 Refreshing session status before signing...');
            const timestamp = Date.now();
            const sessionResponse = await axios.get(
                `${getApiUrl('attendanceSessionStatus')}?t=${timestamp}&refresh=${Math.random()}`,
                {
                    withCredentials: true,
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                }
            );

            const latestSession = sessionResponse.data.session;

            if (!latestSession) {
                setError('No active session found. Please wait for admin to open a session.');
                setLoading(false);
                return;
            }

            if (!latestSession.isActive) {
                setError('Session has been closed. Please wait for admin to open a new session.');
                setSession(null);
                setLoading(false);
                return;
            }

            console.log('✅ Using latest active session:', latestSession._id);
            setSession(latestSession); // Update state with latest session

            // Validate registration number format for students only
            if (attendanceFormData.userType === 'student') {
                const regNoPattern = /^[A-Z0-9\/\-]+$/i;
                if (!regNoPattern.test(attendanceFormData.regNo.trim())) {
                    setError('Invalid registration number format');
                    setTimeout(() => setError(''), 3000);
                    setLoading(false);
                    return;
                }
            }

            // Generate unique visitor ID if user is a visitor
            const generateVisitorId = () => {
                const timestamp = Date.now().toString(36); // Convert timestamp to base36
                const random = Math.random().toString(36).substr(2, 5); // 5 random chars
                return `VISITOR-${timestamp}-${random}`.toUpperCase();
            };

            // Sign attendance via backend API (anonymous) using the LATEST session
            const attendanceData = {
                name: attendanceFormData.name.trim(),
                regNo: attendanceFormData.userType === 'student' ? attendanceFormData.regNo.trim().toUpperCase() : generateVisitorId(),
                course: attendanceFormData.userType === 'student' ? attendanceFormData.course.trim() : 'N/A',
                year: attendanceFormData.userType === 'student' ? parseInt(attendanceFormData.year) : 0,
                phoneNumber: attendanceFormData.phoneNumber.trim(),
                signature: attendanceFormData.signature.trim(),
                userType: attendanceFormData.userType,
                ministry: latestSession.ministry || 'General', // Use session ministry or default
                sessionId: latestSession._id  // Use latest session, not cached one!
            };

            const response = await axios.post(
                getApiUrl('attendanceSignAnonymous'),
                attendanceData,
                { withCredentials: true }
            );

            console.log('✅ Attendance signed successfully:', response.data);

            // Update local state with the new record
            const newRecord = response.data.record;
            console.log('✅ New attendance record created:', newRecord);

            // Store the name for success message before clearing form
            const signedName = attendanceFormData.name.trim();
            const signedRegNo = attendanceFormData.regNo.trim().toUpperCase();

            // Add to local device attendance list
            setDeviceAttendance(prev => {
                const updated = [...prev, newRecord];
                console.log(`Device attendance updated: ${updated.length} total records`);
                return updated;
            });

            // Clear form after successful submission for next person
            setAttendanceFormData({ name: '', regNo: '', course: '', year: '', phoneNumber: '', signature: '', userType: 'student' });
            setSelectedUser(null);

            // Clear canvas signature
            const canvas = document.querySelector('canvas') as HTMLCanvasElement;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }

            // Show success message with accurate timestamp
            const now = new Date();
            const timeString = formatDateTime(now, { format: 'short', includeSeconds: true, includeDate: false });
            setSuccess(`✅ ${signedName} (${signedRegNo}) successfully signed attendance at ${timeString}! Ready for next person.`);

            // Clear success message after 4 seconds
            setTimeout(() => {
                setSuccess('');
            }, 4000);

        } catch (error: any) {
            console.error('Error during attendance signing:', error);

            let errorMessage = 'Error signing attendance. Please try again.';

            if (error.response) {
                if (error.response.status === 400) {
                    errorMessage = error.response.data?.message ||
                        error.response.data?.error ||
                        error.response.data ||
                        'Invalid attendance data';

                    const regNoUpper = attendanceFormData.regNo.trim().toUpperCase();

                    const isDuplicateError = (
                        (errorMessage.toLowerCase().includes('already signed attendance') && errorMessage.includes(regNoUpper)) ||
                        (errorMessage.toLowerCase().includes('already been used for attendance') && errorMessage.includes(regNoUpper)) ||
                        (errorMessage.toLowerCase().includes('has already signed') && errorMessage.includes(regNoUpper)) ||
                        (errorMessage.toLowerCase().includes('duplicate') && errorMessage.includes(regNoUpper))
                    );

                    if (isDuplicateError) {
                        const cleanMessage = `❌ Registration Number ${regNoUpper} Already Used! This registration number has already been used for attendance in this session. Please use a different registration number.`;
                        setError(cleanMessage);
                        setTimeout(() => setError(''), 8000);
                        setAttendanceFormData(prev => ({ ...prev, regNo: '' }));
                        setLoading(false);
                        return;
                    }
                }
                setError(`❌ ${errorMessage}`);
                setTimeout(() => setError(''), 6000);
            } else {
                setError(`❌ ${error.message || 'Unexpected error'}`);
                setTimeout(() => setError(''), 6000);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return (
            <div className={styles.attendanceContainer}>
                <div className={styles.attendanceCard}>
                    <div className={styles.header}>
                        <FontAwesomeIcon icon={faClock} className={styles.clockIcon} />
                        <h3 className={styles.title}>No Active Attendance Session</h3>
                    </div>
                    <div className={styles.closedMessage}>
                        <p>There is currently no attendance session for {ministry} ministry.</p>
                        <p className={styles.closedNote}>Please wait for an admin to open the attendance session.</p>
                    </div>
                </div>
            </div>
        );
    }

    const isSessionClosed = !session.isActive && session.endTime;

    return (
        <div className={`${styles.attendanceContainer} ${isSessionClosed ? styles.closedSession : ''}`}>
            <div className={styles.attendanceCard}>
                <div className={styles.header}>
                    <FontAwesomeIcon
                        icon={isSessionClosed ? faClock : faCheckCircle}
                        className={`${styles.icon} ${isSessionClosed ? styles.clockIcon : styles.checkIcon}`}
                    />
                    <h3 className={styles.title}>
                        {isSessionClosed
                            ? 'Attendance Session Closed'
                            : `${session.ministry || 'General'} Ministry Attendance`}
                    </h3>
                    {!isSessionClosed && (
                        <p className={styles.sessionInfo}>
                            <strong>Leader:</strong> {session.leadershipRole || 'Loading...'} • {formatDateTime(session.startTime, { format: 'medium', includeSeconds: true })}
                            {isRecentTime(session.startTime, 10) && <span className={styles.recentIndicator}> • Just opened</span>}
                        </p>
                    )}
                </div>

                {isSessionClosed ? (
                    <div className={styles.closedMessage}>
                        <p>The attendance session was closed {sessionClosedAgo}</p>
                        <p className={styles.closedNote}>You can no longer sign attendance for this session.</p>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className={styles.error}>
                                <FontAwesomeIcon icon={faExclamationTriangle} />
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className={styles.success}>
                                <FontAwesomeIcon icon={faCheckCircle} />
                                <span>{success}</span>
                            </div>
                        )}

                        {/* Quick Search Section */}
                        {!selectedUser && (
                            <div className={styles.searchSection}>
                                <div className={styles.searchInputWrapper}>
                                    <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                                    <input
                                        type="text"
                                        placeholder="🔍 Search by Name or Reg No (e.g., IN16...)"
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className={styles.searchInput}
                                        disabled={loading}
                                    />
                                    {isSearching && <div className={styles.searchLoader}></div>}
                                </div>
                                {searchResults.length > 0 && (
                                    <div className={styles.searchResults}>
                                        {searchResults.map(user => (
                                            <div
                                                key={user._id}
                                                className={styles.searchResultItem}
                                                onClick={() => handleSelectUser(user)}
                                            >
                                                <span className={styles.resultName}>{user.username}</span>
                                                <span className={styles.resultReg}>{user.reg} • {user.course}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Selected User Quick Sign Card */}
                        {selectedUser && (
                            <div className={styles.userFoundCard}>
                                <div className={styles.userInfo}>
                                    <h4><FontAwesomeIcon icon={faUserCheck} /> {selectedUser.username}</h4>
                                    <p>{selectedUser.reg} • Year {selectedUser.yos}</p>
                                </div>
                                <button className={styles.resetButton} onClick={resetSelection} title="Change person">
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                        )}

                        {/* Attendance Form */}
                        <div className={styles.attendanceForm}>
                            {!selectedUser ? (
                                <>
                                    <h4 className={styles.formTitle}>...or Enter Details Manually</h4>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Full Name *</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={attendanceFormData.name}
                                            onChange={(e) => setAttendanceFormData({ ...attendanceFormData, name: e.target.value })}
                                            className={styles.formInput}
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>I am a *</label>
                                        <select
                                            value={attendanceFormData.userType || 'student'}
                                            onChange={(e) => setAttendanceFormData({ ...attendanceFormData, userType: e.target.value })}
                                            className={styles.formSelect}
                                            disabled={loading}
                                        >
                                            <option value="student">Student</option>
                                            <option value="visitor">Visitor</option>
                                        </select>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Registration Number *</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Reg No (e.g., IN16/0000/21)"
                                            value={attendanceFormData.regNo}
                                            onChange={(e) => setAttendanceFormData({ ...attendanceFormData, regNo: e.target.value.toUpperCase() })}
                                            className={styles.formInput}
                                            disabled={loading || attendanceFormData.userType === 'visitor'}
                                        />
                                    </div>

                                    {attendanceFormData.userType === 'student' && (
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Course *</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Computer Science"
                                                value={attendanceFormData.course}
                                                onChange={(e) => setAttendanceFormData({ ...attendanceFormData, course: e.target.value })}
                                                className={styles.formInput}
                                                disabled={loading}
                                            />
                                        </div>
                                    )}

                                    {attendanceFormData.userType === 'student' && (
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Year of Study *</label>
                                            <select
                                                value={attendanceFormData.year}
                                                onChange={(e) => setAttendanceFormData({ ...attendanceFormData, year: e.target.value })}
                                                className={styles.formSelect}
                                                disabled={loading}
                                            >
                                                <option value="">Select Year</option>
                                                <option value="1">Year 1</option>
                                                <option value="2">Year 2</option>
                                                <option value="3">Year 3</option>
                                                <option value="4">Year 4</option>
                                                <option value="5">Year 5</option>
                                                <option value="6">Year 6</option>
                                            </select>
                                        </div>
                                    )}

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Phone Number *</label>
                                        <input
                                            type="tel"
                                            placeholder="e.g., 0712345678"
                                            value={attendanceFormData.phoneNumber}
                                            onChange={(e) => setAttendanceFormData({ ...attendanceFormData, phoneNumber: e.target.value })}
                                            className={styles.formInput}
                                            disabled={loading}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', marginBottom: '15px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#4CAF50' }}><FontAwesomeIcon icon={faCheckCircle} /> Details Verified! Just sign below to finish.</p>
                                </div>
                            )}

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}><FontAwesomeIcon icon={faSignature} /> Digital Signature *</label>
                                <div style={{
                                    border: '2px solid rgba(0, 198, 255, 0.3)',
                                    borderRadius: '12px',
                                    padding: '8px',
                                    background: 'rgba(255, 255, 255, 0.05)'
                                }}>
                                    <canvas
                                        ref={(canvas) => {
                                            if (canvas && !canvas.hasAttribute('data-initialized')) {
                                                canvas.setAttribute('data-initialized', 'true');
                                                const ctx = canvas.getContext('2d');
                                                let isDrawing = false;
                                                let lastX = 0;
                                                let lastY = 0;

                                                const startDrawing = (e: MouseEvent | TouchEvent) => {
                                                    isDrawing = true;
                                                    const rect = canvas.getBoundingClientRect();
                                                    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
                                                    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
                                                    lastX = clientX - rect.left;
                                                    lastY = clientY - rect.top;
                                                };

                                                const draw = (e: MouseEvent | TouchEvent) => {
                                                    if (!isDrawing || !ctx) return;
                                                    e.preventDefault();
                                                    const rect = canvas.getBoundingClientRect();
                                                    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
                                                    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
                                                    const currentX = clientX - rect.left;
                                                    const currentY = clientY - rect.top;

                                                    ctx.lineWidth = 2.5;
                                                    ctx.lineCap = 'round';
                                                    ctx.strokeStyle = '#00c6ff';
                                                    ctx.shadowBlur = 1;
                                                    ctx.shadowColor = '#00c6ff';
                                                    ctx.beginPath();
                                                    ctx.moveTo(lastX, lastY);
                                                    ctx.lineTo(currentX, currentY);
                                                    ctx.stroke();

                                                    lastX = currentX;
                                                    lastY = currentY;

                                                    setAttendanceFormData(prev => ({ ...prev, signature: canvas.toDataURL() }));
                                                };

                                                const stopDrawing = () => isDrawing = false;

                                                canvas.addEventListener('mousedown', startDrawing);
                                                canvas.addEventListener('mousemove', draw);
                                                window.addEventListener('mouseup', stopDrawing);
                                                canvas.addEventListener('touchstart', startDrawing, { passive: false });
                                                canvas.addEventListener('touchmove', draw, { passive: false });
                                                window.addEventListener('touchend', stopDrawing);
                                            }
                                        }}
                                        width={400}
                                        height={140}
                                        style={{
                                            width: '100%',
                                            height: '140px',
                                            borderRadius: '8px',
                                            background: 'rgba(0, 0, 0, 0.2)',
                                            cursor: 'crosshair',
                                            touchAction: 'none'
                                        }}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                        <small style={{ color: 'rgba(255, 255, 255, 0.6)' }}>✍️ Please sign in the box</small>
                                        <button
                                            type="button"
                                            disabled={loading}
                                            onClick={(e) => {
                                                const target = e.target as HTMLElement;
                                                const canvas = target.parentElement?.parentElement?.querySelector('canvas') as HTMLCanvasElement;
                                                if (canvas) {
                                                    const ctx = canvas.getContext('2d');
                                                    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
                                                }
                                                setAttendanceFormData(prev => ({ ...prev, signature: '' }));
                                            }}
                                            style={{ padding: '5px 12px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '15px', fontSize: '0.75rem', cursor: 'pointer' }}
                                        >
                                            Clear Signature
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={signAttendance}
                                disabled={loading || !session?.isActive}
                                className={`${styles.signButton} ${loading ? styles.loading : ''}`}
                            >
                                {loading ? 'Processing...' : selectedUser ? 'Complete Check-in' : 'Sign Attendance'}
                            </button>
                        </div>

                        {/* Recent History Display (Optional/Scrollable) */}
                        {deviceAttendance.length > 0 && (
                            <div className={styles.attendanceCount}>
                                <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', opacity: 0.8 }}>
                                    <FontAwesomeIcon icon={faUsers} /> Signed on this device: <strong>{deviceAttendance.length}</strong>
                                </p>
                                <div className={styles.usersList}>
                                    {deviceAttendance.slice(0, 3).map((record, idx) => (
                                        <span key={idx} className={styles.userBadge}>
                                            {record.userName}
                                        </span>
                                    ))}
                                    {deviceAttendance.length > 3 && <span style={{ fontSize: '0.8rem' }}>+{deviceAttendance.length - 3} more</span>}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AttendanceSignin;