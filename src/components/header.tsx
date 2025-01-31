
import styles from '../styles/header.module.css';
import cuLogo from '../assets/cuLogoUAR.png';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className={styles['header']}>
            <div className={styles['flex-title-phone']}>
                <div className={styles.container}>
                    <Link to="/" className={styles['logo']}>
                        <img src={cuLogo} alt="Cu-logo" className={styles['logo-image']} />
                    </Link>
                    <div className={styles['title']}>
                        <h3 className={styles['title-text']}>Kisii University Christian Union</h3>
                    </div>
                    <div className={styles['nav--phone']}>
                        <div className={styles['signUp-btn--phone']}>
                            <Link to="/" className={styles['nav-link']}>
                                Home
                            </Link>
                        </div>
                        <div className={styles['Login-btn--phone']}>
                            <a href="#contacts" className={styles['nav-link']}>
                                Contact
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
