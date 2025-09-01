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
    faClock
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

                {/* News and Countdown Display Section */}
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

                {/* Media Management Section */}
                <div className={styles.mediaManagementSection}>
                    <div className={styles.selectionCard}>
                        <h2>
                            <FontAwesomeIcon icon={faUsers} />
                            Media Management
                        </h2>
                        <p className={styles.leadershipDescription}>
                            Manage photos and media for the KSUCU website gallery
                        </p>
                        <button 
                            className={styles.mediaManagementButton}
                            onClick={() => window.location.href = '/media-admin'}
                        >
                            Manage Media Gallery
                            <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
                        </button>
                    </div>
                </div>

                {/* News Management Section */}
                <div className={styles.newsManagementSection}>
                    <div className={styles.selectionCard}>
                        <h2>
                            <FontAwesomeIcon icon={faUsers} />
                            News Administration
                        </h2>
                        <p className={styles.leadershipDescription}>
                            Update news, manage events with countdown timers, and add photos
                        </p>
                        <button 
                            className={styles.newsManagementButton}
                            onClick={() => window.location.href = '/news-admin'}
                        >
                            News Admin
                            <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
                        </button>
                    </div>
                </div>

                {/* Leadership Role Selection Section */}
                <div className={styles.leadershipSelection}>
                    <div className={styles.selectionCard}>
                        <h2>
                            <FontAwesomeIcon icon={faUsers} />
                            Select Your Leadership Role
                        </h2>
                        <p className={styles.leadershipDescription}>
                            Choose your position to access centralized attendance management for all KSUCU members
                        </p>
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