import React from 'react';
import { Link } from 'react-router-dom';
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
            
            <div className={styles.form}>
                <div className={styles['user-details']}>
                    <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Your Details</h3>
                    
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

            <div className={styles.submisions}>
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

            <div className={styles['form-footer']}>
                <p><Link to="/">Home</Link></p>
            </div>
        </div>
    );
};

export default UserProfile;