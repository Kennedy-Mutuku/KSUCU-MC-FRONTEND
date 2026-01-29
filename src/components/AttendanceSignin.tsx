import { useState, useEffect, useRef } from 'react';
import styles from '../styles/attendanceSignin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faExclamationTriangle,
    faSearch,
    faUserCheck,
    faTimes
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { getApiUrl } from '../config/environment';
import SignaturePad from './attendance/SignaturePad';
import AttendanceSessionStatus from './attendance/AttendanceSessionStatus';

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
    const [attendanceFormData, setAttendanceFormData] = useState({ name: '', regNo: '', course: '', year: '', phoneNumber: '', signature: '', userType: 'student' });

    // Quick Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
    const searchTimeoutRef = useRef<any>(null);

    useEffect(() => {
        checkActiveSession();
        const interval = setInterval(checkActiveSession, 10000);
        return () => clearInterval(interval);
    }, [ministry]);

    const checkActiveSession = async () => {
        try {
            const timestamp = Date.now();
            const sessionResponse = await axios.get(
                `${getApiUrl('attendanceSessionStatus')}?t=${timestamp}&refresh=${Math.random()}`,
                { withCredentials: true }
            );

            if (sessionResponse.data.session) {
                const sessionData = sessionResponse.data.session;
                setSession(sessionData);
            } else {
                setSession(null);
            }
        } catch (error: any) {
            setSession(null);
            setError('⚠️ Connection error. Please try again.');
            setTimeout(() => setError(''), 5000);
        }
    };

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
        setAttendanceFormData({ name: '', regNo: '', course: '', year: '', phoneNumber: '', signature: '', userType: 'student' });
    };

    const signAttendance = async () => {
        if (!attendanceFormData.name || !attendanceFormData.phoneNumber || !attendanceFormData.signature) {
            setError('Please fill in name, phone number, and signature');
            setTimeout(() => setError(''), 3000);
            return;
        }

        if (attendanceFormData.userType === 'student' && (!attendanceFormData.regNo || !attendanceFormData.course || !attendanceFormData.year)) {
            setError('Students must fill in registration number, course, and year');
            setTimeout(() => setError(''), 3000);
            return;
        }

        setLoading(true);
        try {
            const timestamp = Date.now();
            const sessionResponse = await axios.get(
                `${getApiUrl('attendanceSessionStatus')}?t=${timestamp}&refresh=${Math.random()}`,
                { withCredentials: true }
            );

            const latestSession = sessionResponse.data.session;
            if (!latestSession || !latestSession.isActive) {
                setError('No active session found or session closed.');
                setLoading(false);
                return;
            }

            const attendanceData = {
                ...attendanceFormData,
                name: attendanceFormData.name.trim(),
                regNo: attendanceFormData.userType === 'student' ? attendanceFormData.regNo.trim().toUpperCase() : `VISITOR-${Date.now()}`,
                course: attendanceFormData.userType === 'student' ? attendanceFormData.course.trim() : 'N/A',
                year: attendanceFormData.userType === 'student' ? parseInt(attendanceFormData.year) : 0,
                phoneNumber: attendanceFormData.phoneNumber.trim(),
                signature: attendanceFormData.signature.trim(),
                sessionId: latestSession._id
            };

            await axios.post(getApiUrl('attendanceSignAnonymous'), attendanceData, { withCredentials: true });
            const signedName = attendanceFormData.name.trim();

            resetSelection();

            setSuccess(`✅ ${signedName} successfully signed attendance!`);
            setTimeout(() => setSuccess(''), 4000);
        } catch (error: any) {
            setError(`❌ ${error.response?.data?.message || 'Error signing attendance'}`);
            setTimeout(() => setError(''), 6000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.attendanceContainer}>
            <div className={styles.attendanceCard}>
                <AttendanceSessionStatus session={session} ministry={ministry} />

                {session?.isActive && (
                    <>
                        {error && <div className={styles.error}><FontAwesomeIcon icon={faExclamationTriangle} /> <span>{error}</span></div>}
                        {success && <div className={styles.success}><FontAwesomeIcon icon={faCheckCircle} /> <span>{success}</span></div>}

                        {!selectedUser && (
                            <div className={styles.searchSection}>
                                <div className={styles.searchInputWrapper}>
                                    <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                                    <input
                                        type="text"
                                        placeholder="🔍 Search by Name or Reg No..."
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
                                            <div key={user._id} className={styles.searchResultItem} onClick={() => handleSelectUser(user)}>
                                                <span className={styles.resultName}>{user.username}</span>
                                                <span className={styles.resultReg}>{user.reg} • {user.course}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedUser && (
                            <div className={styles.userFoundCard}>
                                <div className={styles.userInfo}>
                                    <h4><FontAwesomeIcon icon={faUserCheck} /> {selectedUser.username}</h4>
                                    <p>{selectedUser.reg} • Year {selectedUser.yos}</p>
                                </div>
                                <button className={styles.resetButton} onClick={resetSelection} title="Change person"><FontAwesomeIcon icon={faTimes} /></button>
                            </div>
                        )}

                        <div className={styles.attendanceForm}>
                            {!selectedUser && (
                                <>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Full Name *</label>
                                        <input
                                            type="text"
                                            value={attendanceFormData.name}
                                            onChange={(e) => setAttendanceFormData({ ...attendanceFormData, name: e.target.value })}
                                            className={styles.formInput}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Registration Number *</label>
                                        <input
                                            type="text"
                                            value={attendanceFormData.regNo}
                                            onChange={(e) => setAttendanceFormData({ ...attendanceFormData, regNo: e.target.value.toUpperCase() })}
                                            className={styles.formInput}
                                            disabled={attendanceFormData.userType === 'visitor'}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Phone Number *</label>
                                        <input
                                            type="tel"
                                            value={attendanceFormData.phoneNumber}
                                            onChange={(e) => setAttendanceFormData({ ...attendanceFormData, phoneNumber: e.target.value })}
                                            className={styles.formInput}
                                        />
                                    </div>
                                </>
                            )}

                            <SignaturePad
                                onSignatureChange={(sig) => setAttendanceFormData(prev => ({ ...prev, signature: sig }))}
                                loading={loading}
                            />

                            <button onClick={signAttendance} disabled={loading} className={`${styles.signButton} ${loading ? styles.loading : ''}`}>
                                {loading ? 'Processing...' : selectedUser ? 'Complete Check-in' : 'Sign Attendance'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AttendanceSignin;