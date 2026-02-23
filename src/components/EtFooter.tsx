import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/EtComponents.module.css';
import Footer from './footer';

interface EtFooterProps {
    currentTeam: string;
}

const etTeams = [
    { name: 'RIVET', path: '/ets/rivet' },
    { name: 'NET', path: '/ets/net' },
    { name: 'ESET', path: '/ets/eset' },
    { name: 'WESO', path: '/ets/weso' },
    { name: 'CET', path: '/ets/cet' },
];

const EtFooter: React.FC<EtFooterProps> = ({ currentTeam }) => {
    return (
        <>
            <section className={styles.etFooterLinks}>
                <h4 className={styles.etFooterLinksTitle}>EXPLORE OTHER EVANGELISTIC TEAMS</h4>
                <div className={styles.etLinksGrid}>
                    {etTeams.map((team) => (
                        <Link
                            key={team.name}
                            to={team.path}
                            className={`${styles.etLinkItem} ${currentTeam.toUpperCase() === team.name ? styles.active : ''}`}
                        >
                            {team.name}
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
};

export default EtFooter;
