import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/superAdmin.module.css';
import Header from '../components/header';
import Footer from '../components/footer';

const SuperAdmin: React.FC = () => {
    const [userCount, setUserCount] = useState<number>(0);
    const [usersByYos, setUsersByYos] = useState<{ [key: string]: number }>({});
    const [anonymousFeedback, setAnonymousFeedback] = useState<string[]>([]);
    const [nonAnonymousFeedback, setNonAnonymousFeedback] = useState<{ name: string, message: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const backEndURL = 'https://ksucu-mc.co.ke/sadmin';

    useEffect(() => {
        fetchUserData();
        fetchFeedback();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${backEndURL}/users`, { withCredentials: true });
            const users = response.data;
            console.log(response.data);
            
            setUserCount(users.length);
            
            const groupedUsers: { [key: string]: number } = {};
            users.forEach((user: { yos: string }) => {
                groupedUsers[user.yos] = (groupedUsers[user.yos] || 0) + 1;
            });
            setUsersByYos(groupedUsers);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError('Failed to fetch user data');
        }
    };

    const fetchFeedback = async () => {
        try {
            const response = await axios.get(`${backEndURL}/feedback`, { withCredentials: true });
            const feedback = response.data;
            console.log(response.data);
            
            
            const anonymous: string[] = [];
            const nonAnonymous: { name: string, message: string }[] = [];
            
            feedback.forEach((item: { anonymous: boolean, name?: string, message: string }) => {
                if (item.anonymous) {
                    anonymous.push(item.message);
                } else {
                    nonAnonymous.push({ name: item.name || 'Unknown', message: item.message });
                }
            });
            
            setAnonymousFeedback(anonymous);
            setNonAnonymousFeedback(nonAnonymous);
        } catch (err) {
            console.error('Error fetching feedback:', err);
            setError('Failed to fetch feedback');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading data...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <Header />
            <div className={styles.container}>
                <h4>Total Users: {userCount}</h4>
                <h5>Users by Year of Study:</h5>
                <ul>
                    {Object.entries(usersByYos).map(([yos, count]) => (
                        <li key={yos}>YOS {yos} - {count} students</li>
                    ))}
                </ul>
                
                <h5>Feedback</h5>
                <div className={styles.feedbackSection}>
                    <div>
                        <h6>Anonymous Feedback</h6>
                        <ul>
                            {anonymousFeedback.map((msg, index) => (
                                <li key={index}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h6>Non-Anonymous Feedback</h6>
                        <ul>
                            {nonAnonymousFeedback.map((feedback, index) => (
                                <li key={index}><strong>{feedback.name}:</strong> {feedback.message}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SuperAdmin;
