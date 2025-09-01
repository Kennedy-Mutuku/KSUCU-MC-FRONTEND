import React, { useEffect, useState } from 'react';
import styles from '../styles/elders.module.css';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import BackButton from '../components/BackButton';
import img from '../assets/elders-Attire.jpg';
import whatsappIcon from '../assets/Download Whatsapp logo_ 3d render_.png'; // Add your WhatsApp icon image here

const Elders: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const whatsappNumber = "254792006514";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 3000); // Show the popup after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <BackButton />
      <UniversalHeader />
      <main>
        <div className={styles['container']}>
          <div className={styles['photoImg']}>
            <img src={img} alt="Elders-attire" />
          </div>
          <a
            href={whatsappLink}
            className={`${styles['whatsappPopup']} ${showPopup ? styles['show'] : ''}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={whatsappIcon} alt="WhatsApp Icon" />
            <span>Let's Talk</span>
            
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Elders;
