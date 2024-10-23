import React, { useState, useEffect } from 'react';
import styles from '../styles/savedSouls.module.css';
import Header from '../components/header';
import axios from 'axios';
import Footer from '../components/footer';

const SavedSouls: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [village, setVillage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState('');
  const [userCount, setUserCount] = useState<number | null>(null);

  const backEndURL = 'http://localhost:3000';

  useEffect(() => {
    fetchUserCount()
  }, []);

  const handleSubmit = async () => {
    if (loading) return;  // Prevent multiple submissions
  
    setLoading(true);  // Set loading to true to disable the button
    
    // Input validation
    if (!name || !phone || !region || !village) {
      setError('Please make sure you fill all inputs');
      setLoading(false);  // Re-enable the button
      return;
    }
  
    // Using axios for POST request
    axios.post(`${backEndURL}/users/save-soul`, {
        name, 
        phone, 
        region, 
        village
      })
      .then(() => {
        // Clear input fields upon success
        fetchUserCount()
        setName('');
        setPhone('');
        setRegion('');
        setVillage('');
        setError('Thank you for winning a soul for Christ!');
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          // Handle specific 404 error
          setError('Phone number already Registered.');
        } else {
          // Handle other errors
          console.error('Error:', error);
          setError('Failed to submit the form. Please try again later.');
        }
      })
      .finally(() => {
        setLoading(false);  // Re-enable the button after submission
      });
  };
  
  const fetchUserCount = async () => {
    try {
      const response = await axios.get<{ count: number }>('http://localhost:3000/users/countSaved');
      setUserCount(response.data.count);
    } catch (err) {
      console.error('Error fetching user count:');
      setError('Failed to fetch soul count');
    }
  };


  return (
    <>
        <Header />
        <div className={styles.container}>

            <h4 className={styles.title}>MISSION DEPARTMENT</h4>
            <h6 className={styles['title-sub']}>...teach all nations, baptizing them in the name of the father of the son and of the Holy Ghost (Math 28vs19)</h6>

            <div className={styles.flex}>
              
              <form className={styles.row} id="postForm">
                <h4 className={styles['sub-title']}>Win a Soul For Christ</h4>
                {error && <div className={styles.error}>{error}</div>}
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label htmlFor="phone">Phone:</label>
                <input
                    type="number"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />

                <label htmlFor="village">Village/Hostel:</label>
                <input
                    type="text"
                    id="village"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    required
                />

                <label htmlFor="region">Region:</label>
                <input
                    type="text"
                    id="region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    required
                />

                <button type="button" className={styles['submit-btn']} onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Adding...' : 'Add'}
                </button>

              </form>

            </div>

            <div className={styles.wonStatus}>

              <p className={styles.wonSoulsStatus}>Souls Won</p>
              <p className={styles.numberWon}>{userCount || 0} </p>
                
            </div>

        </div>

        <Footer />
    </>
  );
};

export default SavedSouls;
