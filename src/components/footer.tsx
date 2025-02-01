
import styles from '../styles/index.module.css';
import { FaYoutube, FaFacebook, FaTiktok } from 'react-icons/fa';

const Footer = () => {
    return (
        <div className={styles['footer']} id='contacts'>
            <p className={styles['footer--text']}>KISII UNIVERSITY MAIN CAMPUS CHRISTIAN UNION 2024</p>
                
            <div className={styles['hr']}></div>

            <div className={styles['social--links']}>
                <div className={styles['youtube']}>
                    <a href="https://www.youtube.com/@KSUCU-MC" className={styles['social-link']}><FaYoutube /></a>
                </div>

                <div className={styles['facebook']}>
                    <a href="https://www.facebook.com/ksucumc" className={styles['social-link']}><FaFacebook /></a>
                </div>

                <div className={styles['tiktok']}>
                    <a href="https://www.tiktok.com/@ksucumc" className={styles['social-link']}><FaTiktok /></a>
                </div>
            </div>
        </div>
    );
};

export default Footer;

