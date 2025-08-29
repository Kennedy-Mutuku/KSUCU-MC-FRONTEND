import { useEffect, useState } from "react";
import { getApiUrl } from '../config/environment';
import styles from '../styles/index.module.css';
import cuLogo from '../assets/cuLogoUAR.png';
import { Link, useNavigate } from 'react-router-dom';
import loadingAnime from '../assets/Animation - 1716747954931.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import visionImg from '../assets/gents.jpg'
import missionImg from '../assets/ladies.jpg'
import valuesImg from '../assets/amptheatre.jpg'
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faUserLock } from '@fortawesome/free-solid-svg-icons';
import { ChevronDown, ChevronUp } from "lucide-react";

interface NewsData {
  title: string;
  body: string;
  imageUrl: string;
}

const LandingPageHeader = () => {
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [openCommission, setOpenCommision] = useState(false);
  const [userData, setUserData] = useState<{ username: string; email: string; yos: number; phone: string; et: string; ministry: string } | null>(null);
  const [error, setError] = useState('');
  const [generalLoading, setgeneralLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
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

    const handleFocus = () => {
      fetchUserData();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
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
    console.log('🏠 Header: Fetching user data...');
    
    if (!navigator.onLine) {
        console.log('❌ Header: User offline');
        setError('check your internet and try again...')
        return;
    }

    window.scrollTo({
        top: 0,
        behavior: 'auto'
    });
    
    try {
        setgeneralLoading(true)
        document.body.style.overflow = 'hidden';            

        const apiUrl = getApiUrl('users');
        console.log('🏠 Header: Fetching from:', apiUrl);

        const response = await fetch(apiUrl, {
            credentials: 'include'
        });

        console.log('🏠 Header: Response status:', response.status);
        const data = await response.json();
        console.log('🏠 Header: Response data:', data);
        
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
        console.log('✅ Header: Setting user data:', finalUserData);
        setUserData(finalUserData);
        
    } catch (error) {
        if (error instanceof Error && error.message === 'Authentication failed: jwt expired') {
            navigate('/');
        } else {
            console.error('❌ Header: Error fetching user data:', error);
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
      setNewsData(data);
    } catch (error: any) {
      console.log(error)
    }finally{
      setgeneralLoading(false)
    }
  };

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
    console.log('👤 Header: User icon clicked, userData:', userData);
    console.log('👤 Header: Navigating to /profile');
    navigate('/profile')
  }
  function handleRedirectToLogin() {
    navigate('/signIn')
  }

  function navigateMedia() {
    if(userData){
      navigate('/media')
    }else{
      setError('Please log in to access Media 😔');
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
      setError(`Please log in to access ${linkName} 😔`);
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
          <p className={styles['loading-text']}>Please wait...🤗</p>
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
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '60px', minHeight: '45px', justifyContent: 'center'}} onClick={userData ? handleRedirectToUserInfo : handleRedirectToLogin}>
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
            <div className={styles['main-quick--links']} style={{
              position: 'fixed',
              top: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
              minWidth: '350px',
              maxWidth: '450px',
              maxHeight: '500px',
              overflow: 'visible',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px'
            }}>
            {error && <div className={styles.error} style={{ textAlign: 'center', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1001, backgroundColor: '#ff4444', color: 'white', padding: '15px 25px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>{error}</div>}
            <div className={styles['quick-access-header']} style={{
              textAlign: 'center', 
              marginBottom: '15px', 
              padding: '0 10px',
              borderBottom: '1px solid rgba(115, 0, 81, 0.08)',
              paddingBottom: '10px',
              width: '100%'
            }}>
              <h3 className={styles['quick-access-title']} style={{
                margin: '0',
                color: '#730051',
                fontSize: '1rem',
                fontWeight: '700',
                letterSpacing: '0.4px',
                textTransform: 'uppercase'
              }}>Quick Access</h3>
              <p className={styles['quick-access-subtitle']} style={{
                margin: '2px 0 0 0',
                color: '#666',
                fontSize: '0.75rem',
                fontWeight: '400'
              }}>Services & resources</p>
            </div>
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
              Constitution
            </a>
            <div onClick={handleAboutUsClick} className={styles['quick-item--link']}>
              About Us
            </div>
            { userData && <div onClick={handleLogout} className={styles['quick-item--link']} style={{borderTop: '1px solid rgba(255,255,255,0.12)', marginTop: '6px', paddingTop: '8px', cursor: 'pointer', gridColumn: '1 / -1'}}>Log out</div> }
            </div>
          )}
        </div>

        {error && <div className={styles.error} style={{ textAlign: 'center', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1001, backgroundColor: '#ff4444', color: 'white', padding: '15px 25px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>{error}</div>}
        
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
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              Weekly Friday Prayers & Sunday Services
            </div>
            <div className={styles.modalBody}>
              <p>
                For those in session, <b>welcome to our <span className={styles.boldBlue}>Friday prayers</span> every week</b>
                <span className={styles.venueNote}>(venue communicated weekly)</span> and <b className={styles.boldBlue}>Sunday services</b>.
              </p>
              <ul>
                <li><b>Friday Prayers:</b> 6:30 PM – 7:00 PM</li>
                <li><b>Sunday Services:</b> 8:00AM – 10:00 AM </li>
                <li><b>Venues:</b> Communicated in advance</li>
              </ul>
              <p className={styles.stayBlessed}>
                <i>Stay blessed, and see you there! <span role="img" aria-label="pray">🙏🏾</span></i>
              </p>
            </div>

            {/* NEWS SECTION */}
            <div className={styles.newsInModal}>
              <span className={styles.newsLabel}><FontAwesomeIcon icon={faGlobe} /> Latest News</span>
              {newsData ? (
                <div className={styles.newsModalFlex}>
                  <img className={styles.newsModalImg} src={newsData.imageUrl} alt="news" />
                  <div>
                    <span className={styles.newsModalTitle}>{newsData.title}</span>
                    <Link className={styles.newsModalLink} to="/news">...read more</Link>
                  </div>
                </div>
              ) : (
                <span className={styles.newsLoading}>Loading news...</span>
              )}
            </div>
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