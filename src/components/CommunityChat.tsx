import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Users, Image, Mic, Video, Edit, Trash2, Reply, Check, CheckCheck, Heart, ThumbsDown } from 'lucide-react';
import socketService from '../services/socketService';
import { getApiUrl, getBaseUrl } from '../config/environment';
import styles from '../styles/CommunityChat.module.css';
import Cookies from 'js-cookie';

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
  deletedFor?: {
    userId?: string;
    username?: string;
    deletedAt: string;
  }[];
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: {
    _id: string;
    message: string;
    senderName: string;
    timestamp: string;
  };
  reactions?: {
    likes: {
      userId?: string;
      username?: string;
      timestamp: string;
    }[];
    dislikes: {
      userId?: string;
      username?: string;
      timestamp: string;
    }[];
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
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [longPressMessage, setLongPressMessage] = useState<Message | null>(null);
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [pressTimer, setPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  
  // Media recording states
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<ReturnType<typeof setInterval> | null>(null);
  
  // Swipe to reply states
  const [swipeStartX, setSwipeStartX] = useState(0);
  const [swipeStartY, setSwipeStartY] = useState(0);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [swipingMessage, setSwipingMessage] = useState<string | null>(null);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchCurrentUser = async () => {
    try {
      console.log('🔍 Chat: Fetching user data...');
      
      // Use the same method as UniversalHeader
      const apiUrl = getApiUrl('users');
      const response = await fetch(apiUrl, {
        credentials: 'include'
      });
      
      console.log('🔍 Chat: Response status:', response.status);
      const data = await response.json();
      console.log('🔍 Chat: Response data:', data);
      
      if (!response.ok) {
        console.log('❌ Chat: Response not ok:', data.message);
        setCurrentUser(null);
        return false;
      }
      
      // Check if we have user data (same as UniversalHeader)
      if (data && data.username && data._id) {
        // Use the full username from database, not just first name
        setCurrentUser({
          username: data.username,
          userId: data._id
        });
        console.log('✅ Chat: User authenticated successfully:', data.username);
        return true; // User is logged in
      } else {
        console.log('❌ Chat: No valid user data found in response');
        setCurrentUser(null);
        return false; // User is not logged in
      }
    } catch (error: any) {
      console.error('❌ Chat: Failed to fetch current user:', error);
      setCurrentUser(null);
      return false; // Failed to authenticate
    }
  };

  const connectSocket = async () => {
    try {
      setIsLoading(true);
      setError(''); // Clear any previous errors
      
      // Require authentication for chat access
      const isAuthenticated = await fetchCurrentUser();

      // If not authenticated, show login prompt
      if (!isAuthenticated) {
        setShowLoginPrompt(true);
        setIsLoading(false);
        return;
      }

      // Connect to socket with authenticated user
      await socketService.connect();
      setIsConnected(true);
      setupSocketListeners();
      loadMessages();
    } catch (error: any) {
      console.error('Failed to connect to chat:', error);
      setError('Failed to connect to chat. Please try again.');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const setupSocketListeners = () => {
    socketService.onNewMessage((message: Message) => {
      console.log('🔍 Chat: Received new message:', message);
      console.log('🔍 Chat: Current user when receiving message:', currentUser);
      setMessages(prev => [...prev, message]);
      
      // Auto-mark messages as delivered if they're from other users
      if (currentUser && message.senderId !== currentUser.userId) {
        setTimeout(() => {
          socketService.updateMessageStatus(message._id, 'delivered');
          
          // Auto-mark as read after a short delay (simulating user viewing)
          setTimeout(() => {
            socketService.updateMessageStatus(message._id, 'read');
          }, 2000);
        }, 500);
      }
      
      setTimeout(scrollToBottom, 100);
    });

    socketService.onMessageEdited((message: Message) => {
      setMessages(prev => prev.map(msg => 
        msg._id === message._id ? message : msg
      ));
    });

    socketService.onMessageDeleted(({ messageId }: { messageId: string }) => {
      // Mark message as deleted for everyone (show "This message was deleted")
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, deleted: true, message: '', mediaUrl: undefined } : msg
      ));
    });

    socketService.onMessageDeletedForUser(({ messageId }: { messageId: string; userId?: string; username?: string }) => {
      // Remove message from view only for the specific user
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
    });

    socketService.onMessageStatusUpdated(({ messageId, status }: { messageId: string; status: string }) => {
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, status: status as any } : msg
      ));
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

    socketService.onReactionUpdate(({ messageId, reactions }: { messageId: string; reactions: any }) => {
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, reactions } : msg
      ));
    });
  };

  const loadMessages = async () => {
    try {
      console.log('💬 Chat: Loading messages...');
      
      const apiUrl = `${getApiUrl('chatMessages')}?page=${page}&limit=50`;
      const response = await fetch(apiUrl, {
        credentials: 'include'
      });
      
      const data = await response.json();
      console.log('💬 Chat: Messages response:', data);
      
      if (response.ok && data.success) {
        setMessages(prev => page === 1 ? data.messages : [...data.messages, ...prev]);
        setHasMore(data.hasMore);
        if (page === 1) {
          setTimeout(scrollToBottom, 100);
        }
        console.log('💬 Chat: Messages loaded successfully');
      } else {
        console.error('💬 Chat: Failed to load messages:', data.message);
        setError('Failed to load messages');
      }
    } catch (error) {
      console.error('💬 Chat: Error loading messages:', error);
      setError('Failed to load messages');
    }
  };

  const handleSendMessage = async () => {
    console.log('handleSendMessage called', { 
      newMessage: newMessage, 
      trimmed: newMessage.trim(), 
      isConnected, 
      isLoading 
    });
    
    if (!newMessage.trim() || !isConnected) {
      console.log('Send message blocked:', { 
        hasMessage: !!newMessage.trim(), 
        isConnected, 
        isLoading 
      });
      return;
    }

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

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 10MB.');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/', 'video/', 'audio/', 'application/pdf', 'text/', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const isValidType = allowedTypes.some(type => file.type.startsWith(type));
    
    if (!isValidType) {
      setError('File type not supported. Please upload images, videos, audio, PDF, or document files.');
      return;
    }

    const formData = new FormData();
    formData.append('media', file);
    if (replyToMessage) {
      formData.append('replyTo', replyToMessage._id);
    }

    try {
      setIsLoading(true);
      setError(''); // Clear previous errors
      
      const fileType = file.type.startsWith('image/') ? 'image' : 
                      file.type.startsWith('video/') ? 'video' : 
                      file.type.startsWith('audio/') ? 'audio' : 'file';
      
      console.log(`📁 Chat: Uploading ${fileType}...`, {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Get authentication token from cookies
      const token = Cookies.get('socket_token');
      
      // Prepare headers
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(getApiUrl('chatUpload'), {
        method: 'POST',
        credentials: 'include',
        headers: headers,
        body: formData
      });

      const data = await response.json();
      console.log('📁 Chat: Upload response:', data);

      if (response.ok && data.success) {
        setReplyToMessage(null);
        console.log(`📁 Chat: ${fileType} uploaded successfully`);
        setError(`✅ ${fileType.charAt(0).toUpperCase() + fileType.slice(1)} sent successfully!`);
        setTimeout(() => setError(''), 3000);
      } else {
        console.error('📁 Chat: Failed to upload file:', data.message);
        
        // Handle specific authentication errors
        if (response.status === 401 || response.status === 403) {
          if (!token) {
            setError('❌ Please log in to upload media files. You can still send text messages as a guest.');
          } else {
            setError('❌ Your session has expired. Please log in again to upload media files.');
          }
        } else if (response.status === 413) {
          setError('❌ File too large. Please choose a smaller file (max 10MB).');
        } else if (response.status === 415) {
          setError('❌ File type not supported. Please upload images, videos, audio, or document files.');
        } else {
          setError(`❌ Failed to upload ${fileType}: ${data.message || 'Unknown error'}`);
        }
      }
    } catch (error: any) {
      console.error('📁 Chat: Error uploading file:', error);
      if (error.name === 'NetworkError' || !navigator.onLine) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Failed to upload file. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Voice Recording Functions
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'voice_message.webm', { type: 'audio/webm' });
        handleFileUpload(audioFile);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start recording
      recorder.start();
      
      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingTimer(timer);
      
      console.log('🎤 Started voice recording');
    } catch (error) {
      console.error('Error starting voice recording:', error);
      setError('Could not access microphone. Please check permissions.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
      
      if (recordingTimer) {
        clearInterval(recordingTimer);
        setRecordingTimer(null);
      }
      
      console.log('🎤 Stopped voice recording');
    }
  };

  const cancelVoiceRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setMediaRecorder(null);
      setRecordingTime(0);
      
      if (recordingTimer) {
        clearInterval(recordingTimer);
        setRecordingTimer(null);
      }
      
      console.log('🎤 Cancelled voice recording');
    }
  };

  // Media Type Handlers
  const handleImageUpload = () => {
    imageInputRef.current?.click();
  };

  const handleVideoUpload = () => {
    videoInputRef.current?.click();
  };

  const handleVoiceMessage = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  const renderMessageStatus = (status: string) => {
    switch (status) {
      case 'sending':
        return <div className={styles.messageStatus} title="Sending">⏳</div>;
      case 'sent':
        return <div title="Sent"><Check size={14} className={`${styles.messageStatus} ${styles.sent}`} /></div>;
      case 'delivered':
        return <div title="Delivered"><CheckCheck size={14} className={`${styles.messageStatus} ${styles.delivered}`} /></div>;
      case 'read':
        return <div title="Read"><CheckCheck size={14} className={`${styles.messageStatus} ${styles.read}`} /></div>;
      default:
        return null;
    }
  };


  const handleDeleteForMe = async () => {
    if (longPressMessage) {
      try {
        // Pass the message ID - backend will identify user from socket connection
        await socketService.deleteMessageForMe(longPressMessage._id);
        setShowDeleteOptions(false);
        setLongPressMessage(null);
      } catch (error) {
        console.error('Error deleting message for me:', error);
        setError('Failed to delete message');
      }
    }
  };

  const handleReaction = async (messageId: string, reactionType: 'like' | 'dislike') => {
    try {
      const token = Cookies.get('socket_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const body = { reactionType };

      const response = await fetch(getApiUrl(`chat/react/${messageId}`), {
        method: 'POST',
        credentials: 'include',
        headers: headers,
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update message in local state
        setMessages(prev => prev.map(msg => 
          msg._id === messageId ? data.message : msg
        ));
        
        // Also emit through socket for real-time updates
        socketService.addReaction(messageId, reactionType);
      } else {
        console.error('Failed to add reaction:', data.message);
        setError(`Failed to ${reactionType} message: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      setError(`Failed to ${reactionType} message`);
    }
  };

  const hasUserReacted = (reactions: any, reactionType: 'likes' | 'dislikes'): boolean => {
    if (!reactions || !currentUser) return false;
    
    return reactions[reactionType]?.some((reaction: any) => {
      return reaction.userId?.toString() === currentUser.userId.toString();
    }) || false;
  };

  const handleDeleteForAll = async () => {
    if (longPressMessage && currentUser) {
      // Double-check that the current user owns the message
      const userIdMatch = longPressMessage.senderId === currentUser.userId;
      const usernameMatch = longPressMessage.senderName === currentUser.username;
      const trimmedUsernameMatch = !!(currentUser.username && longPressMessage.senderName === currentUser.username.trim());
      const caseInsensitiveUsernameMatch = !!(currentUser.username && 
        longPressMessage.senderName.toLowerCase() === currentUser.username.toLowerCase());
      const trimmedCaseInsensitiveMatch = !!(currentUser.username && 
        longPressMessage.senderName.toLowerCase().trim() === currentUser.username.toLowerCase().trim());
      
      const isOwn = userIdMatch || usernameMatch || trimmedUsernameMatch || 
                    caseInsensitiveUsernameMatch || trimmedCaseInsensitiveMatch;
      
      if (!isOwn) {
        setError('You can only delete your own messages for everyone.');
        setShowDeleteOptions(false);
        setLongPressMessage(null);
        return;
      }
      
      try {
        await socketService.deleteMessage(longPressMessage._id);
        setShowDeleteOptions(false);
        setLongPressMessage(null);
      } catch (error) {
        console.error('Error deleting message for all:', error);
        setError('Failed to delete message');
      }
    }
  };

  // Swipe to reply handlers (separate from long press)
  const handleSwipeStart = (e: React.TouchEvent, message: Message) => {
    const touch = e.touches[0];
    setSwipeStartX(touch.clientX);
    setSwipeStartY(touch.clientY);
    setSwipingMessage(message._id);
    setIsSwipeActive(true);
    setSwipeDistance(0);
    
    // Cancel any ongoing long press when starting swipe
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleSwipeMove = (e: React.TouchEvent, message: Message) => {
    if (!isSwipeActive || swipingMessage !== message._id) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - swipeStartX;
    const deltaY = Math.abs(touch.clientY - swipeStartY);
    
    // If user is swiping horizontally, cancel long press
    if (Math.abs(deltaX) > 10) {
      if (pressTimer) {
        clearTimeout(pressTimer);
        setPressTimer(null);
      }
    }
    
    // Only allow horizontal swipes (prevent vertical scrolling interference)
    if (deltaY > 30) {
      handleSwipeEnd();
      return;
    }
    
    // Only track rightward swipes (positive deltaX)
    if (deltaX > 0 && deltaX <= 80) {
      setSwipeDistance(deltaX);
      e.preventDefault(); // Prevent scrolling when swiping
    }
  };

  const handleSwipeEnd = () => {
    if (swipeDistance > 40 && swipingMessage) {
      // Trigger reply if swipe distance is sufficient
      const messageToReply = messages.find(msg => msg._id === swipingMessage);
      if (messageToReply) {
        setReplyToMessage(messageToReply);
      }
    }
    
    // Reset swipe state
    setIsSwipeActive(false);
    setSwipingMessage(null);
    setSwipeDistance(0);
  };

  // Mouse drag handlers for desktop
  const handleMouseDragStart = (e: React.MouseEvent, message: Message) => {
    setSwipeStartX(e.clientX);
    setSwipeStartY(e.clientY);
    setSwipingMessage(message._id);
    setIsDragging(true);
    setSwipeDistance(0);
    
    // Cancel any ongoing long press when starting drag
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    
    e.preventDefault(); // Prevent text selection
  };

  const handleMouseDragMove = (e: React.MouseEvent, message: Message) => {
    if (!isDragging || swipingMessage !== message._id) return;
    
    const deltaX = e.clientX - swipeStartX;
    const deltaY = Math.abs(e.clientY - swipeStartY);
    
    // If user is dragging horizontally, cancel long press
    if (Math.abs(deltaX) > 10) {
      if (pressTimer) {
        clearTimeout(pressTimer);
        setPressTimer(null);
      }
    }
    
    // Only allow horizontal drags (prevent vertical scrolling interference)
    if (deltaY > 30) {
      handleMouseDragEnd();
      return;
    }
    
    // Only track rightward drags (positive deltaX)
    if (deltaX > 0 && deltaX <= 80) {
      setSwipeDistance(deltaX);
      e.preventDefault(); // Prevent text selection
    }
  };

  const handleMouseDragEnd = () => {
    if (swipeDistance > 40 && swipingMessage) {
      // Trigger reply if drag distance is sufficient
      const messageToReply = messages.find(msg => msg._id === swipingMessage);
      if (messageToReply) {
        setReplyToMessage(messageToReply);
      }
    }
    
    // Reset drag state
    setIsDragging(false);
    setSwipingMessage(null);
    setSwipeDistance(0);
  };

  const renderMessage = (message: Message) => {
    // Enhanced ownership detection with debugging
    let isOwn = false;
    
    if (currentUser) {
      // Check multiple comparison methods
      const userIdMatch = message.senderId === currentUser.userId;
      const usernameMatch = message.senderName === currentUser.username;
      const trimmedUsernameMatch = !!(currentUser.username && message.senderName === currentUser.username.trim());
      const caseInsensitiveUsernameMatch = !!(currentUser.username && 
        message.senderName.toLowerCase() === currentUser.username.toLowerCase());
      const trimmedCaseInsensitiveMatch = !!(currentUser.username && 
        message.senderName.toLowerCase().trim() === currentUser.username.toLowerCase().trim());
      
      isOwn = userIdMatch || usernameMatch || trimmedUsernameMatch || 
              caseInsensitiveUsernameMatch || trimmedCaseInsensitiveMatch;
      
      // Debug logging to help identify the issue
      console.log('Message ownership check:', {
        messageId: message._id,
        messageSenderId: message.senderId,
        messageSenderName: `"${message.senderName}"`,
        currentUserId: currentUser?.userId,
        currentUsername: `"${currentUser?.username}"`,
        userIdMatch,
        usernameMatch,
        trimmedUsernameMatch,
        caseInsensitiveUsernameMatch,
        trimmedCaseInsensitiveMatch,
        finalResult: isOwn
      });
    }
    
    // Check if message is deleted for current user (both authenticated and guest)
    const isDeletedForMe = message.deletedFor?.some(del => {
      if (currentUser?.userId) {
        return del.userId === currentUser.userId;
      } else if (currentUser?.username) {
        return del.username === currentUser.username;
      }
      return false;
    });
    
    // Don't render messages deleted for this user
    if (isDeletedForMe) return null;

    return (
      <div key={message._id} className={`${styles.messageWrapper} ${isOwn ? styles.ownMessageWrapper : styles.otherMessageWrapper}`}>
        {/* Reply icon that appears when swiping */}
        {swipingMessage === message._id && swipeDistance > 20 && (
          <div className={styles.replyIndicator} style={{
            opacity: Math.min(swipeDistance / 60, 1),
            transform: `translateX(${Math.min(swipeDistance - 40, 20)}px)`
          }}>
            <Reply size={20} />
          </div>
        )}
        <div 
          className={`${styles.message} ${isOwn ? styles.ownMessage : styles.otherMessage} ${swipingMessage === message._id ? styles.swipeActive : ''}`}
          style={{
            transform: swipingMessage === message._id ? `translateX(${swipeDistance}px)` : 'translateX(0px)',
            transition: (isSwipeActive || isDragging) && swipingMessage === message._id ? 'none' : 'transform 0.2s ease-out',
            cursor: isDragging && swipingMessage === message._id ? 'grabbing' : 'default'
          }}
          onMouseDown={(e) => {
            if (!message.deleted) {
              // Check if this is a left mouse button click for drag
              if (e.button === 0) {
                handleMouseDragStart(e, message);
                // Also start long press timer
                const timer = setTimeout(() => {
                  // Only trigger long press if no drag is active
                  if (!isDragging) {
                    setLongPressMessage(message);
                    setShowDeleteOptions(true);
                  }
                }, 800);
                setPressTimer(timer);
              }
            }
          }}
          onMouseMove={(e) => {
            if (!message.deleted && isDragging) {
              handleMouseDragMove(e, message);
            }
          }}
          onMouseUp={() => {
            handleMouseDragEnd();
            // Clear long press timer
            if (pressTimer) {
              clearTimeout(pressTimer);
              setPressTimer(null);
            }
          }}
          onMouseLeave={() => {
            handleMouseDragEnd();
            // Clear long press timer
            if (pressTimer) {
              clearTimeout(pressTimer);
              setPressTimer(null);
            }
          }}
          onTouchStart={(e) => {
            if (!message.deleted) {
              handleSwipeStart(e, message);
              // Start long press timer separately
              const timer = setTimeout(() => {
                // Only trigger long press if no swipe is active
                if (!isSwipeActive) {
                  setLongPressMessage(message);
                  setShowDeleteOptions(true);
                }
              }, 800); // Longer delay to allow swipe gestures
              setPressTimer(timer);
            }
          }}
          onTouchMove={(e) => !message.deleted && handleSwipeMove(e, message)}
          onTouchEnd={() => {
            handleSwipeEnd();
            // Clear long press timer on touch end
            if (pressTimer) {
              clearTimeout(pressTimer);
              setPressTimer(null);
            }
          }}
        >
          {message.replyTo && (
            <div className={styles.replyTo}>
              <span className={styles.replyAuthor}>{message.replyTo.senderName}</span>
              <span className={styles.replyContent}>{message.replyTo.message}</span>
            </div>
          )}
          
          <div className={styles.messageHeader}>
            <div 
              className={styles.userAvatar} 
              style={{ backgroundColor: generateUserColor(message.senderName) }}
            >
              {generateUserInitials(message.senderName)}
            </div>
            <div className={styles.senderName}>{message.senderName}</div>
          </div>

          <div className={styles.messageContent}>
            {message.deleted ? (
              <p className={styles.deletedMessage}>
                <i>This message was deleted</i>
              </p>
            ) : message.messageType === 'image' ? (
              <div>
                <img 
                  src={`${getBaseUrl()}${message.mediaUrl}`} 
                  alt={message.mediaFileName}
                  className={styles.messageImage}
                  onError={(e) => {
                    console.error('Failed to load image:', message.mediaUrl);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {message.message && <p>{message.message}</p>}
              </div>
            ) : message.messageType === 'video' ? (
              <div>
                <video 
                  src={`${getBaseUrl()}${message.mediaUrl}`} 
                  controls
                  className={styles.messageVideo}
                  onError={() => {
                    console.error('Failed to load video:', message.mediaUrl);
                  }}
                />
                {message.message && <p>{message.message}</p>}
              </div>
            ) : message.messageType === 'audio' ? (
              <div>
                <audio 
                  src={`${getBaseUrl()}${message.mediaUrl}`} 
                  controls
                  className={styles.messageAudio}
                  onError={() => {
                    console.error('Failed to load audio:', message.mediaUrl);
                  }}
                />
                {message.message && <p>{message.message}</p>}
              </div>
            ) : message.messageType === 'file' ? (
              <div className={styles.fileMessage}>
                <a 
                  href={`${getBaseUrl()}${message.mediaUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.fileLink}
                >
                  📎 {message.mediaFileName || 'Download File'}
                </a>
                {message.message && <p>{message.message}</p>}
              </div>
            ) : (
              // Default to text message if messageType is missing or unrecognized
              <p>{message.message}</p>
            )}
          </div>
          
          <div className={styles.messageFooter}>
            <span className={styles.timestamp}>
              {formatTime(message.timestamp)}
              {message.edited && <span className={styles.edited}> (edited)</span>}
            </span>
            {isOwn && message.status && renderMessageStatus(message.status)}
          </div>

          {/* Reaction section */}
          {!message.deleted && (
            <div className={styles.messageReactions}>
              <div className={styles.reactionButtons}>
                <button 
                  className={`${styles.reactionButton} ${hasUserReacted(message.reactions, 'likes') ? styles.reactionActive : ''}`}
                  onClick={() => handleReaction(message._id, 'like')}
                  title="Like this message"
                >
                  <Heart size={16} />
                  {(message.reactions?.likes?.length || 0) > 0 && (
                    <span className={styles.reactionCount}>{message.reactions?.likes?.length || 0}</span>
                  )}
                </button>
                <button 
                  className={`${styles.reactionButton} ${hasUserReacted(message.reactions, 'dislikes') ? styles.reactionActive : ''}`}
                  onClick={() => handleReaction(message._id, 'dislike')}
                  title="Dislike this message"
                >
                  <ThumbsDown size={16} />
                  {(message.reactions?.dislikes?.length || 0) > 0 && (
                    <span className={styles.reactionCount}>{message.reactions?.dislikes?.length || 0}</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {isOwn && !message.deleted && (
          <div className={styles.messageActions}>
            <button onClick={() => setReplyToMessage(message)} title="Reply">
              <Reply size={16} />
            </button>
            <button onClick={() => setEditingMessage(message)} title="Edit">
              <Edit size={16} />
            </button>
            <button onClick={() => {
              setLongPressMessage(message);
              setShowDeleteOptions(true);
            }} title="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    );
  };

  const handleLoginRedirect = () => {
    window.location.href = '/signIn';
  };

  const generateUserInitials = (username: string): string => {
    return username
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const generateUserColor = (username: string): string => {
    const colors = [
      '#730051', '#8b1c5b', '#0099cc', '#00c6ff', '#ef4444', 
      '#f59e0b', '#10b981', '#8b5cf6', '#f97316', '#06b6d4'
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  useEffect(() => {
    if (isOpen && !isConnected && !showLoginPrompt) {
      connectSocket();
    }
    
    // Trigger AI chatbot visibility update when chat opens/closes
    setTimeout(() => {
      const chatbaseFrame = document.querySelector('iframe[src*="chatbase.co"]') as HTMLIFrameElement;
      if (chatbaseFrame) {
        const currentPath = window.location.pathname;
        const isHomePage = currentPath === '/' || currentPath === '/Home' || currentPath === '/home';
        const shouldShow = isHomePage && !isOpen;
        chatbaseFrame.style.display = shouldShow ? 'block' : 'none';
      }
    }, 100);
  }, [isOpen]);

  // Handle global mouse events for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && swipingMessage) {
        const deltaX = e.clientX - swipeStartX;
        const deltaY = Math.abs(e.clientY - swipeStartY);
        
        // Cancel long press if dragging horizontally
        if (Math.abs(deltaX) > 10) {
          if (pressTimer) {
            clearTimeout(pressTimer);
            setPressTimer(null);
          }
        }
        
        // Only allow horizontal drags
        if (deltaY > 30) {
          handleMouseDragEnd();
          return;
        }
        
        // Only track rightward drags
        if (deltaX > 0 && deltaX <= 80) {
          setSwipeDistance(deltaX);
        }
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseDragEnd();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, swipingMessage, swipeStartX, swipeStartY, pressTimer]);

  useEffect(() => {
    return () => {
      socketService.disconnect();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (recordingTimer) {
        clearInterval(recordingTimer);
      }
      if (mediaRecorder && isRecording) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [recordingTimer, mediaRecorder, isRecording]);

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

  // Show login prompt for unauthenticated users
  if (showLoginPrompt) {
    return (
      <div className={styles.chatWindow}>
        <div className={styles.chatHeader}>
          <div className={styles.headerLeft}>
            <MessageCircle size={20} />
            <span>KSUCU-MC Community Chat</span>
          </div>
          <div className={styles.headerRight}>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className={styles.loginPrompt}>
          <h3>Authentication Required</h3>
          <p>Only logged-in members are allowed to access the community chat.</p>
          <p>Please log in to your account to start chatting with other members.</p>
          <div className={styles.loginPromptButtons}>
            <button 
              onClick={() => setIsOpen(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button 
              onClick={handleLoginRedirect}
              className={styles.loginButton}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <div className={styles.headerLeft}>
          <MessageCircle size={20} />
          <span>KSUCU-MC Community Chat</span>
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

      {/* Voice Recording Bar */}
      {isRecording && (
        <div className={styles.recordingBar}>
          <div className={styles.recordingInfo}>
            <div className={styles.recordingDot}></div>
            <span>Recording... {formatRecordingTime(recordingTime)}</span>
          </div>
          <div className={styles.recordingActions}>
            <button onClick={cancelVoiceRecording} className={styles.cancelRecording}>
              Cancel
            </button>
            <button onClick={stopVoiceRecording} className={styles.stopRecording}>
              Send
            </button>
          </div>
        </div>
      )}

      <div className={styles.inputContainer}>
        <div className={styles.inputActions}>
          <button 
            onClick={handleImageUpload} 
            title="Send Image"
          >
            <Image size={20} />
          </button>
          <button 
            onClick={handleVideoUpload} 
            title="Send Video"
          >
            <Video size={20} />
          </button>
          <button 
            onClick={handleVoiceMessage} 
            className={isRecording ? styles.recordingButton : ''}
            title={isRecording ? "Stop Recording" : "Record Voice Message"}
          >
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
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Send button clicked!', { 
              newMessage, 
              trimmed: newMessage.trim(), 
              isConnected, 
              isLoading, 
              disabled: !newMessage.trim() || !isConnected || isLoading 
            });
            if (newMessage.trim() && isConnected && !isLoading) {
              handleSendMessage();
            }
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Send button touch end!', { 
              newMessage, 
              trimmed: newMessage.trim(), 
              isConnected, 
              isLoading 
            });
            if (newMessage.trim() && isConnected && !isLoading) {
              handleSendMessage();
            }
          }}
          disabled={!newMessage.trim() || !isConnected || isLoading}
          className={`${styles.sendButton} ${(!newMessage.trim() || !isConnected || isLoading) ? styles.disabledSendButton : ''}`}
          style={{ 
            pointerEvents: 'auto', 
            zIndex: 2147483647,
            touchAction: 'manipulation',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
            outline: 'none'
          }}
          type="button"
          title={`Send message - ${(!newMessage.trim() || !isConnected || isLoading) ? 'Disabled' : 'Ready'}`}
        >
          <Send size={20} />
        </button>

        {/* Hidden file inputs for different media types */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileUpload(file);
            }
            e.target.value = ''; // Reset input
          }}
          style={{ display: 'none' }}
        />
        
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileUpload(file);
            }
            e.target.value = ''; // Reset input
          }}
          style={{ display: 'none' }}
        />
        
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileUpload(file);
            }
            e.target.value = ''; // Reset input
          }}
          style={{ display: 'none' }}
        />
      </div>

      {/* Delete Options Modal */}
      {showDeleteOptions && longPressMessage && (
        <div className={styles.deleteModal} onClick={() => setShowDeleteOptions(false)}>
          <div className={styles.deleteOptions} onClick={(e) => e.stopPropagation()}>
            <h3>Delete Message</h3>
            <p>Choose how you want to delete this message:</p>
            
            <button 
              className={styles.deleteOption}
              onClick={handleDeleteForMe}
            >
              <Trash2 size={16} />
              Delete for Me
              <span className={styles.deleteDescription}>
                Remove this message from your view only
              </span>
            </button>

            {/* Only show "Delete for All" if the message belongs to the current user */}
            {(() => {
              if (!currentUser || !longPressMessage) return null;
              
              // Check if current user owns the message
              const userIdMatch = longPressMessage.senderId === currentUser.userId;
              const usernameMatch = longPressMessage.senderName === currentUser.username;
              const trimmedUsernameMatch = !!(currentUser.username && longPressMessage.senderName === currentUser.username.trim());
              const caseInsensitiveUsernameMatch = !!(currentUser.username && 
                longPressMessage.senderName.toLowerCase() === currentUser.username.toLowerCase());
              const trimmedCaseInsensitiveMatch = !!(currentUser.username && 
                longPressMessage.senderName.toLowerCase().trim() === currentUser.username.toLowerCase().trim());
              
              const isOwn = userIdMatch || usernameMatch || trimmedUsernameMatch || 
                          caseInsensitiveUsernameMatch || trimmedCaseInsensitiveMatch;
              
              if (!isOwn) return null;
              
              return (
                <button 
                  className={styles.deleteOption}
                  onClick={handleDeleteForAll}
                >
                  <Trash2 size={16} />
                  Delete for All
                  <span className={styles.deleteDescription}>
                    Remove this message for everyone in the chat
                  </span>
                </button>
              );
            })()}

            <button 
              className={`${styles.deleteOption} ${styles.cancelOption}`}
              onClick={() => setShowDeleteOptions(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityChat;