import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/superAdmin.module.css';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import { getApiUrl } from '../config/environment';

const SuperAdmin: React.FC = () => {
    const [userCount, setUserCount] = useState<number>(0);
    const [usersByYos, setUsersByYos] = useState<{ [key: string]: number }>({});
    const [anonymousFeedback, setAnonymousFeedback] = useState<string[]>([]);
    const [nonAnonymousFeedback, setNonAnonymousFeedback] = useState<{ name: string, message: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [usersByMinistry, setUsersByMinistry] = useState<{ [key: string]: number }>({});
    const [usersByEt, setUsersByEt] = useState<{ [key: string]: number }>({});
    const [users, setUsers] = useState<{ username: string; reg: string; course: string; yos: string }[]>([]);


    // Use dynamic API URL based on environment
    const backEndURL = getApiUrl('superAdmin').replace('/login', '');

    useEffect(() => {
        fetchUserData();
        fetchFeedback();
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

