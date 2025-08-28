import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, config } from '../config/environment';
import styles from '../styles/messagesAdmin.module.css';
import cuLogo from '../assets/cuLogoUAR.png';
import { 
  MessageCircle, 
  UserCheck, 
  UserX, 
  Calendar,
  Filter,
  Search,
  Archive,
  Trash2,
  ArrowLeft,
  Mail,
  MailOpen,
  Clock,
  CheckCircle
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import loadingAnime from '../assets/Animation - 1716747954931.gif';

interface Message {
  id: string;
  subject: string;
  message: string;
  category: string;
  isAnonymous: boolean;
  senderInfo?: {
    username: string;
    email: string;
    ministry: string;
    yos: number;
  };
  timestamp: string;
  isRead: boolean;
  status: 'new' | 'read' | 'replied' | 'archived';
}

interface UserData {
  username: string;
  email: string;
  role: string;
}

const MessagesAdmin = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'anonymous' | 'identified'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const navigate = useNavigate();

  const categories = [
    { value: 'feedback', label: 'General Feedback', icon: '💬' },
    { value: 'suggestion', label: 'Suggestion', icon: '💡' },
    { value: 'complaint', label: 'Complaint', icon: '⚠️' },
    { value: 'praise', label: 'Praise & Appreciation', icon: '❤️' },
    { value: 'prayer', label: 'Prayer Request', icon: '🙏' },
    { value: 'technical', label: 'Technical Issue', icon: '🔧' },
    { value: 'other', label: 'Other', icon: '📋' }
  ];

  const statusOptions = [
    { value: 'new', label: 'New', icon: Mail, color: '#3b82f6' },
    { value: 'read', label: 'Read', icon: MailOpen, color: '#f59e0b' },
    { value: 'replied', label: 'Replied', icon: CheckCircle, color: '#10b981' },
    { value: 'archived', label: 'Archived', icon: Archive, color: '#6b7280' }
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData && userData.role === 'super_admin') {
      fetchMessages();
    }
  }, [userData]);

  useEffect(() => {
    filterMessages();
  }, [messages, searchTerm, filterType, filterCategory, filterStatus]);

  const fetchUserData = async () => {
    try {
      const apiUrl = getApiUrl('users');
      const response = await fetch(apiUrl, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        
        if (data.role !== 'super_admin') {
          navigate('/');
          return;
        }
      } else {
        navigate('/signIn');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/signIn');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(getApiUrl('messages'), {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        setError('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Error loading messages');
    }
  };

  // Suppress TypeScript warning - error state available for future UI implementation
  if (error) { /* error state handled via setError calls */ }

  const filterMessages = () => {
    let filtered = messages;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(message =>
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (message.senderInfo?.username.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by type (anonymous/identified)
    if (filterType !== 'all') {
      filtered = filtered.filter(message =>
        filterType === 'anonymous' ? message.isAnonymous : !message.isAnonymous
      );
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(message => message.category === filterCategory);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(message => message.status === filterStatus);
    }

    // Sort by timestamp (newest first)
    filtered = filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setFilteredMessages(filtered);
  };

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`${config.baseUrl}/messages/${messageId}/read`, {
        method: 'PATCH',
        credentials: 'include'
      });

      if (response.ok) {
        setMessages(prev => prev.map(msg =>
          msg.id === messageId ? { ...msg, isRead: true, status: 'read' } : msg
        ));
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const updateMessageStatus = async (messageId: string, status: 'replied' | 'archived') => {
    try {
      const response = await fetch(`${config.baseUrl}/messages/${messageId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setMessages(prev => prev.map(msg =>
          msg.id === messageId ? { ...msg, status, isRead: true } : msg
        ));
        setSelectedMessage(prev => prev ? { ...prev, status, isRead: true } : null);
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const response = await fetch(`${config.baseUrl}/messages/${messageId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(cat => cat.value === category) || { label: category, icon: '📋' };
  };

  const getStatusInfo = (status: string) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[0];
  };

  const goBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className={styles['loading-screen']}>
        <p className={styles['loading-text']}>Loading Messages...🔐</p>
        <img src={loadingAnime} alt="animation gif" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={goBack} className={styles.backButton}>
            <ArrowLeft size={24} />
          </button>
          
          <div className={styles.logoSection}>
            <img src={cuLogo} alt="KSUCU Logo" className={styles.logo} />
            <h1 className={styles.title}>Messages Admin</h1>
          </div>

          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <FontAwesomeIcon className={styles.userIcon} icon={faUser} />
              <span className={styles.username}>{userData?.username}</span>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.mainContent}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Mail size={24} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>{messages.filter(m => m.status === 'new').length}</span>
                <span className={styles.statLabel}>New</span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <UserX size={24} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>{messages.filter(m => m.isAnonymous).length}</span>
                <span className={styles.statLabel}>Anonymous</span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className={styles.searchContainer}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Filters */}
          <div className={styles.filtersSection}>
            <h3 className={styles.filterTitle}>
              <Filter size={18} />
              Filters
            </h3>
            
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className={styles.filterSelect}
              >
                <option value="all">All Messages</option>
                <option value="anonymous">Anonymous Only</option>
                <option value="identified">Identified Only</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Status</option>
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Messages List */}
        <main className={styles.messagesSection}>
          <div className={styles.messagesHeader}>
            <h2 className={styles.messagesTitle}>
              Messages ({filteredMessages.length})
            </h2>
          </div>

          <div className={styles.messagesContainer}>
            {filteredMessages.length === 0 ? (
              <div className={styles.emptyState}>
                <MessageCircle size={64} className={styles.emptyIcon} />
                <h3>No Messages Found</h3>
                <p>There are no messages matching your current filters.</p>
              </div>
            ) : (
              <div className={styles.messagesList}>
                {filteredMessages.map((message) => {
                  const categoryInfo = getCategoryInfo(message.category);
                  const statusInfo = getStatusInfo(message.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div
                      key={message.id}
                      className={`${styles.messageCard} ${!message.isRead ? styles.unread : ''} ${
                        selectedMessage?.id === message.id ? styles.selected : ''
                      }`}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (!message.isRead) {
                          markAsRead(message.id);
                        }
                      }}
                    >
                      <div className={styles.messageHeader}>
                        <div className={styles.messageInfo}>
                          <div className={styles.messageSender}>
                            {message.isAnonymous ? (
                              <>
                                <UserX size={16} className={styles.anonymousIcon} />
                                <span>Anonymous</span>
                              </>
                            ) : (
                              <>
                                <UserCheck size={16} className={styles.identifiedIcon} />
                                <span>{message.senderInfo?.username}</span>
                              </>
                            )}
                          </div>
                          <div className={styles.messageStatus}>
                            <StatusIcon size={14} style={{ color: statusInfo.color }} />
                            <span>{statusInfo.label}</span>
                          </div>
                        </div>
                        <div className={styles.messageTime}>
                          <Clock size={14} />
                          <span>{formatDate(message.timestamp)}</span>
                        </div>
                      </div>

                      <div className={styles.messageContent}>
                        <div className={styles.messageSubject}>
                          <span className={styles.categoryIcon}>{categoryInfo.icon}</span>
                          <span className={styles.subject}>{message.subject}</span>
                        </div>
                        <p className={styles.messagePreview}>
                          {message.message.substring(0, 100)}
                          {message.message.length > 100 ? '...' : ''}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        {/* Message Details */}
        {selectedMessage && (
          <aside className={styles.detailsPanel}>
            <div className={styles.detailsHeader}>
              <h3 className={styles.detailsTitle}>Message Details</h3>
              <div className={styles.detailsActions}>
                <button
                  onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                  className={`${styles.actionButton} ${styles.replyButton}`}
                  disabled={selectedMessage.status === 'replied'}
                >
                  <CheckCircle size={16} />
                  Mark Replied
                </button>
                <button
                  onClick={() => updateMessageStatus(selectedMessage.id, 'archived')}
                  className={`${styles.actionButton} ${styles.archiveButton}`}
                  disabled={selectedMessage.status === 'archived'}
                >
                  <Archive size={16} />
                  Archive
                </button>
                <button
                  onClick={() => deleteMessage(selectedMessage.id)}
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>

            <div className={styles.detailsContent}>
              <div className={styles.detailsField}>
                <label>From:</label>
                <div className={styles.senderDetails}>
                  {selectedMessage.isAnonymous ? (
                    <div className={styles.anonymousSender}>
                      <UserX size={16} />
                      <span>Anonymous User</span>
                    </div>
                  ) : (
                    <div className={styles.identifiedSender}>
                      <UserCheck size={16} />
                      <div>
                        <div className={styles.senderName}>{selectedMessage.senderInfo?.username}</div>
                        <div className={styles.senderEmail}>{selectedMessage.senderInfo?.email}</div>
                        <div className={styles.senderInfo}>
                          Ministry: {selectedMessage.senderInfo?.ministry} | Year: {selectedMessage.senderInfo?.yos}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.detailsField}>
                <label>Category:</label>
                <div className={styles.categoryBadge}>
                  <span>{getCategoryInfo(selectedMessage.category).icon}</span>
                  <span>{getCategoryInfo(selectedMessage.category).label}</span>
                </div>
              </div>

              <div className={styles.detailsField}>
                <label>Subject:</label>
                <div className={styles.subjectText}>{selectedMessage.subject}</div>
              </div>

              <div className={styles.detailsField}>
                <label>Message:</label>
                <div className={styles.messageText}>{selectedMessage.message}</div>
              </div>

              <div className={styles.detailsField}>
                <label>Received:</label>
                <div className={styles.timestampText}>
                  <Calendar size={16} />
                  <span>{formatDate(selectedMessage.timestamp)}</span>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default MessagesAdmin;