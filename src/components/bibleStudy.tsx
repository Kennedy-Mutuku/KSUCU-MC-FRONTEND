import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/bs.module.css';
import { Link } from 'react-router-dom';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';

const Bs: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        residence: '',
        yos: '',
        phone: '',
        gender: '' // Add gender field here
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Clear error after 5 seconds
    React.useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, gender: e.target.value });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true); // Set loading to true to disable the button
        setError('');

        // Validation
        if (!formData.name.trim()) {
            setError('Please enter your full name');
            setLoading(false);
            return;
        }
        if (!formData.phone.trim()) {
            setError('Please enter your phone number');
            setLoading(false);
            return;
        }
        if (!formData.yos) {
            setError('Please select your year of study');
            setLoading(false);
            return;
        }
        if (!formData.residence) {
            setError('Please select your residence');
            setLoading(false);
            return;
        }
        if (!formData.gender) {
            setError('Please select your gender');
            setLoading(false);
            return;
        }

        // Phone number validation
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(formData.phone)) {
            setError('Please enter a valid phone number (10-15 digits)');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('https://ksucu-mc.co.ke/users/bibleStudy', formData);
            console.log('Response:', response.status);
            setError('✅ Registration successful! Welcome to Bible Study!');
            
            // Clear form inputs after successful submission
            setFormData({
                name: '',
                residence: '',
                yos: '',
                phone: '',
                gender: '' 
            });
        } catch (error: any) {
            if (error.response?.status === 400) {
                setError('❌ Phone number already registered. Please use a different number.');
            } else if (error.response?.status >= 500) {
                setError('❌ Server error. Please try again later.');
            } else if (!navigator.onLine) {
                setError('❌ No internet connection. Please check your connection and try again.');
            } else {
                console.error('Error:', error);
                setError('❌ Registration failed. Please try again.');
            }
        } finally {
            setLoading(false); // Set loading to false to re-enable the button
        }
    };

    return (
        <>
            <UniversalHeader />
            <h2 className={styles.bsTitle}>Bible Study</h2>
            
            {error && (
                <div className={`${styles.error} ${error.includes('✅') ? styles.success : styles.errorMsg}`}>
                    {error}
                </div>
            )}

            <div className={styles['container']}>
                <h2 className={styles['text']}>Register</h2>

                <form onSubmit={handleSubmit} className={styles['form']}>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div>
                        <label htmlFor="phone">Phone</label>
                        <input type="number" id="phone" value={formData.phone} onChange={handleChange} required />
                    </div>

                    <div>
                        <label htmlFor="yos">Y.O.S</label>
                        <select id="yos" name="yos" value={formData.yos} className={styles['inputs']} onChange={(e) => setFormData({ ...formData, yos: e.target.value })} required>
                            <option className={styles['payment-option']} value="">--select Year of Study--</option>
                            <option value="1" className={styles['payment-option']}> 1 </option>
                            <option value="2" className={styles['payment-option']}> 2 </option>
                            <option value="3" className={styles['payment-option']}> 3 </option>
                            <option value="4" className={styles['payment-option']}> 4 </option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="residence">Residence</label>
                        <select id="residence" name="residence" value={formData.residence} className={styles['inputs']} onChange={(e) => setFormData({ ...formData, residence: e.target.value })} required>
                            <option className={styles['payment-option']} value="">--select Residence--</option>
                            <option value='Kisumu ndogo' className={styles['payment-option']}> Kisumu ndogo </option>
                            <option value='nyamage' className={styles['payment-option']}> nyamage</option>
                            <option value='Fanta' className={styles['payment-option']}> Fanta </option>
                        </select>
                    </div>

                    {/* Gender selection */}
                    <div>
                        <label>Gender</label>
                        <div>
                            <input
                                type="radio"
                                id="gender-m"
                                name="gender"
                                value="M"
                                checked={formData.gender === 'M'}
                                onChange={handleGenderChange}
                                required
                            />
                            <label htmlFor="gender-m">Male</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="gender-f"
                                name="gender"
                                value="F"
                                checked={formData.gender === 'F'}
                                onChange={handleGenderChange}
                                required
                            />
                            <label htmlFor="gender-f">Female</label>
                        </div>
                    </div>

                </form>

                <div className={styles['submisions']}>
                    <div className={styles['clearForm']} onClick={() => setFormData({ name: '', residence: '', yos: '', phone: '', gender: '' })}>Clear</div>
                    <button className={styles['submitData']} type="submit" disabled={loading}>
                        <span className={styles['submitDataButton']}>
                            {loading ? (
                                <>
                                    <span className={styles.spinner}></span>
                                    Submitting...
                                </>
                            ) : (
                                'Register Now'
                            )}
                        </span>
                    </button>
                </div>

                <div className={styles['form-footer']}>
                    <p><Link to={"/Home"}>Home</Link></p>
                </div>

            </div>
            <Footer />
        </>
    );
};

export default Bs;
