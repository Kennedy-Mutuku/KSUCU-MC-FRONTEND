import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from '../styles/attendanceSignin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faExclamationCircle,
    faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { getApiUrl } from '../config/environment';
import { formatDateTime } from '../utils/timeUtils';

interface Session {
    _id: string;
    title: string;
    ministry: string;
    isActive: boolean;
    startTime: string;
    leadershipRole?: string;
}

const AttendanceSignin: React.FC = () => {
<<<<<<< HEAD
    const [session, setSession] = useState<Session | null>(null);
=======
    const [attendanceSessions, setAttendanceSessions] = useState<Session[]>([]);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
<<<<<<< HEAD

    const [formData, setFormData] = useState({
        fullName: '',
        userType: 'student',
=======
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [attendanceFormData, setAttendanceFormData] = useState({
        phoneNumber: '',
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
        registrationNumber: '',
        course: '',
        year: '',
        phoneNumber: '',
        signature: ''
    });

<<<<<<< HEAD
    const canvasRef = useRef<HTMLCanvasElement>(null);
=======
    const signatureUpdateCallback = useCallback((sig: string) => {
        setAttendanceFormData(prev => ({ ...prev, signature: sig }));
    }, []);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch(getApiUrl('attendanceStatus'), {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setAttendanceSessions(data.sessions || []);

                    // If we have a selected session, keep it updated
                    if (selectedSession) {
                        const updated = (data.sessions || []).find((s: Session) => s._id === selectedSession._id);
                        if (updated) {
                            setSelectedSession(updated);
                        }
                    }
                }
            } catch (err) {
                console.error('Error fetching session status:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 4) {
            if (selectedUser) resetUserSelection();
            return;
        }
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79

    const fetchStatus = useCallback(async () => {
        try {
            const response = await fetch(getApiUrl('attendanceSessionStatus'), {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
<<<<<<< HEAD
                setSession(data.session);
=======
                const mappedUsers = (data || []).map((user: any) => ({
                    _id: user._id,
                    username: user.username,
                    registrationNumber: user.reg || '',
                    phoneNumber: user.phone || ''
                }));

                // Auto-select if there is an exact match for registration number
                const exactMatch = mappedUsers.find(
                    (user: User) => user.registrationNumber.toUpperCase() === query.toUpperCase()
                );

                if (exactMatch) {
                    handleSelectUser(exactMatch);
                } else if (selectedUser) {
                    // Clear selection if they change the reg no and it no longer matches
                    resetUserSelection();
                }
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
            }
        } catch (err) {
            console.error('Error fetching session status:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 10000);
        return () => clearInterval(interval);
    }, [fetchStatus]);

    useEffect(() => {
        if (!showForm || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        const startDrawing = (e: any) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            lastX = clientX - rect.left;
            lastY = clientY - rect.top;
        };

        const draw = (e: any) => {
            if (!isDrawing || !ctx) return;
            if (e.touches) e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const currentX = clientX - rect.left;
            const currentY = clientY - rect.top;

            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#334155';
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();

            lastX = currentX;
            lastY = currentY;
        };

        const stopDrawing = () => {
            if (isDrawing) {
                isDrawing = false;
                setFormData(prev => ({ ...prev, signature: canvas.toDataURL() }));
            }
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        window.addEventListener('touchend', stopDrawing);

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            window.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('touchstart', startDrawing);
            canvas.removeEventListener('touchmove', draw);
            window.removeEventListener('touchend', stopDrawing);
        };
    }, [showForm]);

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        setFormData(prev => ({ ...prev, signature: '' }));
    };

<<<<<<< HEAD
    const handleSubmit = async (e: React.FormEvent) => {
=======
    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        setAttendanceFormData(prev => ({
            ...prev,
            phoneNumber: user.phoneNumber || '',
            registrationNumber: user.username // Use name as registration identity for sign-in payload if needed
        }));
    };

    const resetUserSelection = () => {
        setSelectedUser(null);
        setAttendanceFormData(prev => ({
            ...prev,
            phoneNumber: '',
            registrationNumber: ''
        }));
    };

    const handleSignin = async (e: React.FormEvent) => {
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
        e.preventDefault();

        if (!session) {
            setMessage('❌ No active session found.');
            return;
        }
        if (!formData.signature) {
            setMessage('✍️ Please provide your signature.');
            return;
        }

        setSubmitting(true);
        setMessage('');

        try {
            const payload = {
<<<<<<< HEAD
                sessionId: session._id,
                name: formData.fullName,
                userType: formData.userType,
                registrationNumber: formData.registrationNumber,
                course: formData.course,
                year: formData.year,
                phoneNumber: formData.phoneNumber,
                signature: formData.signature,
                ministry: session.ministry
=======
                sessionId: selectedSession?._id,
                regNo: regNo,
                phoneNumber: attendanceFormData.phoneNumber,
                ministry: selectedSession?.ministry || attendanceFormData.ministry,
                signature: attendanceFormData.signature,
                userId: selectedUser?._id,
                name: selectedUser?.username || regNo
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
            };

            const response = await fetch(getApiUrl('attendanceSignAnonymous'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setFormData({
                    fullName: '',
                    userType: 'student',
                    registrationNumber: '',
                    course: '',
                    year: '',
                    phoneNumber: '',
                    signature: ''
                });
                setMessage('✅ Attendance recorded successfully!');
                setTimeout(() => {
                    setSuccess(false);
                    setMessage('');
                    setShowForm(false);
                }, 3000);
            } else {
                setMessage(`❌ ${data.message || 'Error recording attendance.'}`);
            }
        } catch (err) {
            setMessage('❌ Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.attendanceContainer}>
                <FontAwesomeIcon icon={faSpinner} spin size="2x" style={{ color: '#00c6ff' }} />
            </div>
        );
    }

    if (!session || !session.isActive) {
        return (
            <div className={styles.attendanceContainer}>
                <h1 className={styles.mainTitle}>SIGN ATTENDANCE</h1>
                <div className={styles.noSession}>
                    <FontAwesomeIcon icon={faExclamationCircle} size="3x" style={{ marginBottom: '15px', color: '#cbd5e1' }} />
                    <p>No active attendance session at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.attendanceContainer}>
            <h1 className={styles.mainTitle}>SIGN ATTENDANCE</h1>

            {/* Session Active Box */}
            <div className={styles.sessionActiveBox}>
                <div className={styles.sessionStatusText}>
                    <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '8px' }} />
                    Session Active
                </div>
                <div className={styles.sessionDetailsText}>
                    {session.leadershipRole || 'Secretary'} has opened attendance
                </div>
                <div className={styles.sessionTimeText}>
                    Started: {formatDateTime(session.startTime)}
                </div>
            </div>

            {/* Sign Attendance Toggle Button */}
            {!showForm && (
                <button
                    className={styles.signButton}
                    onClick={() => setShowForm(true)}
                >
                    SIGN ATTENDANCE
                </button>
            )}

            {/* Attendance Form */}
            {showForm && (
                <div className={styles.attendanceFormCard}>
                    <h2 className={styles.formInternalTitle}>Sign Your Attendance</h2>

                    {message && (
                        <div className={`${styles.alert} ${success ? styles.alertSuccess : styles.alertError}`}>
                            {message}
                        </div>
<<<<<<< HEAD
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Full Name *</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>I am a *</label>
                            <select
                                className={styles.formInput}
                                value={formData.userType}
                                onChange={e => setFormData({ ...formData, userType: e.target.value })}
                                required
                                disabled={submitting}
                            >
                                <option value="student">Student</option>
                                <option value="visitor">Visitor</option>
                                <option value="staff">Staff</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {formData.userType === 'student' && (
                            <>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Registration Number *</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        placeholder="e.g., IN16/00014/22"
                                        value={formData.registrationNumber}
                                        onChange={e => setFormData({ ...formData, registrationNumber: e.target.value })}
                                        required
                                        disabled={submitting}
                                    />
=======
                        <h1 className={styles.centerTitle}>Attendance Center</h1>
                        <p className={styles.centerSubtitle}>
                            Select a session below to record your participation.
                        </p>

                        <div className={styles.sessionList}>
                            {attendanceSessions.length === 0 ? (
                                <AttendanceSessionStatus session={null} />
                            ) : (
                                attendanceSessions.map((session, idx) => (
                                    <div
                                        key={session._id}
                                        className={styles.compactStatusRow}
                                        onClick={() => {
                                            setSelectedSession(session);
                                            setAttendanceFormData(prev => ({ ...prev, ministry: session.ministry || '' }));
                                            setShowForm(true);
                                        }}
                                    >
                                        <div className={styles.compactNumber}>{idx + 1}</div>
                                        <div className={styles.compactInfo}>
                                            <h3 className={styles.compactTitle}>{session.title}</h3>
                                            <p className={styles.compactSubtitle}>{session.leadershipRole || 'General'}</p>
                                        </div>
                                        <button className={styles.compactSignBtn}>Sign</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <div className={styles.formView}>
                        <div className={styles.formHeader}>
                            <button className={styles.backBtn} onClick={() => { setShowForm(false); setSelectedSession(null); }}>
                                <FontAwesomeIcon icon={faArrowLeft} /> Back
                            </button>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Sign In</h3>
                                <p style={{ fontSize: '0.75rem', color: '#8b005e', fontWeight: 700 }}>{selectedSession?.title}</p>
                            </div>
                        </div>

                        {message && (
                            <div className={`${styles.alert} ${success ? styles.alertSuccess : styles.alertError}`}>
                                <FontAwesomeIcon icon={success ? faCheckCircle : faExclamationCircle} />
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSignin}>
                            <div className={styles.searchWrapper}>
                                <label className={styles.formLabel}>Registration Number</label>
                                <div style={{ position: 'relative' }}>
                                    <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                                    <input
                                        type="text"
                                        className={`${styles.formInput} ${styles.searchInput}`}
                                        placeholder="Enter Registration Number (e.g., IN16/...)"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            const val = e.target.value.toUpperCase();
                                            setSearchQuery(val);
                                            handleSearch(val);
                                        }}
                                        onBlur={() => {
                                            // Handle case where they stop typing and we haven't found anyone
                                            if (!selectedUser && searchQuery.length > 5) {
                                                setAttendanceFormData(prev => ({ ...prev, registrationNumber: searchQuery }));
                                            }
                                        }}
                                        disabled={signing}
                                    />
                                </div>
                            </div>

                            {selectedUser ? (
                                <div className={styles.userFoundAlert}>
                                    <div className={styles.userFoundContent}>
                                        <div className={styles.userFoundIcon}>
                                            <FontAwesomeIcon icon={faUserCheck} />
                                        </div>
                                        <div>
                                            <h4 className={styles.welcomeText}>Welcome back, {selectedUser.username}!</h4>
                                            <p className={styles.foundMeta}>Reg No: {selectedUser.registrationNumber}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.clearBtn}
                                        onClick={resetUserSelection}
                                        title="Not you?"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                            ) : searchQuery.length >= 4 && (
                                <div className={styles.manualEntrySection}>
                                    <p className={styles.manualEntryHint}>Not recognized? Please enter your details manually:</p>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Full Name</label>
                                        <input
                                            type="text"
                                            className={styles.formInput}
                                            placeholder="Enter your full name"
                                            value={attendanceFormData.registrationNumber}
                                            onChange={(e) => setAttendanceFormData({ ...attendanceFormData, registrationNumber: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Phone Number (Optional)</label>
                                        <input
                                            type="tel"
                                            className={styles.formInput}
                                            placeholder="Enter phone number"
                                            value={attendanceFormData.phoneNumber}
                                            onChange={(e) => setAttendanceFormData({ ...attendanceFormData, phoneNumber: e.target.value })}
                                        />
                                    </div>
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
                                </div>

<<<<<<< HEAD
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Course *</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        placeholder="e.g., Computer Science"
                                        value={formData.course}
                                        onChange={e => setFormData({ ...formData, course: e.target.value })}
                                        required
                                        disabled={submitting}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Year of Study *</label>
                                    <select
                                        className={styles.formInput}
                                        value={formData.year}
                                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                                        required
                                        disabled={submitting}
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
                            </>
                        )}

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Phone Number *</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                placeholder="e.g., +254712345678"
                                value={formData.phoneNumber}
                                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Digital Signature *</label>
                            <div className={styles.signatureContainer}>
                                <canvas
                                    ref={canvasRef}
                                    width={400}
                                    height={150}
                                    style={{ width: '100%', height: '150px', cursor: 'crosshair', touchAction: 'none' }}
                                />
                                <div className={styles.signatureControls}>
                                    <span>Draw signature above</span>
                                    <button
                                        type="button"
                                        className={styles.clearSigBtn}
                                        onClick={clearSignature}
                                        disabled={submitting}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.actionButtons}>
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Submit'}
                            </button>
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={() => setShowForm(false)}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
=======
                            {(selectedUser || (searchQuery.length >= 4)) && (
                                <>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Sign Here</label>
                                        <SignaturePad
                                            onSignatureChange={signatureUpdateCallback}
                                            loading={signing}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className={styles.primaryCta}
                                        disabled={signing}
                                        style={{ marginTop: '10px' }}
                                    >
                                        {signing ? (
                                            <><FontAwesomeIcon icon={faSpinner} spin /> Recording...</>
                                        ) : (
                                            <>Confirm Participation <FontAwesomeIcon icon={faUserCheck} /></>
                                        )}
                                    </button>
                                </>
                            )}
                        </form>
                    </div>
                )}
            </div>
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
        </div>
    );
};

export default AttendanceSignin;
