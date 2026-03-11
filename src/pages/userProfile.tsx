import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/signin.module.css';
import cuLogo from '../assets/KSUCU logo updated document.png';
import loadingAnime from '../assets/Animation - 1716747954931.gif';
import { getApiUrl } from '../config/environment';
import axios from 'axios';
import Cookies from 'js-cookie';

interface UserData {
    username: string;
    email: string;
    yos: number;
    phone: string;
    et: string;
    ministry: string;
    course?: string;
    reg?: string;
    role?: string;
    graduationYear?: number;
}

const UserProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [loggingOut, setLoggingOut] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (!loading && userData) {
            const timer = setTimeout(() => {
                navigate('/');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [navigate, loading, userData]);

    const fetchUserData = async () => {
        console.log('📋 Profile: Starting to fetch user data...');
        try {
            const apiUrl = getApiUrl('users');
            console.log('📋 Profile: Fetching from:', apiUrl);

            const response = await fetch(apiUrl, {
                credentials: 'include', // This ensures cookies are sent with the request
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('📋 Profile: Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Profile: User data received:', data);
                setUserData(data);
            } else {
                console.log('❌ Profile: User not authenticated, redirecting to login');
                // User not authenticated, redirect to login
                navigate('/signIn');
            }
        } catch (error) {
            console.error('❌ Profile: Failed to fetch user data:', error);
            setError('Failed to load profile data');
            // Redirect to login on error
            navigate('/signIn');
        } finally {
            console.log('📋 Profile: Finished loading, setting loading to false');
            setLoading(false);
        }
    };

    const handleContinueToKSUCUMC = () => {
        navigate('/');
    };

    const handleLogout = async () => {
        try {
            // window.alert('Starting logout...'); // Uncomment for debugging
            setLoggingOut(true);
            console.log('Starting logout process...');

            // Call logout API
            try {
                const response = await axios.post(getApiUrl('usersLogout'), {}, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Logout API response:', response);
            } catch (apiError) {
                console.warn('Logout API failed, proceeding with local cleanup:', apiError);
            }

            // Clear cookies more thoroughly
            const cookiesToClear = ['loginToken', 'sessionToken', 'authToken', 'token', 'socket_token', 'user_s'];
            cookiesToClear.forEach(cookieName => {
                Cookies.remove(cookieName);
                Cookies.remove(cookieName, { path: '/' });
                Cookies.remove(cookieName, { domain: window.location.hostname });
                Cookies.remove(cookieName, { domain: `.${window.location.hostname}` });
            });

            // Clear all cookies fallback
            document.cookie.split(";").forEach((cookie) => {
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
            });

            // Clear local storage and session storage
            localStorage.clear();
            sessionStorage.clear();

            console.log('Logout successful, redirecting to login...');

            // Show success message
            setSuccessMessage('Successfully logged out!');
            // window.alert('Logged out successfully!'); // Uncomment for debugging

            setTimeout(() => {
                navigate('/signIn', { replace: true });
            }, 500);

        } catch (error: any) {
            console.error('Logout script error:', error);
            // Even on error, force cleanup
            localStorage.clear();
            sessionStorage.clear();
            navigate('/signIn', { replace: true });
        } finally {
            setLoggingOut(false);
        }
    };


    if (loading) {
        return (
            <>
                <div className={styles.container}>
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <img src={loadingAnime} alt="Loading..." className={styles['loading-gif']} />
                        <p>Loading your profile...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error || !userData) {
        return (
            <>
                <div className={styles.container}>
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <p>Failed to load profile. <Link to="/signIn">Please login again</Link></p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className={styles.body} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', backgroundAttachment: 'fixed', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                <div className={styles.container} style={{ margin: '10px auto', maxWidth: '90vw', maxHeight: '95vh', overflowY: 'auto' }}>
                    <Link to={"/"} className={styles.logo_div} style={{ marginTop: '10px' }}>
                        <div className={styles['logo_signUp']} style={{ width: '80px', height: '80px' }}>
                            <img src={cuLogo} alt="CU logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                    </Link>

                    <h2 className={styles.text} style={{ marginTop: '10px', marginBottom: '10px', fontSize: '1.6rem', color: '#730051', textAlign: 'center' }}>
                        Welcome back, {userData.username}!
                    </h2>

                    <p style={{
                        color: '#666',
                        fontSize: '0.9rem',
                        marginTop: '15px',
                        textAlign: 'center',
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
            </div>
        </>
    );
};

export default UserProfilePage;