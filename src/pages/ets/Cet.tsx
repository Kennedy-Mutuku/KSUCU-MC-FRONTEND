import React from 'react';
import EtHeader from '../../components/EtHeader';
import EtFooter from '../../components/EtFooter';
import CET_IMG from '../../assets/CET.jpg';
import styles from '../../styles/ET.module.css';

const Cet: React.FC = () => {
    return (
        <>
            <EtHeader teamName="CET" />
            <div className={styles['main']}>
                <div className={styles['ET-section']} style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className={styles['ET-section--flex']}>
                        <h3 className={styles['ET-name']}>CET</h3>
                        <p className={styles['ET-content']}>
                            CET (Central Evangelistic Team) is a mission-driven ministry in KSUCU-MC, committed to evangelizing the Central region and Nairobi. The team focuses on equipping members for evangelism, organizing fellowships, and conducting impactful missions. Through outreach and discipleship, CET plays a key role in spreading the Gospel and nurturing spiritual growth in the region.
                        </p>
                    </div>
                    <div className={styles['ET-img']} style={{ maxWidth: '600px', margin: '2rem auto' }}>
                        <img src={CET_IMG} alt="CET" style={{ borderRadius: '15px' }} />
                    </div>
                </div>
            </div>
            <EtFooter currentTeam="CET" />
        </>
    );
};

export default Cet;
