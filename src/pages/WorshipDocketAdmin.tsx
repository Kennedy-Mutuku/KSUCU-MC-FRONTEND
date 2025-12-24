import React, { useState } from 'react';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import ModernNewsDisplay from '../components/ModernNewsDisplay';
import styles from '../styles/worshipDocketAdmin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUsers, 
    faCheckCircle,
    faArrowRight,
    faNewspaper,
    faBox,
    faBookOpen,
    faHeart
} from '@fortawesome/free-solid-svg-icons';

const WorshipDocketAdmin: React.FC = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [message, setMessage] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('');

    const handleLogin = () => {
        if (password === 'Overseer') {
            setAuthenticated(true);
            setAuthError('');
            setMessage('Successfully logged in to Leadership Admin');
            setTimeout(() => setMessage(''), 3000);
        } else {
            setAuthError('Invalid password');
            setTimeout(() => setAuthError(''), 3000);
        }
        setPassword('');
    };

    const leadershipRoles = [
        'Chairperson',
        'Vice Chairperson',
        'Secretary', 
        'Treasurer',
        'Publicity Secretary',
        'Worship Coordinator',
        'Bible Study Coordinator',
        'Discipleship Coordinator',
        'Prayer Coordinator',
        'Missions Coordinator',
        'Boards Coordinator'
    ];

    const handleRoleSelection = (role: string) => {
        setSelectedRole(role);
        setMessage(`Selected: ${role} - Redirecting to attendance management...`);
        setTimeout(() => {
            // Store authentication state
            sessionStorage.setItem('adminAuth', 'Overseer');
            sessionStorage.setItem('leadershipRole', role);
            // This will redirect to the session management page
            window.location.href = `/attendance-session-management?role=${encodeURIComponent(role)}`;
        }, 1500);
    };

    if (!authenticated) {
        return (
            <>
                <UniversalHeader />
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
                <Footer />
            </>
        );
    }

    return (
        <>
                  <UniversalHeader />
            <div className={styles.container}>
                <div className={styles.adminHeader}>
                    <h1>
                        <FontAwesomeIcon icon={faUsers} />
                        Leadership Attendance Administration
                    </h1>
                    <p>Select your leadership role to manage centralized attendance</p>
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
                                    sessionStorage.setItem('adminAuth', 'Overseer');
                                    window.location.href = '/news-admin';
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
                                    sessionStorage.setItem('adminAuth', 'Overseer');
                                    window.location.href = '/media-admin';
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
                                    sessionStorage.setItem('adminAuth', 'Overseer');
                                    window.location.href = '/requisitions-admin';
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
                                    sessionStorage.setItem('adminAuth', 'Overseer');
                                    window.location.href = '/adminBs';
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
                                    sessionStorage.setItem('adminAuth', 'Overseer');
                                    window.location.href = '/compassion-counseling-admin';
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
                                Leadership Attendance Management
                            </h3>
                            <p>Select your leadership role to access centralized attendance management</p>
                            <div className={styles.leadershipRoleGrid}>
                                {leadershipRoles.map((role) => (
                                    <button 
                                        key={role}
                                        className={styles.leadershipRoleButton}
                                        onClick={() => handleRoleSelection(role)}
                                        disabled={selectedRole !== ''}
                                    >
                                        {role}
                                        <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
                                    </button>
                                ))}
                            </div>
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
            <Footer />
        </>
    );
};

export default WorshipDocketAdmin;