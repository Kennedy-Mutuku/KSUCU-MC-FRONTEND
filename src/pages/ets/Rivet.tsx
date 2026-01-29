import React from 'react';
import EtHeader from '../../components/EtHeader';
import EtFooter from '../../components/EtFooter';
import RIVET_IMG from '../../assets/RIVET.jpg';
import styles from '../../styles/ET.module.css';

const Rivet: React.FC = () => {
    return (
        <>
            <EtHeader teamName="RIVET" />
            <div className={styles['main']}>
                <div className={styles['ET-section']} style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className={styles['ET-section--flex']}>
                        <h3 className={styles['ET-name']}>RIVET</h3>
                        <p className={styles['ET-content']}>
                            RIVET (Rift Valley Evangelistic Team) is a dedicated evangelistic ministry within KSUCU-MC, focused on spreading the Gospel across the Rift Valley region. The team is committed to equipping believers for evangelism, organizing impactful missions, and fostering spiritual growth through regular fellowships. By actively engaging in outreach and discipleship, RIVET plays a vital role in fulfilling the Great Commission within its designated region.
                        </p>
                    </div>
                    <div className={styles['ET-img']} style={{ maxWidth: '600px', margin: '2rem auto' }}>
                        <img src={RIVET_IMG} alt="RIVET" style={{ borderRadius: '15px' }} />
                    </div>
                </div>
            </div>
            <EtFooter currentTeam="RIVET" />
        </>
    );
};

export default Rivet;
