import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../config/environment';
import styles from '../styles/attendanceSignin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faClock } from '@fortawesome/free-solid-svg-icons';

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
                
                // Check if user has already signed (if logged in)
                if (userData) {
                    const storedAttendance = JSON.parse(localStorage.getItem('ministryAttendance') || '[]');
                    const userRecord = storedAttendance.find((record: any) => 
                        record.ministry === ministry && record.sessionId === sessionData._id
                    );
                    setSigned(!!userRecord);
                } else {
                    setSigned(false);
                }
            } else {
                console.log('No session found for ministry:', ministry);
                setSession(null);
                setSigned(false);
            }
        } catch (error) {
            console.error('Error checking session:', error);
        }
    };

    const signAttendance = async () => {
        if (!userData) {
            setError('Please log in to sign attendance');
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

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Check if already signed
            const storedAttendance = JSON.parse(localStorage.getItem('ministryAttendance') || '[]');
            const existingRecord = storedAttendance.find((record: any) => 
                record.ministry === ministry && record.sessionId === session._id
            );

            if (existingRecord) {
                setError('You have already signed attendance for this session');
                setTimeout(() => setError(''), 5000);
                setLoading(false);
                return;
            }

            // Create attendance record
            const attendanceRecord = {
                id: Date.now().toString(),
                name: userData.username,
                regNo: userData.regNo || 'N/A',
                year: userData.year || 1,
                ministry: ministry,
                sessionId: session._id,
                timestamp: new Date().toISOString()
            };

            // Add to stored attendance
            storedAttendance.push(attendanceRecord);
            localStorage.setItem('ministryAttendance', JSON.stringify(storedAttendance));

            setSigned(true);
            setSuccess('Attendance signed successfully!');
            setTimeout(() => setSuccess(''), 3000);
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

                        {signed ? (
                            <div className={styles.signedStatus}>
                                <FontAwesomeIcon icon={faCheckCircle} className={styles.signedIcon} />
                                <p>You have already signed attendance for this session</p>
                            </div>
                        ) : userData ? (
                            <div className={styles.signSection}>
                                <p className={styles.instruction}>
                                    Click below to sign attendance for {ministry} ministry
                                </p>
                                <button 
                                    onClick={signAttendance}
                                    disabled={loading}
                                    className={`${styles.signButton} ${loading ? styles.loading : ''}`}
                                >
                                    {loading ? 'Signing...' : 'Sign Attendance'}
                                </button>
                            </div>
                        ) : (
                            <div className={styles.loginPrompt}>
                                <p>Please log in to sign attendance</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AttendanceSignin;