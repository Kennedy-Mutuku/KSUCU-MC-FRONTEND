import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/EtComponents.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface EtHeaderProps {
    teamName: string;
}

const EtHeader: React.FC<EtHeaderProps> = ({ teamName }) => {
    const navigate = useNavigate();

    return (
        <header className={styles.etHeader}>
            <button onClick={() => navigate(-1)} className={styles.backBtn}>
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Back</span>
            </button>
            <h1 className={styles.etHeaderTitle}>{teamName}</h1>
            <div style={{ width: '80px' }}></div> {/* Spacer to center title if button is on left */}
        </header>
    );
};

export default EtHeader;
