import React, { useState } from 'react';
import styles from '../styles/signin.module.css';
import cuLogo from '../assets/cuLogoUAR.png';
import { Link } from 'react-router-dom';

const Forgotpassword: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        regNumber: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleWhatsAppRedirect = () => {
        if (!formData.name.trim() || !formData.regNumber.trim()) {
            setError('Please fill in all fields');
            return;
        }

        const message = `Hello admin, I am ${formData.name.trim()}, of reg no ${formData.regNumber.trim()}, kindly help me in resetting my KSUCU MC password.`;
        const encodedMessage = encodeURIComponent(message);

        // Open both WhatsApp windows - 0717481883 first, then 0740881485
        window.open(`https://wa.me/254717481883?text=${encodedMessage}`, '_blank');
        window.open(`https://wa.me/254740881485?text=${encodedMessage}`, '_blank');

        setError('');
    };

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
                    Enter your details to request password reset from admin
                </p>

                {error && <p className={styles.error}>{error}</p>}

                <form action="" className={styles['form']}>
                    <div className={styles['form-div']}>
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            className={styles['input']}
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className={styles['form-div']}>
                        <label htmlFor="regNumber">Reg Number</label>
                        <input
                            type="text"
                            id="regNumber"
                            className={styles['input']}
                            value={formData.regNumber}
                            onChange={handleChange}
                            placeholder="e.g., BCS/1234/21"
                            required
                        />
                    </div>
                </form>

                <div className={styles['submisions']}>
                    <div className={styles['clearForm']} onClick={() => setFormData({ name: '', regNumber: '' })}>Clear</div>
                    <div className={styles['submitData']} onClick={handleWhatsAppRedirect}>Request Password Reset</div>
                </div>

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


