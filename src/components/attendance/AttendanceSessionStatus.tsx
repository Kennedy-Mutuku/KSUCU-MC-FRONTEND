import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import { formatDateTime, getTimeAgo, isRecentTime } from '../../utils/timeUtils';
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

const AttendanceSessionStatus: React.FC<AttendanceSessionStatusProps> = ({ session, ministry }) => {
    if (!session) {
        return (
            <div className={styles.header}>
                <FontAwesomeIcon icon={faClock} className={styles.clockIcon} />
                <h3 className={styles.title}>No Active Attendance Session</h3>
                <div className={styles.closedMessage}>
                    <p>There is currently no attendance session for {ministry || 'this'} ministry.</p>
                    <p className={styles.closedNote}>Please wait for an admin to open the attendance session.</p>
                </div>
            </div>
        );
    }

    const isSessionClosed = !session.isActive && session.endTime;

    return (
        <div className={styles.header}>
            <FontAwesomeIcon
                icon={isSessionClosed ? faClock : faCheckCircle}
                className={`${styles.icon} ${isSessionClosed ? styles.clockIcon : styles.checkIcon}`}
            />
            <h3 className={styles.title}>
                {isSessionClosed
                    ? 'Attendance Session Closed'
                    : `${session.ministry || 'General'} Ministry Attendance`}
            </h3>
            {!isSessionClosed && (
                <p className={styles.sessionInfo}>
                    <strong>Leader:</strong> {session.leadershipRole || 'N/A'} • {formatDateTime(session.startTime, { format: 'medium', includeSeconds: true })}
                    {isRecentTime(session.startTime, 10) && <span className={styles.recentIndicator}> • Just opened</span>}
                </p>
            )}
            {isSessionClosed && (
                <div className={styles.closedMessage}>
                    <p>The attendance session was closed {getTimeAgo(session.endTime!)}</p>
                    <p className={styles.closedNote}>You can no longer sign attendance for this session.</p>
                </div>
            )}
        </div>
    );
};

export default AttendanceSessionStatus;
