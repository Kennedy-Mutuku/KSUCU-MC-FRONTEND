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
    ministry: string;
    isActive: boolean;
    startTime: string;
    endTime?: string;
    leadershipRole?: string;
}

const AttendanceSignin: React.FC = () => {
    const [attendanceSession, setAttendanceSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [signing, setSigning] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
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
                    setAttendanceSession(data.session);
                    if (data.session) {
                        setAttendanceFormData(prev => ({
                            ...prev,
                            ministry: data.session.ministry || ''
                        }));
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
        if (query.length < 3) {
            setSearchResults([]);
            return;
        }

        try {
            const response = await fetch(`${getApiUrl('usersSearch')}?query=${encodeURIComponent(query)}`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                // Map API response fields to expected component interface if necessary
                const mappedUsers = (data || []).map((user: any) => ({
                    _id: user._id,
                    username: user.username,
                    registrationNumber: user.reg || '',
                    phoneNumber: user.phone || ''
                }));
                setSearchResults(mappedUsers);
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
            registrationNumber: user.registrationNumber || ''
        }));
        setSearchQuery('');
        setSearchResults([]);
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
                sessionId: attendanceSession?._id,
                registrationNumber: regNo,
                phoneNumber: attendanceFormData.phoneNumber,
                ministry: attendanceFormData.ministry,
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
                            Record your participation in our spiritual gatherings quickly and easily.
                        </p>

                        <AttendanceSessionStatus session={attendanceSession} />

                        {attendanceSession?.isActive && (
                            <button
                                className={styles.primaryCta}
                                onClick={() => setShowForm(true)}
                            >
                                Sign Attendance Now <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={styles.formView}>
                        <div className={styles.formHeader}>
                            <button className={styles.backBtn} onClick={() => setShowForm(false)}>
                                <FontAwesomeIcon icon={faArrowLeft} /> Back
                            </button>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Sign In</h3>
                        </div>

                        {message && (
                            <div className={`${styles.alert} ${success ? styles.alertSuccess : styles.alertError}`}>
                                <FontAwesomeIcon icon={success ? faCheckCircle : faExclamationCircle} />
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSignin}>
                            <div className={styles.searchWrapper}>
                                <label className={styles.formLabel}>Find Your Name</label>
                                <div style={{ position: 'relative' }}>
                                    <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                                    <input
                                        type="text"
                                        className={`${styles.formInput} ${styles.searchInput}`}
                                        placeholder="Type name or registration number..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        disabled={signing || !!selectedUser}
                                    />
                                </div>
                                {searchResults.length > 0 && (
                                    <div className={styles.searchResults}>
                                        {searchResults.map(user => (
                                            <div
                                                key={user._id}
                                                className={styles.resultItem}
                                                onClick={() => handleSelectUser(user)}
                                            >
                                                <span className={styles.resultName}>{user.username}</span>
                                                <span className={styles.resultMeta}>{user.registrationNumber || 'No Reg No.'}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {selectedUser && (
                                <div className={styles.selectedUserBar}>
                                    <div className={styles.selectedInfo}>
                                        <h4>{selectedUser.username}</h4>
                                        <p>{selectedUser.registrationNumber}</p>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.clearBtn}
                                        onClick={resetUserSelection}
                                        title="Clear selection"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                            )}

                            {!selectedUser && (
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Manual Entry (If not found)</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        placeholder="Full Name / Reg Number"
                                        value={attendanceFormData.registrationNumber}
                                        onChange={(e) => setAttendanceFormData({ ...attendanceFormData, registrationNumber: e.target.value })}
                                        required
                                    />
                                </div>
                            )}

                            <div className={styles.formGroup}>
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
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceSignin;