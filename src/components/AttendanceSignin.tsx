import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../config/environment';
import styles from '../styles/attendanceSignin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faClock, faUsers, faUserPlus } from '@fortawesome/free-solid-svg-icons';

interface AttendanceSession {
    _id: string;
    ministry: string;
    isActive: boolean;
    startTime: string;
    endTime?: string;
}

interface AttendanceSigninProps {
    ministry: string;
}

const AttendanceSignin: React.FC<AttendanceSigninProps> = ({ ministry }) => {
    const [session, setSession] = useState<AttendanceSession | null>(null);
    const [signed, setSigned] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userData, setUserData] = useState<any>(null);
    const [sessionClosedAgo, setSessionClosedAgo] = useState('');
    const [showMultiUserForm, setShowMultiUserForm] = useState(false);
    const [multiUserData, setMultiUserData] = useState({ name: '', regNo: '', year: '' });
    const [deviceAttendance, setDeviceAttendance] = useState<any[]>([]);

    useEffect(() => {
        fetchUserData();
        checkActiveSession();
        
        // Check for session updates every 30 seconds
        const interval = setInterval(() => {
            checkActiveSession();
        }, 30000);

        return () => clearInterval(interval);
    }, [ministry]);

    useEffect(() => {
        // Re-check session when userData changes
        if (userData) {
            checkActiveSession();
        }
    }, [userData]);

    useEffect(() => {
        if (session && session.endTime) {
            updateClosedTime();
            const timeInterval = setInterval(updateClosedTime, 60000); // Update every minute
            return () => clearInterval(timeInterval);
        }
    }, [session]);

    const updateClosedTime = () => {
        if (session?.endTime) {
            const endTime = new Date(session.endTime);
            const now = new Date();
            const diffInMinutes = Math.floor((now.getTime() - endTime.getTime()) / (1000 * 60));
            setSessionClosedAgo(`${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`);
        }
    };

    const fetchUserData = async () => {
        try {
            const response = await fetch(getApiUrl('users'), {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const checkActiveSession = async () => {
        try {
            console.log('Checking session for ministry:', ministry);
            
            // Check localStorage for session
            const storedSession = localStorage.getItem(`attendanceSession_${ministry}`);
            
            if (storedSession) {
                const sessionData = JSON.parse(storedSession);
                console.log('Session data from localStorage:', sessionData);
                setSession(sessionData);
                
                // Load device attendance records for this session
                const storedAttendance = JSON.parse(localStorage.getItem('ministryAttendance') || '[]');
                const sessionAttendance = storedAttendance.filter((record: any) => 
                    record.ministry === ministry && record.sessionId === sessionData._id
                );
                setDeviceAttendance(sessionAttendance);
                
                // Check if current user has already signed (if logged in)
                if (userData && userData.regNo) {
                    const userRecord = sessionAttendance.find((record: any) => 
                        record.regNo === userData.regNo
                    );
                    setSigned(!!userRecord);
                } else {
                    setSigned(false);
                }
            } else {
                console.log('No session found for ministry:', ministry);
                setSession(null);
                setSigned(false);
                setDeviceAttendance([]);
            }
        } catch (error) {
            console.error('Error checking session:', error);
        }
    };

    const signAttendance = async (customData?: any) => {
        const userToSign = customData || userData;
        
        if (!userToSign) {
            setError('User data required to sign attendance');
            return;
        }

        if (!session) {
            setError('No active session found');
            return;
        }

        if (!session.isActive) {
            setError('This attendance session is closed');
            return;
        }

        // Validate registration number
        if (!userToSign.regNo || userToSign.regNo.trim() === '') {
            setError('Registration number is required');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Check if this regNo already signed for this session
            const storedAttendance = JSON.parse(localStorage.getItem('ministryAttendance') || '[]');
            const existingRecord = storedAttendance.find((record: any) => 
                record.regNo === userToSign.regNo && 
                record.ministry === ministry && 
                record.sessionId === session._id
            );

            if (existingRecord) {
                setError(`Registration number ${userToSign.regNo} has already signed attendance for this session`);
                setTimeout(() => setError(''), 5000);
                setLoading(false);
                return;
            }

            // Create attendance record
            const attendanceRecord = {
                id: Date.now().toString(),
                name: userToSign.name || userToSign.username,
                regNo: userToSign.regNo.trim().toUpperCase(),
                year: userToSign.year || 1,
                ministry: ministry,
                sessionId: session._id,
                timestamp: new Date().toISOString()
            };

            // Add to stored attendance
            storedAttendance.push(attendanceRecord);
            localStorage.setItem('ministryAttendance', JSON.stringify(storedAttendance));

            // Update device attendance list
            setDeviceAttendance(prev => [...prev, attendanceRecord]);

            // If this was the logged-in user, mark as signed
            if (!customData && userData && userData.regNo === userToSign.regNo) {
                setSigned(true);
            }

            // Reset multi-user form if used
            if (customData) {
                setMultiUserData({ name: '', regNo: '', year: '' });
                setShowMultiUserForm(false);
            }

            setSuccess(`✅ Attendance signed successfully for ${attendanceRecord.name}!`);
            setTimeout(() => setSuccess(''), 4000);
        } catch (error) {
            setError('Error signing attendance. Please try again.');
            setTimeout(() => setError(''), 5000);
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
                        {isSessionClosed ? 'Attendance Session Closed' : `${ministry} Ministry Attendance`}
                    </h3>
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

                        {/* Show signed status only if current user has signed */}
                        {signed && userData && (
                            <div className={styles.signedStatus}>
                                <FontAwesomeIcon icon={faCheckCircle} className={styles.signedIcon} />
                                <p>You ({userData.regNo}) have already signed attendance</p>
                            </div>
                        )}

                        {/* Show device attendance count */}
                        {deviceAttendance.length > 0 && (
                            <div className={styles.attendanceCount}>
                                <FontAwesomeIcon icon={faUsers} className={styles.usersIcon} />
                                <p>{deviceAttendance.length} user{deviceAttendance.length !== 1 ? 's' : ''} signed from this device</p>
                                <div className={styles.usersList}>
                                    {deviceAttendance.map((record: any, index: number) => (
                                        <span key={record.id} className={styles.userBadge}>
                                            {record.name} ({record.regNo})
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sign buttons section */}
                        <div className={styles.signSection}>
                            {userData && !signed && (
                                <button 
                                    onClick={() => signAttendance()}
                                    disabled={loading}
                                    className={`${styles.signButton} ${loading ? styles.loading : ''}`}
                                >
                                    {loading ? 'Signing...' : `Sign as ${userData.username} (${userData.regNo})`}
                                </button>
                            )}
                            
                            <button 
                                onClick={() => setShowMultiUserForm(!showMultiUserForm)}
                                className={styles.multiUserButton}
                                disabled={loading}
                            >
                                <FontAwesomeIcon icon={faUserPlus} />
                                {showMultiUserForm ? 'Cancel' : 'Sign for Someone Else'}
                            </button>
                        </div>

                        {/* Multi-user form */}
                        {showMultiUserForm && (
                            <div className={styles.multiUserForm}>
                                <h4>Sign Attendance for Another Person</h4>
                                <div className={styles.formGroup}>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={multiUserData.name}
                                        onChange={(e) => setMultiUserData({...multiUserData, name: e.target.value})}
                                        className={styles.formInput}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <input
                                        type="text"
                                        placeholder="Registration Number (e.g., KU/2024/001234)"
                                        value={multiUserData.regNo}
                                        onChange={(e) => setMultiUserData({...multiUserData, regNo: e.target.value})}
                                        className={styles.formInput}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <select
                                        value={multiUserData.year}
                                        onChange={(e) => setMultiUserData({...multiUserData, year: e.target.value})}
                                        className={styles.formSelect}
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
                                <button
                                    onClick={() => {
                                        if (!multiUserData.name || !multiUserData.regNo || !multiUserData.year) {
                                            setError('Please fill in all fields');
                                            setTimeout(() => setError(''), 3000);
                                            return;
                                        }
                                        signAttendance(multiUserData);
                                    }}
                                    disabled={loading}
                                    className={styles.submitButton}
                                >
                                    {loading ? 'Signing...' : 'Sign Attendance'}
                                </button>
                            </div>
                        )}

                        {!userData && !showMultiUserForm && (
                            <div className={styles.loginPrompt}>
                                <p>You can sign attendance for multiple users from this device</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AttendanceSignin;