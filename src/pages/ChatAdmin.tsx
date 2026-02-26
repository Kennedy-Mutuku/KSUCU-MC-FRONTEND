import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/environment';
import styles from '../styles/chatAdmin.module.css';
import {
  MessageCircle,
  Send,
  Trash2,
  Reply,
  AlertCircle,
  Users,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import io, { Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useOverseerAuth } from '../hooks/useOverseerAuth';
import OverseerLogoutButton from '../components/OverseerLogoutButton';

interface ChatMessage {
  _id: string;
  senderId: string;
  senderName: string;
  message: string;
  messageType: 'text' | 'image' | 'video' | 'audio' | 'file';
  mediaUrl?: string;
  timestamp: string;
  deleted: boolean;
  edited: boolean;
  replyTo?: {
    _id: string;
    message: string;
    senderName: string;
  };
}

const ChatAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { authenticated, loading: authLoading } = useOverseerAuth();
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminMessage, setAdminMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Check authentication
  useEffect(() => {
    if (authLoading) return;
    if (authenticated) {
      checkUserAuth();
    } else {
      navigate('/worship-docket-admin');
    }
  }, [authenticated, authLoading, navigate]);

  const checkUserAuth = async () => {
    try {
      const response = await fetch(getApiUrl('users'), {
        credentials: 'include'
      });
      
      if (response.ok) {
        setUserAuthenticated(true);
      } else {
        setUserAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking user auth:', error);
      setUserAuthenticated(false);
    }
  };

  // Fetch messages
  useEffect(() => {
    if (authenticated && userAuthenticated) {
      fetchMessages();
      initializeSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [authenticated, userAuthenticated]);

  const initializeSocket = () => {
    const socketUrl = getApiUrl('chat').replace('/api/chat', '');
    const token = Cookies.get('socket_token');

    if (!token) {
      console.error('Chat Admin: No socket token found');
      return;
    }

    const socket = io(socketUrl, {
      auth: {
        token: token
      },
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('Chat Admin: Socket connected');
      socket.emit('joinRoom', 'community-chat');
    });

    // Listen for new messages from anyone (including this admin)
    socket.on('newMessage', (message: ChatMessage) => {
      console.log('Chat Admin: New message received', message);
      setMessages(prev => {
        // Avoid duplicates
        const exists = prev.some(msg => msg._id === message._id);
        if (exists) return prev;
        return [...prev, message];
      });
    });

    // Listen for deleted messages
    socket.on('messageDeleted', (messageId: string) => {
      console.log('Chat Admin: Message deleted', messageId);
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
    });

    socket.on('disconnect', () => {
      console.log('Chat Admin: Socket disconnected');
    });

    socketRef.current = socket;
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('chat') + '/messages?limit=100', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendAdminMessage = async () => {
    if (!adminMessage.trim()) return;

    const messageContent = adminMessage;
    // Optimistic update: Clear input immediately
    setAdminMessage('');
    setReplyingTo(null);

    try {
      const response = await fetch(getApiUrl('chat') + '/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          message: messageContent,
          messageType: 'text',
          replyTo: replyingTo?._id || null
        })
      });

      if (!response.ok) {
        // Validation failed or error
        setAdminMessage(messageContent); // Restore input
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setAdminMessage(messageContent); // Restore input
      alert("Error sending message. Please checking your connection.");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    // Optimistic update: Remove message immediately
    const previousMessages = [...messages];
    setMessages(prev => prev.filter(msg => msg._id !== messageId));
    setDeleteConfirmId(null);

    try {
      const response = await fetch(getApiUrl('chat') + `/delete/${messageId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        // Revert on failure
        setMessages(previousMessages);
        alert("Failed to delete message. Please try again.");
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      // Revert on error
      setMessages(previousMessages);
      alert("Error deleting message. Please check your connection.");
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStats = () => {
    const today = new Date().toDateString();
    const messagesToday = messages.filter(msg => 
      new Date(msg.timestamp).toDateString() === today
    ).length;

    const uniqueSenders = new Set(messages.map(msg => msg.senderId)).size;

    return {
      total: messages.length,
      today: messagesToday,
      users: uniqueSenders
    };
  };

  if (!authenticated || loading) {
    return (
      <div className={styles.loadingContainer}>
        <MessageCircle size={48} className={styles.loadingIcon} />
        <p>Loading Chat Admin...</p>
      </div>
    );
  }

  if (!userAuthenticated) {
    return (
      <>
        <div className={styles.container}>
          <div className={styles.header}>
            <button onClick={() => navigate('/worship-docket-admin')} className={styles.backButton}>
              <ArrowLeft size={20} />
              Back
            </button>
            <div className={styles.headerContent}>
              <MessageCircle size={32} className={styles.headerIcon} />
              <div>
                <h1 className={styles.title}>Community Chat Management</h1>
                <p className={styles.subtitle}>Monitor and moderate the KSUCU-MC community chat</p>
              </div>
            </div>
          </div>

          <div className={styles.loginPrompt}>
            <AlertCircle size={64} className={styles.promptIcon} />
            <h2>Authentication Required</h2>
            <p>You need to be logged into your KSUCU account to use Chat Admin features.</p>
            <p className={styles.promptSubtext}>
              Please sign in to your account first, then return to this page.
            </p>
            <button 
              onClick={() => navigate('/signIn')}
              className={styles.loginButton}
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </>
    );
  }

  const stats = getStats();

  return (
    <>
      <div className={styles.container}>
        <OverseerLogoutButton />
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <MessageCircle size={32} className={styles.headerIcon} />
            <div>
              <h1 className={styles.title}>Community Chat Management</h1>
              <p className={styles.subtitle}>Monitor and moderate the KSUCU-MC community chat</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <MessageCircle size={24} className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>{stats.total}</span>
              <span className={styles.statLabel}>Total Messages</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <Calendar size={24} className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>{stats.today}</span>
              <span className={styles.statLabel}>Messages Today</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <Users size={24} className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>{stats.users}</span>
              <span className={styles.statLabel}>Active Users</span>
            </div>
          </div>
        </div>

        {/* Admin Message Composer */}
        <div className={styles.adminComposer}>
          <h2 className={styles.composerTitle}>
            <Send size={20} />
            Post Admin Message
          </h2>
          {replyingTo && (
            <div className={styles.replyPreview}>
              <Reply size={16} />
              <span>Replying to {replyingTo.senderName}: "{replyingTo.message.substring(0, 50)}..."</span>
              <button onClick={() => setReplyingTo(null)} className={styles.cancelReply}>×</button>
            </div>
          )}
          <div className={styles.composerInput}>
            <input
              type="text"
              value={adminMessage}
              onChange={(e) => setAdminMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendAdminMessage()}
              placeholder={replyingTo ? "Type your reply..." : "Type admin message or announcement..."}
              className={styles.messageInput}
            />
            <button 
              onClick={handleSendAdminMessage}
              disabled={!adminMessage.trim()}
              className={styles.sendButton}
            >
              <Send size={20} />
              {replyingTo ? 'Reply' : 'Post'}
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className={styles.messagesSection}>
          <h2 className={styles.messagesTitle}>
            Recent Messages ({messages.length})
          </h2>
          
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <MessageCircle size={64} className={styles.emptyIcon} />
              <h3>No Messages Yet</h3>
              <p>Community chat messages will appear here</p>
            </div>
          ) : (
            <div className={styles.messagesList}>
              {messages.slice().reverse().map((message) => (
                <div key={message._id} className={styles.messageCard}>
                  {deleteConfirmId === message._id && (
                    <div className={styles.deleteConfirmOverlay}>
                      <AlertCircle size={24} className={styles.confirmIcon} />
                      <p>Delete this message for everyone?</p>
                      <div className={styles.confirmButtons}>
                        <button 
                          onClick={() => handleDeleteMessage(message._id)}
                          className={styles.confirmDelete}
                        >
                          Yes, Delete
                        </button>
                        <button 
                          onClick={() => setDeleteConfirmId(null)}
                          className={styles.confirmCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className={styles.messageHeader}>
                    <div className={styles.messageSender}>
                      <strong>{message.senderName}</strong>
                      <span className={styles.messageTime}>{formatTimestamp(message.timestamp)}</span>
                    </div>
                    <div className={styles.messageActions}>
                      <button 
                        onClick={() => setReplyingTo(message)}
                        className={styles.actionButton}
                        title="Reply to this message"
                      >
                        <Reply size={16} />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmId(message._id)}
                        className={styles.deleteButton}
                        title="Delete for everyone"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {message.replyTo && (
                    <div className={styles.replyReference}>
                      <Reply size={14} />
                      <span>Reply to {message.replyTo.senderName}: {message.replyTo.message.substring(0, 40)}...</span>
                    </div>
                  )}

                  <div className={styles.messageContent}>
                    {message.message}
                  </div>

                  {message.mediaUrl && (
                    <div className={styles.mediaPreview}>
                      {message.messageType === 'image' && (
                        <img src={message.mediaUrl} alt="Shared" className={styles.mediaImage} />
                      )}
                      {message.messageType === 'video' && (
                        <video controls className={styles.mediaVideo}>
                          <source src={message.mediaUrl} />
                        </video>
                      )}
                      {message.messageType === 'audio' && (
                        <audio controls className={styles.mediaAudio}>
                          <source src={message.mediaUrl} />
                        </audio>
                      )}
                      {message.messageType === 'file' && (
                        <a href={message.mediaUrl} target="_blank" rel="noopener noreferrer" className={styles.fileLink}>
                          📎 View Attachment
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatAdmin;
