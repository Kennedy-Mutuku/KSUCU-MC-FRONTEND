import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Media.module.css';
import Header from '../components/header';
import Footer from '../components/footer';

const Media: React.FC = () => {
  const [showMediaEvents, setShowMediaEvents] = useState(false);

  const events = [
    { event: "Subcomm photos", date: "2025-01-20", link: "https://photos.app.goo.gl/PrxWoMuyRNEet22b7" },
    { event: "Sunday service", date: "2024-22-13", link: "https://photos.app.goo.gl/Vt6HDo1xEtgA3Nmn9" },
    { event: "Worship Weekend", date: "2024-02-10", link: "https://photos.app.goo.gl/wbNV3coJREGEUSZX7" },
    { event: "Bible Study weekend", date: "2024-01-26", link: "https://photos.app.goo.gl/otVcso25sG6fkxjR8" },
    { event: "Evangelism photos", date: "2024-02-02", link: "https://photos.app.goo.gl/JvqV19BaGGZwrVFS7" },
    { event: "Weekend Photos", date: "2024-02-09", link: "https://photos.app.goo.gl/HkBvW67gyDSvLqgS7" },
    { event: "KSUCU-MC MEGA HIKE", date: "2024-02-15", link: "https://photos.app.goo.gl/RaNP4ikjEjXLHBmbA" },
    { event: "Creative Night photos", date: "2024-02-11", link: "https://photos.app.goo.gl/qYjukQAuWAdzBpaA7" },
    { event: "Valentine's concert ", date: "2024-02-17", link: "https://photos.app.goo.gl/BvYon9KCNPL1uMu87" },
  ];

  return (
    <>
      <Header />

      <main>
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
                  {events.map((event, index) => (
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
