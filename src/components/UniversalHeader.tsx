import React, { useEffect, useState } from "react";
import { getApiUrl } from '../config/environment';
import styles from '../styles/index.module.css';
import cuLogo from '../assets/cuLogoUAR.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import loadingAnime from '../assets/Animation - 1716747954931.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserLock, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import CommunityChat from './CommunityChat';

const UniversalHeader: React.FC = () => {
  const [userData, setUserData] = useState<{ username: string; email: string; yos: number; phone: string; et: string; ministry: string } | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [error, setError] = useState('');
  const [generalLoading, setgeneralLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavToggle = () => {
    document.body.classList.toggle(styles['nav-open']);
  };

  useEffect(() => {
    // Skip fetching user data if on polling officer routes
    const isPollingOfficerRoute = location.pathname.startsWith('/polling-officer');
    const isAdminRoute = location.pathname === '/admin' || location.pathname.startsWith('/admin/');

    if (isAdminRoute) {
      // Check for super admin session
      checkSuperAdminSession();
    } else if (!isPollingOfficerRoute) {
      fetchUserData();
    }

    const handleFocus = () => {
      if (isAdminRoute) {
        checkSuperAdminSession();
      } else if (!isPollingOfficerRoute) {
        fetchUserData();
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [location.pathname]);

  const checkSuperAdminSession = async () => {
    try {
      const apiUrl = getApiUrl('superAdmin').replace('/login', '');
      const response = await fetch(`${apiUrl}/verify`, {
        credentials: 'include'
      });

      if (response.ok) {
        setIsSuperAdmin(true);
        setUserData({ username: 'Admin', email: '', yos: 0, phone: '', et: '', ministry: '' });
      }
    } catch (error) {
      console.error('Error checking super admin session:', error);
    }
  };

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

  const handleSuperAdminLogout = async () => {
    try {
      const apiUrl = getApiUrl('superAdmin').replace('/login', '');
      const response = await fetch(`${apiUrl}/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setIsSuperAdmin(false);
        setUserData(null);
        navigate('/');
      }
    } catch (error) {
      console.error('Error logging out super admin:', error);
    }
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
                {!isSuperAdmin && (
                  <div className={styles['About-btn']}>
                    <Link to="/#about" className={styles['nav-link']}>
                      About us
                    </Link>
                  </div>
                )}

                {isSuperAdmin ? (
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '80px', minHeight: '50px', justifyContent: 'center'}} onClick={handleSuperAdminLogout}>
                    <FontAwesomeIcon className={`${styles['user-icon']} `} icon={faSignOutAlt} />
                    <span style={{color: '#ffffff', fontSize: '12px', marginTop: '3px', fontWeight: '600', textShadow: '0 1px 3px rgba(0,0,0,0.3)', whiteSpace: 'nowrap'}}>
                      Logout
                    </span>
                  </div>
                ) : (
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '80px', minHeight: '50px', justifyContent: 'center'}} onClick={userData ? handleRedirectToUserInfo : handleRedirectToLogin}>
                    <FontAwesomeIcon className={`${styles['user-icon']} `} icon={userData ? faUser : faUserLock} />
                    <span style={{color: '#ffffff', fontSize: '12px', marginTop: '3px', fontWeight: '600', textShadow: '0 1px 3px rgba(0,0,0,0.3)', whiteSpace: 'nowrap'}}>
                      {userData ? userData.username || 'User' : 'Log In'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles['hambuger-div']} id="hambuger">
              <button className={styles['nav-toggle__btn']} onClick={handleNavToggle}>
                <div className={styles.hambuger}></div>
              </button>
            </div>

            <div className={`${styles['user-icon-container']} `}>
              {isSuperAdmin ? (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '60px', minHeight: '45px', justifyContent: 'center'}} onClick={handleSuperAdminLogout}>
                  <FontAwesomeIcon className={`${styles['user-icon']} `} icon={faSignOutAlt} />
                  <span style={{color: '#ffffff', fontSize: '10px', marginTop: '2px', fontWeight: '600', textShadow: '0 1px 3px rgba(0,0,0,0.3)', whiteSpace: 'nowrap'}}>
                    Logout
                  </span>
                </div>
              ) : (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', minWidth: '60px', minHeight: '45px', justifyContent: 'center'}} onClick={userData ? handleRedirectToUserInfo : handleRedirectToLogin}>
                  <FontAwesomeIcon className={`${styles['user-icon']} `} icon={userData ? faUser : faUserLock} />
                  <span style={{color: '#ffffff', fontSize: '10px', marginTop: '2px', fontWeight: '600', textShadow: '0 1px 3px rgba(0,0,0,0.3)', whiteSpace: 'nowrap'}}>
                    {userData ? userData.username || 'User' : 'Log In'}
                  </span>
                </div>
              )}
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
              <Link to="/signIn" className={styles['Login-btn']}>Log in</Link>
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
            
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}
      </header>

      {/* Community Chat - Show for all users */}
      <CommunityChat />
    </>
  );
};

export default UniversalHeader;