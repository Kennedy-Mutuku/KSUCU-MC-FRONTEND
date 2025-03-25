import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Media.module.css';
import Header from '../components/header';
import Footer from '../components/footer';
import loadingAnime from '../assets/Animation - 1716747954931.gif';

const Media: React.FC = () => {
  const [showMediaEvents, setShowMediaEvents] = useState(false);
  const [error, setError] = useState('');

  const events = [
    { event: "Subcomm photos", date: "2025-01-20", link: "https://photos.app.goo.gl/PrxWoMuyRNEet22b7" },
    { event: "Sunday service", date: "2025-22-13", link: "https://photos.app.goo.gl/Vt6HDo1xEtgA3Nmn9" },
    { event: "Worship Weekend", date: "2025-02-10", link: "https://photos.app.goo.gl/wbNV3coJREGEUSZX7" },
    { event: "Bible Study weekend", date: "2025-01-26", link: "https://photos.app.goo.gl/otVcso25sG6fkxjR8" },
    { event: "Evangelism photos", date: "2025-02-02", link: "https://photos.app.goo.gl/JvqV19BaGGZwrVFS7" },
    { event: "Weekend Photos", date: "2025-02-09", link: "https://photos.app.goo.gl/HkBvW67gyDSvLqgS7" },
    { event: "KSUCU-MC MEGA HIKE", date: "2025-02-15", link: "https://photos.app.goo.gl/RaNP4ikjEjXLHBmbA" },
    { event: "Creative Night photos", date: "2025-02-11", link: "https://photos.app.goo.gl/qYjukQAuWAdzBpaA7" },
    { event: "Valentine's concert ", date: "2025-02-17", link: "https://photos.app.goo.gl/BvYon9KCNPL1uMu87" },
    { event: "Weekend Photos", date: "2025-02-17", link: "https://photos.app.goo.gl/gMuMfKPvCx3rTRRn8" },
    { event: "Worship Weekend", date: "14th - 16th march", link: "https://photos.app.goo.gl/t2uVjvUSepDBcx3LA" },
    { event: "Prayer Week", date: "7th - 9th March", link: "https://photos.app.goo.gl/24sm1zdBxdUege3Y6" },
    { event: "Elders Day", date: "22nd March", link: "https://photos.app.goo.gl/L9Hkr8BxnVP1MSsD6" },
    { event: "Hymn Sunday", date: "23nd March", link: "https://photos.app.goo.gl/RWWRM2zp9LkmVgtU6" },
    { event: "Sunday service", date: "24nd March", link: "https://photos.app.goo.gl/UnA7f6Aqp3kHtsxaA" },
  ];

  const [generalLoading, setgeneralLoading] = useState(false);
  const navigate = useNavigate();
    useEffect(() => {
      fetchUserData()
    },[])
  const fetchUserData = async () => {
    // check if the user in online
    if (!navigator.onLine) {
        setError('check your internet and try again...')
        return;
    }

    window.scrollTo({
        top: 0,
        behavior: 'auto' // 'auto' for instant scroll
    });
    
    try {
        
        setgeneralLoading(true)

        document.body.style.overflow = 'hidden';            

        const response = await fetch('https://ksucu-mc.co.ke/users/data', {
            credentials: 'include'
        });

        if (!response.ok) {
          setError('You need to login or sign up to access this page')
          setTimeout(() => {
           return navigate('/')
          }, 5000);
        }  


        
    } catch (error) {
        if (error instanceof Error && error.message === 'Authentication failed: jwt expired') {
            setError('session timed out, log in again')
            setTimeout(() => setError(''), 3000); 
            return navigate('/')
        }else{
            console.error('Error fetching user data:');
            return navigate('/')
        }
        
    }finally{    
        document.body.style.overflow = '';  
        setgeneralLoading(false);      
    }
  };
  const reversedEvents = [...events].reverse(); // Spread operator to avoid mutating the original array
  
  return (
    <>
      <Header />
        
      {generalLoading && (
                <div className={styles['loading-screen']}>
                    <p className={styles['loading-text']}>Please wait...🤗</p>
                    <img src={loadingAnime} alt="animation gif" />
                </div>
      )}

      <main>
      {error && <div className={styles.error}>{error}</div>}

        <div className={styles.mediatitle}>

          <h2 className={styles['media-tittle--text']}>KSUCU-MC MEDIA</h2>

          <div className={styles['link-flex']}>
            <div className={styles['first-links']}>
              <ul className={styles['first-link--list']}>
                <li className={styles['first-link--item']}><a href="https://www.youtube.com/results?search_query=kisii+university+christian+union" target='_blank' className={styles['first-link']}>YOUTUBE</a></li>
                <li className={styles['first-link--item']}><a href="https://web.facebook.com/ksucumc/?_rdc=1&_rdr#" target='_blank' className={styles['first-link']}>FACEBOOK</a></li>
                <li className={styles['first-link--item']}><a href="https://www.tiktok.com/@ksucumc" target='_blank' className={styles['first-link']}>TIKTOK</a></li>
                <li className={styles['first-link--item']}><a href="https://x.com/@Ksucu_mc" target='_blank' className={styles['first-link']}>TWITTER</a></li>
              </ul>
            </div>

            <div className={styles['first-links-2']}>
              <ul className={styles['first-link--list']}>
                <li className={styles['first-link--item']}><Link to="/news" className={styles['first-link']}>NEWS</Link></li>
                <li className={styles['first-link--item']} onClick={() => setShowMediaEvents(true)} ><a className={styles['first-link']}>GALLERY</a></li>
                <li className={styles['first-link--item']}><a href="https://www.youtube.com/results?search_query=kisii+university+christian+union" target='_blank' className={styles['first-link']}>YOUTUBE</a></li>
                <li className={styles['first-link--item']}><Link to="/library" className={styles['first-link']}>E-LIBRARY</Link></li>
              </ul>
            </div>
          </div>

          <div className={styles['cta-btn-div']}>
            <button className={styles['cta-btn']}>Media Events</button>
          </div>
        </div>

        {/* Media Events Canvas */}
        {showMediaEvents && (
          <div className={styles.canvasOverlay}>
            <div className={styles.canvas}>
              <button className={styles.closeBtn} onClick={() => setShowMediaEvents(false)}>✖</button>
              <h3>Media Events</h3>
              <table className={styles.eventTable}>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Google Photos</th>
                  </tr>
                </thead>
                <tbody>
                  {reversedEvents.map((event, index) => (
                    <tr key={index}>
                      <td>{event.event}</td>
                      <td>{event.date}</td>
                      <td><a className={styles.googlePhotosRedirectLinks} href={event.link} target="_blank" rel="noopener noreferrer">View Photos</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Media;
