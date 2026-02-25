import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, X, Bell } from 'lucide-react';
import styles from '../styles/notificationBubble.module.css';
import socketService from '../services/socketService';
import { getApiUrl } from '../config/environment';

interface NotificationData {
    messageId: string;
    subject: string;
    ministryName?: string;
}

const NotificationBubble = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [lastNotification, setLastNotification] = useState<NotificationData | null>(null);
    const [showCard, setShowCard] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${getApiUrl('users')}`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    setIsLoggedIn(true);
                    setupSocket();
                }
            } catch (err) {
                console.log('User not logged in');
            }
        };

        const setupSocket = async () => {
            try {
                await socketService.connect();
                const socket = socketService.getSocket();

                if (socket) {
                    socket.on('overseerReply', (data: NotificationData) => {
                        const isHistoryTab = location.pathname === '/contact-us' && new URLSearchParams(location.search).get('tab') === 'history';

                        if (!isHistoryTab) {
                            setUnreadCount(prev => prev + 1);
                            setLastNotification(data);
                            setShowCard(true);
                        }
                    });
                }
            } catch (err) {
                console.error('Notification Bubble socket setup failed:', err);
            }
        };

        checkAuth();

        return () => {
            socketService.off('overseerReply');
        };
    }, [location.pathname, location.search]);

    const handleBubbleClick = () => {
        if (unreadCount > 0) {
            setShowCard(!showCard);
        } else {
            navigate('/contact-us?tab=history');
        }
    };

    const handleViewDetails = () => {
        setUnreadCount(0);
        setShowCard(false);
        navigate('/contact-us?tab=history');
    };

    const closeCard = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowCard(false);
    };

    // Always show the bubble as a "Talk to Us" button, except on the contact page itself
    if (location.pathname === '/contact-us') return null;

    return (
        <div className={styles.bubbleContainer}>
            {showCard && lastNotification && (
                <div className={styles.notificationCard}>
                    <div className={styles.cardHeader}>
                        <h4>New Message</h4>
                        <button className={styles.closeBtn} onClick={closeCard}>
                            <X size={16} />
                        </button>
                    </div>
                    <div className={styles.cardBody}>
                        <p>
                            <strong>Re: {lastNotification.subject}</strong>
                            {lastNotification.ministryName && ` from ${lastNotification.ministryName} Overseer`}
                        </p>
                    </div>
                    <button className={styles.viewBtn} onClick={handleViewDetails}>
                        View Conversation
                    </button>
                </div>
            )}

            <div className={styles.floatingBubble} onClick={handleBubbleClick}>
                {unreadCount > 0 ? <Bell size={24} /> : <MessageCircle size={24} />}
                {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
            </div>
        </div>
    );
};

export default NotificationBubble;
