import { useEffect, useState } from "react";
import styles from '../styles/index.module.css';
import cuLogo from '../assets/cuLogoUAR.png';
import { FaYoutube, FaFacebook, FaTiktok } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import loadingAnime from '../assets/Animation - 1716747954931.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faRocket } from '@fortawesome/free-solid-svg-icons';

//photos
import prayerPNG from '../assets/prayer.png'

// Define the type for the countdown
interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface NewsData {
  title: string;
  body: string;
  imageUrl: string;
}

const LandingPage = () => {
  
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [openCommission, setOpenCommision] = useState(false);
  const [openPrayerJoint, setOpenPrayerJoint] = useState(false);
  const [openBibleStudy, setOpenBibleStudy] = useState(false);
  const [openDevelopment, setOpenDevelopment] = useState(false);
  const [openGraphicDesign, setOpenGraphicDesign] = useState(false);
  const [openKairosCourse, setOpenCairosCourse] = useState(false);
  const [openFocus, setOpenFocus] = useState(false);
  const [userData, setUserData] = useState<{ username: string; email: string; yos: number; phone: string; et: string; ministry: string } | null>(null);
  const [error, setError] = useState('');
  const [generalLoading, setgeneralLoading] = useState(false);
  const [showMinistries, setShowMinistries] = useState(false);
  const [showClasses, setShowClasses] = useState(false);
  const [showBoards, setShowBoards] = useState(false);
  const [showEvangelisticTeams, setShowEvangelisticTeams] = useState(false);
  const navigate = useNavigate();

  const handleNavToggle = () => {
    document.body.classList.toggle(styles['nav-open']);
  };

  const handleNavigateToElders = () => {
    navigate('/elders')
  }

  const [timeLeft, setTimeLeft] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {

    fetchUserData()
    fetchNewsData()

    // Target date: December 27th, 23:59:59 of the current year
    const targetDate = new Date(2025, 2, 21, 23, 59, 59).getTime();

    // Update countdown every second
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      // Calculate time left
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // If countdown is finished, clear the interval
      if (difference < 0) {
        clearInterval(intervalId);
      } else {
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

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

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch user data');
        }

        // Set username to only the first name (first word) if there are multiple names
        const firstName = data.username.split(' ')[0];

        setUserData({
            ...data,
            username: firstName
        });
        
    } catch (error) {
        if (error instanceof Error && error.message === 'Authentication failed: jwt expired') {
            setError('session timed out, log in again')
            setTimeout(() => setError(''), 3000); 
        }else{
            console.error('Error fetching user data:');
        }
        
    }finally{    
        document.body.style.overflow = '';  
        setgeneralLoading(false);      
    }
  };

  const fetchNewsData = async () => {
    setgeneralLoading(true)
    try {
      const response = await fetch('https://ksucu-mc.co.ke/adminnews/news', {
        method: 'GET',
        credentials: 'include'  // Ensures cookies (for authentication) are sent with the request
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
          const response = await fetch('https://ksucu-mc.co.ke/users/logout', {
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

  function handleOpenCommission(): void {
    setOpenCommision(true)
  }
  function handleCloseCommission(): void {
    setOpenCommision(false)
  }

  function handleOpenPrayerJoint(): void {
    setOpenPrayerJoint(true)
  }
  function handleClosePrayerJoint(): void {
    setOpenPrayerJoint(false)
  }

  function handleOpenBibleStudy(): void {
    setOpenBibleStudy(true)
  }
  function handleCloseBibleStudy(): void {
    setOpenBibleStudy(false)
  }

  function handleOpenDevelopment(): void {
    setOpenDevelopment(true)
  }
  function handleCloseDevelopment(): void {
    setOpenDevelopment(false)
  }

  function handleOpenGraphics(): void {
    setOpenGraphicDesign(true)
  }
  function handleCloseGraphics(): void {
    setOpenGraphicDesign(false)
  }

  function handleOpenFocus(): void {
    setOpenFocus(true)
  }
  function handleCloseFocus(): void {
    setOpenFocus(false)
  }

  function handleOpenCairos(): void {
    setOpenCairosCourse(true)
  }
  function handleCloseCairos(): void {
    setOpenCairosCourse(false)
  }

    // Method to handle the toggling behavior
    const handleToggle = (setShow: React.Dispatch<React.SetStateAction<boolean>>, currentState: boolean) => {
      setShow(!currentState);
    };

  return (
    <>

    <div className={styles.body}>
        
      {generalLoading && (
                <div className={styles['loading-screen']}>
                    <p className={styles['loading-text']}>Please wait...🤗</p>
                    <img src={loadingAnime} alt="animation gif" />
                </div>
      )}

        <header className={styles.header}>

          <div className={styles.container}>
            <div className={styles['flex-title']}>
              <div className={styles.logo}>
                <img src={cuLogo} alt="Cu-logo" className={styles['logo-image']} />
              </div>
              <div className={styles.title}>
                <h5 className={styles['title-text']}>KISII UNIVERSITY CHRISTIAN </h5>
                <h5 className={styles['title-text']}>UNION MAIN CAMPUS</h5>
                <div className={styles['nav-one--hidden']}>
                  {userData ?
                    <Link to="/changeDetails" className={styles['signUp-btn']}>{userData.username}</Link>
                   : <Link to="/signUp" className={styles['signUp-btn']}>Sign up</Link>
                  }
            
                  {userData ?
                   <Link to="/signIn" className={styles['Login-btn']} onClick={handleLogout}>Log out</Link> :
                    <Link to="/signIn" className={styles['Login-btn']}>Log in</Link>
                  }
                  <div className={styles['About-btn']}>
                    <a href="#about" className={styles['nav-link']}>
                      About us
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.nav}>
              <div className={styles['nav-one']}>
              {userData ?
                    <Link to="/changeDetails" className={styles['signUp-btn']}>{userData.username}</Link>
                   : <Link to="/signUp" className={styles['signUp-btn']}>Sign up</Link>
                  }
            
                  {userData ?
                   <Link to="/signIn" className={styles['Login-btn']} onClick={handleLogout} >Log out</Link> :
                    <Link to="/signIn" className={styles['Login-btn']}>Log in</Link>
                  }
                <div className={styles['About-btn']}>
                <a href="#about" className={styles['nav-link']}>
                      About us
                    </a>
                </div>
              </div>
              <div className={styles.row} id="hambuger">
                <button className={styles['nav-toggle__btn']} onClick={handleNavToggle}>
                  <div className={styles.hambuger}></div>
                </button>
              </div>
            </div>
            <div className={styles['main-quick--links']}>
              <h3 className={styles['main-quick--links---text']}>Quick Links</h3>
              <ul className={styles['quick-nav--links']}>
                <li className={styles['quick-item']}><Link to="/save" className={styles['quick-item--link']}>Win a Soul</Link></li>
                <hr />
                <li className={styles['quick-item']}><Link to="/media" className={styles['quick-item--link']}>Media</Link></li>
                <hr />
                <li className={styles['quick-item']}>
                <a 
                  href="/pdfs/constitution.pdf" 
                  download="constitution.pdf" 
                  className={styles['quick-item--link']}
                >
                  Constitution
                </a>
              </li>

                <hr />
                <li className={styles['quick-item']}><Link to="library" className={styles['quick-item--link']}>Library</Link></li>
                <hr />
                <li className={styles['quick-item']}><Link to="/financial" className={styles['quick-item--link']}>Financials</Link></li>
                <hr />
                <li className={styles['quick-item']}><Link to="/Bs" className={styles['quick-item--link']}>Bible Study</Link></li>
                <hr />
              </ul>
            </div>
            
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles['intro-video--header']}>
              {/* <div className={styles['video-intro']}>
                <img src={introVid} alt="Intro Video" />
                  <span className={styles["commission-claimer"]} onClick={handleOpenCommission}>
                    <FontAwesomeIcon icon={faQuestion} beatFade />
                  </span>
              </div> */}

              <div className={styles['video-intro']}>
                <div className={styles['video-wrapper']}>
                  <iframe 
                    src="https://www.youtube.com/embed/gaCW4HUwVk0" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <span className={styles["commission-claimer"]} onClick={handleOpenCommission}>
                  <FontAwesomeIcon icon={faQuestion} beatFade />
                </span>
              </div>

              <div className={styles['side-bar--links']}>
                <h3 className={styles['quick-links']}>Quick Links</h3>
                <ul className={styles['quick-nav--links']}>
                <li className={styles['quick-item']}><Link to="/save" className={styles['quick-item--link']}>Win a Soul</Link></li>
                  <li className={styles['quick-item']}><Link to="media" className={styles['quick-item--link']}>Media</Link></li>
                  <li className={styles['quick-item']}>                <a 
                  href="/pdfs/constitution.pdf" 
                  download="constitution.pdf" 
                  className={styles['quick-item--link']}
                >
                  Constitution
                </a></li>
                  <li className={styles['quick-item']}><Link to="library" className={styles['quick-item--link']}>Library</Link></li>
                  <li className={styles['quick-item']}><Link to="/financial" className={styles['quick-item--link']}>Financials</Link></li>
                  <li className={styles['quick-item']}><Link to="/Bs" className={styles['quick-item--link']}>bible study</Link></li>
                </ul>
              </div>
            </div>
          </div>

        </header>

        {  openCommission &&

          <div className={styles.commission2024}>

            <p className={styles.commissionTitle}>
              2025 Elders Day
            </p>

            <p className={styles.commissionCountDown}>
              {timeLeft.days} Days, {timeLeft.hours} Hours, {timeLeft.minutes} Minutes,{" "}
              {timeLeft.seconds} Seconds
            </p>

            <p className={styles.commissionButtonDiv}>
              <button className={styles.commissionRegistrationButton} onClick={handleNavigateToElders}>
                Book your space now
              </button>
            </p>
            <div className={styles.newsReportDiv}>
              {/* <p className={styles.newsReport}>
                  <img className={styles.newsReportimg} src={newsData.imageUrl} alt="news image" />
                  <span className={styles.newsReportImage}>{newsData.title}<Link to="/news">...readmore</Link></span>
              </p> */}

              {newsData ? (
                <p className={styles.newsReport}>
                  <img className={styles.newsReportimg} src={newsData.imageUrl} alt="news image" />
                  <span className={styles.newsReportImage}>
                    {newsData.title}
                    <Link className={styles.newsReportLink} to="/news">...read more</Link>
                  </span>
                </p>
              ) : (
                <p>Loading news data...</p>  // Or any placeholder content while loading
              )}

            </div>

            <p className={styles.cancelBtn} onClick={handleCloseCommission}>
              <FontAwesomeIcon icon={faXmark} />
            </p>

          </div>

        }

        <div className={styles.main}>

              <div className={styles['call-to-action-text']}>
                <p className={styles['cta-text']}>JOIN A NON-DENOMINATIONAL CHRISTIAN STUDENT ASSOCIATION</p>
              </div>

              <div className={styles['main-flex']}>

                <div className={styles['main-section--flex']}>
                  {/* Boards Section */}
                  <div className={styles.boards}>
                    <div className={styles.boardsCategoryDiv}>
                      <h3 className={`${styles['boards-title']} ${styles['category-title']}`}>
                        KSUCU-MC BOARDS
                      </h3>
                      <svg
                        className={`${styles['dropdown-icon']} ${showBoards ? styles.rotate : ''}`}
                        onClick={() => handleToggle(setShowBoards, showBoards)}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                      </svg>
                    </div>

                    <div className={`${styles['dropdown-content']} ${showBoards ? styles.show : ''}`}>
                    <ol className={`${styles['boards-list']} ${styles['category-list']}`}>
                      <li className={styles['boards-item']}>
                        <Link to="/boards" className={styles['boards-item--link']}>ICT board</Link>
                      </li>
                      <li className={styles['boards-item']}>
                        <Link to="/boards" className={styles['boards-item--link']}>Editorial board</Link>
                      </li>
                      <li className={styles['boards-item']}>
                        <Link to="/boards" className={styles['boards-item--link']}>Media Production</Link>
                      </li>
                      <li className={styles['boards-item']}>
                        <Link to="/boards" className={styles['boards-item--link']}>Communication board</Link>
                      </li>
                    </ol>
                    </div>
                  </div>

                  {/* Evangelistic Teams Section */}
                  <div className={styles.ET}>
                    <div className={styles.boardsCategoryDiv}>
                      <h3 className={`${styles['ET-title']} ${styles['category-title']}`}>
                        EVANGELISTIC TEAMS
                      </h3>
                      <svg
                        className={`${styles['dropdown-icon']} ${showEvangelisticTeams ? styles.rotate : ''}`}
                        onClick={() => handleToggle(setShowEvangelisticTeams, showEvangelisticTeams)}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                      </svg>
                    </div>

                    <div className={`${styles['dropdown-content']} ${showEvangelisticTeams ? styles.show : ''}`}>
                    <ol className={`${styles['ET-list']} ${styles['category-list']}`}>
                      <li className={styles['ET-item']}>
                        <Link to="/ets#cet" className={styles['ET-item--link']}>CET</Link>
                      </li>
                      <li className={styles['ET-item']}>
                        <Link to="/ets#net" className={styles['ET-item--link']}>NET</Link>
                      </li>
                      <li className={styles['ET-item']}>
                        <Link to="/ets#eset" className={styles['ET-item--link']}>ESET</Link>
                      </li>
                      <li className={styles['ET-item']}>
                        <Link to="/ets#rivet" className={styles['ET-item--link']}>RIVET</Link>
                      </li>
                      <li className={styles['ET-item']}>
                        <Link to="/ets#weso" className={styles['ET-item--link']}>WESO</Link>
                      </li>
                    </ol>
                    </div>
                  </div>
                </div>

                <div className={styles['main-section--flex']}>
                  {/* Ministries Section */}
                  <div className={styles.ministries}>
                    <div className={styles.boardsCategoryDiv}>
                      <h3 className={`${styles['ministries-title']} ${styles['category-title']}`}>
                        KSUCU-MC MINISTRIES
                      </h3>
                      <svg
                        className={`${styles['dropdown-icon']} ${showMinistries ? styles.rotate : ''}`}
                        onClick={() => handleToggle(setShowMinistries, showMinistries)}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                      </svg>
                    </div>

                    <div className={`${styles['dropdown-content']} ${showMinistries ? styles.show : ''}`}>
                    <ol className={`${styles['ministries-list']} ${styles['category-list']}`}>
                      <li className={styles['ministries-item']}>
                        <Link to="/ministries#ushering" className={styles['ministries-item--link']}>Ushering</Link>
                      </li>
                      <li className={styles['ministries-item']}>
                        <Link to="/ministries#creativity" className={styles['ministries-item--link']}>Creativity</Link>
                      </li>
                      <li className={styles['ministries-item']}>
                        <Link to="/ministries#compassion" className={styles['ministries-item--link']}>Compassion</Link>
                      </li>
                      <li className={styles['ministries-item']}>
                        <Link to="/ministries#intercessory" className={styles['ministries-item--link']}>Intercessory</Link>
                      </li>
                      <li className={styles['ministries-item']}>
                        <Link to="/ministries#hs" className={styles['ministries-item--link']}>High School</Link>
                      </li>
                      <li className={styles['ministries-item']}>
                        <Link to="/ministries#wananzambe" className={styles['ministries-item--link']}>Wananzambe</Link>
                      </li>
                      <li className={styles['ministries-item']}>
                        <Link to="/ministries#cs" className={styles['ministries-item--link']}>Church School</Link>
                      </li>
                      <li className={styles['ministries-item']}>
                        <Link to="/ministries#pw" className={styles['ministries-item--link']}>Praise and Worship</Link>
                      </li>
                    </ol>
                    </div>
                  </div>

                  {/* Classes and Fellowships Section */}
                  <div className={styles.committees}>
                    <div className={styles.boardsCategoryDiv}>
                      <h3 className={`${styles['comm-title']} ${styles['category-title']}`}>
                        CLASSES AND FELLOWSHIPS
                      </h3>
                      <svg
                        className={`${styles['dropdown-icon']} ${showClasses ? styles.rotate : ''}`}
                        onClick={() => handleToggle(setShowClasses, showClasses)}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                      </svg>
                    </div>

                    <div className={`${styles['dropdown-content']} ${showClasses ? styles.show : ''}`}>
                    <ol className={`${styles['comm-list']} ${styles['category-list']}`}>
                      <li className={styles['comm-item']}>
                        <Link to="/fellowshipsandclasses" className={styles['comm-item--link']}>Best-p classes</Link>
                      </li>
                      <li className={styles['comm-item']}>
                        <Link to="/fellowshipsandclasses" className={styles['comm-item--link']}>Class fellowships</Link>
                      </li>
                      <li className={styles['comm-item']}>
                        <Link to="/fellowshipsandclasses" className={styles['comm-item--link']}>Sisters fellowship</Link>
                      </li>
                      <li className={styles['comm-item']}>
                        <Link to="/fellowshipsandclasses" className={styles['comm-item--link']}>Brothers fellowship</Link>
                      </li>
                      <li className={styles['comm-item']}>
                        <Link to="/fellowshipsandclasses" className={styles['comm-item--link']}>Discipleship classes</Link>
                      </li>
                    </ol>
                    </div>
                  </div>
                </div>
                
              </div>
              
        </div>

        <div className={styles.containerOthers}>
          
          <div className={styles.appreciatingTitleText}>
            <h2 className={styles.appreciatingTitleh2Text}>Appreciating the opportunity to fellowship with KSUCU-MC, other interesting forums are:</h2>
          </div>

          <div className={styles.containerOthersRow}>

                  <div className={styles.othersColumns}  >
                      {/* <span class="fa fa-clock-o size"></span> */}
                      <FontAwesomeIcon icon={faClock} className={styles.othersIcon} onClick={handleOpenPrayerJoint} />
                      <br />
                      <span>Joint Prayer Time</span>

                      { openPrayerJoint && <div className={styles.othersDisplayDiv}>
                        <div className={styles.closeOtherDisplayDiv}>
                          <FontAwesomeIcon icon={faXmark} className={styles.closeOtherDisplayIcon} onClick={handleClosePrayerJoint} />
                        </div>
                        <p className={styles.othersDisplayDivTitle}>Joint Prayers</p>
                        <div className={styles.othersImg}>
                            <img src={prayerPNG} alt='prayer image' />
                        </div>
                        <div className={styles.othersTextDiv}>
                          <p className={styles.othersText}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste illum enim esse dolorem libero! Deleniti exercitationem quaerat harum, enim earum excepturi esse possimus ex ipsum? Quasi suscipit explicabo impedit veritatis?</p>
                        </div>
                      </div>}

                  </div>
                  <div className={styles.othersColumns}  >
                      {/* <span class="fa fa-coffee size"></span> */}
                      <FontAwesomeIcon icon={faCoffee} className={styles.othersIcon} onClick={handleOpenBibleStudy} />
                      <br />
                      <span>Bible Study Nights</span>

                      { openBibleStudy && <div className={styles.othersDisplayDiv}>
                        <div className={styles.closeOtherDisplayDiv}>
                          <FontAwesomeIcon icon={faXmark} className={styles.closeOtherDisplayIcon} onClick={handleCloseBibleStudy} />
                        </div>
                        <p className={styles.othersDisplayDivTitle}>Bible Study</p>
                        <div className={styles.othersImg}>
                            <img src={prayerPNG} alt='prayer image' />
                        </div>
                        <div className={styles.othersTextDiv}>
                          <p className={styles.othersText}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste illum enim esse dolorem libero! Deleniti exercitationem quaerat harum, enim earum excepturi esse possimus ex ipsum? Quasi suscipit explicabo impedit veritatis?</p>
                        </div>
                      </div>}

                  </div>
                  <div className={styles.othersColumns} >
                      {/* <span class="fa fa-trophy size"></span> */}
                      <FontAwesomeIcon icon={faTrophy} className={styles.othersIcon} onClick={handleOpenDevelopment} />
                      < br />
                      <span>Development Projects</span>

                    
                      { openDevelopment && <div className={styles.othersDisplayDiv}>
                        <div className={styles.closeOtherDisplayDiv}>
                          <FontAwesomeIcon icon={faXmark} className={styles.closeOtherDisplayIcon} onClick={handleCloseDevelopment} />
                        </div>
                        <p className={styles.othersDisplayDivTitle}>Development</p>
                        <div className={styles.othersImg}>
                            <img src={prayerPNG} alt='prayer image' />
                        </div>
                        <div className={styles.othersTextDiv}>
                          <p className={styles.othersText}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste illum enim esse dolorem libero! Deleniti exercitationem quaerat harum, enim earum excepturi esse possimus ex ipsum? Quasi suscipit explicabo impedit veritatis?</p>
                        </div>
                      </div>}

                  </div>
                  <div className={styles.othersColumns} >
                      {/* <span class="fa fa-code size"></span> */}
                      <FontAwesomeIcon icon={faCode} className={styles.othersIcon} onClick={handleOpenGraphics} />
                      <br />
                      <span>Graphic Design Classes</span>

                      { openGraphicDesign && <div className={styles.othersDisplayDiv}>
                        <div className={styles.closeOtherDisplayDiv}>
                          <FontAwesomeIcon icon={faXmark} className={styles.closeOtherDisplayIcon} onClick={handleCloseGraphics} />
                        </div>
                        <p className={styles.othersDisplayDivTitle}>Graphics Classes</p>
                        <div className={styles.othersImg}>
                            <img src={prayerPNG} alt='prayer image' />
                        </div>
                        <div className={styles.othersTextDiv}>
                          <p className={styles.othersText}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste illum enim esse dolorem libero! Deleniti exercitationem quaerat harum, enim earum excepturi esse possimus ex ipsum? Quasi suscipit explicabo impedit veritatis?</p>
                        </div>
                      </div>}

                  </div>
                  <div className={styles.othersColumns} >
                      {/* <span class="fa fa-globe size"></span> */}
                      <FontAwesomeIcon icon={faGlobe} className={styles.othersIcon} onClick={handleOpenCairos} />
                      <br />
                      <span>Kairos Course Training</span>

                      { openKairosCourse && <div className={styles.othersDisplayDiv}>
                        <div className={styles.closeOtherDisplayDiv}>
                          <FontAwesomeIcon icon={faXmark} className={styles.closeOtherDisplayIcon} onClick={handleCloseCairos} />
                        </div>
                        <p className={styles.othersDisplayDivTitle}>Kairos Classes</p>
                        <div className={styles.othersImg}>
                            <img src={prayerPNG} alt='prayer image' />
                        </div>
                        <div className={styles.othersTextDiv}>
                          <p className={styles.othersText}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste illum enim esse dolorem libero! Deleniti exercitationem quaerat harum, enim earum excepturi esse possimus ex ipsum? Quasi suscipit explicabo impedit veritatis?</p>
                        </div>
                      </div>}
                  </div>
                  <div className={styles.othersColumns} >
                      {/* <span class="fa fa-rocket size"></span> */}
                      <FontAwesomeIcon icon={faRocket} className={styles.othersIcon} onClick={handleOpenFocus} />
                      <br />
                      <span>FOCUS conferences</span>

                      { openFocus && <div className={styles.othersDisplayDiv}>
                        <div className={styles.closeOtherDisplayDiv}>
                          <FontAwesomeIcon icon={faXmark} className={styles.closeOtherDisplayIcon} onClick={handleCloseFocus} />
                        </div>
                        <p className={styles.othersDisplayDivTitle}>FOCUS Conferences</p>
                        <div className={styles.othersImg}>
                            <img src={prayerPNG} alt='prayer image' />
                        </div>
                        <div className={styles.othersTextDiv}>
                          <p className={styles.othersText}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste illum enim esse dolorem libero! Deleniti exercitationem quaerat harum, enim earum excepturi esse possimus ex ipsum? Quasi suscipit explicabo impedit veritatis?</p>
                        </div>
                      </div>}


                  </div>
          </div>

        </div>

        <div className={styles.containerAbout}>
          <div className={styles.about}>
          <p id="about" className={styles.aboutTitle}>About us</p>
              <div className={styles.aboutFlex}>
                      <div className={`${styles.aboutCol} ${styles.aboutCol1}`}>

                        <div className={styles.aboutCol1Mission}>
                          <h4><b>MISSION</b></h4>
                          <p>
                            To impact Christian core values and skills to students through equipping, empowering and offering conducive environment for effective living in and out of campus.
                          </p>
                        </div>


                        <div className={styles.aboutCol1Vision}>
                          <h4><b>VISION</b></h4>
                          <p>
                            A relevant and effective Christian to the church and society.
                          </p>
                        </div>
                        
                      </div>

                      <div className={`${styles.aboutCol} ${styles.aboutCol2}`}>
                        <h4><b>OBJECTIVES</b></h4>
                        <b>1.Discipleship</b><br /> i. To deepen and strengthen spiritual lives of its members through the study of The Bible, prayers, Christian fellowships and obedience to God.<br /> ii. To encourage responsible membership through the exercise
                        of various spiritual gifts.
                        <br />
                        <b>2.Evangelism</b><br /> To encourage members to witness to the Lord Jesus, in and outside campus as the incarnate Son of God and seek to lead others to a personal faith in Him.
                        <br />
                        <b>3.Mission and Compassion</b><br /> To prepare Christian students to take good news to all nations of the world and to play active role in. communities where they live.
                        <br />
                        <b>4.Leadership Development</b><br /> To identify and develop Christian leaders through training and experience.
                      </div>
              </div>
            </div>
          </div>
          <div className={  `${ styles['footer'] } ${ styles['home-footer'] }` } id='contacts'>
            <p className={styles['footer--text']}>KISII UNIVERSITY MAIN CAMPUS CHRISTIAN UNION 2024</p>
                
            <div className={styles['hr']}></div>

            <div className={styles['social--links']}>
                <div className={styles['youtube']}>
                    <a href="https://www.youtube.com/@KSUCU-MC" className={styles['social-link']}><FaYoutube /></a>
                </div>

                <div className={styles['facebook']}>
                    <a href="https://www.facebook.com/ksucumc" className={styles['social-link']}><FaFacebook /></a>
                </div>

                <div className={styles['tiktok']}>
                    <a href="" className={styles['social-link']}><FaTiktok /></a>
                </div>
            </div>
        </div>
    </div>

    </>
  );
};

export default LandingPage;


