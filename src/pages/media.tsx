import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Media.module.css';
import Header from '../components/header';
import Footer from '../components/footer';
import loadingAnime from '../assets/Animation - 1716747954931.gif';
import { FaYoutube, FaFacebook, FaTiktok, FaTwitter, FaImage, FaNewspaper, FaBook, FaTimes } from 'react-icons/fa';

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

      <main className={styles.main}>
        {error && <div className={styles.error}>{error}</div>}

        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>KSUCU-MC MEDIA HUB</h1>
            <p className={styles.heroSubtitle}>Stay connected through our digital platforms and explore our content</p>
          </div>
        </section>

        {/* Social Media Platforms */}
        <section className={styles.socialSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Follow Us On Social Media</h2>
            <div className={styles.socialGrid}>
              <a href="https://www.youtube.com/@KSUCU-MC" target='_blank' rel="noopener noreferrer" className={styles.socialCard}>
                <div className={styles.socialIcon} style={{backgroundColor: '#FF0000'}}>
                  <FaYoutube />
                </div>
                <h3>YouTube</h3>
                <p>Watch our sermons, testimonies and events</p>
              </a>
              
              <a href="https://web.facebook.com/ksucumc" target='_blank' rel="noopener noreferrer" className={styles.socialCard}>
                <div className={styles.socialIcon} style={{backgroundColor: '#1877F2'}}>
                  <FaFacebook />
                </div>
                <h3>Facebook</h3>
                <p>Connect with our community</p>
              </a>
              
              <a href="https://www.tiktok.com/@ksucumc" target='_blank' rel="noopener noreferrer" className={styles.socialCard}>
                <div className={styles.socialIcon} style={{backgroundColor: '#000000'}}>
                  <FaTiktok />
                </div>
                <h3>TikTok</h3>
                <p>Short inspirational videos</p>
              </a>
              
              <a href="https://x.com/@Ksucu_mc" target='_blank' rel="noopener noreferrer" className={styles.socialCard}>
                <div className={styles.socialIcon} style={{backgroundColor: '#1DA1F2'}}>
                  <FaTwitter />
                </div>
                <h3>Twitter/X</h3>
                <p>Latest updates and announcements</p>
              </a>
            </div>
          </div>
        </section>

        {/* Content Categories */}
        <section className={styles.contentSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Explore Our Content</h2>
            <div className={styles.contentGrid}>
              <Link to="/news" className={styles.contentCard}>
                <div className={styles.contentIcon} style={{backgroundColor: '#28a745'}}>
                  <FaNewspaper />
                </div>
                <h3>Latest News</h3>
                <p>Stay updated with KSUCU-MC news and announcements</p>
              </Link>
              
              <div onClick={() => setShowMediaEvents(true)} className={styles.contentCard}>
                <div className={styles.contentIcon} style={{backgroundColor: '#6f42c1'}}>
                  <FaImage />
                </div>
                <h3>Photo Gallery</h3>
                <p>Browse photos from our events and activities</p>
              </div>
              
              <Link to="/library" className={styles.contentCard}>
                <div className={styles.contentIcon} style={{backgroundColor: '#fd7e14'}}>
                  <FaBook />
                </div>
                <h3>E-Library</h3>
                <p>Access our digital library resources</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <section className={styles.eventsSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Recent Events</h2>
            <div className={styles.eventsPreview}>
              {events.slice(0, 6).map((event, index) => (
                <div key={index} className={styles.eventCard}>
                  <div className={styles.eventImage}>
                    <FaImage />
                  </div>
                  <div className={styles.eventContent}>
                    <h4>{event.event}</h4>
                    <p className={styles.eventDate}>{event.date}</p>
                    <a href={event.link} target="_blank" rel="noopener noreferrer" className={styles.viewPhotosBtn}>
                      View Photos
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.viewAllContainer}>
              <button onClick={() => setShowMediaEvents(true)} className={styles.viewAllBtn}>
                View All Events
              </button>
            </div>
          </div>
        </section>

        {/* Enhanced Gallery Modal */}
        {showMediaEvents && (
          <div className={styles.modalOverlay} onClick={() => setShowMediaEvents(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>Photo Gallery - All Events</h3>
                <button className={styles.closeBtn} onClick={() => setShowMediaEvents(false)}>
                  <FaTimes />
                </button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.galleryGrid}>
                  {reversedEvents.map((event, index) => (
                    <div key={index} className={styles.galleryItem}>
                      <div className={styles.galleryImagePlaceholder}>
                        <FaImage />
                      </div>
                      <div className={styles.galleryItemContent}>
                        <h4>{event.event}</h4>
                        <p className={styles.galleryDate}>{event.date}</p>
                        <a href={event.link} target="_blank" rel="noopener noreferrer" className={styles.galleryViewBtn}>
                          View Photos
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Media;
