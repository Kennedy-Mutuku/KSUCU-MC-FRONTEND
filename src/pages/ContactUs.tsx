import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getApiUrl } from '../config/environment';
import styles from '../styles/contactUs.module.css';
import cuLogo from '../assets/cuLogoUAR.png';
import {
  MessageCircle,
  Send,
  Heart,
  ArrowLeft,
  History,
  MessageSquare,
  CheckCircle2,
  Clock,
  Reply
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserLock } from '@fortawesome/free-solid-svg-icons';
import loadingAnime from '../assets/Animation - 1716747954931.gif';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socketService from '../services/socketService';

interface UserData {
  username: string;
  email: string;
  yos: number;
  phone: string;
  et: string;
  ministry: string;
}

interface ChatMessage {
  _id: string;
  messageId: string;
  senderId: string;
  senderName: string;
  messageContent: string;
  timestamp: string;
  isOverseer: boolean;
}

interface UserMessage {
  _id: string;
  subject: string;
  message: string;
  ministryName?: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  timestamp: string;
  replyText?: string;
  repliedAt?: string;
  conversation?: ChatMessage[];
}

const ContactUs = () => {
  const [searchParams] = useSearchParams();
  const ministryId = searchParams.get('ministryId');
  const ministryNameParam = searchParams.get('ministryName');

  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAnonymous, _setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState(ministryNameParam ? `Message to ${ministryNameParam} Overseer` : '');
  const [category, setCategory] = useState(ministryId ? 'other' : 'feedback');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalLoading, setGeneralLoading] = useState(false);
  const [showMyMessages, setShowMyMessages] = useState(false);
  const [myMessages, setMyMessages] = useState<UserMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [historyReplyText, setHistoryReplyText] = useState('');
  const [isSendingHistoryReply, setIsSendingHistoryReply] = useState(false);

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

  useEffect(() => {
    fetchUserData();

    // Check if we should open the history tab directly
    const tab = searchParams.get('tab');
    if (tab === 'history') {
      setShowMyMessages(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (showMyMessages && userData) {
      fetchUserMessages();
    }
  }, [showMyMessages, userData]);

  useEffect(() => {
    if (!userData) return;

    const setupSocket = async () => {
      try {
        await socketService.connect();
        const socket = socketService.getSocket();

        if (socket) {
          socket.on('overseerReply', (data: any) => {
            toast.info(`New reply from overseer! Re: ${data.subject || 'your message'}`, {
              position: "top-right",
              autoClose: 5000,
              onClick: () => {
                setShowMyMessages(true);
                fetchUserMessages();
              }
            });

            // Refresh history if already on history tab
            if (showMyMessages) {
              fetchUserMessages();
            }
          });
        }
      } catch (err) {
        console.error('Socket notification setup failed:', err);
      }
    };

    setupSocket();

    return () => {
      socketService.off('overseerReply');
    };
  }, [userData, showMyMessages]);

  const fetchUserData = async () => {
    try {
      setGeneralLoading(true);
      const apiUrl = getApiUrl('users');
      const response = await fetch(apiUrl, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const firstName = data.username.split(' ')[0];
        setUserData({
          ...data,
          username: firstName
        });

      }
    } catch (error) {
      console.log('User not logged in or error fetching user data');
    } finally {
      setGeneralLoading(false);
    }
  };

  const fetchUserMessages = async () => {
    try {
      setMessagesLoading(true);
      const response = await fetch(`${getApiUrl('messages')}/my-messages`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        const messagesWithHistory = await Promise.all(
          data.messages.map(async (msg: UserMessage) => {
            try {
              const convRes = await fetch(`${getApiUrl('messages')}/${msg._id}/conversation`, {
                credentials: 'include'
              });
              if (convRes.ok) {
                const convData = await convRes.json();
                return { ...msg, conversation: convData.conversation };
              }
            } catch (err) {
              console.error(`Error fetching conversation for ${msg._id}:`, err);
            }
            return msg;
          })
        );
        setMyMessages(messagesWithHistory);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.warning('Please enter your message', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!subject.trim()) {
      toast.warning('Please enter a subject', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Check if user wants identified message but is not logged in
    if (!isAnonymous && !userData) {
      toast.warning('Please log in to send identified messages.', {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const messageData = {
        subject: subject.trim(),
        message: message.trim(),
        category,
        isAnonymous,
        senderInfo: !isAnonymous && userData ? {
          username: userData.username,
          email: userData.email,
          ministry: userData.ministry,
          yos: userData.yos
        } : null,
        ministryId: ministryId || null,
        ministryName: ministryNameParam || null,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(getApiUrl('messages'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        toast.success('Message sent successfully! Thank you for reaching out.', {
          position: "top-right",
          autoClose: 3000,
        });

        setMessage('');
        setSubject('');
        setCategory('feedback');

        if (userData) {
          setShowMyMessages(true);
        } else {
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHistoryReply = async (msgId: string) => {
    if (!historyReplyText.trim()) return;

    setIsSendingHistoryReply(true);
    try {
      const response = await fetch(`${getApiUrl('messages')}/${msgId}/reply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          replyText: historyReplyText.trim(),
          isOverseer: false
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newChatMsg = data.data;

        // Update local state
        setMyMessages(prev => prev.map(msg =>
          msg._id === msgId
            ? {
              ...msg,
              status: 'new', // Set to new so overseer sees it
              conversation: [...(msg.conversation || []), newChatMsg]
            }
            : msg
        ));
        setHistoryReplyText('');
        setActiveReplyId(null);
        toast.success('Message sent!');
      } else {
        throw new Error('Failed to send reply');
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSendingHistoryReply(false);
    }
  };

  const handleHistoryKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, msgId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleHistoryReply(msgId);
    }
  };

  const handleRedirectToUserInfo = () => {
    navigate('/profile');
  };

  const handleRedirectToLogin = () => {
    navigate('/signIn');
  };

  const goBack = () => {
    navigate(-1);
  };

  if (generalLoading) {
    return (
      <div className={styles['loading-screen']}>
        <p className={styles['loading-text']}>Loading...🤗</p>
        <img src={loadingAnime} alt="animation gif" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={goBack} className={styles.backButton}>
            <ArrowLeft size={24} />
          </button>

          <div className={styles.logoSection}>
            <img src={cuLogo} alt="KSUCU Logo" className={styles.logo} />
            <h1 className={styles.title}>Talk to Us</h1>
          </div>

          <div className={styles.userSection}>
            <div
              className={styles.userInfo}
              onClick={userData ? handleRedirectToUserInfo : handleRedirectToLogin}
            >
              <FontAwesomeIcon
                className={styles.userIcon}
                icon={userData ? faUser : faUserLock}
              />
              <span className={styles.username}>
                {userData ? userData.username : 'Log In'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <MessageCircle className={styles.heroIcon} />
            <h2 className={styles.heroTitle}>
              {ministryNameParam ? `Contact ${ministryNameParam} Overseer` : "We'd Love to Hear from You!"}
            </h2>
            <p className={styles.heroSubtitle}>
              {ministryNameParam
                ? `Send a message directly to the ${ministryNameParam} ministry overseer. We'll get back to you soon.`
                : "Share your thoughts, suggestions, prayer requests, or feedback with our leadership team."
              }
            </p>
          </div>
        </div>

        {userData && (
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tabLink} ${!showMyMessages ? styles.activeTab : ''}`}
              onClick={() => setShowMyMessages(false)}
            >
              <MessageSquare size={18} />
              <span>Send New Message</span>
            </button>
            <button
              className={`${styles.tabLink} ${showMyMessages ? styles.activeTab : ''}`}
              onClick={() => setShowMyMessages(true)}
            >
              <History size={18} />
              <span>My Message History</span>
            </button>
          </div>
        )}

        {!showMyMessages ? (
          <>

            <form onSubmit={handleSubmit} className={styles.messageForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Message Category</label>
                <div className={styles.categoryGrid}>
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      className={`${styles.categoryButton} ${category === cat.value ? styles.selected : ''}`}
                      onClick={() => setCategory(cat.value)}
                    >
                      <span className={styles.categoryIcon}>{cat.icon}</span>
                      <span className={styles.categoryLabel}>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject" className={styles.label}>Subject *</label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={styles.input}
                  placeholder="Brief summary of your message..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>Your Message *</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={styles.textarea}
                  placeholder="Share your thoughts, feedback, suggestions, or prayer requests..."
                  required
                  rows={6}
                />
              </div>

              {!isAnonymous && userData && (
                <div className={styles.userPreview}>
                  <h4 className={styles.previewTitle}>Message will be sent from:</h4>
                  <div className={styles.previewInfo}>
                    <div className={styles.previewItem}><strong>Name:</strong> {userData.username}</div>
                    <div className={styles.previewItem}><strong>Email:</strong> {userData.email}</div>
                    <div className={styles.previewItem}><strong>Ministry:</strong> {userData.ministry}</div>
                    <div className={styles.previewItem}><strong>Year:</strong> {userData.yos}</div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting || (!isAnonymous && !userData)}
              >
                {isSubmitting ? (
                  <>
                    <div className={styles.spinner} />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className={styles.historySection}>
            {messagesLoading ? (
              <div className={styles.messageLoading}>Loading your messages...</div>
            ) : myMessages.length === 0 ? (
              <div className={styles.noMessages}>
                <MessageSquare size={48} />
                <p>You haven't sent any messages yet.</p>
                <button onClick={() => setShowMyMessages(false)} className={styles.secondaryButton}>
                  Send your first message
                </button>
              </div>
            ) : (
              <div className={styles.messageList}>
                {myMessages.map((msg) => (
                  <div key={msg._id} className={styles.messageCard}>
                    <div className={styles.messageHeader}>
                      <div className={styles.messageMainInfo}>
                        <h4>{msg.subject}</h4>
                        <span className={styles.messageDate}>
                          {new Date(msg.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={`${styles.statusBadge} ${styles[msg.status]}`}>
                        {msg.status === 'replied' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                        <span>{msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}</span>
                      </div>
                    </div>

                    <p className={styles.messageContent}>{msg.message}</p>

                    {msg.ministryName && (
                      <div className={styles.ministryTag}>
                        To: {msg.ministryName} Overseer
                      </div>
                    )}

                    <div className={styles.replySection}>
                      <div className={styles.replyHeader}>
                        <MessageSquare size={16} />
                        <span>Conversation History</span>
                      </div>
                      <div className={styles.conversationList}>
                        {/* Always show the original message first */}
                        <div className={`${styles.chatMsg} ${styles.userChat}`}>
                          <div className={styles.chatInfo}>
                            <strong>You</strong>
                            <span className={styles.chatTime}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className={styles.chatContent}>{msg.message}</p>
                        </div>

                        {msg.conversation && msg.conversation.map((chat) => (
                          // Skip if it's the same as the original message to avoid duplication
                          (chat.messageContent === msg.message && chat.isOverseer === false &&
                            Math.abs(new Date(chat.timestamp).getTime() - new Date(msg.timestamp).getTime()) < 2000)
                            ? null : (
                              <div
                                key={chat._id}
                                className={`${styles.chatMsg} ${chat.isOverseer ? styles.overseerChat : styles.userChat}`}
                              >
                                <div className={styles.chatInfo}>
                                  <strong>{chat.isOverseer ? 'Overseer' : 'You'}</strong>
                                  <span className={styles.chatTime}>
                                    {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className={styles.chatContent}>{chat.messageContent}</p>
                              </div>
                            )
                        ))}
                      </div>
                    </div>

                    <div className={styles.cardActions}>
                      {activeReplyId === msg._id ? (
                        <div className={styles.inlineReplyForm}>
                          <textarea
                            value={historyReplyText}
                            onChange={(e) => setHistoryReplyText(e.target.value)}
                            onKeyDown={(e) => handleHistoryKeyDown(e, msg._id)}
                            placeholder="Type your follow-up message..."
                            className={styles.inlineTextarea}
                            rows={2}
                          />
                          <div className={styles.inlineActions}>
                            <button
                              onClick={() => setActiveReplyId(null)}
                              className={styles.cancelButton}
                              disabled={isSendingHistoryReply}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleHistoryReply(msg._id)}
                              className={styles.sendButton}
                              disabled={isSendingHistoryReply || !historyReplyText.trim()}
                            >
                              {isSendingHistoryReply ? 'Sending...' : 'Send'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveReplyId(msg._id)}
                          className={styles.replyButton}
                        >
                          <Reply size={14} />
                          <span>Reply</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Your feedback helps us serve our community better</p>
        <div className={styles.footerHeart}>
          <Heart size={16} />
          <span>KSUCU-MC Leadership Team</span>
        </div>
      </footer>
      <ToastContainer />
    </div>
  );
};

export default ContactUs;
