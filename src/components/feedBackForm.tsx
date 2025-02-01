import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/feedback.module.css';
import Header from '../components/header';
import Footer from '../components/footer';

const FeedbackForm: React.FC = () => {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        anonymous: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };    

    const handleCheckboxChange = () => {
        setFormData({ ...formData, anonymous: !formData.anonymous });
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        if (!formData.title || !formData.message) {
            setError('Please fill in all required fields.');
            return;
        } else {
            setError('');
        }

        setLoading(true);
        try {
            const response = await axios.post('http://ksucu-mc.co.ke/users/recomendations', formData);
            console.log('Response:', response.status);
            setError('Feedback submitted successfully!');
        } catch (error: any) {
            console.error('Error:', error.status);
            if(error.status === 401){
                setError('Login required sorry')
            }else{
                setError('Failed to submit feedback. Please try again later.');
            }
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
                <h2 className={styles.text}>Submit Your Feedback</h2>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title">Title</label>
                        <select id="title" value={formData.title} onChange={handleChange} className={styles.inputs} required>
                            <option value="">-- Select a Title --</option>
                            <option value="Reviews">Reviews</option>
                            <option value="Recommendations">Recommendations</option>
                            <option value="Suggestions">Suggestions</option>
                            <option value="Concerns">Concerns</option>
                            <option value="Other Comments">Other Comments</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="message">Message</label>
                        <textarea id="message" value={formData.message} onChange={handleChange} className={styles.inputs} required />
                    </div>

                    <div className={styles.checkboxContainer}>
                        <label htmlFor="anonymous">Anonymous</label>
                        <input type="checkbox" id="anonymous" checked={formData.anonymous} onChange={handleCheckboxChange} />
                    </div>

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
