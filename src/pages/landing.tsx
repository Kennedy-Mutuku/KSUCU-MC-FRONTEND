import React, { useEffect, useState } from "react";
import { getApiUrl } from '../config/environment';
import styles from '../styles/index.module.css';
import { FaYoutube, FaFacebook, FaTiktok } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faRocket } from '@fortawesome/free-solid-svg-icons';
import visionImg from '../assets/gents.jpg'
import missionImg from '../assets/ladies.jpg'
import valuesImg from '../assets/amptheatre.jpg'
import prayerPNG from '../assets/RIVET.jpg'
import { faUserLock } from '@fortawesome/free-solid-svg-icons';
import { Heart, Camera, BookOpen, Library, DollarSign, GraduationCap, MessageCircle } from "lucide-react";
import LandingPageHeader from '../components/LandingPageHeader';


interface NewsData {
  title: string;
  body: string;
  imageUrl: string;
}

const LandingPage = () => {
  
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [openPrayerJoint, setOpenPrayerJoint] = useState(false);
  const [openBibleStudy, setOpenBibleStudy] = useState(false);
  const [openDevelopment, setOpenDevelopment] = useState(false);
  const [openGraphicDesign, setOpenGraphicDesign] = useState(false);
  const [openKairosCourse, setOpenCairosCourse] = useState(false);
  const [openFocus, setOpenFocus] = useState(false);
  const [userData, setUserData] = useState<{ username: string; email: string; yos: number; phone: string; et: string; ministry: string } | null>(null);
  const [error, setError] = useState('');
  const [generalLoading, setgeneralLoading] = useState(false);
  const [showCommissionDialog, setShowCommissionDialog] = useState(false);
  const [showMinistries, setShowMinistries] = useState(false);
  const [showClasses, setShowClasses] = useState(false);
  const [showBoards, setShowBoards] = useState(false);
  const [showEvangelisticTeams, setShowEvangelisticTeams] = useState(false);
  const navigate = useNavigate();


  const images = [
    { url:  visionImg , text: `
      <h1 class="${styles['section-text']}"></h1>
      <div class="${styles['loadingBar-intro']}"></div>
      ` },
    { url: missionImg , text: `<h1 class="${styles['section-text']}"></h1><div class="${styles['loadingBar-intro']}"></div>` },
    { url:  valuesImg , text: `<h1 class="${styles['section-text']}"></h1><div class="${styles['loadingBar-intro']}"></div>` }
  ];
  

  useEffect(() => {
    fetchUserData()
    fetchNewsData()
    

    // Refetch user data when window gains focus (user returns from login)
    const handleFocus = () => {
      fetchUserData();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };

  }, [images.length]);

  const fetchUserData = async () => {
    console.log('🏠 Landing: Fetching user data...');
    
    // check if the user in online
    if (!navigator.onLine) {
        console.log('❌ Landing: User offline');
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

        const apiUrl = getApiUrl('users');
        console.log('🏠 Landing: Fetching from:', apiUrl);

        const response = await fetch(apiUrl, {
            credentials: 'include'
        });

        console.log('🏠 Landing: Response status:', response.status);
        const data = await response.json();
        console.log('🏠 Landing: Response data:', data);
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch user data');
        }  

        if (!data.phone || !data.reg || !data.yos) {
            setError('...navigating to update details')
            // Redirect to the update details page
            navigate('/changeDetails');
            
            return;
        }

        // Set username to only the first name (first word) if there are multiple names
        const firstName = data.username.split(' ')[0];

        const finalUserData = {
            ...data,
            username: firstName
        };
        console.log('✅ Landing: Setting user data:', finalUserData);
        setUserData(finalUserData);
        
    } catch (error) {
        if (error instanceof Error && error.message === 'Authentication failed: jwt expired') {
            // Silently handle expired session
            navigate('/');
        } else {
            console.error('❌ Landing: Error fetching user data:', error);
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


  function handleCloseCommission(): void {
    setShowCommissionDialog(false)
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


  const handleQuickLinkClick = (action?: () => void, event?: React.MouseEvent) => {
    event?.stopPropagation();
    if (action) {
      action();
    }
  };


  function navigateMedia() {
    if(userData){
      navigate('/media')
    }else{

      // navigate('/media')

      setError('Login required 😔');

      setTimeout(() => {
        setError('')
      }, 5000);
    }
  }

  function navigateToTalkToUs() {
    // For now, we'll navigate to a contact/message page
    // This can be updated later when the messaging functionality is implemented
    navigate('/contact-us');
  }

  // The commission dialog content will be handled in the main return below
  const renderCommissionDialog = () => {
    return (
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
    );
  };

  // Suppress TypeScript warnings - these states are available for future UI implementation
  if (error) { /* error state handled via setError calls */ }
  if (generalLoading) { /* loading state handled via setgeneralLoading calls */ }
  
  return (
    <React.Fragment>
      <LandingPageHeader />
      {showCommissionDialog && renderCommissionDialog()}
      
      <div className={styles.landingPage}>
        <div className={styles.main}>

              <div className={styles['call-to-action-text']}>
                <p className={styles['cta-text']}>JOIN A NON-DENOMINATIONAL CHRISTIAN STUDENT ASSOCIATION</p>
              </div>

              <div className={styles['main-flex']}>

                <div className={styles['main-section--flex']}>
                  {/* Boards Section */}
                  <div className={styles.boards}>
                    <div className={styles.boardsCategoryDiv} onClick={() => handleToggle(setShowBoards, showBoards)}>
                      <h3 className={`${styles['boards-title']} ${styles['category-title']}`}>
                        KSUCU-MC BOARDS
                      </h3>
                      <svg
                        className={`${styles['dropdown-icon']} ${showBoards ? styles.rotate : ''}`}
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
                    <div className={styles.boardsCategoryDiv} onClick={() => handleToggle(setShowEvangelisticTeams, showEvangelisticTeams)}>
                      <h3 className={`${styles['ET-title']} ${styles['category-title']}`}>
                        EVANGELISTIC TEAMS
                      </h3>
                      <svg
                        className={`${styles['dropdown-icon']} ${showEvangelisticTeams ? styles.rotate : ''}`}
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
                    <div className={styles.boardsCategoryDiv} onClick={() => handleToggle(setShowMinistries, showMinistries)}>
                      <h3 className={`${styles['ministries-title']} ${styles['category-title']}`}>
                        KSUCU-MC MINISTRIES
                      </h3>
                      <svg
                        className={`${styles['dropdown-icon']} ${showMinistries ? styles.rotate : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                      </svg>
                    </div>

                    <div className={`${styles['dropdown-content']} ${showMinistries ? styles.show : ''}`}>
                    <ol className={`${styles['ministries-list']} ${styles['category-list']}`}>
                      <li className={styles['ministries-item']}>
                        <Link to="/ministries/ushering" className={styles['ministries-item--link']}>Ushering</Link>
                      </li>
                      <li className={styles['ministries-item']}>
                        <Link to="/ministries/creativity" className={styles['ministries-item--link']}>Creativity</Link>
                      </li>
                      <li className={styles['ministries-item']}>
                        <Link to="/ministries/compassion" className={styles['ministries-item--link']}>Compassion</Link>
                      </li>
                      <li className={styles['ministries-item']}>
                        <Link to="/ministries/intercessory" className={styles['ministries-item--link']}>Intercessory</Link>
                      </li>
                      <li className={styles['ministries-item']}>
                        <Link to="/ministries/highSchool" className={styles['ministries-item--link']}>High School</Link>
                      </li>
                      <li className={styles['ministries-item']}>
                        <Link to="/ministries/wananzambe" className={styles['ministries-item--link']}>Wananzambe</Link>
                      </li>
                      <li className={styles['ministries-item']}>
                        <Link to="/ministries/churchSchool" className={styles['ministries-item--link']}>Church School</Link>
                      </li>
                      <li className={styles['ministries-item']}>
                        <Link to="/ministries/praiseAndWorship" className={styles['ministries-item--link']}>Praise and Worship</Link>
                      </li>
                      <li className={styles['ministries-item']}>
                        <Link to="/ministries/choir" className={styles['ministries-item--link']}>Choir</Link>
                      </li>
                    </ol>
                    </div>
                  </div>

                  {/* Classes and Fellowships Section */}
                  <div className={styles.committees}>
                    <div className={styles.boardsCategoryDiv} onClick={() => handleToggle(setShowClasses, showClasses)}>
                      <h3 className={`${styles['comm-title']} ${styles['category-title']}`}>
                        CLASSES AND FELLOWSHIPS
                      </h3>
                      <svg
                        className={`${styles['dropdown-icon']} ${showClasses ? styles.rotate : ''}`}
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

        <div className={styles.weeklyActivities}>

          <div className={styles.container}>
            <h3 className={styles.sectionTitle}>Our Weekly Activities</h3>
            <div className={styles.activityCardContainer}>
              {[
                { day: "Monday", event: "Discipleship" },
                { day: "Tuesday", event: "Ministry Meetings" },
                { day: "Wednesday", event: "Best P" },
                { day: "Thursday", event: "ET Fellowship" },
                { day: "Friday", event: "Friday Fellowship" }
              ].map((activity, index) => (
                <div key={index} className={styles.cardClasses}>
                  <h4 className={styles.cardTitle} >{activity.day}: {activity.event}</h4>
                  <p>Time: 6:50 PM to 8:50 PM</p>
                  <p>Venue: Communicated daily</p>
                </div>
              ))}

                <div  className={styles.cardClasses}>
                  <h4 className={styles.cardTitle} >Saturday: Class Fellowship</h4>
                  <p>Time: 9:00 AM to 12:00 PM</p>
                  <p>Venue: Communicated earlier</p>
                </div>

                <div  className={styles.cardClasses}>
                  <h4 className={styles.cardTitle} >Sunday : Services</h4>
                  <p>First Servics: 7:30 AM to 10:00 AM</p>
                  <p>Second Service: 10:15 AM to 12:45 PM</p>
                  <p>Venue: Communicated before service</p>
                </div>
            </div>
          </div>

        </div>

        {/* others */}

        <div className={styles.containerOthers}>
          
          <div className={styles.appreciatingTitleText}>
            <h2 className={styles.appreciatingTitleh2Text}>Appreciating the opportunity to fellowship with KSUCU, other interesting forums are:</h2>
          </div>

          <div className={styles.containerOthersRow}>

                  <div className={styles.othersColumns} onClick={handleOpenPrayerJoint}>
                      {/* <span class="fa fa-clock-o size"></span> */}
                      <FontAwesomeIcon icon={faClock} className={styles.othersIcon} />
                      <span>Joint Prayer Time</span>

                      { openPrayerJoint && <div className={styles.othersDisplayDiv} onClick={(e) => e.target === e.currentTarget && handleClosePrayerJoint()}>
                        <div className={styles.closeOtherDisplayDiv}>
                          <FontAwesomeIcon icon={faXmark} className={styles.closeOtherDisplayIcon} onClick={handleClosePrayerJoint} />
                        </div>
                        <p className={styles.othersDisplayDivTitle}>Joint Prayers</p>
                        <div className={styles.othersImg}>
                            <img src={prayerPNG} alt='prayer image' />
                        </div>
                        <div className={styles.othersTextDiv}>
                          <p className={styles.othersText}>KSUCU-MC joint prayers are conducted everyday from 8-50 pm to 9-30 pm and in the morning from 5-00am to 6-00 am venues are communicated before time, on wednesdays students meet at gethsamane from 1 to 2 pm and 5 to 6 pm for prayers and fasting</p>
                        </div>
                      </div>}

                  </div>
                  <div className={styles.othersColumns} onClick={handleOpenBibleStudy}>
                      {/* <span class="fa fa-coffee size"></span> */}
                      <FontAwesomeIcon icon={faCoffee} className={styles.othersIcon} />
                      <span>Bible Study Nights</span>

                      { openBibleStudy && <div className={styles.othersDisplayDiv} onClick={(e) => e.target === e.currentTarget && handleCloseBibleStudy()}>
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
                  <div className={styles.othersColumns} onClick={handleOpenDevelopment}>
                      {/* <span class="fa fa-trophy size"></span> */}
                      <FontAwesomeIcon icon={faTrophy} className={styles.othersIcon} />
                      <span>Development Projects</span>

                    
                      { openDevelopment && <div className={styles.othersDisplayDiv} onClick={(e) => e.target === e.currentTarget && handleCloseDevelopment()}>
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
                  <div className={styles.othersColumns} onClick={handleOpenGraphics}>
                      {/* <span class="fa fa-code size"></span> */}
                      <FontAwesomeIcon icon={faCode} className={styles.othersIcon} />
                      <span>Graphic Design Classes</span>

                      { openGraphicDesign && <div className={styles.othersDisplayDiv} onClick={(e) => e.target === e.currentTarget && handleCloseGraphics()}>
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
                  <div className={styles.othersColumns} onClick={handleOpenCairos}>
                      {/* <span class="fa fa-globe size"></span> */}
                      <FontAwesomeIcon icon={faGlobe} className={styles.othersIcon} />
                      <span>Kairos Course Training</span>

                      { openKairosCourse && <div className={styles.othersDisplayDiv} onClick={(e) => e.target === e.currentTarget && handleCloseCairos()}>
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
                  <div className={styles.othersColumns} onClick={handleOpenFocus}>
                      {/* <span class="fa fa-rocket size"></span> */}
                      <FontAwesomeIcon icon={faRocket} className={styles.othersIcon} />
                      <span>FOCUS conferences</span>

                      { openFocus && <div className={styles.othersDisplayDiv} onClick={(e) => e.target === e.currentTarget && handleCloseFocus()}>
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

          {/* Ministries Admin Section */}
        <div className={styles.worshipAdminSection}>
          <div className={styles.container}>
            <div className={styles.worshipAdminCard}>
              <h3>Ministries Administration</h3>
              <p>Manage ministries</p>
              <Link to="/worship-docket-admin" className={styles.worshipAdminButton}>
                Ministries Admin
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.containerAbout}>

          <div className={styles.container}>
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
            
                              <p className={styles.objectivesTitle}>Discipleship</p>
                              <ul className={styles.subList}>
                                <li>To deepen and strengthen spiritual lives of its members through the study of The Bible, prayers, Christian fellowships, and obedience to God. <span ><Link className={styles.registerSpan} to={"/Bs"}>Register for bible study today</Link> </span></li>
                                <li>To encourage responsible membership through the exercise of various spiritual gifts.</li>
                              </ul>
            
                              <p className={styles.objectivesTitle}>Evangelism</p>
                              <p className={styles.subList} >To encourage members to witness to the Lord Jesus, in and outside campus as the incarnate Son of God and seek to lead others to a personal faith in Him.</p>
            
                              <p className={styles.objectivesTitle}>Mission and Compassion</p>
                              <p className={styles.subList} >To prepare Christian students to take good news to all nations of the world and to play an active role in communities where they live.</p>
            
            
                              <p className={styles.objectivesTitle}>Leadership Development</p>
                              <p className={styles.subList} >To identify and develop Christian leaders through training and experience.</p>
            
                        </div>
                </div>
            </div>
          </div>

        </div>

        {/* Professional Quick Links Sidebar */}
        <div className={styles['quick-links-sidebar']}>
          <div 
            className={styles['quick-link-item']}
            data-text="Talk to Us"
            onClick={(e) => handleQuickLinkClick(navigateToTalkToUs, e)}
          >
            <MessageCircle className={styles.icon} />
          </div>

          <div 
            className={styles['quick-link-item']}
            data-text="Media"
            onClick={(e) => handleQuickLinkClick(navigateMedia, e)}
          >
            <Camera className={styles.icon} />
          </div>
          
          <div 
            className={styles['quick-link-item']}
            data-text="Win a Soul"
            onClick={(e) => handleQuickLinkClick(() => navigate('/save'), e)}
          >
            <Heart className={styles.icon} />
          </div>
          
          <div 
            className={styles['quick-link-item']}
            data-text="Constitution"
            onClick={(e) => handleQuickLinkClick(() => {
              const link = document.createElement('a');
              link.href = '/pdfs/constitution.pdf';
              link.download = 'constitution.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }, e)}
          >
            <BookOpen className={styles.icon} />
          </div>
          
          <div 
            className={styles['quick-link-item']}
            data-text="Library"
            onClick={(e) => handleQuickLinkClick(() => navigate('/library'), e)}
          >
            <Library className={styles.icon} />
          </div>
          
          <div 
            className={styles['quick-link-item']}
            data-text="Financials"
            onClick={(e) => handleQuickLinkClick(() => navigate('/financial'), e)}
          >
            <DollarSign className={styles.icon} />
          </div>
          
          <div 
            className={styles['quick-link-item']}
            data-text="Bible Study"
            onClick={(e) => handleQuickLinkClick(() => navigate('/Bs'), e)}
          >
            <GraduationCap className={styles.icon} />
          </div>

          {userData && (
            <div 
              className={styles['quick-link-item']}
              data-text="Log out"
              onClick={(e) => handleQuickLinkClick(() => {
                handleLogout();
                navigate('/signIn');
              }, e)}
            >
              <FontAwesomeIcon icon={faUserLock} className={styles.icon} />
            </div>
          )}
        </div>

        <div className={`${styles['footer']} ${styles['home-footer']}`} id='contacts'>
            <p className={styles['footer--text']}>KISII UNIVERSITY MAIN CAMPUS CHRISTIAN UNION 2025</p>
                
            <div className={styles['hr']}></div>

            <div className={styles['social--links']}>
                <div className={styles['youtube']}>
                    <a href="https://www.youtube.com/@KSUCU-MC" target="blank" className={styles['social-link']}><FaYoutube /></a>
                </div>

                <div className={styles['facebook']}>
                    <a href="https://www.facebook.com/ksucumc" target="blank" className={styles['social-link']}><FaFacebook /></a>
                </div>

                <div className={styles['tiktok']}>
                    <a href="https://www.tiktok.com/@ksucumc" target="blank" className={styles['social-link']}><FaTiktok /></a>
                </div>
            </div>
        </div>
    </div>
    </div>
  </React.Fragment>
  );
};

export default LandingPage;
