import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/signin.module.css';
import cuLogo from '../assets/KSUCU logo updated document.png';
import axios from 'axios';
import { getApiUrl } from '../config/environment';
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
}

interface UserProfileProps {
    userData: UserData;
    isLoading: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ userData, isLoading }) => {
    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleContinueToKSUCUMC = () => {
        navigate('/');
    };

    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            console.log('Starting logout process...');
            
            // Call logout API
            const response = await axios.post(getApiUrl('usersLogout'), {}, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Logout API response:', response);
            
            // Clear cookies more thoroughly
            const cookiesToClear = ['loginToken', 'sessionToken', 'authToken', 'token'];
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
            
            // Show success message briefly before redirecting
            setSuccessMessage('Successfully logged out!');
            setTimeout(() => {
                navigate('/signIn', { replace: true });
            }, 1000);
            
        } catch (error: any) {
            console.error('Logout API error:', error);
            
            // Even if API fails, clear local data and redirect
            const cookiesToClear = ['loginToken', 'sessionToken', 'authToken', 'token'];
            cookiesToClear.forEach(cookieName => {
                Cookies.remove(cookieName);
                Cookies.remove(cookieName, { path: '/' });
                Cookies.remove(cookieName, { domain: window.location.hostname });
                Cookies.remove(cookieName, { domain: `.${window.location.hostname}` });
            });
            
            document.cookie.split(";").forEach((cookie) => {
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
            });
            
            localStorage.clear();
            sessionStorage.clear();
            
            setSuccessMessage('Logged out successfully!');
            setTimeout(() => {
                navigate('/signIn', { replace: true });
            }, 1000);
        } finally {
            setLoggingOut(false);
        }
    };


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
        <>
            <style>
                {`
                    @media (max-width: 768px) {
                        .profile-grid {
                            grid-template-columns: 1fr !important;
                        }
                    }
                `}
            </style>
            <div className={styles.container} style={{ 
                maxHeight: '95vh',
                overflowY: 'auto',
                padding: '15px 20px',
                margin: '10px'
            }}>
            <Link to={"/"} className={styles.logo_div}>
                <div className={styles['logo_signUp']} style={{ marginBottom: '10px' }}>
                    <img src={cuLogo} alt="CU logo" style={{ height: '60px' }} />
                </div>
            </Link>

            <h2 className={styles.text} style={{ margin: '5px 0 10px 0', fontSize: '1.3rem' }}>Welcome back, {userData.username}!</h2>
            
            {/* Success Message */}
            {successMessage && (
                <div style={{ 
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    border: '1px solid #c3e6cb',
                    padding: '8px',
                    borderRadius: '5px',
                    marginBottom: '10px',
                    textAlign: 'center',
                    fontSize: '14px'
                }}>
                    {successMessage}
                </div>
            )}
            
            {/* Continue to KSUCUMC Button */}
            <div style={{ textAlign: 'center', margin: '10px 0' }}>
                <button 
                    onClick={handleContinueToKSUCUMC}
                    style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '10px 25px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,123,255,0.3)',
                        transition: 'all 0.3s ease',
                        minWidth: '180px'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#0056b3';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 3px 6px rgba(0,123,255,0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#007bff';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,123,255,0.3)';
                    }}
                >
                    Continue to KSUCUMC
                </button>
            </div>
            
            {/* Small Logout Button */}
            <div style={{ textAlign: 'center', margin: '5px 0 15px 0' }}>
                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500',
                        cursor: loggingOut ? 'not-allowed' : 'pointer',
                        opacity: loggingOut ? 0.6 : 1,
                        transition: 'all 0.3s ease',
                        boxShadow: '0 1px 3px rgba(220, 53, 69, 0.3)',
                        minWidth: '70px'
                    }}
                    onMouseOver={(e) => {
                        if (!loggingOut) {
                            e.currentTarget.style.backgroundColor = '#c82333';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc3545';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    {loggingOut ? 'Logging out...' : 'Log out'}
                </button>
            </div>
            
            <div className={styles.form} style={{ margin: '5px 0' }}>
                <div className={styles['user-details']}>
                    <h3 style={{ marginBottom: '8px', color: '#2c3e50', fontSize: '1.1rem' }}>Your Profile</h3>
                    
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '6px', 
                        fontSize: '13px' 
                    }} className="profile-grid">
                        <div className={styles['detail-item']} style={{ padding: '5px 8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                            <strong>Name:</strong><br />{userData.username}
                        </div>
                        
                        <div className={styles['detail-item']} style={{ padding: '5px 8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                            <strong>Email:</strong><br />{userData.email}
                        </div>
                        
                        <div className={styles['detail-item']} style={{ padding: '5px 8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                            <strong>Phone:</strong><br />{userData.phone}
                        </div>
                        
                        <div className={styles['detail-item']} style={{ padding: '5px 8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                            <strong>Year of Study:</strong><br />Year {userData.yos}
                        </div>
                        
                        <div className={styles['detail-item']} style={{ padding: '5px 8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                            <strong>Evangelistic Team:</strong><br />{userData.et}
                        </div>
                        
                        <div className={styles['detail-item']} style={{ padding: '5px 8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                            <strong>Ministry:</strong><br />{userData.ministry}
                        </div>

                        {userData.course && (
                            <div className={styles['detail-item']} style={{ padding: '5px 8px', backgroundColor: '#f8f9fa', borderRadius: '4px', gridColumn: '1 / -1' }}>
                                <strong>Course:</strong><br />{userData.course}
                            </div>
                        )}

                        {userData.reg && (
                            <div className={styles['detail-item']} style={{ padding: '5px 8px', backgroundColor: '#f8f9fa', borderRadius: '4px', gridColumn: '1 / -1' }}>
                                <strong>Registration:</strong><br />{userData.reg}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Details button */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginTop: '10px',
                marginBottom: '10px'
            }}>
                <Link 
                    to="/changeDetails" 
                    style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '8px 16px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(40,167,69,0.3)',
                        transition: 'all 0.3s ease',
                        minWidth: '100px',
                        textAlign: 'center',
                        display: 'inline-block'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#218838';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 3px 6px rgba(40,167,69,0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#28a745';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(40,167,69,0.3)';
                    }}
                >
                    Edit Details
                </Link>
            </div>
        </div>
        </>
    );
};

export default UserProfile;