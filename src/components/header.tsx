
import styles from '../styles/header.module.css';
import cuLogo from '../assets/cuLogoUAR.png';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className={styles['header']}>

            <div className={styles.container}>
                <div className={styles['flex-title']}>
                    <Link to="/" className={styles['logo']}>
                        <img src={cuLogo} alt="Cu-logo" className={styles['logo-image']} />
                    </Link>
                    <div className={styles['title']}>
                        <h3 className={styles['title-text']}>KISII UNIVERSITY CHRISTIAN</h3>
                        <h3 className={styles['title-text']}>UNION MAIN CAMPUS</h3>
                        <div className={styles['nav-one--hidden']}>
                            <div className={styles['signUp-btn']}>
                                <Link to="/" className={styles['nav-link']}>
                                    Home
                                </Link>
                            </div>
                            <div className={styles['Login-btn']}>
                                <a href="#contacts" className={styles['nav-link']}>
                                    Contact
                                </a>
                            </div>
                            <div className={styles['About-btn']}>
                                <a href="" className={styles['nav-link']}>
                                    About Us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles['nav']}>
                    <div className={styles['nav-one']}>
                        <div className={styles['signUp-btn']}>
                            <Link to="/" className={styles['nav-link']}>
                                Home
                            </Link>
                        </div>
                        <div className={styles['Login-btn']}>
                            <a href="#contacts" className={styles['nav-link']}>
                                Contact
                            </a>
                        </div>
                        <div className={styles['About-btn']}>
                            <a href="" className={styles['nav-link']}>
                                About Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </header>
    );
};

export default Header;
