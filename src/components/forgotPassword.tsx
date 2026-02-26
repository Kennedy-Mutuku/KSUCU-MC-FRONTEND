import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/signin.module.css';
import cuLogo from '../assets/cuLogoUAR.png';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../config/environment';

const Forgotpassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async () => {
        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            await axios.post(getApiUrl('usersForgetPassword'), {
                email: email.trim().toLowerCase()
            });

            setSuccessMessage('Password reset link has been sent to your email. Please check your inbox.');
            setEmail('');
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError('No account found with this email address.');
            } else {
                setError(err.response?.data?.message || 'Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (successMessage) {
        return (
            <div className={styles.body}>
                <div className={styles['container']}>
                    <Link to={"/"}>
                        <div className={styles['logo_signUp']}><img src={cuLogo} alt="CU logo" /></div>
                    </Link>

                    <div style={{
                        background: '#dcfce7',
                        border: '2px solid #16a34a',
                        borderRadius: '12px',
                        padding: '25px',
                        textAlign: 'center',
                        marginTop: '20px'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '15px' }}>✅</div>
                        <h2 style={{ color: '#166534', marginBottom: '15px' }}>Check Your Email</h2>
                        <p style={{ color: '#166534', marginBottom: '20px', fontSize: '14px' }}>
                            {successMessage}
                        </p>
                        <p style={{ color: '#555', fontSize: '13px', marginBottom: '20px' }}>
                            Tip: Your default password is your phone number
                        </p>

                        <Link
                            to="/signIn"
                            style={{
                                display: 'inline-block',
                                background: '#730051',
                                color: 'white',
                                padding: '12px 30px',
                                borderRadius: '25px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '16px'
                            }}
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.body}>
            <div className={styles['container']}>
                <Link to={"/"}>
                    <div className={styles['logo_signUp']}><img src={cuLogo} alt="CU logo" /></div>
                </Link>
                <h2 className={styles['text']}>Forgot Password?</h2>

                <p style={{
                    fontSize: '13px',
                    color: '#777',
                    textAlign: 'center',
                    marginBottom: '20px',
                    padding: '0 20px'
                }}>
                    Enter your email and we'll send you a password reset link
                </p>

                {error && <p className={styles.error}>{error}</p>}

                <form action="" className={styles['form']}>
                    <div className={styles['form-div']}>
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            className={styles['input']}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your registered email"
                            required
                        />
                    </div>
                </form>

                <div className={styles['submisions']}>
                    <div className={styles['clearForm']} onClick={() => { setEmail(''); setError(''); }}>Clear</div>
                    <div
                        className={styles['submitData']}
                        onClick={loading ? undefined : handleSubmit}
                        style={{ opacity: loading ? 0.7 : 1, pointerEvents: loading ? 'none' : 'auto' }}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </div>
                </div>

                <p style={{ fontSize: '12px', color: '#555', textAlign: 'center', marginTop: '10px' }}>
                    Tip: Your default password is your phone number
                </p>

                <div className={styles['form-footer']}>
                    <p><Link to={"/signIn"}>← Back to Login</Link></p>
                </div>

                <div className={styles['signup-link']}>
                    <p>Don't have an account? <Link to={"/signUp"} className={styles['register-link']}>Register here</Link></p>
                </div>

            </div>
        </div>
    );
};

export default Forgotpassword;
