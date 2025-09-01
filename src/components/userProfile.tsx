import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

    const handleContinueToKSUCUMC = () => {
        navigate('/');
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
                <div className={styles['logo_signUp']} style={{ marginBottom: '10px' }}>
                    <img src={cuLogo} alt="CU logo" style={{ height: '8vh' }} />
                </div>
            </Link>

            <h2 className={styles.text} style={{ margin: '10px 0 15px 0', fontSize: '1.5rem' }}>Welcome back, {userData.username}!</h2>
            
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
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 3px 6px rgba(0,123,255,0.3)',
                        transition: 'all 0.3s ease',
                        minWidth: '200px'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#0056b3';
                        e.currentTarget.style.transform = 'translateY(-2px)';
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
            
            <div className={styles.form} style={{ marginTop: '10px' }}>
                <div className={styles['user-details']}>
                    <h3 style={{ marginBottom: '10px', color: '#2c3e50', fontSize: '1.2rem' }}>Your Profile</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
                        <div className={styles['detail-item']} style={{ padding: '6px 8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                            <strong>Name:</strong> {userData.username}
                        </div>
                        
                        <div className={styles['detail-item']} style={{ padding: '6px 8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                            <strong>Year:</strong> {userData.yos}
                        </div>
                        
                        <div className={styles['detail-item']} style={{ padding: '6px 8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                            <strong>Phone:</strong> {userData.phone}
                        </div>
                        
                        <div className={styles['detail-item']} style={{ padding: '6px 8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                            <strong>ET:</strong> {userData.et}
                        </div>
                        
                        <div className={styles['detail-item']} style={{ padding: '6px 8px', backgroundColor: '#f8f9fa', borderRadius: '4px', gridColumn: '1 / -1' }}>
                            <strong>Email:</strong> {userData.email}
                        </div>
                        
                        <div className={styles['detail-item']} style={{ padding: '6px 8px', backgroundColor: '#f8f9fa', borderRadius: '4px', gridColumn: '1 / -1' }}>
                            <strong>Ministry:</strong> {userData.ministry}
                        </div>

                        {userData.course && (
                            <div className={styles['detail-item']} style={{ padding: '6px 8px', backgroundColor: '#f8f9fa', borderRadius: '4px', gridColumn: '1 / -1' }}>
                                <strong>Course:</strong> {userData.course}
                            </div>
                        )}

                        {userData.reg && (
                            <div className={styles['detail-item']} style={{ padding: '6px 8px', backgroundColor: '#f8f9fa', borderRadius: '4px', gridColumn: '1 / -1' }}>
                                <strong>Registration:</strong> {userData.reg}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Details button */}
            <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'center', 
                marginTop: '20px',
                flexWrap: 'wrap'
            }}>
                <Link 
                    to="/changeDetails" 
                    style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(40,167,69,0.3)',
                        transition: 'all 0.3s ease',
                        minWidth: '120px',
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
    );
};

export default UserProfile;