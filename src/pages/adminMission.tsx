import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/savedSoulsList.module.css'; 
import Header from '../components/header';
import Footer from '../components/footer';

const SavedSoulsList: React.FC = () => {
  const [souls, setSouls] = useState<Array<{ name: string, phone: string, region: string, village: string }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const backEndURL = 'http://localhost:3000';

  useEffect(() => {
    fetchSavedSouls();
  }, []);

  const fetchSavedSouls = async () => {
    try {
      const response = await axios.get(`${backEndURL}/adminmission/souls`, { withCredentials: true });
      setSouls(response.data);  
      setLoading(false);
    } catch (err) {
      console.error('Error fetching saved souls:');
      setError('Failed to fetch saved souls');
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading saved souls...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <> 
        <Header />
        <div className={styles.container}>
        <h4>Saved Souls List</h4>
        {souls.length === 0 ? (
            <p>No souls have been saved yet.</p>
        ) : (
            <table className={styles.table}>
            <thead>
                <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Region</th>
                <th>Village</th>
                </tr>
            </thead>
            <tbody>
                {souls.map((soul, index) => (
                <tr key={index}>
                    <td>{soul.name}</td>
                    <td>{soul.phone}</td>
                    <td>{soul.region}</td>
                    <td>{soul.village}</td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </div>
        <Footer />
    </>
  );
};

export default SavedSoulsList;

