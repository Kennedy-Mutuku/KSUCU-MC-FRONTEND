import React, { useState, useEffect, useCallback } from 'react';
import styles from '../styles/attendanceSignin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faExclamationCircle,
    faSearch,
    faTimes,
    faSpinner,
    faUserCheck,
    faPenNib,
    faArrowRight,
    faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { getApiUrl } from '../config/environment';
import AttendanceSessionStatus from './attendance/AttendanceSessionStatus';
import SignaturePad from './attendance/SignaturePad';

interface User {
    _id: string;
    username: string;
    registrationNumber: string;
    phoneNumber?: string;
}

interface Session {
    _id: string;
    title: string;
    ministry: string;
    isActive: boolean;
    startTime: string;
    endTime?: string;
    leadershipRole?: string;
}

const AttendanceSignin: React.FC = () => {
    const [attendanceSessions, setAttendanceSessions] = useState<Session[]>([]);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [signing, setSigning] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [attendanceFormData, setAttendanceFormData] = useState({
        phoneNumber: '',
        registrationNumber: '',
        ministry: '',
        signature: ''
    });

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

        try {
            const response = await fetch(`${getApiUrl('usersSearch')}?query=${encodeURIComponent(query)}`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
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
            }
        } catch (err) {
            console.error('Search error:', err);
        }
    };

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
        e.preventDefault();

        const regNo = selectedUser ? selectedUser.registrationNumber : attendanceFormData.registrationNumber;

        if (!regNo) {
            setMessage('❌ Please enter your name or registration number');
            return;
        }

        if (!attendanceFormData.signature) {
            setMessage('✍️ Please provide your signature');
            return;
        }

        setSigning(true);
        setMessage('');

        try {
            const payload = {
                sessionId: selectedSession?._id,
                regNo: regNo,
                phoneNumber: attendanceFormData.phoneNumber,
                ministry: selectedSession?.ministry || attendanceFormData.ministry,
                signature: attendanceFormData.signature,
                userId: selectedUser?._id,
                name: selectedUser?.username || regNo
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
                setMessage('✅ Attendance recorded successfully!');
                setTimeout(() => {
                    setSuccess(false);
                    setMessage('');
                    setShowForm(false);
                    setAttendanceFormData(prev => ({ ...prev, signature: '', phoneNumber: '', registrationNumber: '' }));
                    setSelectedUser(null);
                }, 3000);
            } else {
                setMessage(`❌ ${data.message || 'Error signing attendance'}`);
            }
        } catch (err) {
            setMessage('❌ Network error. Please try again.');
        } finally {
            setSigning(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.attendanceContainer}>
                <div className={styles.attendanceCard} style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                    <FontAwesomeIcon icon={faSpinner} spin size="2x" style={{ color: '#8b005e' }} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.attendanceContainer}>
            <div className={styles.attendanceCard}>
                {!showForm ? (
                    <div className={styles.landingView}>
                        <div className={styles.centerIconWrapper}>
                            <FontAwesomeIcon icon={faPenNib} />
                        </div>
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
                                </div>
                            )}

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
        </div>
    );
};

export default AttendanceSignin;