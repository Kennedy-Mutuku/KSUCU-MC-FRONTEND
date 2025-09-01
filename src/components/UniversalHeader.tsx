import React, { useEffect, useState } from "react";
import { getApiUrl } from '../config/environment';
import styles from '../styles/index.module.css';
import cuLogo from '../assets/cuLogoUAR.png';
import { Link, useNavigate } from 'react-router-dom';
import loadingAnime from '../assets/Animation - 1716747954931.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserLock } from '@fortawesome/free-solid-svg-icons';

const UniversalHeader: React.FC = () => {
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

  const handleLogout = async () => {
    setgeneralLoading(true)
      try {
          const logoutUrl = getApiUrl('usersLogout');
          console.log('Header: Attempting logout to:', logoutUrl);
          
          const response = await fetch(logoutUrl, {
              method: 'POST',
              credentials: 'include',
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          console.log('Header: Logout response status:', response.status);

          if (response.ok) {
              console.log('Header: Logout successful');
              setUserData(null);
              navigate('/signIn');
          } else {
              console.log('Header: Logout failed with status:', response.status);
              // Still clear user data and navigate even if server logout fails
              setUserData(null);
              navigate('/signIn');
          }
      } catch (error) {
          console.error('Header: Error during logout:', error);
          // Still clear user data and navigate even if logout request fails
          setUserData(null);
          navigate('/signIn');
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

  const handleHomeClick = () => {
    navigate('/');
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
            <div className={styles.logo} onClick={handleHomeClick} style={{ cursor: 'pointer', textAlign: 'center' }}>
              <img src={cuLogo} alt="Cu-logo" className={styles['logo-image']} />
            </div>

            <div className={styles.title}>
              <p className={styles['title-text']}>
                <span className={styles['full-title']}>Kisii University Christian Union</span>
                <span className={styles['short-title']}>Kisii Uni CU</span>
              </p>

              {/* Desktop navigation - simplified without Back/Home buttons */}
              <div className={styles['nav-one--hidden']}>
                <div className={styles['About-btn']}>
                  <Link to="/#about" className={styles['nav-link']}>
                    About us
                  </Link>
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
                <Link to="/#about" className={styles['nav-link']}>
                  About us
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Links - simplified without Back/Home */}
          <div className={styles['main-quick--links']}>
            {error && <div className={styles.error}>{error}</div>}
            
            { userData && <div onClick={handleLogout} className={styles['quick-item--link']} style={{borderTop: '1px solid rgba(255,255,255,0.12)', marginTop: '6px', paddingTop: '8px', cursor: 'pointer', gridColumn: '1 / -1'}}>Log out</div> }
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}
      </header>
    </>
  );
};

export default UniversalHeader;