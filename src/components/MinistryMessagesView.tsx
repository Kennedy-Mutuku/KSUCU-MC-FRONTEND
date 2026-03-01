import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCommentDots,
    faSearch,
    faPaperPlane,
    faCheckDouble,
    faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/overseerDashboard.module.css';
import { useSearchParams } from 'react-router-dom';

interface ChatMessage {
    _id: string;
    messageId: string;
    senderId: string;
    senderName: string;
    messageContent: string;
    timestamp: string;
    isOverseer: boolean;
}

interface Message {
    _id: string;
    subject: string;
    message: string;
    category: string;
    status: 'new' | 'replied' | 'read';
    timestamp: string;
    isAnonymous: boolean;
    senderInfo?: {
        username: string;
        email: string;
        phone: string;
    };
    replyText?: string;
    repliedAt?: string;
}

interface MinistryMessagesViewProps {
    role?: string;
}

const MinistryMessagesView: React.FC<MinistryMessagesViewProps> = ({ role }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversation, setConversation] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [convLoading, setConvLoading] = useState(false);
    const selectedId = searchParams.get('messageId');
    const selectedMessage = messages.find(m => m._id === selectedId) || null;
    const [replyText, setReplyText] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const [actionMessage, setActionMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const setSelectedMessage = (msg: Message | null) => {
        const params = new URLSearchParams(searchParams);
        if (msg) params.set('messageId', msg._id);
        else params.delete('messageId');
        setSearchParams(params);
    };


    useEffect(() => {
        if (role) {
            fetchMessages();
        }
    }, [role]);

    useEffect(() => {
        if (selectedId) {
            fetchConversation(selectedId);
        } else {
            setConversation([]);
        }
    }, [selectedId]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/messages/overseer/${encodeURIComponent(role || '')}`);
            const data = response.data.messages || [];
            setMessages(data);
            if (data.length > 0 && !selectedMessage) {
                setSelectedMessage(data[0]);
            }
        } catch (err: any) {
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchConversation = async (msgId: string) => {
        try {
            setConvLoading(true);
            const response = await axiosInstance.get(`/messages/${msgId}/conversation`);
            setConversation(response.data.conversation || []);
        } catch (err) {
            console.error('Error fetching conversation:', err);
        } finally {
            setConvLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleReply();
        }
    };

    const handleReply = async () => {
        if (!selectedMessage || !replyText.trim()) return;

        setIsReplying(true);
        try {
            const response = await axiosInstance.put(`/messages/${selectedMessage._id}/reply`, {
                replyText: replyText.trim(),
                isOverseer: true
            });

            setActionMessage('Reply sent successfully!');
            setReplyText('');

            // Update local conversation state
            const newChatMsg = response.data.data;
            setConversation(prev => [...prev, newChatMsg]);

            // Update local messages state to show as replied
            setMessages(prev => prev.map(m => m._id === selectedMessage._id ? { ...m, status: 'replied' } : m));

        } catch (err: any) {
            console.error('Error sending reply:', err);
            setActionMessage(err.response?.data?.message || 'Failed to send reply');
        } finally {
            setIsReplying(false);
            setTimeout(() => setActionMessage(''), 3000);
        }
    };

    const filteredMessages = messages.filter(msg =>
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (msg.senderInfo?.username || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!role) return null;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={styles.sectionHeader}>
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">Communication Center</h3>
                    <p className="text-sm text-gray-500 mt-1">Interact with students and provide guidance</p>
                </div>
            </div>

            <div className={`${styles.chatContainer} ${selectedId ? styles.chatContainerActive : ''}`}>
                {/* Left Sidebar: Message List */}
                <div className={`${styles.chatSidebar} ${selectedId ? styles.mobileHidden : ''}`}>
                    <div className={styles.chatSidebarHeader}>
                        <div className="relative">
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-1 focus:ring-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.chatList}>
                        {filteredMessages.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <p className="text-xs">No messages found</p>
                            </div>
                        ) : (
                            filteredMessages.map(msg => (
                                <div
                                    key={msg._id}
                                    className={`${styles.chatItem} ${selectedMessage?._id === msg._id ? styles.chatItemActive : ''}`}
                                    onClick={() => setSelectedMessage(msg)}
                                >
                                    <div className={styles.chatItemHeader}>
                                        <h5>{msg.subject}</h5>
                                        <span className={styles.chatItemTime}>
                                            {new Date(msg.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`${styles.statusIndicator} ${msg.status === 'new' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                                        <p className={styles.chatItemPreview}>
                                            {msg.isAnonymous ? 'Anonymous' : msg.senderInfo?.username || 'Guest'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Pane: Conversation */}
                <div className={`${styles.chatContent} ${!selectedId ? styles.mobileHidden : ''}`}>
                    {selectedMessage ? (
                        <>
                            <div className={styles.chatHeader}>
                                <div className="flex items-center gap-3">
                                    <button
                                        className={`${styles.mobileBackBtn} md:hidden`}
                                        onClick={() => setSelectedMessage(null)}
                                    >
                                        <FontAwesomeIcon icon={faArrowLeft} />
                                    </button>
                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                        {selectedMessage.isAnonymous ? '?' : (selectedMessage.senderInfo?.username || 'G').charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 m-0">{selectedMessage.subject}</h4>
                                        <p className="text-[10px] text-gray-500 m-0">
                                            {selectedMessage.isAnonymous ? 'Anonymous Student' : `${selectedMessage.senderInfo?.username} (${selectedMessage.senderInfo?.phone || 'No Phone'})`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${selectedMessage.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                        {selectedMessage.status}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.chatBody}>
                                {convLoading ? (
                                    <div className="flex justify-center p-10">
                                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-center mb-4">
                                            <span className="text-[10px] bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                                Conversation Started {new Date(selectedMessage.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className={`${styles.messageBubble} ${styles.messageReceived}`}>
                                            <p className="m-0 whitespace-pre-wrap">{selectedMessage.message}</p>
                                            <div className="flex justify-end mt-2">
                                                <span className="text-[10px] opacity-50">
                                                    {new Date(selectedMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>

                                        {conversation.length > 0 && conversation.map((chat) => (
                                            // Skip the first message if it's identical to the original message to avoid duplication
                                            // if it was already saved in the new schema. 
                                            // But more reliably, we just show original + history after it (excluding the very first if it's the same content/time)
                                            (chat.messageContent === selectedMessage.message && chat.isOverseer === false &&
                                                Math.abs(new Date(chat.timestamp).getTime() - new Date(selectedMessage.timestamp).getTime()) < 2000)
                                                ? null : (
                                                    <div
                                                        key={chat._id}
                                                        className={`${styles.messageBubble} ${chat.isOverseer ? styles.messageSent : styles.messageReceived}`}
                                                    >
                                                        <p className="m-0 whitespace-pre-wrap">{chat.messageContent}</p>
                                                        <div className="flex justify-end items-center gap-1 mt-2">
                                                            <span className="text-[10px] opacity-50">
                                                                {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                            {chat.isOverseer && <FontAwesomeIcon icon={faCheckDouble} className="text-[10px] text-white/70" />}
                                                        </div>
                                                    </div>
                                                )
                                        ))}
                                    </>
                                )}
                            </div>

                            <div className={styles.chatFooter}>
                                <div className={styles.replyInputWrapper}>
                                    <textarea
                                        placeholder="Type your guidance here..."
                                        className={styles.chatInput}
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        rows={1}
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = 'auto';
                                            target.style.height = target.scrollHeight + 'px';
                                        }}
                                    />
                                    <button
                                        className={`${styles.btnPrimary} ${styles.chatSendBtn}`}
                                        disabled={isReplying || !replyText.trim()}
                                        onClick={handleReply}
                                    >
                                        <FontAwesomeIcon icon={faPaperPlane} />
                                        <span className="hidden md:inline ml-2">Send</span>
                                    </button>
                                </div>
                                {actionMessage && (
                                    <p className="text-[10px] text-primary font-bold mt-2 animate-pulse">{actionMessage}</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <FontAwesomeIcon icon={faCommentDots} size="3x" className="mb-4 opacity-20" />
                            <p className="font-medium">Select a message to start conversing</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MinistryMessagesView;
