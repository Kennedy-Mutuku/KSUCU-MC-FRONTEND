import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/signin.module.css';
import cuLogo from '../assets/KSUCU logo updated document.png';
import loadingAnime from '../assets/Animation - 1716747954931.gif';
import { getApiUrl } from '../config/environment';

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

const UserProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        console.log('📋 Profile: Starting to fetch user data...');
        try {
            const apiUrl = getApiUrl('users');
            console.log('📋 Profile: Fetching from:', apiUrl);
            
            const response = await fetch(apiUrl, {
                credentials: 'include'
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

    const handleLogout = async () => {
        try {
            const response = await fetch(getApiUrl('usersLogout'), {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                navigate('/');
            }
        } catch (error) {
            console.error('Logout failed:', error);
            // Still navigate away even if logout fails
            navigate('/');
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <img src={loadingAnime} alt="Loading..." className={styles['loading-gif']} />
                    <p>Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (error || !userData) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Failed to load profile. <Link to="/signIn">Please login again</Link></p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.body} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
            <div className={styles.container} style={{ margin: '20px auto', maxHeight: '90vh', overflowY: 'auto' }}>
                <Link to={"/"} className={styles.logo_div} style={{ marginTop: '20px' }}>
                    <div className={styles['logo_signUp']}>
                        <img src={cuLogo} alt="CU logo" />
                    </div>
                </Link>

                <h2 className={styles.text} style={{ marginTop: '20px', marginBottom: '20px' }}>Welcome back, {userData.username}!</h2>
                
                <div className={styles.form} style={{ marginBottom: '20px' }}>
                    <div className={styles['user-details']} style={{ padding: '10px' }}>
                        <h3 style={{ marginBottom: '20px', color: '#2c3e50', textAlign: 'center' }}>Your Profile</h3>
                        
                        <div style={{ marginBottom: '15px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                            <strong style={{ color: '#495057' }}>Name:</strong>
                            <div style={{ marginTop: '5px', fontSize: '16px' }}>{userData.username}</div>
                        </div>
                        
                        <div style={{ marginBottom: '15px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                            <strong style={{ color: '#495057' }}>Email:</strong>
                            <div style={{ marginTop: '5px', fontSize: '16px' }}>{userData.email}</div>
                        </div>
                        
                        <div style={{ marginBottom: '15px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                            <strong style={{ color: '#495057' }}>Phone:</strong>
                            <div style={{ marginTop: '5px', fontSize: '16px' }}>{userData.phone}</div>
                        </div>
                        
                        <div style={{ marginBottom: '15px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                            <strong style={{ color: '#495057' }}>Year of Study:</strong>
                            <div style={{ marginTop: '5px', fontSize: '16px' }}>Year {userData.yos}</div>
                        </div>
                        
                        <div style={{ marginBottom: '15px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                            <strong style={{ color: '#495057' }}>Evangelistic Team:</strong>
                            <div style={{ marginTop: '5px', fontSize: '16px' }}>{userData.et}</div>
                        </div>
                        
                        <div style={{ marginBottom: '15px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                            <strong style={{ color: '#495057' }}>Ministry:</strong>
                            <div style={{ marginTop: '5px', fontSize: '16px' }}>{userData.ministry}</div>
                        </div>

                        {userData.course && (
                            <div style={{ marginBottom: '15px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                                <strong style={{ color: '#495057' }}>Course:</strong>
                                <div style={{ marginTop: '5px', fontSize: '16px' }}>{userData.course}</div>
                            </div>
                        )}

                        {userData.reg && (
                            <div style={{ marginBottom: '15px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                                <strong style={{ color: '#495057' }}>Registration:</strong>
                                <div style={{ marginTop: '5px', fontSize: '16px' }}>{userData.reg}</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.submisions} style={{ marginTop: '20px', marginBottom: '20px' }}>
                    <Link to="/changeDetails" className={styles.clearForm}>
                        Edit Details
                    </Link>
                    <button 
                        className={styles.submitData} 
                        onClick={handleLogout}
                        style={{ border: 'none', cursor: 'pointer' }}
                    >
                        Logout
                    </button>
                </div>

                <div className={styles['form-footer']} style={{ marginBottom: '20px' }}>
                    <p><Link to="/">Back to Home</Link></p>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;