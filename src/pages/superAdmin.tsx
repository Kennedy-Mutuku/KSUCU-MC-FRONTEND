import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/superAdmin.module.css';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import { getApiUrl } from '../config/environment';

interface Message {
    _id: string;
    subject: string;
    message: string;
    category: string;
    isAnonymous: boolean;
    senderInfo?: {
        username?: string;
        email?: string;
        ministry?: string;
        yos?: number;
    };
    timestamp: string;
    isRead: boolean;
    status: string;
}

const SuperAdmin: React.FC = () => {
    const [userCount, setUserCount] = useState<number>(0);
    const [usersByYos, setUsersByYos] = useState<{ [key: string]: number }>({});
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [usersByMinistry, setUsersByMinistry] = useState<{ [key: string]: number }>({});
    const [usersByEt, setUsersByEt] = useState<{ [key: string]: number }>({});
    const [users, setUsers] = useState<{ username: string; reg: string; course: string; yos: string }[]>([]);


    // Use dynamic API URL based on environment
    const backEndURL = getApiUrl('superAdmin').replace('/login', '');

    useEffect(() => {
        fetchUserData();
        fetchMessages();
    }, []);

    // const fetchUserData = async () => {
    //     try {
    //         const response = await axios.get(`${backEndURL}/users`, { withCredentials: true });
    //         const users = response.data;
    //         console.log(response.data);
            
    //         setUserCount(users.length);
            
    //         const groupedUsers: { [key: string]: number } = {};

    //         users.forEach((user: { yos: string }) => {
    //             groupedUsers[user.yos] = (groupedUsers[user.yos] || 0) + 1;
    //         });
    //         setUsersByYos(groupedUsers);
    //     } catch (err) {
    //         console.error('Error fetching user data:', err);
    //         setError('Failed to fetch user data');
    //     }
    // };

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${backEndURL}/users`, { withCredentials: true });
            const users = response.data;
            console.log(response.data);
            
            setUserCount(users.length);
            setUsers(users); // Store users for the table
    
            // Categorizing users by yos, ministry, and et
            const groupedByYos: { [key: string]: number } = {};
            const groupedByMinistry: { [key: string]: number } = {};
            const groupedByEt: { [key: string]: number } = {};
    
            users.forEach((user: { yos: string, ministry: string, et: string }) => {
                groupedByYos[user.yos] = (groupedByYos[user.yos] || 0) + 1;
                groupedByMinistry[user.ministry] = (groupedByMinistry[user.ministry] || 0) + 1;
                groupedByEt[user.et] = (groupedByEt[user.et] || 0) + 1;
            });
    
            setUsersByYos(groupedByYos);
            setUsersByMinistry(groupedByMinistry);
            setUsersByEt(groupedByEt);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError('Failed to fetch user data');
        }
    };
    
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${backEndURL}/messages`, { withCredentials: true });
            const messages = response.data;
            console.log('Messages fetched:', messages);

            setMessages(messages);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError('Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading ......</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
                  <UniversalHeader />
            <div className={styles.container}>
                <h4>Total Students: {userCount}</h4>

                <h5>Category by Year of Study:</h5>
                <ul>
                    {Object.entries(usersByYos).map(([yos, count]) => (
                        <li key={yos}>YOS {yos} - {count} students</li>
                    ))}
                </ul>

                <h5>Category by Ministry:</h5>
                <ul>
                    {Object.entries(usersByMinistry).map(([ministry, count]) => (
                        <li key={ministry}>{ministry} - {count} students</li>
                    ))}
                </ul>

                <h5>Category by ET:</h5>
                <ul>
                    {Object.entries(usersByEt).map(([et, count]) => (
                        <li key={et}>{et} - {count} students</li>
                    ))}
                </ul>


                <h5>Messages & Feedback</h5>

                <div className={styles.categoryFilter}>
                    <label htmlFor="categorySelect">Filter by Category: </label>
                    <select
                        id="categorySelect"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={styles.categoryDropdown}
                    >
                        <option value="all">All Categories</option>
                        <option value="feedback">Feedback</option>
                        <option value="suggestion">Suggestion</option>
                        <option value="complaint">Complaint</option>
                        <option value="praise">Praise</option>
                        <option value="prayer">Prayer</option>
                        <option value="technical">Technical</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className={styles.feedbackSection}>
                    {messages.length === 0 ? (
                        <p>No messages yet.</p>
                    ) : (
                        <div className={styles.messagesContainer}>
                            {messages
                                .filter(msg => selectedCategory === 'all' || msg.category === selectedCategory)
                                .map((msg) => (
                                <div key={msg._id} className={styles.messageCard}>
                                    <div className={styles.messageHeader}>
                                        <span className={styles.category}>{msg.category}</span>
                                        <span className={styles.timestamp}>
                                            {new Date(msg.timestamp).toLocaleDateString()} {new Date(msg.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <h6 className={styles.subject}>{msg.subject}</h6>
                                    <p className={styles.messageContent}>{msg.message}</p>
                                    <div className={styles.messageFooter}>
                                        {msg.isAnonymous ? (
                                            <span className={styles.anonymous}>Anonymous</span>
                                        ) : (
                                            <span className={styles.sender}>
                                                From: {msg.senderInfo?.username || 'Unknown'}
                                                {msg.senderInfo?.email && ` (${msg.senderInfo.email})`}
                                                {msg.senderInfo?.ministry && ` - ${msg.senderInfo.ministry}`}
                                                {msg.senderInfo?.yos && ` - YOS ${msg.senderInfo.yos}`}
                                            </span>
                                        )}
                                        <span className={styles.status}>{msg.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <h5>List of all Students</h5>
                <table className={styles.studentTable}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Reg</th>
                            <th>Course</th>
                            <th>Year of Study (YOS)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.username}</td>
                                <td>{user.reg}</td>
                                <td>{user.course}</td>
                                <td>{user.yos}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            <Footer />
        </>
    );
};

export default SuperAdmin;

