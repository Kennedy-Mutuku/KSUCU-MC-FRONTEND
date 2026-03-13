import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/signin.module.css';
import cuLogo from '../assets/KSUCU logo updated document.png';

interface UserData {
    username: string;
    email: string;
    yos: number;
    phone: string;
    et: string;
    ministry: string;
    course?: string;
    reg?: string;
}

interface UserProfileProps {
    userData: UserData;
    isLoading: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ userData, isLoading }) => {
    const navigate = useNavigate();

    // Auto-redirect to home after 3 seconds
    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => {
                navigate('/');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [navigate, isLoading]);

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container} style={{
            maxHeight: '95vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            margin: '10px',
            minHeight: '40vh'
        }}>
            <div className={styles['logo_signUp']} style={{ marginBottom: '20px' }}>
                <img src={cuLogo} alt="CU logo" style={{ height: '80px' }} />
            </div>

            <h2 className={styles.text} style={{
                margin: '10px 0',
                fontSize: '1.6rem',
                color: '#730051',
                textAlign: 'center'
            }}>
                Welcome back, {userData.username}!
            </h2>

            <p style={{
                color: '#666',
                fontSize: '0.9rem',
                marginTop: '15px',
                animation: 'pulse 2s infinite'
            }}>
                Redirecting you...
            </p>

            <style>
                {`
                    @keyframes pulse {
                        0% { opacity: 0.6; }
                        50% { opacity: 1; }
                        100% { opacity: 0.6; }
                    }
                `}
            </style>
        </div>
    );
};

export default UserProfile;