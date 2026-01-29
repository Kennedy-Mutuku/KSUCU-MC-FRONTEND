import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faClock, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { formatDateTime } from '../../utils/timeUtils';
import styles from '../../styles/attendanceSignin.module.css';

interface Session {
    _id: string;
    ministry: string;
    isActive: boolean;
    startTime: string;
    endTime?: string;
    leadershipRole?: string;
}

interface AttendanceSessionStatusProps {
    session: Session | null;
    ministry?: string;
}

const AttendanceSessionStatus: React.FC<AttendanceSessionStatusProps> = ({ session }) => {
    if (!session) {
        return (
            <div className={styles.statusCard} style={{ flexDirection: 'column', textAlign: 'center', background: '#f8fafc', borderColor: '#e2e8f0', padding: '24px' }}>
                <div className={styles.statusIconWrapper} style={{ background: '#f1f5f9', color: '#94a3b8', margin: '0 0 12px' }}>
                    <FontAwesomeIcon icon={faExclamationCircle} />
                </div>
                <div className={styles.statusInfo}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>No Active Session</h3>
                    <p className={styles.statusDetails}>Wait for a leader to open an attendance session</p>
                </div>
            </div>
        );
    }

    const isSessionClosed = !session.isActive && session.endTime;

    if (isSessionClosed) {
        return (
            <div className={styles.statusCard} style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
                <div className={styles.statusIconWrapper} style={{ background: '#e2e8f0', color: '#64748b' }}>
                    <FontAwesomeIcon icon={faClock} />
                </div>
                <div className={styles.statusInfo}>
                    <h3>Session Closed</h3>
                    <p className={styles.statusDetails}>Attendance for this session is no longer being recorded.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.statusCard}>
            <div className={styles.statusIconWrapper}>
                <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <div className={styles.statusInfo}>
                <h3>Live Session Active</h3>
                <p className={styles.statusDetails}>
                    {session.leadershipRole || 'Leader'} • Started {formatDateTime(session.startTime, { format: 'short', includeDate: false })}
                </p>
            </div>
        </div>
    );
};

export default AttendanceSessionStatus;
