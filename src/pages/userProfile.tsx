import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/signin.module.css';
import cuLogo from '../assets/KSUCU logo updated document.png';
import loadingAnime from '../assets/Animation - 1716747954931.gif';
import { getApiUrl } from '../config/environment';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';

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

    const handleContinueToKSUCUMC = () => {
        navigate('/');
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
            <>
                <UniversalHeader />
                <div className={styles.container}>
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <img src={loadingAnime} alt="Loading..." className={styles['loading-gif']} />
                        <p>Loading your profile...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !userData) {
        return (
            <>
                <UniversalHeader />
                <div className={styles.container}>
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <p>Failed to load profile. <Link to="/signIn">Please login again</Link></p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <UniversalHeader />
            <div className={styles.body} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                <div className={styles.container} style={{ margin: '10px auto', maxWidth: '90vw', maxHeight: '95vh', overflowY: 'auto' }}>
                <Link to={"/"} className={styles.logo_div} style={{ marginTop: '10px' }}>
                    <div className={styles['logo_signUp']} style={{ width: '80px', height: '80px' }}>
                        <img src={cuLogo} alt="CU logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                </Link>

                <h2 className={styles.text} style={{ marginTop: '10px', marginBottom: '15px', fontSize: '1.3rem' }}>Welcome back, {userData.username}!</h2>
                
                {/* Continue to KSUCUMC Button */}
                <div style={{ textAlign: 'center', margin: '15px 0' }}>
                    <button 
                        onClick={handleContinueToKSUCUMC}
                        style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '12px 30px',
                            borderRadius: '25px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 3px 6px rgba(0,123,255,0.3)',
                            transition: 'all 0.3s ease',
                            minWidth: '200px'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#0056b3';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,123,255,0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#007bff';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 3px 6px rgba(0,123,255,0.3)';
                        }}
                    >
                        Continue to KSUCUMC
                    </button>
                </div>
                
                <div className={styles.form} style={{ marginBottom: '15px' }}>
                    <div className={styles['user-details']} style={{ padding: '8px' }}>
                        <h3 style={{ marginBottom: '15px', color: '#2c3e50', textAlign: 'center', fontSize: '1.1rem' }}>Your Profile</h3>
                        
                        <div style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #dee2e6' }}>
                            <strong style={{ color: '#495057', fontSize: '13px' }}>Name:</strong>
                            <div style={{ marginTop: '3px', fontSize: '14px' }}>{userData.username}</div>
                        </div>
                        
                        <div style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #dee2e6' }}>
                            <strong style={{ color: '#495057', fontSize: '13px' }}>Email:</strong>
                            <div style={{ marginTop: '3px', fontSize: '14px' }}>{userData.email}</div>
                        </div>
                        
                        <div style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #dee2e6' }}>
                            <strong style={{ color: '#495057', fontSize: '13px' }}>Phone:</strong>
                            <div style={{ marginTop: '3px', fontSize: '14px' }}>{userData.phone}</div>
                        </div>
                        
                        <div style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #dee2e6' }}>
                            <strong style={{ color: '#495057', fontSize: '13px' }}>Year of Study:</strong>
                            <div style={{ marginTop: '3px', fontSize: '14px' }}>Year {userData.yos}</div>
                        </div>
                        
                        <div style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #dee2e6' }}>
                            <strong style={{ color: '#495057', fontSize: '13px' }}>Evangelistic Team:</strong>
                            <div style={{ marginTop: '3px', fontSize: '14px' }}>{userData.et}</div>
                        </div>
                        
                        <div style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #dee2e6' }}>
                            <strong style={{ color: '#495057', fontSize: '13px' }}>Ministry:</strong>
                            <div style={{ marginTop: '3px', fontSize: '14px' }}>{userData.ministry}</div>
                        </div>

                        {userData.course && (
                            <div style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #dee2e6' }}>
                                <strong style={{ color: '#495057', fontSize: '13px' }}>Course:</strong>
                                <div style={{ marginTop: '3px', fontSize: '14px' }}>{userData.course}</div>
                            </div>
                        )}

                        {userData.reg && (
                            <div style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #dee2e6' }}>
                                <strong style={{ color: '#495057', fontSize: '13px' }}>Registration:</strong>
                                <div style={{ marginTop: '3px', fontSize: '14px' }}>{userData.reg}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Edit Details and Log Out buttons on the same row */}
                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    justifyContent: 'center', 
                    marginTop: '15px',
                    marginBottom: '15px',
                    flexWrap: 'wrap'
                }}>
                    <Link 
                        to="/changeDetails" 
                        style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            textDecoration: 'none',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '13px',
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
                    <button 
                        onClick={handleLogout}
                        style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(220,53,69,0.3)',
                            transition: 'all 0.3s ease',
                            minWidth: '100px'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#c82333';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 3px 6px rgba(220,53,69,0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#dc3545';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(220,53,69,0.3)';
                        }}
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
};

export default UserProfilePage;