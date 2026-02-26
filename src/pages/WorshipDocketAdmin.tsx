import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernNewsDisplay from '../components/ModernNewsDisplay';
import OverseerLogoutButton from '../components/OverseerLogoutButton';
import styles from '../styles/worshipDocketAdmin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faCheckCircle,
    faArrowRight,
    faNewspaper,
    faBox,
    faBookOpen,
    faHeart,
    faComments
} from '@fortawesome/free-solid-svg-icons';
import { useOverseerAuth } from '../hooks/useOverseerAuth';

const WorshipDocketAdmin: React.FC = () => {
    const navigate = useNavigate();
    const { authenticated, loading: authLoading, login } = useOverseerAuth();
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [message, setMessage] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('');

    const handleLogin = async () => {
        const result = await login(password);
        if (result.success) {
            setAuthError('');
            setMessage('Successfully logged in to Leadership Admin');
            setTimeout(() => setMessage(''), 3000);
        } else {
            setAuthError(result.message || 'Invalid password');
            setTimeout(() => setAuthError(''), 3000);
        }
        setPassword('');
    };

    const handleRoleSelection = () => {
        const role = 'Executive Admin';
        setSelectedRole(role);
        setMessage(`Redirecting to attendance management...`);
        setTimeout(() => {
            sessionStorage.setItem('adminAuth', 'authenticated');
            sessionStorage.setItem('leadershipRole', role);
            navigate(`/attendance-session-management?role=${encodeURIComponent(role)}`);
        }, 800);
    };

    if (authLoading) {
        return (
            <div className={styles.container}>
                <p style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>Verifying session...</p>
            </div>
        );
    }

    if (!authenticated) {
        return (
            <>
                <div className={styles.container}>
                    <div className={styles.loginCard}>
                        <h2>Leadership Admin</h2>
                        <p>Enter admin password to access leadership attendance management</p>

                        {authError && (
                            <div className={styles.error}>
                                {authError}
                            </div>
                        )}

                        <div className={styles.inputGroup}>
                            <input
                                type="password"
                                className={styles.passwordInput}
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                            />
                        </div>

                        <button
                            className={styles.loginButton}
                            onClick={handleLogin}
                        >
                            Access Admin Panel
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className={styles.container}>
                <OverseerLogoutButton />
                <div className={styles.adminHeader}>
                    <h1>
                        <FontAwesomeIcon icon={faUsers} />
                        Leadership Attendance Administration
                    </h1>
                    <p>Centralized management for all church attendance sessions</p>
                </div>

                {message && (
                    <div className={styles.message}>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        {message}
                    </div>
                )}

                {/* Admin Dashboard Overview */}
                <div className={styles.dashboardOverview}>
                    <h2>Password Overseer Dashboard</h2>
                    <p>Welcome! Here are all available administrative functions organized for easy access:</p>
                </div>

                {/* Main Admin Functions Grid */}
                <div className={styles.adminFunctionsGrid}>

                    {/* 1. News Administration */}
                    <div className={styles.functionCard}>
                        <div className={styles.functionNumber}>1</div>
                        <div className={styles.functionContent}>
                            <h3>
                                <FontAwesomeIcon icon={faNewspaper} />
                                News Administration
                            </h3>
                            <p>Update news, manage events with countdown timers, and add photos</p>
                            <button
                                className={styles.functionButton}
                                onClick={() => {
                                    // Store authentication state
                                    sessionStorage.setItem('adminAuth', 'authenticated');
                                    navigate('/news-admin');
                                }}
                            >
                                News Admin
                                <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
                            </button>
                        </div>
                    </div>

                    {/* 2. Media Management */}
                    <div className={styles.functionCard}>
                        <div className={styles.functionNumber}>2</div>
                        <div className={styles.functionContent}>
                            <h3>
                                <FontAwesomeIcon icon={faUsers} />
                                Media Management
                            </h3>
                            <p>Manage photos and media for the KSUCU website gallery</p>
                            <button
                                className={styles.functionButton}
                                onClick={() => {
                                    // Store authentication state  
                                    sessionStorage.setItem('adminAuth', 'authenticated');
                                    navigate('/media-admin');
                                }}
                            >
                                Manage Media Gallery
                                <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
                            </button>
                        </div>
                    </div>

                    {/* 3. Requisitions Management */}
                    <div className={styles.functionCard}>
                        <div className={styles.functionNumber}>3</div>
                        <div className={styles.functionContent}>
                            <h3>
                                <FontAwesomeIcon icon={faBox} />
                                Requisitions Management
                            </h3>
                            <p>View, approve, and manage equipment requisition requests from members</p>
                            <button
                                className={styles.functionButton}
                                onClick={() => {
                                    // Store authentication state
                                    sessionStorage.setItem('adminAuth', 'authenticated');
                                    navigate('/requisitions-admin');
                                }}
                            >
                                Manage Requisitions
                                <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
                            </button>
                        </div>
                    </div>

                    {/* 4. Bible Study Administration */}
                    <div className={styles.functionCard}>
                        <div className={styles.functionNumber}>4</div>
                        <div className={styles.functionContent}>
                            <h3>
                                <FontAwesomeIcon icon={faBookOpen} />
                                Bible Study Administration
                            </h3>
                            <p>Manage Bible study registrations, residences, and create balanced groups</p>
                            <button
                                className={styles.functionButton}
                                onClick={() => {
                                    // Store authentication state
                                    sessionStorage.setItem('adminAuth', 'authenticated');
                                    navigate('/adminBs');
                                }}
                            >
                                Bible Study Admin
                                <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
                            </button>
                        </div>
                    </div>

                    {/* 5. Compassion & Counseling Administration */}
                    <div className={styles.functionCard}>
                        <div className={styles.functionNumber}>5</div>
                        <div className={styles.functionContent}>
                            <h3>
                                <FontAwesomeIcon icon={faHeart} />
                                Compassion & Counseling Administration
                            </h3>
                            <p>Manage help requests, donations, and support those in need</p>
                            <button
                                className={styles.functionButton}
                                onClick={() => {
                                    // Store authentication state
                                    sessionStorage.setItem('adminAuth', 'authenticated');
                                    navigate('/compassion-counseling-admin');
                                }}
                            >
                                Compassion Admin
                                <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
                            </button>
                        </div>
                    </div>

                    {/* 6. Leadership Attendance Management */}
                    <div className={styles.functionCard}>
                        <div className={styles.functionNumber}>6</div>
                        <div className={styles.functionContent}>
                            <h3>
                                <FontAwesomeIcon icon={faUsers} />
                                Multi-Session Attendance
                            </h3>
                            <p>Create and manage multiple shareable attendance sessions with custom titles and durations.</p>
                            <button
                                className={styles.functionButton}
                                onClick={handleRoleSelection}
                                disabled={selectedRole !== ''}
                            >
                                Open Attendance Manager
                                <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
                            </button>
                        </div>
                    </div>

                    {/* 7. Community Chat Management */}
                    <div className={styles.functionCard}>
                        <div className={styles.functionNumber}>7</div>
                        <div className={styles.functionContent}>
                            <h3>
                                <FontAwesomeIcon icon={faComments} />
                                Community Chat Management
                            </h3>
                            <p>Manage the KSUCU-MC community chat: moderate messages, ban users, and oversee chat activity</p>
                            <button
                                className={styles.functionButton}
                                onClick={() => {
                                    // Store authentication state
                                    sessionStorage.setItem('adminAuth', 'authenticated');
                                    navigate('/chat-admin');
                                }}
                            >
                                Chat Admin
                                <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
                            </button>
                        </div>
                    </div>

                </div>

                {/* News Display Section - Moved to bottom */}
                <div className={styles.newsDisplaySection}>
                    <div className={styles.newsDisplayCard}>
                        <h2>
                            <FontAwesomeIcon icon={faNewspaper} />
                            Latest News & Upcoming Events
                        </h2>
                        <p className={styles.newsDescription}>
                            Current news updates and countdown to upcoming events
                        </p>
                        <div className={styles.newsDisplayContainer}>
                            <ModernNewsDisplay />
                        </div>
                    </div>
                </div>

                {selectedRole && (
                    <div className={styles.loadingSection}>
                        <div className={styles.loadingMessage}>
                            <FontAwesomeIcon icon={faUsers} className={styles.loadingIcon} />
                            <h3>Loading attendance management for {selectedRole}...</h3>
                            <p>Preparing session controls and attendance records...</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default WorshipDocketAdmin;