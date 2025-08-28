
import styles from '../styles/header.module.css';
import cuLogo from '../assets/cuLogoUAR.png';
import { User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        if (email) {
            setIsLoggedIn(true);
            setUserEmail(email);
        }
    }, []);

    const handleUserClick = () => {
        if (isLoggedIn) {
            navigate('/profile');
        } else {
            navigate('/signIn');
        }
    };

    return (
        <header className={styles['header']}>
            <div className={styles['flex-title-phone']}>
                <div className={styles.container}>
                    <div className={styles['logo-section']}>
                        <img src={cuLogo} alt="KSUCU Logo" className={styles['logo-image']} />
                    </div>
                    <div className={styles['title-section']}>
                        <h3 className={styles['title-text']}>
                            <span className={styles['full-title']}>Kisii University Christian Union</span>
                            <span className={styles['short-title']}>Kisii Uni CU</span>
                        </h3>
                    </div>
                    <div className={styles['nav-section']}>
                        <div className={styles['nav-item']}>
                            <Link to="/" className={styles['nav-text']}>Home</Link>
                        </div>
                        <div className={styles['nav-item']}>
                            <Link to="/#contacts" className={styles['nav-text']}>Contact</Link>
                        </div>
                        <div className={styles['user-section']} onClick={handleUserClick} style={{ cursor: 'pointer' }}>
                            <User className={styles['user-icon']} size={24} />
                            <span className={styles['user-text']}>
                                {isLoggedIn ? userEmail.split('@')[0] : 'Log In'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
