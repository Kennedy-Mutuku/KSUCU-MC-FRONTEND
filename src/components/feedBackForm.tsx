import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/environment';
import styles from '../styles/feedback.module.css';
import Header from '../components/header';
import Footer from '../components/footer';

const FeedbackForm: React.FC = () => {
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        category: 'feedback',
        isAnonymous: true
    });
    const [userData, setUserData] = useState<any>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
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
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleCheckboxChange = () => {
        setFormData({ ...formData, isAnonymous: !formData.isAnonymous });
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        if (!formData.subject || !formData.message) {
            setError('Please fill in all required fields.');
            return;
        } else {
            setError('');
        }

        setLoading(true);
        try {
            const messageData = {
                subject: formData.subject.trim(),
                message: formData.message.trim(),
                category: formData.category,
                isAnonymous: formData.isAnonymous,
                senderInfo: !formData.isAnonymous && userData ? {
                    username: userData.username,
                    email: userData.email,
                    ministry: userData.ministry,
                    yos: userData.yos
                } : null,
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
                setError('Feedback submitted successfully!');
                setFormData({
                    subject: '',
                    message: '',
                    category: 'feedback',
                    isAnonymous: true
                });
                
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error: any) {
            console.error('Error:', error);
            setError('Failed to submit feedback. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <h2 className={styles.bsTitle}>Feedback</h2>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.container}>
                <h2 className={styles.text}>Submit Your Suggestions, Feedbacks or concerns</h2>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="subject">Subject</label>
                        <input 
                            type="text"
                            id="subject" 
                            value={formData.subject} 
                            onChange={handleChange} 
                            className={styles.inputs} 
                            placeholder="Brief summary of your message..."
                            required 
                        />
                    </div>

                    <div>
                        <label htmlFor="category">Category</label>
                        <select id="category" value={formData.category} onChange={handleChange} className={styles.inputs} required>
                            <option value="feedback">General Feedback</option>
                            <option value="suggestion">Suggestion</option>
                            <option value="complaint">Complaint</option>
                            <option value="praise">Praise & Appreciation</option>
                            <option value="prayer">Prayer Request</option>
                            <option value="technical">Technical Issue</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="message">Message</label>
                        <textarea 
                            id="message" 
                            value={formData.message} 
                            onChange={handleChange} 
                            className={styles.inputs} 
                            placeholder="Share your thoughts, feedback, suggestions, or prayer requests..."
                            required 
                            rows={6}
                        />
                    </div>

                    <div className={styles.checkboxContainer}>
                        <label htmlFor="isAnonymous">
                            {formData.isAnonymous ? '🕵️‍♂️ Anonymous (Your identity will remain confidential)' : '👤 Identified (For follow-up purposes)'}
                        </label>
                        <input 
                            type="checkbox" 
                            id="isAnonymous" 
                            checked={formData.isAnonymous} 
                            onChange={handleCheckboxChange} 
                        />
                    </div>

                    {!formData.isAnonymous && userData && (
                        <div className={styles.userInfo}>
                            <p><strong>Your message will be sent from:</strong></p>
                            <p>Name: {userData.username}</p>
                            <p>Email: {userData.email}</p>
                            <p>Ministry: {userData.ministry}</p>
                        </div>
                    )}

                    {!formData.isAnonymous && !userData && (
                        <div className={styles.loginNote}>
                            <p>⚠️ Please log in to send identified messages</p>
                        </div>
                    )}

                    <section className={styles.submission}>
                        <button className={styles.submitButton} type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
                    </section>
                </form>

            </div>
            <Footer />
        </>
    );
};

export default FeedbackForm;
