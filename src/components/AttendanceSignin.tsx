import React, { useState, useEffect } from 'react';
import styles from '../styles/attendanceSignin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faClock, faUsers } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { getApiUrl } from '../config/environment';
import { formatDateTime, getTimeAgo, isRecentTime } from '../utils/timeUtils';

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [sessionClosedAgo, setSessionClosedAgo] = useState('');
    const [attendanceFormData, setAttendanceFormData] = useState({ name: '', regNo: '', course: '', year: '', phoneNumber: '', signature: '', userType: 'student' });
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
                console.log('❌ No active session found');
                setSession(null);
                setDeviceAttendance([]);
            }
        } catch (error: any) {
            console.error('❌ Error checking session:', error.message);
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
                console.log(`📝 Device attendance updated: ${updated.length} total records`);
                return updated;
            });
            
            // Clear form after successful submission for next person
            setAttendanceFormData({ name: '', regNo: '', course: '', year: '', phoneNumber: '', signature: '', userType: 'student' });
            
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
            console.error('❌ Error during attendance signing:', error);
            
            let errorMessage = 'Error signing attendance. Please try again.';
            
            // Handle different error response formats (development vs production)
            if (error.response) {
                console.log('🔍 Full error response received:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });
                
                if (error.response.status === 400) {
                    // Extract error message from different possible formats
                    // Check both 'message' and 'error' fields for consistency
                    errorMessage = error.response.data?.message || 
                                  error.response.data?.error || 
                                  error.response.data || 
                                  'Invalid attendance data';
                    
                    console.log('🔍 Extracted error message:', errorMessage);
                    
                    // Convert to string if it's not already
                    if (typeof errorMessage !== 'string') {
                        try {
                            errorMessage = JSON.stringify(errorMessage);
                        } catch {
                            errorMessage = String(errorMessage);
                        }
                    }
                    
                    // Check for duplicate registration number VERY specifically
                    const regNoUpper = attendanceFormData.regNo.trim().toUpperCase();
                    
                    console.log('🔍 Checking if error is duplicate-related:', {
                        errorMessage: errorMessage,
                        regNoUpper: regNoUpper,
                        errorMessageLower: errorMessage.toLowerCase()
                    });
                    
                    // Only treat as duplicate if it EXPLICITLY mentions the exact registration number
                    const isDuplicateError = (
                        (errorMessage.toLowerCase().includes('already signed attendance') && errorMessage.includes(regNoUpper)) ||
                        (errorMessage.toLowerCase().includes('already been used for attendance') && errorMessage.includes(regNoUpper)) ||
                        (errorMessage.toLowerCase().includes('has already signed') && errorMessage.includes(regNoUpper)) ||
                        (errorMessage.toLowerCase().includes('duplicate') && errorMessage.includes(regNoUpper))
                    );
                    
                    console.log('🔍 Is duplicate error?', isDuplicateError);
                    
                    if (isDuplicateError) {
                        // Extract just the registration number from the error for cleaner display
                        const cleanMessage = `❌ Registration Number ${regNoUpper} Already Used! This registration number has already been used for attendance in this session. Please use a different registration number.`;
                        console.log('🔍 Showing duplicate error message:', cleanMessage);
                        setError(cleanMessage);
                        setTimeout(() => setError(''), 8000);
                        
                        // Clear only the registration number field to allow correction
                        setAttendanceFormData(prev => ({
                            ...prev,
                            regNo: ''
                        }));
                        
                        // Focus on the registration number input for easy correction
                        const regNoInput = document.querySelector('input[placeholder*="IN16"]') as HTMLInputElement;
                        if (regNoInput) {
                            regNoInput.focus();
                        }
                        
                        setLoading(false);
                        return;
                    } else {
                        // Not a duplicate error - show the original error message
                        console.log('🔍 Not a duplicate error - showing original message:', errorMessage);
                        setError(`❌ ${errorMessage}`);
                        setTimeout(() => setError(''), 6000);
                    }
                } else if (error.response.status === 404) {
                    errorMessage = error.response.data?.message || 
                                  error.response.data?.error ||
                                  'Session not found. Please refresh and try again.';
                    setError(`❌ ${errorMessage}`);
                    setTimeout(() => setError(''), 6000);
                } else {
                    // Handle other HTTP error statuses
                    errorMessage = error.response.data?.message || 
                                  error.response.data?.error ||
                                  `Server error (${error.response.status}). Please try again.`;
                    setError(`❌ ${errorMessage}`);
                    setTimeout(() => setError(''), 6000);
                }
            } else if (error.request) {
                // Network error
                errorMessage = 'Network error. Please check your internet connection and try again.';
                setError(`❌ ${errorMessage}`);
                setTimeout(() => setError(''), 6000);
            } else {
                // Other error
                errorMessage = error.message || 'Unexpected error occurred.';
                setError(`❌ ${errorMessage}`);
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
                            <strong>Started:</strong> {formatDateTime(session.startTime, { format: 'medium', includeSeconds: true })}
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


                        {/* Show attendance count and recent signups */}
                        {deviceAttendance.length > 0 && (
                            <div className={styles.attendanceCount}>
                                <FontAwesomeIcon icon={faUsers} className={styles.usersIcon} />
                                <p>
                                    <strong>{deviceAttendance.length}</strong> total attendee{deviceAttendance.length !== 1 ? 's' : ''} in this session
                                </p>
                                <div className={styles.usersList}>
                                    <h4 className={styles.recentTitle}>Recent Attendees:</h4>
                                    {deviceAttendance.slice(0, 5).map((record: any, index: number) => (
                                        <span key={record._id || `${record.regNo}-${index}`} className={styles.userBadge}>
                                            {record.userName || record.name} ({record.regNo})
                                        </span>
                                    ))}
                                    {deviceAttendance.length > 5 && (
                                        <span className={styles.moreIndicator}>
                                            ... and {deviceAttendance.length - 5} more
                                        </span>
                                    )}
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
                                <label className={styles.formLabel}>I am a *</label>
                                <select
                                    value={attendanceFormData.userType || 'student'}
                                    onChange={(e) => {
                                        setAttendanceFormData({...attendanceFormData, userType: e.target.value});
                                        // Force re-render by changing a visible element
                                        const regField = document.querySelector('[placeholder*="C025"]') as HTMLInputElement;
                                        if (regField) {
                                            regField.style.display = e.target.value === 'student' ? 'block' : 'none';
                                        }
                                    }}
                                    className={styles.formSelect}
                                    disabled={loading}
                                    style={{backgroundColor: 'yellow', border: '3px solid red'}}
                                >
                                    <option value="student">Student</option>
                                    <option value="visitor">Visitor</option>
                                </select>
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Registration Number *</label>
                                <input
                                    type="text"
                                    placeholder="🚨 VISITOR SELECTOR ABOVE THIS FIELD! 🚨"
                                    value={attendanceFormData.regNo}
                                    onChange={(e) => setAttendanceFormData({...attendanceFormData, regNo: e.target.value.toUpperCase()})}
                                    className={styles.formInput}
                                    disabled={loading}
                                />
                            </div>

                            {attendanceFormData.userType === 'student' && (
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Course *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Computer Science"
                                        value={attendanceFormData.course}
                                        onChange={(e) => setAttendanceFormData({...attendanceFormData, course: e.target.value})}
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
                            )}
                            
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
                                💡 <strong>Note:</strong> Each registration number can only be used once per session. 
                                After signing, you can immediately sign for another person.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AttendanceSignin;