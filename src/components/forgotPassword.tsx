import React, { useState } from 'react';
import styles from '../styles/signin.module.css';
import cuLogo from '../assets/cuLogoUAR.png';
import { Link } from 'react-router-dom';

const Forgotpassword: React.FC = () => {
    const [regNumber, setRegNumber] = useState('');
    const [error, setError] = useState('');

    const handleRegChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegNumber(e.target.value);
    };

    const handleWhatsAppRedirect = () => {
        if (!regNumber.trim()) {
            setError('Please enter your registration number');
            return;
        }

        const message = `I am ${regNumber}, I forgot my ksucu-mc portal password`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/254740881485?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className={styles.body}>
            <div className={styles['container']}>
                <Link to={"/"}>
                    <div className={styles['logo_signUp']}><img src={cuLogo} alt="CU logo" /></div>
                </Link>
                <h2 className={styles['text']}>Forgot Password?</h2>

                <div style={{ 
                    padding: '20px', 
                    backgroundColor: '#e3f2fd', 
                    border: '1px solid #2196f3', 
                    borderRadius: '8px', 
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    <p style={{ margin: '0 0 15px 0', color: '#1565c0', fontSize: '16px' }}>
                        📱 <strong>Contact Admin via WhatsApp</strong>
                    </p>
                    <p style={{ margin: '0 0 15px 0', color: '#424242', fontSize: '14px' }}>
                        To reset your password, please contact our admin on WhatsApp.<br/>
                        Enter your registration number below and click "Contact Admin".
                    </p>
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <form action="" className={styles['form']}>
                    <div className={styles['form-div']}>
                        <label htmlFor="regNumber">REGISTRATION NUMBER</label>
                        <input 
                            type="text" 
                            id="regNumber" 
                            className={styles['input']}
                            value={regNumber} 
                            onChange={handleRegChange}
                            placeholder="Enter your reg number..."
                        />
                    </div>
                </form>

                <div className={styles['submisions']}>
                    <div className={styles['clearForm']} onClick={() => setRegNumber('')}>Clear</div>
                    <div className={styles['submitData']} onClick={handleWhatsAppRedirect}>Contact Admin</div>
                </div>

                <div className={styles['form-footer']}>
                    <p><Link to={"/signIn"}>Back to Sign In</Link></p>
                </div>

            </div>
        </div>
    );
};

export default Forgotpassword;

