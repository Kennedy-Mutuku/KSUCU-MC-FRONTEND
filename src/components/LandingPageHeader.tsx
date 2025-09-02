import { useEffect, useState } from "react";
import { getApiUrl } from '../config/environment';
import styles from '../styles/index.module.css';
import cuLogo from '../assets/cuLogoUAR.png';
import { Link, useNavigate } from 'react-router-dom';
import loadingAnime from '../assets/Animation - 1716747954931.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import visionImg from '../assets/gents.jpg'
import missionImg from '../assets/ladies.jpg'
import valuesImg from '../assets/amptheatre.jpg'
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faUserLock } from '@fortawesome/free-solid-svg-icons';
import { ChevronDown, ChevronUp } from "lucide-react";

interface NewsData {
  title: string;
  summary: string;
  body: string;
  imageUrl: string;
  eventDate?: string;
  eventTime?: string;
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const LandingPageHeader = () => {
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [openCommission, setOpenCommision] = useState(false);
  const [userData, setUserData] = useState<{ username: string; email: string; yos: number; phone: string; et: string; ministry: string } | null>(null);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState<CountdownTime | null>(null);
  const [eventPassed, setEventPassed] = useState<boolean>(false);
  const [generalLoading, setgeneralLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  // const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();

  const handleNavToggle = () => {
    document.body.classList.toggle(styles['nav-open']);
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const images = [
    { url: visionImg, text: `<h1 class="${styles['section-text']}"></h1><div class="${styles['loadingBar-intro']}"></div>` },
    { url: missionImg, text: `<h1 class="${styles['section-text']}"></h1><div class="${styles['loadingBar-intro']}"></div>` },
    { url: valuesImg, text: `<h1 class="${styles['section-text']}"></h1><div class="${styles['loadingBar-intro']}"></div>` }
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchUserData()
    fetchNewsData()
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);

    // Auto-refresh news every 30 seconds to ensure all devices get updates
    const newsRefreshInterval = setInterval(() => {
      fetchNewsData();
    }, 30000);

    const handleFocus = () => {
      fetchUserData();
      fetchNewsData(); // Refresh news when user returns to the page
    };

    // Check if mobile view
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth <= 767);
    };
    
    checkMobileView(); // Initial check
    window.addEventListener('resize', checkMobileView);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      clearInterval(newsRefreshInterval);
      window.removeEventListener('resize', checkMobileView);
      window.removeEventListener('focus', handleFocus);
      // Cleanup: Remove body class when component unmounts
      document.body.classList.remove('quick-links-open');
    };

  }, [images.length]);
  
  // Cleanup effect for dropdown state
  useEffect(() => {
    if (!isDropdownOpen) {
      document.body.classList.remove('quick-links-open');
    }
  }, [isDropdownOpen]);
  
  // Click outside handler for quick access
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        const target = event.target as Element;
        const quickLinksBtn = document.querySelector('.Quick-links-btn');
        const quickAccess = document.querySelector('.main-quick--links');
        
        if (quickLinksBtn && !quickLinksBtn.contains(target) && 
            quickAccess && !quickAccess.contains(target)) {
          setIsDropdownOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const fetchUserData = async () => {
    console.log('Header: Fetching user data...');
    
    // Offline check disabled - always try to fetch
    // if (!navigator.onLine) {
    //     console.log('Header: User offline');
    //     setError('check your internet and try again...')
    //     return;
    // }

    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });
    
    try {
        setgeneralLoading(true)
        document.body.style.overflow = 'hidden';            

        const apiUrl = getApiUrl('users');
        console.log('Header: Fetching from:', apiUrl);

        const response = await fetch(apiUrl, {
            credentials: 'include'
        });

        console.log('Header: Response status:', response.status);
        const data = await response.json();
        console.log('Header: Response data:', data);
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch user data');
        }  

        if (!data.phone || !data.reg || !data.yos) {
            setError('...navigating to update details')
            navigate('/changeDetails');
            return;
        }

        const firstName = data.username.split(' ')[0];

        const finalUserData = {
            ...data,
            username: firstName
        };
        console.log('Header: Setting user data:', finalUserData);
        setUserData(finalUserData);
        
    } catch (error) {
        if (error instanceof Error && error.message === 'Authentication failed: jwt expired') {
            navigate('/');
        } else {
            console.error('Header: Error fetching user data:', error);
        }
        
    }finally{    
        document.body.style.overflow = '';  
        setgeneralLoading(false);      
    }
  };

  const fetchNewsData = async () => {
    setgeneralLoading(true)
    try {
      const response = await fetch(getApiUrl('news'), {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch news data');
      }
      const data = await response.json();
      console.log('LandingPage: News data received:', data);
      console.log('LandingPage: Summary field:', data.summary);
      console.log('LandingPage: Body field:', data.body);
      setNewsData(data);
    } catch (error: any) {
      console.log(error)
    }finally{
      setgeneralLoading(false)
    }
  };

  // Calculate countdown timer
  const calculateCountdown = (eventDate: string, eventTime: string): CountdownTime | null => {
    try {
      console.log('Calculating countdown for:', eventDate, eventTime);
      
      // Parse the date more robustly
      let eventDateTime: Date;
      
      // Handle different date formats
      if (eventTime && eventTime !== '') {
        // Try different formats for combining date and time
        if (eventDate.includes('T')) {
          // ISO format
          eventDateTime = new Date(`${eventDate.split('T')[0]}T${eventTime}`);
        } else {
          // Try standard format
          eventDateTime = new Date(`${eventDate}T${eventTime}`);
        }
        
        // If that fails, try parsing separately
        if (isNaN(eventDateTime.getTime())) {
          eventDateTime = new Date(eventDate);
          const timeParts = eventTime.match(/(\d{1,2}):(\d{2})/);
          if (timeParts) {
            eventDateTime.setHours(parseInt(timeParts[1], 10), parseInt(timeParts[2], 10), 0, 0);
          }
        }
      } else {
        // If no time specified, use noon as default
        eventDateTime = new Date(eventDate);
        eventDateTime.setHours(12, 0, 0, 0);
      }
      
      console.log('Parsed event date:', eventDateTime);
      
      // Validate the date
      if (isNaN(eventDateTime.getTime())) {
        console.error('Invalid date/time format:', eventDate, eventTime);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      const now = new Date();
      const difference = eventDateTime.getTime() - now.getTime();
      
      console.log('Time difference:', difference, 'ms');

      if (difference <= 0) {
        console.log('Event has passed');
        return null; // Event has passed
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const result = { days, hours, minutes, seconds };
      console.log('Countdown result:', result);
      
      // Ensure no NaN values
      if (isNaN(days) || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        console.error('NaN values detected in countdown');
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return result;
    } catch (error) {
      console.error('Error calculating countdown:', error);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  };

  // Update countdown every second
  useEffect(() => {
    if (!newsData?.eventDate) return;

    const updateCountdown = () => {
      const countdownData = calculateCountdown(newsData.eventDate!, newsData.eventTime || '12:00');
      if (countdownData) {
        setCountdown(countdownData);
        setEventPassed(false);
      } else {
        setCountdown(null);
        setEventPassed(true);
      }
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [newsData]);

  const handleLogout = async () => {
    setgeneralLoading(true)
      try {
          const response = await fetch(getApiUrl('usersLogout'), {
              method: 'POST',
              credentials: 'include'
          });

          if (!response.ok) {
              throw new Error('Logout failed');
          }
          setUserData(null);
          navigate('/signIn');
      } catch (error) {
          console.error('Error during logout:');
          setError('An error occurred during logout');
      }finally{
        setgeneralLoading(false)
      }
  };

  const toggleDropdown = () => {
    // if (!isDropdownOpen && event) {
    //   const rect = (event.target as HTMLElement).getBoundingClientRect();
    //   setDropdownPosition({
    //     top: rect.bottom + 5,
    //     left: rect.right - 220 // 220px is the min-width of dropdown
    //   });
    // }
    setIsDropdownOpen(!isDropdownOpen);
    
    // Toggle body class for desktop quick access
    if (!isDropdownOpen) {
      document.body.classList.add('quick-links-open');
    } else {
      document.body.classList.remove('quick-links-open');
    }
  };

  function handleOpenCommission(): void {
    setOpenCommision(true)
  }
  function handleCloseCommission(): void {
    setOpenCommision(false)
  }

  function handleRedirectToUserInfo() {
    console.log('Header: User icon clicked, userData:', userData);
    console.log('Header: Navigating to /profile');
    navigate('/profile')
  }
  function handleRedirectToLogin() {
    navigate('/signIn')
  }

  function navigateMedia() {
    if(userData){
      navigate('/media')
    }else{
      setError('Please log in to access Media');
      setTimeout(() => {
        setError('')
        navigate('/signIn');
      }, 2000);
    }
  }


  function handleProtectedLink(path: string, linkName: string) {
    if(userData){
      navigate(path);
    }else{
      setError(`Please log in to access ${linkName}`);
      setTimeout(() => {
        setError('')
        navigate('/signIn');
      }, 2000);
    }
  }

  function handlePublicLink(path: string) {
    navigate(path);
  }

  function handleAboutUsClick() {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
    // Close any open menus
    setIsDropdownOpen(false);
    setIsMobileNavOpen(false);
    document.body.classList.remove(styles['nav-open']);
    document.body.classList.remove('quick-links-open');
  }

  return (
    <>
      {generalLoading && (
        <div className={styles['loading-screen']}>
          <p className={styles['loading-text']}>Please wait...</p>
          <img src={loadingAnime} alt="animation gif" />
        </div>
      )}

      <header className={styles.header}>
        <div className={styles['flex-title']}>
          <div className={styles.container}>
            <div className={styles.logo}>
              <img src={cuLogo} alt="Cu-logo" className={styles['logo-image']} />
            </div>

            <div className={styles.title}>
              <p className={styles['title-text']}>
                <span className={styles['full-title']}>Kisii University Christian Union</span>
                <span className={styles['short-title']}>Kisii Uni CU</span>
              </p>

              {/* Desktop icons */}
              <div className={styles['nav-one--hidden']}>
                <div className={styles['About-btn']}>
                  <button onClick={handleAboutUsClick} className={styles['nav-link']} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit', fontFamily: 'inherit', textDecoration: 'none' }}>
                    About us
                  </button>
                </div>

                <div className={styles['Quick-links-btn']} onClick={toggleDropdown} >
                  <a  className={styles['nav-link-quick-link']}>
                    Quick Links
                  </a>
                  <button className={styles['dropdown-toggle']} type="button" >
                    {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {/* No dropdown on desktop - using main quick access section instead */}
                </div>

                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '80px', minHeight: '50px', justifyContent: 'center'}} onClick={userData ? handleRedirectToUserInfo : handleRedirectToLogin}>
                  <FontAwesomeIcon className={`${styles['user-icon']} `} icon={userData ? faUser : faUserLock} />
                  <span style={{color: '#ffffff', fontSize: '12px', marginTop: '3px', fontWeight: '600', textShadow: '0 1px 3px rgba(0,0,0,0.5)', whiteSpace: 'nowrap', backgroundColor: 'rgba(0,0,0,0.4)', padding: '1px 4px', borderRadius: '3px', maxWidth: '70px', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {userData ? userData.username || 'User' : 'Log In'}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles['hambuger-div']} id="hambuger">
              <button className={styles['nav-toggle__btn']} onClick={handleNavToggle}>
                <div className={styles.hambuger}></div>
              </button>
            </div>

            <div className={`${styles['user-icon-container']} `}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '60px', height: '60px', justifyContent: 'center'}} onClick={userData ? handleRedirectToUserInfo : handleRedirectToLogin}>
                <FontAwesomeIcon className={`${styles['user-icon']} `} icon={userData ? faUser : faUserLock} />
                <span style={{color: '#ffffff', fontSize: '10px', marginTop: '2px', fontWeight: '600', textShadow: '0 1px 3px rgba(0,0,0,0.5)', whiteSpace: 'nowrap', backgroundColor: 'rgba(0,0,0,0.4)', padding: '1px 3px', borderRadius: '3px', maxWidth: '55px', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                  {userData ? userData.username || 'User' : 'Log In'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.nav}>
            <div className={styles['nav-one']}>
              {userData ?
                <Link to="/profile" className={styles['signUp-btn']}>{userData.username}</Link>
                : <Link to="/signUp" className={styles['signUp-btn']}>Sign up</Link>
              }
              {userData ?
                <Link to="/signIn" className={styles['Login-btn']} onClick={handleLogout} >Log out</Link> :
                <Link to="/signIn" className={styles['Login-btn']}>Log in</Link>
              }
              <div className={styles['About-btn']}>
                <button onClick={handleAboutUsClick} className={styles['nav-link']} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit', fontFamily: 'inherit', textDecoration: 'none' }}>
                  About us
                </button>
              </div>
            </div>
          </div>

          {(isDropdownOpen || isMobileNavOpen) && (
            <>
              <div 
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  zIndex: 999,
                  animation: 'fadeIn 0.3s ease'
                }}
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsMobileNavOpen(false);
                  document.body.classList.remove('quick-links-open');
                  document.body.classList.remove(styles['nav-open']);
                }}
              />
              <div className={styles['main-quick--links']} style={{
                position: 'fixed',
                top: isMobileView ? '70px' : '80px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                backgroundColor: 'white',
                borderRadius: isMobileView ? '12px' : '20px',
                padding: isMobileView ? '12px' : '25px',
                boxShadow: isMobileView ? '0 8px 25px rgba(0, 0, 0, 0.1), 0 3px 12px rgba(115, 0, 81, 0.05)' : '0 15px 50px rgba(0, 0, 0, 0.15), 0 5px 20px rgba(115, 0, 81, 0.08)',
                minWidth: isMobileView ? '260px' : '360px',
                maxWidth: isMobileView ? '300px' : '460px',
                maxHeight: isMobileView ? '350px' : '500px',
                overflow: 'visible',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: isMobileView ? '6px' : '12px',
                animation: 'modalSlideIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                border: '1px solid rgba(115, 0, 81, 0.08)'
              }}>
            <a onClick={navigateMedia} className={styles['quick-item--link']}>
              Media
            </a>
            <div onClick={() => handleProtectedLink('/save', 'Win a Soul')} className={styles['quick-item--link']}>
              Win a Soul
            </div>
            <div onClick={() => handlePublicLink('/Bs')} className={styles['quick-item--link']}>
              Bible Study
            </div>
            <div onClick={() => handlePublicLink('/library')} className={styles['quick-item--link']}>
              Library
            </div>
            <div onClick={() => handleProtectedLink('/financial', 'Financials')} className={styles['quick-item--link']}>
              Financials
            </div>
            <a 
              href="/pdfs/constitution.pdf" 
              download="constitution.pdf" 
              className={styles['quick-item--link']}
            >
              <FontAwesomeIcon icon={faDownload} style={{ marginRight: '8px' }} />
              Constitution
            </a>
            <div onClick={() => handlePublicLink('/requisitions')} className={styles['quick-item--link']}>
              Requisitions
            </div>
            <div onClick={handleAboutUsClick} className={styles['quick-item--link']}>
              About Us
            </div>
              </div>
            </>
          )}
        </div>

        
        <div className={`${styles['']} ${styles['container-vidTitle']}`}>
          <div className={styles['intro-video--header']}>
            <div className={styles['video-intro']}>
              <div className={styles['intro-video']} style={{ backgroundImage: `url(${images[currentIndex].url})` }} dangerouslySetInnerHTML={{ __html: images[currentIndex].text }}></div>
              <span className={styles["commission-claimer"]} onClick={handleOpenCommission}>
                <FontAwesomeIcon icon={faQuestion} beatFade />
              </span>
            </div>
          </div>
        </div>
      </header>

      {openCommission &&
        <div className={styles.modalOverlay} onClick={handleCloseCommission}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            {newsData ? (
              <>
                <div className={styles.modalHeader} style={{ textAlign: 'center' }}>
                  {newsData.title}
                </div>
                
                {/* Event Information and Countdown */}
                {newsData.eventDate && (
                  <div className={styles.eventSection}>
                    <div className={styles.eventInfo} style={{ textAlign: 'center' }}>
                      <h4 style={{color: '#730051', margin: '0 0 10px 0', textAlign: 'center'}}>Upcoming Event</h4>
                      <p style={{margin: '5px 0', color: '#666', fontWeight: '600', textAlign: 'center'}}>
                        {new Date(newsData.eventDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {newsData.eventTime ? ` at ${newsData.eventTime}` : ' at 12:00'}
                      </p>
                    </div>
                    
                    {countdown && !eventPassed && (
                      <div className={styles.countdownTimer}>
                        <h5 style={{color: '#730051', margin: '10px 0 5px 0', textAlign: 'center'}}>Time Remaining</h5>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 1fr)',
                          gap: '8px',
                          marginTop: '10px'
                        }}>
                          <div style={{
                            background: 'rgba(115, 0, 81, 0.1)',
                            borderRadius: '6px',
                            padding: '8px 4px',
                            textAlign: 'center',
                            border: '1px solid rgba(115, 0, 81, 0.2)'
                          }}>
                            <div style={{fontSize: '18px', fontWeight: 'bold', color: '#730051'}}>{String(countdown.days || 0).padStart(2, '0')}</div>
                            <div style={{fontSize: '10px', color: '#730051', textTransform: 'uppercase'}}>Days</div>
                          </div>
                          <div style={{
                            background: 'rgba(115, 0, 81, 0.1)',
                            borderRadius: '6px',
                            padding: '8px 4px',
                            textAlign: 'center',
                            border: '1px solid rgba(115, 0, 81, 0.2)'
                          }}>
                            <div style={{fontSize: '18px', fontWeight: 'bold', color: '#730051'}}>{String(countdown.hours || 0).padStart(2, '0')}</div>
                            <div style={{fontSize: '10px', color: '#730051', textTransform: 'uppercase'}}>Hours</div>
                          </div>
                          <div style={{
                            background: 'rgba(115, 0, 81, 0.1)',
                            borderRadius: '6px',
                            padding: '8px 4px',
                            textAlign: 'center',
                            border: '1px solid rgba(115, 0, 81, 0.2)'
                          }}>
                            <div style={{fontSize: '18px', fontWeight: 'bold', color: '#730051'}}>{String(countdown.minutes || 0).padStart(2, '0')}</div>
                            <div style={{fontSize: '10px', color: '#730051', textTransform: 'uppercase'}}>Minutes</div>
                          </div>
                          <div style={{
                            background: 'rgba(115, 0, 81, 0.1)',
                            borderRadius: '6px',
                            padding: '8px 4px',
                            textAlign: 'center',
                            border: '1px solid rgba(115, 0, 81, 0.2)'
                          }}>
                            <div style={{fontSize: '18px', fontWeight: 'bold', color: '#730051'}}>{String(countdown.seconds || 0).padStart(2, '0')}</div>
                            <div style={{fontSize: '10px', color: '#730051', textTransform: 'uppercase'}}>Seconds</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {eventPassed && (
                      <div style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        borderRadius: '8px',
                        padding: '12px',
                        marginTop: '10px',
                        textAlign: 'center'
                      }}>
                        <h5 style={{color: '#10B981', margin: '0 0 5px 0', textAlign: 'center'}}>Event Has Started/Ended</h5>
                        <p style={{margin: '0', fontSize: '14px', color: '#666', textAlign: 'center'}}>This event is no longer upcoming.</p>
                      </div>
                    )}
                  </div>
                )}

                <div className={styles.modalBody}>
                  {/* Show news image if available */}
                  {newsData.imageUrl && (
                    <div style={{textAlign: 'center', marginBottom: '15px'}}>
                      <img 
                        src={newsData.imageUrl} 
                        alt="News" 
                        style={{
                          maxWidth: '100%',
                          height: 'auto',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Show full news content */}
                  <div style={{lineHeight: '1.6', color: '#333', textAlign: 'left', marginBottom: '20px'}}>
                    {newsData.body ? (
                      newsData.body.split('\n').map((paragraph, index) => (
                        <p key={index} style={{margin: '12px 0', textAlign: 'left'}}>
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p style={{margin: '8px 0', textAlign: 'center'}}>
                        {newsData.summary || 'No content available'}
                      </p>
                    )}
                  </div>
                  
                  {/* Footer with timestamp */}
                  <div style={{
                    textAlign: 'center', 
                    marginTop: '20px', 
                    paddingTop: '15px', 
                    borderTop: '1px solid rgba(115, 0, 81, 0.1)',
                    fontSize: '12px',
                    color: '#666'
                  }}>
                    Latest Update • KSUCU-MC Communication Board
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.modalHeader} style={{ textAlign: 'center' }}>
                  Weekly Friday Prayers & Sunday Services
                </div>
                <div className={styles.modalBody} style={{ textAlign: 'center' }}>
                  <p style={{ textAlign: 'center' }}>
                    For those in session, <b>welcome to our <span className={styles.boldBlue}>Friday prayers</span> every week</b>
                    <span className={styles.venueNote}>(venue communicated weekly)</span> and <b className={styles.boldBlue}>Sunday services</b>.
                  </p>
                  <ul style={{ textAlign: 'center', listStyle: 'none', padding: '0' }}>
                    <li style={{ margin: '8px 0' }}><b>Friday Prayers:</b> 6:30 PM – 7:00 PM</li>
                    <li style={{ margin: '8px 0' }}><b>Sunday Services:</b> 8:00AM – 10:00 AM </li>
                    <li style={{ margin: '8px 0' }}><b>Venues:</b> Communicated in advance</li>
                  </ul>
                  <p className={styles.stayBlessed} style={{ textAlign: 'center' }}>
                    <i>Stay blessed, and see you there!</i>
                  </p>
                </div>
              </>
            )}
            
            <button className={styles.closeBtn} onClick={handleCloseCommission}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>
      }
    </>
  );
};

export default LandingPageHeader;