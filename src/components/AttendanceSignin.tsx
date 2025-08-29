import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../config/environment';
import styles from '../styles/attendanceSignin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faClock, faUsers, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

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
        
        // Check for session updates every 10 seconds for better responsiveness
        const interval = setInterval(() => {
            checkActiveSession();
        }, 10000);

        // Listen for cross-tab session updates
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'attendanceSessionUpdate') {
                try {
                    const updateData = JSON.parse(event.newValue || '{}');
                    if (updateData.ministry === ministry) {
                        console.log('Session update detected from another tab:', updateData);
                        setSession(updateData.session);
                        
                        // Update localStorage for this ministry
                        localStorage.setItem(`attendanceSession_${ministry}`, JSON.stringify(updateData.session));
                        
                        // Refresh attendance records
                        checkActiveSession();
                    }
                } catch (error) {
                    console.error('Error parsing session update:', error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorageChange);
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
            console.log('Checking session for ministry:', ministry);
            
            // First check the backend API for active sessions
            try {
                const sessionResponse = await axios.get(
                    `http://localhost:3000/attendance/session/${ministry}`,
                    { withCredentials: true }
                );
                
                if (sessionResponse.data.session) {
                    const sessionData = sessionResponse.data.session;
                    console.log('Session data from API:', sessionData);
                    setSession(sessionData);
                    
                    // Store in localStorage for offline access
                    localStorage.setItem(`attendanceSession_${ministry}`, JSON.stringify(sessionData));
                    
                    // Load attendance records from API
                    try {
                        const recordsResponse = await axios.get(
                            `http://localhost:3000/attendance/records/${sessionData._id}`,
                            { withCredentials: true }
                        );
                        const sessionAttendance = recordsResponse.data.records || [];
                        setDeviceAttendance(sessionAttendance);
                        
                        // No automatic sign detection without login
                        setSigned(false);
                    } catch (recordsError) {
                        console.log('No attendance records found or error loading records');
                        setDeviceAttendance([]);
                    }
                } else {
                    console.log('No active session found from API');
                    setSession(null);
                    setSigned(false);
                    setDeviceAttendance([]);
                    localStorage.removeItem(`attendanceSession_${ministry}`);
                }
            } catch (apiError: any) {
                console.log('API error, checking localStorage as fallback:', apiError.message);
                
                // Fallback to localStorage if API fails
                const storedSession = localStorage.getItem(`attendanceSession_${ministry}`);
                
                if (storedSession) {
                    const sessionData = JSON.parse(storedSession);
                    console.log('Using localStorage session data:', sessionData);
                    
                    // Verify if session is still valid (not too old)
                    const sessionAge = Date.now() - new Date(sessionData.startTime).getTime();
                    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
                    
                    if (sessionAge < maxAge) {
                        setSession(sessionData);
                        
                        // Load device attendance records from localStorage
                        const storedAttendance = JSON.parse(localStorage.getItem('ministryAttendance') || '[]');
                        const sessionAttendance = storedAttendance.filter((record: any) => 
                            record.ministry === ministry && record.sessionId === sessionData._id
                        );
                        setDeviceAttendance(sessionAttendance);
                        
                        // No automatic sign detection without login
                        setSigned(false);
                    } else {
                        console.log('Session too old, removing from localStorage');
                        localStorage.removeItem(`attendanceSession_${ministry}`);
                        setSession(null);
                        setSigned(false);
                        setDeviceAttendance([]);
                    }
                } else {
                    console.log('No session found in localStorage either');
                    setSession(null);
                    setSigned(false);
                    setDeviceAttendance([]);
                }
            }
        } catch (error) {
            console.error('Error checking session:', error);
            setSession(null);
            setSigned(false);
            setDeviceAttendance([]);
        }
    };

    const signAttendance = async () => {
        // Validate form data
        if (!attendanceFormData.name || !attendanceFormData.regNo || !attendanceFormData.year || !attendanceFormData.phoneNumber || !attendanceFormData.signature) {
            setError('Please fill in all fields including phone number and signature');
            setTimeout(() => setError(''), 3000);
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

        // Validate registration number format
        const regNoPattern = /^[A-Z0-9\/\-]+$/i;
        if (!regNoPattern.test(attendanceFormData.regNo.trim())) {
            setError('Invalid registration number format');
            setTimeout(() => setError(''), 3000);
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // First try to sign attendance via API
            try {
                const attendanceData = {
                    name: attendanceFormData.name.trim(),
                    regNo: attendanceFormData.regNo.trim().toUpperCase(),
                    year: parseInt(attendanceFormData.year),
                    phoneNumber: attendanceFormData.phoneNumber.trim(),
                    signature: attendanceFormData.signature.trim(),
                    ministry: ministry,
                    sessionId: session._id
                };

                const response = await axios.post(
                    `http://localhost:3000/attendance/sign`,
                    attendanceData,
                    { withCredentials: true }
                );

                console.log('Attendance signed via API:', response.data);
                
                // Update local state
                const newRecord = response.data.record || {
                    id: Date.now().toString(),
                    ...attendanceData,
                    timestamp: new Date().toISOString()
                };
                
                setDeviceAttendance(prev => [...prev, newRecord]);
                
                // Mark as signed for this session
                setSigned(true);
                
                // Also store in localStorage as backup
                const storedAttendance = JSON.parse(localStorage.getItem('ministryAttendance') || '[]');
                storedAttendance.push(newRecord);
                localStorage.setItem('ministryAttendance', JSON.stringify(storedAttendance));
                
            } catch (apiError: any) {
                console.log('API error, using localStorage fallback:', apiError.message);
                
                // Fallback to localStorage if API fails
                const storedAttendance = JSON.parse(localStorage.getItem('ministryAttendance') || '[]');
                const existingRecord = storedAttendance.find((record: any) => 
                    record.regNo === attendanceFormData.regNo.trim().toUpperCase() && 
                    record.ministry === ministry && 
                    record.sessionId === session._id
                );

                if (existingRecord) {
                    setError(`Registration number ${attendanceFormData.regNo} has already signed attendance for this session`);
                    setTimeout(() => setError(''), 5000);
                    setLoading(false);
                    return;
                }

                // Create attendance record for localStorage
                const attendanceRecord = {
                    id: Date.now().toString(),
                    name: attendanceFormData.name.trim(),
                    regNo: attendanceFormData.regNo.trim().toUpperCase(),
                    year: parseInt(attendanceFormData.year),
                    phoneNumber: attendanceFormData.phoneNumber.trim(),
                    signature: attendanceFormData.signature.trim(),
                    ministry: ministry,
                    sessionId: session._id,
                    timestamp: new Date().toISOString()
                };

                storedAttendance.push(attendanceRecord);
                localStorage.setItem('ministryAttendance', JSON.stringify(storedAttendance));
                setDeviceAttendance(prev => [...prev, attendanceRecord]);
                
                setSigned(true);
            }

            // Clear form after successful submission
            setAttendanceFormData({ name: '', regNo: '', year: '', phoneNumber: '', signature: '' });
            
            setSuccess(`✅ Attendance signed successfully for ${attendanceFormData.name}!`);
            setTimeout(() => {
                setSuccess('');
                setSigned(false); // Allow another person to sign
            }, 4000);
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
                                    {deviceAttendance.map((record: any, index: number) => (
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

                                                const startDrawing = (e) => {
                                                    isDrawing = true;
                                                    const rect = canvas.getBoundingClientRect();
                                                    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                                                    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                                                    lastX = clientX - rect.left;
                                                    lastY = clientY - rect.top;
                                                };

                                                const draw = (e) => {
                                                    if (!isDrawing) return;
                                                    e.preventDefault();
                                                    const rect = canvas.getBoundingClientRect();
                                                    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                                                    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
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
                                                const canvas = e.target.parentElement.parentElement.querySelector('canvas');
                                                const ctx = canvas.getContext('2d');
                                                ctx.clearRect(0, 0, canvas.width, canvas.height);
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