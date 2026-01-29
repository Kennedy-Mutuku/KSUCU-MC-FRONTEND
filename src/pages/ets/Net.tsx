import React from 'react';
import EtHeader from '../../components/EtHeader';
import EtFooter from '../../components/EtFooter';
import NET_IMG from '../../assets/NET.jpg';
import styles from '../../styles/ET.module.css';

const Net: React.FC = () => {
    return (
        <>
            <EtHeader teamName="NET" />
            <div className={styles['main']}>
                <div className={styles['ET-section']} style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className={styles['ET-section--flex']}>
                        <h3 className={styles['ET-name']}>NET</h3>
                        <p className={styles['ET-content']}>
                            NET (Nyanza Evangelistic Team) is a vibrant ministry in KSUCU-MC, dedicated to evangelizing the Nyanza region. The team focuses on equipping members for evangelism, organizing impactful missions, and fostering spiritual growth through regular fellowships. Through outreach, discipleship, and mission work, NET seeks to spread the Gospel and transform lives, advancing the Kingdom of God in the region.
                        </p>
                    </div>
                    <div className={styles['ET-img']} style={{ maxWidth: '600px', margin: '2rem auto' }}>
                        <img src={NET_IMG} alt="NET" style={{ borderRadius: '15px' }} />
                    </div>
                </div>
            </div>
            <EtFooter currentTeam="NET" />
        </>
    );
};

export default Net;
