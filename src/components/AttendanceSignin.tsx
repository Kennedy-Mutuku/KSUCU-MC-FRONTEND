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
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        userType: 'student',
        registrationNumber: '',
        course: '',
        year: '',
        phoneNumber: '',
        signature: ''
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const fetchStatus = useCallback(async () => {
        try {
            const response = await fetch(getApiUrl('attendanceSessionStatus'), {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setSession(data.session);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session) {
            setMessage('No active session found.');
            return;
        }
        if (!formData.signature) {
            setMessage('Please provide your signature.');
            return;
        }

        setSubmitting(true);
        setMessage('');

        try {
            const payload = {
                sessionId: session._id,
                name: formData.fullName,
                userType: formData.userType,
                registrationNumber: formData.registrationNumber,
                course: formData.course,
                year: formData.year,
                phoneNumber: formData.phoneNumber,
                signature: formData.signature,
                ministry: session.ministry
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
                setMessage('Attendance recorded successfully!');
                setTimeout(() => {
                    setSuccess(false);
                    setMessage('');
                    setShowForm(false);
                }, 3000);
            } else {
                setMessage(`${data.message || 'Error recording attendance.'}`);
            }
        } catch (err) {
            setMessage('Network error. Please try again.');
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
                                </div>

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
        </div>
    );
};

export default AttendanceSignin;
