import React from 'react';
import EtHeader from '../../components/EtHeader';
import EtFooter from '../../components/EtFooter';
import WESO_IMG from '../../assets/WESO.jpg';
import styles from '../../styles/ET.module.css';

const Weso: React.FC = () => {
    return (
        <>
            <EtHeader teamName="WESO" />
            <div className={styles['main']}>
                <div className={styles['ET-section']} style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className={styles['ET-section--flex']}>
                        <h3 className={styles['ET-name']}>WESO</h3>
                        <p className={styles['ET-content']}>
                            WESO (Western Evangelistic Students Outreach) is a passionate evangelistic ministry in KSUCU-MC, dedicated to spreading the Gospel across the Western region. The team focuses on equipping members for effective evangelism, organizing fellowships, and carrying out impactful missions. Through outreach, discipleship, and mission work, WESO seeks to transform lives and expand God’s kingdom in the region.
                        </p>
                    </div>
                    <div className={styles['ET-img']} style={{ maxWidth: '600px', margin: '2rem auto' }}>
                        <img src={WESO_IMG} alt="WESO" style={{ borderRadius: '15px' }} />
                    </div>
                </div>
            </div>
            <EtFooter currentTeam="WESO" />
        </>
    );
};

export default Weso;
