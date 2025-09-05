import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Users, Image, Mic, Video, FileText, Edit, Trash2, Reply, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import socketService from '../services/socketService';
import { getApiUrl, getBaseUrl } from '../config/environment';
import axios from 'axios';
import styles from '../styles/CommunityChat.module.css';

interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  message: string;
  messageType: 'text' | 'image' | 'video' | 'audio' | 'file';
  mediaUrl?: string;
  mediaFileName?: string;
  mediaSize?: number;
  timestamp: string;
  edited?: boolean;
  editedAt?: string;
  deleted?: boolean;
  replyTo?: {
    _id: string;
    message: string;
    senderName: string;
    timestamp: string;
  };
}

interface OnlineUser {
  _id: string;
  username: string;
  status: 'online' | 'away' | 'busy';
  lastSeen: string;
}

interface TypingUser {
  username: string;
  isTyping: boolean;
}

const CommunityChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [currentUser, setCurrentUser] = useState<{ username: string; userId: string } | null>(null);

  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(getApiUrl('users'), {
        withCredentials: true
      });
      if (response.data && response.data.username) {
        setCurrentUser({
          username: response.data.username,
          userId: response.data._id || response.data.id
        });
        return true; // User is logged in
      } else {
        setCurrentUser(null);
        return false; // User is not logged in
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      setCurrentUser(null);
      return false; // Failed to authenticate
    }
  };

  const connectSocket = async () => {
    try {
      setIsLoading(true);
      setError(''); // Clear any previous errors
      
      // Check if user is authenticated
      const isAuthenticated = await fetchCurrentUser();
      
      if (!isAuthenticated) {
        setError('Please log in to access the community chat.');
        setIsLoading(false);
        return;
      }

      // Try to connect to socket
      await socketService.connect();
      setIsConnected(true);
      setupSocketListeners();
      loadMessages();
    } catch (error: any) {
      console.error('Failed to connect to chat:', error);
      if (error.response && error.response.status === 401) {
        setError('Please log in to access the community chat.');
      } else if (error.message && error.message.includes('Authentication')) {
        setError('Please log in to access the community chat.');
      } else if (error.message && error.message.includes('No authentication token')) {
        setError('Please log in to access the community chat.');
      } else {
        setError('Failed to connect to chat. Please try again.');
      }
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const setupSocketListeners = () => {
    socketService.onNewMessage((message: Message) => {
      setMessages(prev => [...prev, message]);
      setTimeout(scrollToBottom, 100);
    });

    socketService.onMessageEdited((message: Message) => {
      setMessages(prev => prev.map(msg => 
        msg._id === message._id ? message : msg
      ));
    });

    socketService.onMessageDeleted(({ messageId }: { messageId: string }) => {
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
    });

    socketService.onOnlineUsersUpdate((users: OnlineUser[]) => {
      setOnlineUsers(users);
    });

    socketService.onUserTyping(({ username, isTyping }: { username: string; isTyping: boolean }) => {
      setTypingUsers(prev => {
        const filtered = prev.filter(user => user.username !== username);
        return isTyping ? [...filtered, { username, isTyping }] : filtered;
      });
    });

    socketService.onError(({ message }: { message: string }) => {
      setError(message);
    });
  };

  const loadMessages = async () => {
    try {
      const response = await axios.get(`${getApiUrl('chatMessages')}?page=${page}&limit=50`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setMessages(prev => page === 1 ? response.data.messages : [...response.data.messages, ...prev]);
        setHasMore(response.data.hasMore);
        if (page === 1) {
          setTimeout(scrollToBottom, 100);
        }
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      setError('Failed to load messages');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isConnected) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    if (editingMessage) {
      socketService.editMessage(editingMessage._id, messageText);
      setEditingMessage(null);
    } else {
      socketService.sendMessage(messageText, 'text', replyToMessage?._id);
      setReplyToMessage(null);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file || !isConnected) return;

    const formData = new FormData();
    formData.append('media', file);
    if (replyToMessage) {
      formData.append('replyTo', replyToMessage._id);
    }

    try {
      setIsLoading(true);
      const response = await axios.post(getApiUrl('chatUpload'), formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setReplyToMessage(null);
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
      setError('Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTyping = (typing: boolean) => {
    if (typing) {
      socketService.setTyping(true);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        socketService.setTyping(false);
      }, 2000);
    } else {
      socketService.setTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const renderMessage = (message: Message) => {
    const isOwn = currentUser && (message.senderId === currentUser.userId || message.senderName === currentUser.username);

    return (
      <div key={message._id} className={`${styles.message} ${isOwn ? styles.ownMessage : styles.otherMessage}`}>
        {message.replyTo && (
          <div className={styles.replyTo}>
            <span className={styles.replyAuthor}>{message.replyTo.senderName}</span>
            <span className={styles.replyContent}>{message.replyTo.message}</span>
          </div>
        )}
        
        <div className={styles.messageHeader}>
          <span className={styles.senderName}>{message.senderName}</span>
          <span className={styles.timestamp}>
            {formatTime(message.timestamp)}
            {message.edited && <span className={styles.edited}> (edited)</span>}
          </span>
        </div>

        <div className={styles.messageContent}>
          {message.messageType === 'text' && (
            <p>{message.message}</p>
          )}
          
          {message.messageType === 'image' && (
            <div>
              <img 
                src={`${getBaseUrl()}${message.mediaUrl}`} 
                alt={message.mediaFileName}
                className={styles.messageImage}
              />
              {message.message && <p>{message.message}</p>}
            </div>
          )}

          {message.messageType === 'video' && (
            <div>
              <video 
                src={`${getBaseUrl()}${message.mediaUrl}`} 
                controls
                className={styles.messageVideo}
              />
              {message.message && <p>{message.message}</p>}
            </div>
          )}

          {message.messageType === 'audio' && (
            <div>
              <audio 
                src={`${getBaseUrl()}${message.mediaUrl}`} 
                controls
                className={styles.messageAudio}
              />
              {message.message && <p>{message.message}</p>}
            </div>
          )}

          {message.messageType === 'file' && (
            <div>
              <a 
                href={`${getBaseUrl()}${message.mediaUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.fileLink}
              >
                <FileText size={16} />
                {message.mediaFileName}
              </a>
              {message.message && <p>{message.message}</p>}
            </div>
          )}
        </div>

        {isOwn && (
          <div className={styles.messageActions}>
            <button onClick={() => setReplyToMessage(message)} title="Reply">
              <Reply size={16} />
            </button>
            <button onClick={() => setEditingMessage(message)} title="Edit">
              <Edit size={16} />
            </button>
            <button onClick={() => socketService.deleteMessage(message._id)} title="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (isOpen && !isConnected) {
      connectSocket();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      socketService.disconnect();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) {
    return (
      <div className={styles.chatIcon} onClick={() => setIsOpen(true)}>
        <MessageCircle size={24} />
        {onlineUsers.length > 0 && (
          <div className={styles.onlineIndicator}>
            {onlineUsers.length}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <div className={styles.headerLeft}>
          <MessageCircle size={20} />
          <span>Community Chat</span>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.onlineUsers}>
            <Users size={16} />
            <span>{onlineUsers.length}</span>
          </div>
          <button onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <div className={styles.errorContent}>
            {error}
            {error.includes('log in') && (
              <button 
                className={styles.loginButton}
                onClick={() => {
                  setError('');
                  setIsOpen(false);
                  navigate('/signIn');
                }}
              >
                <LogIn size={16} />
                Log In
              </button>
            )}
          </div>
          <button className={styles.closeError} onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className={styles.messagesContainer} ref={chatWindowRef}>
        {hasMore && (
          <button 
            className={styles.loadMore}
            onClick={() => {
              setPage(prev => prev + 1);
              loadMessages();
            }}
          >
            Load more messages
          </button>
        )}

        {messages.map(renderMessage)}
        
        {typingUsers.length > 0 && (
          <div className={styles.typingIndicator}>
            {typingUsers.map(user => user.username).join(', ')} 
            {typingUsers.length === 1 ? ' is' : ' are'} typing...
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {replyToMessage && (
        <div className={styles.replyBar}>
          <span>Replying to {replyToMessage.senderName}</span>
          <button onClick={() => setReplyToMessage(null)}>×</button>
        </div>
      )}

      {editingMessage && (
        <div className={styles.editBar}>
          <span>Editing message</span>
          <button onClick={() => setEditingMessage(null)}>×</button>
        </div>
      )}

      <div className={styles.inputContainer}>
        <div className={styles.inputActions}>
          <button onClick={() => fileInputRef.current?.click()}>
            <Image size={20} />
          </button>
          <button onClick={() => fileInputRef.current?.click()}>
            <Video size={20} />
          </button>
          <button onClick={() => fileInputRef.current?.click()}>
            <Mic size={20} />
          </button>
        </div>

        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
              handleTyping(false);
            }
          }}
          placeholder={editingMessage ? "Edit your message..." : "Type a message..."}
          className={styles.messageInput}
          disabled={!isConnected || isLoading}
        />

        <button 
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || !isConnected || isLoading}
          className={styles.sendButton}
        >
          <Send size={20} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileUpload(file);
            }
          }}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default CommunityChat;