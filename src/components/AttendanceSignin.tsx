import React, { useState, useEffect } from 'react';
import styles from '../styles/attendanceSignin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faClock, faUsers } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { getApiUrl } from '../config/environment';

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
    const [sessionClosedAgo, setSessionClosedAgo] = useState('');
    const [attendanceFormData, setAttendanceFormData] = useState({ name: '', regNo: '', year: '', phoneNumber: '', signature: '' });
    const [deviceAttendance, setDeviceAttendance] = useState<any[]>([]);

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
            const endTime = new Date(session.endTime);
            const now = new Date();
            const diffInMinutes = Math.floor((now.getTime() - endTime.getTime()) / (1000 * 60));
            setSessionClosedAgo(`${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`);
        }
    };


    const checkActiveSession = async () => {
        try {
            console.log('Checking for active attendance session...');
            
            // Check the backend API for active sessions (cross-device sync)
            const sessionResponse = await axios.get(
                getApiUrl('attendanceSessionStatus'),
                { withCredentials: true }
            );
            
            if (sessionResponse.data.session) {
                const sessionData = sessionResponse.data.session;
                console.log('Active session found:', sessionData);
                setSession(sessionData);
                
                // Load attendance records from API if session exists
                try {
                    const recordsResponse = await axios.get(
                        `${getApiUrl('attendanceRecords')}/${sessionData._id}`,
                        { withCredentials: true }
                    );
                    const sessionAttendance = recordsResponse.data.records || [];
                    setDeviceAttendance(sessionAttendance);
                    setSigned(false); // User needs to sign in
                } catch (recordsError) {
                    console.log('No attendance records found');
                    setDeviceAttendance([]);
                }
            } else {
                console.log('No active session found');
                setSession(null);
                setSigned(false);
                setDeviceAttendance([]);
            }
        } catch (error: any) {
            console.error('Error checking session:', error.message);
            // If API fails, show no session (no localStorage fallback for true cross-device sync)
            setSession(null);
            setSigned(false);
            setDeviceAttendance([]);
            setError('Unable to connect to attendance server. Please check your connection.');
            setTimeout(() => setError(''), 5000);
        }
    };

    const signAttendance = async () => {
        // Validate form data
        if (!attendanceFormData.name || !attendanceFormData.regNo || !attendanceFormData.year || !attendanceFormData.phoneNumber || !attendanceFormData.signature) {
            setError('Please fill in all fields including phone number and signature');
            setTimeout(() => setError(''), 3000);
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // CRITICAL: Always get the latest active session before signing
            console.log('🔄 Refreshing session status before signing...');
            const sessionResponse = await axios.get(
                getApiUrl('attendanceSessionStatus', `ministry=${encodeURIComponent(ministry)}&t=${Date.now()}`),
                { 
                    withCredentials: true,
                    headers: { 'Cache-Control': 'no-cache' }
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

            // Validate registration number format
            const regNoPattern = /^[A-Z0-9\/\-]+$/i;
            if (!regNoPattern.test(attendanceFormData.regNo.trim())) {
                setError('Invalid registration number format');
                setTimeout(() => setError(''), 3000);
                setLoading(false);
                return;
            }

            // Sign attendance via backend API (anonymous) using the LATEST session
            const attendanceData = {
                name: attendanceFormData.name.trim(),
                regNo: attendanceFormData.regNo.trim().toUpperCase(),
                year: parseInt(attendanceFormData.year),
                phoneNumber: attendanceFormData.phoneNumber.trim(),
                signature: attendanceFormData.signature.trim(),
                ministry: ministry,
                sessionId: latestSession._id  // Use latest session, not cached one!
            };

            const response = await axios.post(
                getApiUrl('attendanceSignAnonymous'),
                attendanceData,
                { withCredentials: true }
            );

            console.log('✅ Attendance signed successfully:', response.data);
            
            // Update local state with the response
            const newRecord = response.data.record;
            setDeviceAttendance(prev => [...prev, newRecord]);
            
            // Mark as signed for this session
            setSigned(true);

            // Clear form after successful submission
            setAttendanceFormData({ name: '', regNo: '', year: '', phoneNumber: '', signature: '' });
            
            // Show success message with timestamp and guidance
            const now = new Date();
            const timeString = now.toLocaleString();
            setSuccess(`✅ Attendance signed successfully for ${attendanceFormData.name}!\n\nSubmitted at: ${timeString}\n\n🔄 Ready for next person...`);
            setTimeout(() => {
                setSuccess('');
                setSigned(false); // Allow another person to sign
            }, 5000);

        } catch (error: any) {
            console.error('❌ Error during attendance signing:', error);
            if (error.response?.status === 400) {
                const errorMessage = error.response.data.message || 'Invalid attendance data';
                if (errorMessage.includes('already signed attendance')) {
                    setError(`❌ Registration Number Already Used!\n\n${errorMessage}\n\n💡 Please use a different registration number.`);
                } else {
                    setError(errorMessage);
                }
            } else {
                setError('Error signing attendance. Please check your connection and try again.');
            }
            setTimeout(() => setError(''), 6000);
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

                        {/* Show signed status if someone just signed */}
                        {signed && (
                            <div className={styles.signedStatus}>
                                <FontAwesomeIcon icon={faCheckCircle} className={styles.signedIcon} />
                                <p>Attendance signed successfully!</p>
                            </div>
                        )}

                        {/* Show device attendance count */}
                        {deviceAttendance.length > 0 && (
                            <div className={styles.attendanceCount}>
                                <FontAwesomeIcon icon={faUsers} className={styles.usersIcon} />
                                <p>{deviceAttendance.length} user{deviceAttendance.length !== 1 ? 's' : ''} signed from this device</p>
                                <div className={styles.usersList}>
                                    {deviceAttendance.map((record: any) => (
                                        <span key={record.id} className={styles.userBadge}>
                                            {record.name} ({record.regNo})
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Attendance Form - Always visible when session is active */}
                        <div className={styles.attendanceForm}>
                            <h4 className={styles.formTitle}>Enter Your Details to Sign Attendance</h4>
                            
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Full Name *</label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={attendanceFormData.name}
                                    onChange={(e) => setAttendanceFormData({...attendanceFormData, name: e.target.value})}
                                    className={styles.formInput}
                                    disabled={loading}
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Registration Number *</label>
                                <input
                                    type="text"
                                    placeholder="e.g., KU/2024/001234"
                                    value={attendanceFormData.regNo}
                                    onChange={(e) => setAttendanceFormData({...attendanceFormData, regNo: e.target.value.toUpperCase()})}
                                    className={styles.formInput}
                                    disabled={loading}
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Year of Study *</label>
                                <select
                                    value={attendanceFormData.year}
                                    onChange={(e) => setAttendanceFormData({...attendanceFormData, year: e.target.value})}
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
                            
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Phone Number *</label>
                                <input
                                    type="tel"
                                    placeholder="e.g., +254712345678"
                                    value={attendanceFormData.phoneNumber}
                                    onChange={(e) => setAttendanceFormData({...attendanceFormData, phoneNumber: e.target.value})}
                                    className={styles.formInput}
                                    disabled={loading}
                                />
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Digital Signature *</label>
                                <div style={{
                                    border: '2px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '10px',
                                    padding: '10px',
                                    background: 'rgba(255, 255, 255, 0.1)'
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

                                                    ctx.lineWidth = 2;
                                                    ctx.lineCap = 'round';
                                                    ctx.strokeStyle = '#fff';
                                                    ctx.beginPath();
                                                    ctx.moveTo(lastX, lastY);
                                                    ctx.lineTo(currentX, currentY);
                                                    ctx.stroke();
                                                    
                                                    lastX = currentX;
                                                    lastY = currentY;
                                                    
                                                    // Update signature data
                                                    setAttendanceFormData(prev => ({...prev, signature: canvas.toDataURL()}));
                                                };

                                                const stopDrawing = () => {
                                                    isDrawing = false;
                                                };

                                                // Mouse events
                                                canvas.addEventListener('mousedown', startDrawing);
                                                canvas.addEventListener('mousemove', draw);
                                                canvas.addEventListener('mouseup', stopDrawing);
                                                
                                                // Touch events for mobile
                                                canvas.addEventListener('touchstart', startDrawing, {passive: false});
                                                canvas.addEventListener('touchmove', draw, {passive: false});
                                                canvas.addEventListener('touchend', stopDrawing);
                                            }
                                        }}
                                        width={400}
                                        height={120}
                                        style={{
                                            width: '100%',
                                            height: '120px',
                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                            borderRadius: '5px',
                                            background: 'rgba(0, 0, 0, 0.2)',
                                            cursor: 'crosshair',
                                            touchAction: 'none'
                                        }}
                                    />
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: '8px'
                                    }}>
                                        <small style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem'}}>
                                            ✍️ Draw your signature above
                                        </small>
                                        <button
                                            type="button"
                                            disabled={loading}
                                            onClick={(e) => {
                                                const target = e.target as HTMLElement;
                                                const canvas = target.parentElement?.parentElement?.querySelector('canvas') as HTMLCanvasElement;
                                                if (canvas) {
                                                    const ctx = canvas.getContext('2d');
                                                    if (ctx) {
                                                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                                                    }
                                                }
                                                setAttendanceFormData(prev => ({...prev, signature: ''}));
                                            }}
                                            style={{
                                                padding: '4px 8px',
                                                background: '#ff4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                cursor: loading ? 'not-allowed' : 'pointer',
                                                opacity: loading ? 0.6 : 1
                                            }}
                                        >
                                            🔄 Clear
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <button
                                onClick={signAttendance}
                                disabled={loading || !session?.isActive}
                                className={`${styles.signButton} ${loading ? styles.loading : ''}`}
                            >
                                {loading ? 'Signing Attendance...' : 'Sign Attendance'}
                            </button>
                            
                            <p className={styles.formNote}>
                                💡 After signing, you can sign for another person
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AttendanceSignin;