import React, { useEffect, useState } from "react";
import { getApiUrl } from '../config/environment';
import styles from '../styles/index.module.css';
import cuLogo from '../assets/cuLogoUAR.png';
import { Link, useNavigate } from 'react-router-dom';
import loadingAnime from '../assets/Animation - 1716747954931.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons';
import { faUser, faUserLock } from '@fortawesome/free-solid-svg-icons';

interface UniversalHeaderProps {
  showBackButton?: boolean;
  customBackPath?: string;
}

const UniversalHeader: React.FC<UniversalHeaderProps> = ({ 
  showBackButton = true, 
  customBackPath 
}) => {
  const [userData, setUserData] = useState<{ username: string; email: string; yos: number; phone: string; et: string; ministry: string } | null>(null);
  const [error, setError] = useState('');
  const [generalLoading, setgeneralLoading] = useState(false);
  const navigate = useNavigate();

  const handleNavToggle = () => {
    document.body.classList.toggle(styles['nav-open']);
  };

  useEffect(() => {
    fetchUserData();
    
    const handleFocus = () => {
      fetchUserData();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

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

  function handleRedirectToUserInfo() {
    console.log('👤 Header: User icon clicked, userData:', userData);
    console.log('👤 Header: Navigating to /profile');
    navigate('/profile')
  }
  
  function handleRedirectToLogin() {
    navigate('/signIn')
  }

  const handleBackClick = () => {
    if (customBackPath) {
      navigate(customBackPath);
    } else {
      navigate(-1); // Go back in history
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

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
            <div className={styles.logo} onClick={handleHomeClick} style={{ cursor: 'pointer', textAlign: 'center' }}>
              <img src={cuLogo} alt="Cu-logo" className={styles['logo-image']} />
              <div style={{ 
                color: '#ffffff', 
                fontSize: '0.8rem', 
                fontWeight: '600', 
                marginTop: '2px',
                textShadow: '0 1px 3px rgba(0,0,0,0.5)'
              }}>
                Home
              </div>
            </div>

            <div className={styles.title}>
              <p className={styles['title-text']}>
                <span className={styles['full-title']}>Kisii University Christian Union</span>
                <span className={styles['short-title']}>Kisii Uni CU</span>
              </p>

              {/* Desktop navigation */}
              <div className={styles['nav-one--hidden']}>
                <div className={styles['About-btn']}>
                  <Link to="/#about" className={styles['nav-link']}>
                    About us
                  </Link>
                </div>

                {showBackButton && (
                  <div className={styles['Quick-links-btn']} style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={handleBackClick}
                      className={styles['nav-link-quick-link']}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        color: '#ffffff',
                        fontSize: 'inherit',
                        fontFamily: 'inherit'
                      }}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} />
                      Back
                    </button>
                    <button 
                      onClick={handleHomeClick}
                      className={styles['nav-link-quick-link']}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        color: '#ffffff',
                        fontSize: 'inherit',
                        fontFamily: 'inherit'
                      }}
                    >
                      <FontAwesomeIcon icon={faHome} />
                      Home
                    </button>
                  </div>
                )}

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
                <Link to="/#about" className={styles['nav-link']}>
                  About us
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className={styles['main-quick--links']}>
            {error && <div className={styles.error}>{error}</div>}
            
            {showBackButton && (
              <>
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
                  }}>Navigation</h3>
                  <p className={styles['quick-access-subtitle']} style={{
                    margin: '2px 0 0 0',
                    color: '#666',
                    fontSize: '0.75rem',
                    fontWeight: '400'
                  }}>Go back or home</p>
                </div>
                
                <div onClick={handleBackClick} className={styles['quick-item--link']} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                  Back
                </div>
                
                <div onClick={handleHomeClick} className={styles['quick-item--link']} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FontAwesomeIcon icon={faHome} />
                  Home
                </div>
              </>
            )}
            
            { userData && <div onClick={handleLogout} className={styles['quick-item--link']} style={{borderTop: '1px solid rgba(255,255,255,0.12)', marginTop: '6px', paddingTop: '8px', cursor: 'pointer', gridColumn: '1 / -1'}}>Log out</div> }
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}
      </header>
    </>
  );
};

export default UniversalHeader;