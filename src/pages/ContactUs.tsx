import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/environment';
import styles from '../styles/contactUs.module.css';
import cuLogo from '../assets/cuLogoUAR.png';
import {
  MessageCircle,
  Send,
  UserCheck,
  UserX,
  Heart,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserLock } from '@fortawesome/free-solid-svg-icons';
import loadingAnime from '../assets/Animation - 1716747954931.gif';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UserData {
  username: string;
  email: string;
  yos: number;
  phone: string;
  et: string;
  ministry: string;
}

const ContactUs = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('feedback');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalLoading, setGeneralLoading] = useState(false);
  
  const navigate = useNavigate();

  const categories = [
    { value: 'feedback', label: 'General Feedback', icon: '💬' },
    { value: 'suggestion', label: 'Suggestion', icon: '💡' },
    { value: 'complaint', label: 'Complaint', icon: '⚠️' },
    { value: 'praise', label: 'Praise & Appreciation', icon: '❤️' },
    { value: 'prayer', label: 'Prayer Request', icon: '🙏' },
    { value: 'technical', label: 'Technical Issue', icon: '🔧' },
    { value: 'other', label: 'Other', icon: '📋' }
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setGeneralLoading(true);
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
    } finally {
      setGeneralLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.warning('Please enter your message', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!subject.trim()) {
      toast.warning('Please enter a subject', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Check if user wants identified message but is not logged in
    if (!isAnonymous && !userData) {
      toast.warning('Please log in to send identified messages.', {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const messageData = {
        subject: subject.trim(),
        message: message.trim(),
        category,
        isAnonymous,
        senderInfo: !isAnonymous && userData ? {
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
        toast.success('Message sent successfully! Thank you for reaching out.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setMessage('');
        setSubject('');
        setCategory('feedback');

        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRedirectToUserInfo = () => {
    navigate('/profile');
  };

  const handleRedirectToLogin = () => {
    navigate('/signIn');
  };

  const goBack = () => {
    navigate(-1);
  };

  if (generalLoading) {
    return (
      <div className={styles['loading-screen']}>
        <p className={styles['loading-text']}>Loading...🤗</p>
        <img src={loadingAnime} alt="animation gif" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ToastContainer />
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={goBack} className={styles.backButton}>
            <ArrowLeft size={24} />
          </button>
          
          <div className={styles.logoSection}>
            <img src={cuLogo} alt="KSUCU Logo" className={styles.logo} />
            <h1 className={styles.title}>Talk to Us</h1>
          </div>

          <div className={styles.userSection}>
            <div 
              className={styles.userInfo}
              onClick={userData ? handleRedirectToUserInfo : handleRedirectToLogin}
            >
              <FontAwesomeIcon 
                className={styles.userIcon} 
                icon={userData ? faUser : faUserLock} 
              />
              <span className={styles.username}>
                {userData ? userData.username : 'Log In'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <MessageCircle className={styles.heroIcon} />
            <h2 className={styles.heroTitle}>We'd Love to Hear from You!</h2>
            <p className={styles.heroSubtitle}>
              Share your thoughts, suggestions, prayer requests, or feedback with our leadership team.
              Your voice matters in building our community together.
            </p>
          </div>
        </div>

        {/* Anonymous Toggle */}
        <div className={styles.toggleSection}>
          <div className={styles.toggleContainer}>
            <button
              className={`${styles.toggleButton} ${isAnonymous ? styles.active : ''}`}
              onClick={() => setIsAnonymous(true)}
            >
              <UserX size={20} />
              <span>Anonymous Message</span>
              <Shield size={16} className={styles.shieldIcon} />
            </button>
            
            <button
              className={`${styles.toggleButton} ${!isAnonymous ? styles.active : ''}`}
              onClick={() => setIsAnonymous(false)}
              disabled={!userData}
            >
              <UserCheck size={20} />
              <span>Identified Message</span>
              {!userData && <span className={styles.loginRequired}>(Login Required)</span>}
            </button>
          </div>
          
          {isAnonymous ? (
            <p className={styles.toggleDescription}>
              <Shield size={16} /> Your identity will remain completely confidential
            </p>
          ) : (
            <p className={styles.toggleDescription}>
              <UserCheck size={16} /> Your message will include your profile information for follow-up
            </p>
          )}
        </div>

        {/* Message Form */}
        <form onSubmit={handleSubmit} className={styles.messageForm}>
          {/* Category Selection */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Message Category</label>
            <div className={styles.categoryGrid}>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  className={`${styles.categoryButton} ${
                    category === cat.value ? styles.selected : ''
                  }`}
                  onClick={() => setCategory(cat.value)}
                >
                  <span className={styles.categoryIcon}>{cat.icon}</span>
                  <span className={styles.categoryLabel}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className={styles.formGroup}>
            <label htmlFor="subject" className={styles.label}>
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={styles.input}
              placeholder="Brief summary of your message..."
              required
            />
          </div>

          {/* Message */}
          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>
              Your Message *
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={styles.textarea}
              placeholder="Share your thoughts, feedback, suggestions, or prayer requests..."
              required
              rows={6}
            />
          </div>

          {/* User Info Preview (for identified messages) */}
          {!isAnonymous && userData && (
            <div className={styles.userPreview}>
              <h4 className={styles.previewTitle}>Message will be sent from:</h4>
              <div className={styles.previewInfo}>
                <div className={styles.previewItem}>
                  <strong>Name:</strong> {userData.username}
                </div>
                <div className={styles.previewItem}>
                  <strong>Email:</strong> {userData.email}
                </div>
                <div className={styles.previewItem}>
                  <strong>Ministry:</strong> {userData.ministry}
                </div>
                <div className={styles.previewItem}>
                  <strong>Year of Study:</strong> {userData.yos}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || (!isAnonymous && !userData)}
          >
            {isSubmitting ? (
              <>
                <div className={styles.spinner} />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Send Message</span>
              </>
            )}
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>Your feedback helps us serve our community better</p>
        <div className={styles.footerHeart}>
          <Heart size={16} />
          <span>KSUCU-MC Leadership Team</span>
        </div>
      </footer>
    </div>
  );
};

export default ContactUs;