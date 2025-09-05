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
    const [residences, setResidences] = useState<Array<{_id: string, name: string, description: string}>>([]);
    
    // Load saved form data on component mount
    React.useEffect(() => {
        const savedData = localStorage.getItem('bibleStudyFormData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                if (parsedData && (parsedData.name || parsedData.phone || parsedData.residence || parsedData.yos || parsedData.gender)) {
                    setFormData(parsedData);
                    setError('📋 Your previous form data has been restored. Continue filling or click Clear to start fresh.');
                    setTimeout(() => setError(''), 5000);
                }
            } catch (error) {
                console.error('Error loading saved form data:', error);
                localStorage.removeItem('bibleStudyFormData'); // Remove corrupted data
            }
        }
    }, []);

    // Save form data to localStorage whenever it changes
    React.useEffect(() => {
        const dataToSave = {
            ...formData,
            // Don't save empty form
            hasData: formData.name.trim() || formData.phone.trim() || formData.residence || formData.yos || formData.gender
        };
        
        if (dataToSave.hasData) {
            localStorage.setItem('bibleStudyFormData', JSON.stringify(formData));
        }
    }, [formData]);

    // Fetch residences on component mount
    React.useEffect(() => {
        const fetchResidences = async () => {
            try {
                const response = await axios.get('https://ksucu-mc.co.ke/adminBs/residences');
                setResidences(response.data);
            } catch (error) {
                console.error('Error fetching residences:', error);
                // Keep the hardcoded fallback if API fails
                setResidences([
                    {_id: '1', name: 'Kisumu ndogo', description: ''},
                    {_id: '2', name: 'nyamage', description: ''},
                    {_id: '3', name: 'Fanta', description: ''}
                ]);
            }
        };
        fetchResidences();
    }, []);

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
            console.log('Submitting form data:', formData);
            
            const response = await axios.post('https://ksucu-mc.co.ke/users/bibleStudy', formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 second timeout
            });
            
            console.log('Response:', response.status, response.data);
            setError('✅ Registration successful! Welcome to Bible Study!');
            
            // Clear form inputs and localStorage after successful submission
            const clearedData = {
                name: '',
                residence: '',
                yos: '',
                phone: '',
                gender: '' 
            };
            setFormData(clearedData);
            localStorage.removeItem('bibleStudyFormData');
            
        } catch (error: any) {
            console.error('Full error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                code: error.code
            });
            
            if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                setError('❌ Request timeout. Please check your internet connection and try again.');
            } else if (error.response?.status === 400) {
                const message = error.response?.data?.message || 'Phone number already registered. Please use a different number.';
                setError(`❌ ${message}`);
            } else if (error.response?.status >= 500) {
                setError('❌ Server error. Please try again in a few minutes.');
            } else if (error.code === 'ERR_NETWORK' || !navigator.onLine) {
                setError('❌ No internet connection. Please check your connection and try again.');
            } else if (error.response?.status === 404) {
                setError('❌ Service unavailable. Please contact support.');
            } else {
                const message = error.response?.data?.message || error.message || 'Registration failed';
                setError(`❌ ${message}. Please try again.`);
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
                            {residences.map((residence) => (
                                <option key={residence._id} value={residence.name} className={styles['payment-option']}>
                                    {residence.name}
                                </option>
                            ))}
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
                    <div className={styles['clearForm']} onClick={() => {
                        const clearedData = { name: '', residence: '', yos: '', phone: '', gender: '' };
                        setFormData(clearedData);
                        localStorage.removeItem('bibleStudyFormData');
                        setError('Form cleared');
                        setTimeout(() => setError(''), 2000);
                    }}>Clear</div>
                    <button className={styles['submitData']} type="button" onClick={handleSubmit} disabled={loading}>
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
