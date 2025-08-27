import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/signin.module.css';
import cuLogo from '../assets/KSUCU logo updated document.png';
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

interface UserProfileProps {
    userData: UserData;
    onLogout: () => void;
    isLoading: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ userData, onLogout, isLoading }) => {
    const navigate = useNavigate();

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
                onLogout();
            }
        } catch (error) {
            console.error('Logout failed:', error);
            // Still call onLogout to clear local state
            onLogout();
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
        <div className={styles.container}>
            <Link to={"/"} className={styles.logo_div}>
                <div className={styles['logo_signUp']}>
                    <img src={cuLogo} alt="CU logo" />
                </div>
            </Link>

            <h2 className={styles.text}>Welcome back, {userData.username}!</h2>
            
            {/* Continue to KSUCUMC Button */}
            <div style={{ textAlign: 'center', margin: '30px 0' }}>
                <button 
                    onClick={handleContinueToKSUCUMC}
                    style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '15px 40px',
                        borderRadius: '50px',
                        fontSize: '18px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 4px 8px rgba(0,123,255,0.3)',
                        transition: 'all 0.3s ease',
                        minWidth: '250px'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#0056b3';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,123,255,0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#007bff';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,123,255,0.3)';
                    }}
                >
                    Continue to KSUCUMC
                </button>
            </div>
            
            <div className={styles.form}>
                <div className={styles['user-details']}>
                    <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Your Profile</h3>
                    
                    <div className={styles['detail-item']} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                        <strong>Name:</strong> {userData.username}
                    </div>
                    
                    <div className={styles['detail-item']} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                        <strong>Email:</strong> {userData.email}
                    </div>
                    
                    <div className={styles['detail-item']} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                        <strong>Phone:</strong> {userData.phone}
                    </div>
                    
                    <div className={styles['detail-item']} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                        <strong>Year of Study:</strong> {userData.yos}
                    </div>
                    
                    <div className={styles['detail-item']} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                        <strong>Evangelistic Team:</strong> {userData.et}
                    </div>
                    
                    <div className={styles['detail-item']} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                        <strong>Ministry:</strong> {userData.ministry}
                    </div>

                    {userData.course && (
                        <div className={styles['detail-item']} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                            <strong>Course:</strong> {userData.course}
                        </div>
                    )}

                    {userData.reg && (
                        <div className={styles['detail-item']} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                            <strong>Registration:</strong> {userData.reg}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Details and Log Out buttons on the same row */}
            <div style={{ 
                display: 'flex', 
                gap: '15px', 
                justifyContent: 'center', 
                marginTop: '30px',
                flexWrap: 'wrap'
            }}>
                <Link 
                    to="/changeDetails" 
                    style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '12px 25px',
                        borderRadius: '25px',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        boxShadow: '0 3px 6px rgba(40,167,69,0.3)',
                        transition: 'all 0.3s ease',
                        minWidth: '140px',
                        textAlign: 'center',
                        display: 'inline-block'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#218838';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(40,167,69,0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#28a745';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 3px 6px rgba(40,167,69,0.3)';
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
                        padding: '12px 25px',
                        borderRadius: '25px',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        boxShadow: '0 3px 6px rgba(220,53,69,0.3)',
                        transition: 'all 0.3s ease',
                        minWidth: '140px'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#c82333';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(220,53,69,0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc3545';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 3px 6px rgba(220,53,69,0.3)';
                    }}
                >
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default UserProfile;