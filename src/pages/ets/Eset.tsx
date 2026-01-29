import React from 'react';
import EtHeader from '../../components/EtHeader';
import EtFooter from '../../components/EtFooter';
import ESET_IMG from '../../assets/eset.jpg';
import styles from '../../styles/ET.module.css';

const Eset: React.FC = () => {
    return (
        <>
            <EtHeader teamName="ESET" />
            <div className={styles['main']}>
                <div className={styles['ET-section']} style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className={styles['ET-section--flex']}>
                        <h3 className={styles['ET-name']}>ESET</h3>
                        <p className={styles['ET-content']}>
                            ESET (Eastern Evangelistic Team) is a dedicated ministry in KSUCU-MC, focused on spreading the Gospel across the Eastern, Coastal, and North Eastern regions. The team actively equips members for evangelism, organizes impactful missions, and fosters spiritual growth through regular fellowships. Committed to reaching diverse communities, ESET plays a crucial role in advancing the Great Commission and transforming lives through the power of the Gospel.
                        </p>
                    </div>
                    <div className={styles['ET-img']} style={{ maxWidth: '600px', margin: '2rem auto' }}>
                        <img src={ESET_IMG} alt="ESET" style={{ borderRadius: '15px' }} />
                    </div>
                </div>
            </div>
            <EtFooter currentTeam="ESET" />
        </>
    );
};

export default Eset;
