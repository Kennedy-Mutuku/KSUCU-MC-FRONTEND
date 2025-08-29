import React, { useEffect } from 'react';
import styles from '../styles/ministries.module.css';

import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import { useLocation } from 'react-router-dom';
import PW from '../assets/praise-and-worship.jpg'
import wananzambe from '../assets/wananzambe.jpg'
import choir from '../assets/choir.jpg'
import cs from '../assets/churchschool.jpg'
import intecessory from '../assets/intersesory.jpg'
import hs from '../assets/high-school.jpg'
import ushering from '../assets/ushering.jpg'
import compassion from '../assets/compassion.jpg'
import creativity from '../assets/creativity.jpg'
// import loadingAnime from '../assets/Animation - 1716747954931.gif';

const MinistriesPage: React.FC = () => {
  const location = useLocation();
  // const [generalLoading, setgeneralLoading] = useState(false);
  // const [error, setError] = useState('');
  // const [ministries, setMinistries] = useState<string[]>([]);

  useEffect(() => {
    
    // fetchUserData()

    if (location.hash) {
      const targetSection = document.getElementById(location.hash.substring(1));
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash]);

  // const fetchUserData = async () => {

  //   // check if the user in online
  //   if (!navigator.onLine) {
  //       setError('check your internet and try again...')
  //       return;
  //   }

  //   window.scrollTo({
  //       top: 0,
  //       behavior: 'auto' // 'auto' for instant scroll
  //   });
    
  //   try {
        
  //       setgeneralLoading(true)

  //       document.body.style.overflow = 'hidden';            

  //       const response = await fetch('http://localhost:3000/users/data', {
  //           credentials: 'include'
  //       });

  //       const data = await response.json();

  //       console.log(data);
        
        
  //       if (!response.ok) {
  //           throw new Error(data.message || 'Failed to fetch user data');
  //       }  

  //       const ministry  = data.ministry;

  //       if (ministry) {
  //         // Split ministries into an array and trim spaces
  //         const ministryList = ministry.split(",").map((m: string) => m.trim().toLowerCase());
  //         setMinistries(ministryList);
  //       }

        
  //   } catch (error) {
  //       if (error instanceof Error && error.message === 'Authentication failed: jwt expired') {
  //           setError('session timed out, log in again')
  //           setTimeout(() => setError(''), 3000); 
  //       }else{
  //           console.error('Error fetching user data:');
  //       }
        
  //   }finally{    
  //       document.body.style.overflow = '';  
  //       setgeneralLoading(false);      
  //   }
  // };

  return (
    <>

      {/* {generalLoading && (
            <div className={styles['loading-screen']}>
                <p className={styles['loading-text']}>Please wait...🤗</p>
                <img src={loadingAnime} alt="animation gif" />
            </div>
      )} */}

      <UniversalHeader />

      <div className={styles.main}>
        <h2 className={styles['ministries--title']}>MINISTRIES</h2>
        
        {/* {error && <div className={styles.error}>{error}</div>} */}

        <div className={styles['ministry-section']} id='wananzambe'>
          <div className={styles['ministry-section--flex']}>
            <h3 className={styles['ministry-name']}>Wananzambe</h3>

           {/* {ministries.includes("wananzambe") && <Link className={styles['commitment-link']} to="/wananzambe">Sign the commitment form here</Link> } */}
            
            <p className={styles['ministry-content']}>Wanazambe is the instrumentalists' ministry in KSUCU-MC, dedicated to enhancing worship through music. This ministry consists of skilled musicians who play various instruments to create a powerful and uplifting worship experience. With a passion for excellence and a heart for service, Wanazambe plays a vital role in leading the congregation into deep and meaningful worship. </p>
            
          </div>
          <div className={styles['ministry-img']}>
            <img src={wananzambe} alt="Wananzambe Ministry" />
          </div>
        </div>

        <div className={styles['hr-ministries']}></div>

        <div className={`${styles['ministry-section']} ${styles['ministry-section--reverse']}`} id='compassion'>
          <div className={styles['ministry-section--flex']}>
            <h3 className={styles['ministry-name']}>Compassion</h3>
            <p className={styles['ministry-content']}>The Compassion Ministry is dedicated to being the hands and feet of Jesus, reaching out to those in need with love, care, and practical support. Rooted in God’s call to serve others, we strive to meet the physical, emotional, and spiritual needs of individuals and families in our church and community.

Our mission is to bring hope to the hurting, comfort to the brokenhearted, and help to those facing life’s challenges. Whether through food assistance, clothing drives, hospital visits, crisis care, or prayer, we are committed to demonstrating the love of Christ in tangible ways.

If you feel called to make a difference, join us in this transformative ministry as we work together to reflect God’s compassion and bring His light into the lives of others.

“Carry each other’s burdens, and in this way you will fulfill the law of Christ.” – Galatians 6:2</p>
          </div>
          <div className={styles['ministry-img']}>
            <img src={compassion} alt="Compassion Ministry" />
          </div>
        </div>

        <div className={styles['hr-ministries']}></div>

        <div className={styles['ministry-section']} id='pw'>
          <div className={styles['ministry-section--flex']}>
            <h3 className={styles['ministry-name']}>Praise and Worship</h3>
            
            {/* {ministries.includes("pw") && <Link className={styles['commitment-link']} to="/p&w">Sign the commitment form here</Link>} */}

            <p className={styles['ministry-content']}> The Praise and Worship Ministry exists to lead our congregation into the presence of God through heartfelt worship, uplifting music, and a lifestyle of praise. We are passionate about glorifying God and creating an atmosphere where people can encounter Him, experience His love, and respond in worship.

Our ministry is committed to excellence in musicianship, unity in spirit, and authenticity in worship. Whether through singing, playing instruments, or leading in prayer, our team’s mission is to magnify God and inspire others to do the same.

If you have a heart for worship and a desire to use your gifts for God’s glory, we invite you to join us. Together, we’ll lift up the name of Jesus and create moments that touch heaven and change lives.

“Let everything that has breath praise the Lord. Praise the Lord!” – Psalm 150:6 </p>
          </div>
          <div className={styles['ministry-img']}>
            <img src={PW} alt="Praise and Worship Ministry" />
          </div>
        </div>

        <div className={styles['hr-ministries']}></div>

        <div className={`${styles['ministry-section']} ${styles['ministry-section--reverse']}`} id='intercessory'>
          <div className={styles['ministry-section--flex']}>
            <h3 className={styles['ministry-name']}>Intercessory</h3>
            <p className={styles['ministry-content']}>The Intercessory Ministry is dedicated to standing in the gap through prayer, seeking God’s heart, and lifting the needs of others before Him. Rooted in faith and compassion, this ministry strives to align with God's will and bring hope, healing, and transformation through the power of prayer.

We believe in the importance of interceding for individuals, families, communities, and nations, trusting in the promises of God to hear and answer our petitions. Our prayer warriors are committed to creating a spiritual covering, offering support during times of challenge, and celebrating breakthroughs as God moves.

Whether you’re in need of prayer, feel called to intercede for others, or want to deepen your connection with God, we welcome you to join us in this vital and impactful ministry.

“The prayer of a righteous person is powerful and effective.” – James 5:16</p>
          </div>
          <div className={styles['ministry-img']}>
            <img src={intecessory} alt="Intercessory Ministry" />
          </div>
        </div>

        <div className={styles['hr-ministries']}></div>

        <div className={styles['ministry-section']} id='cs'>
          <div className={styles['ministry-section--flex']}>
            <h3 className={styles['ministry-name']}>Church School</h3>
            <p className={styles['ministry-content']}>The Church-School Ministry is dedicated to building a bridge between our church and local schools, fostering relationships that reflect God’s love and make a lasting impact on students, teachers, and families. This ministry exists to serve, support, and inspire the next generation by meeting practical needs, encouraging spiritual growth, and sharing the hope of Christ.

Through partnerships with schools, we provide mentorship, tutoring, prayer support, and resources that enhance both academic success and personal development. Whether through after-school programs, teacher appreciation initiatives, or outreach events, our goal is to create an environment where faith, education, and community come together to transform lives.

Join us as we invest in the lives of students and educators, planting seeds of faith and hope that will bear fruit for years to come.

“Train up a child in the way he should go, and when he is old he will not depart from it.” – Proverbs 22:6</p>
          </div>
          <div className={styles['ministry-img']}>
            <img src={cs} alt="Church School Ministry" />
          </div>
        </div>

        <div className={styles['hr-ministries']}></div>

        <div className={`${styles['ministry-section']} ${styles['ministry-section--reverse']}`} id='hs'>
          <div className={styles['ministry-section--flex']}>
            <h3 className={styles['ministry-name']}>High School</h3>
            <p className={styles['ministry-content']}>The High School Ministry is a vibrant community where students  can grow in their faith, build lasting friendships, and discover their purpose in Christ. We are passionate about equipping the next generation to navigate the challenges of high school with confidence, grounded in God’s Word and His love.

Through engaging worship, relevant teaching, small group discussions, and fun activities, we create an environment where students feel welcomed, valued, and empowered. Our goal is to inspire a deeper relationship with Jesus, foster authentic connections, and encourage students to live out their faith boldly in their schools, homes, and communities.

Whether you're new to church or have been attending for years, there's a place for you here. Join us as we grow together, serve others, and make a difference for God’s Kingdom.

“Don’t let anyone look down on you because you are young, but set an example for the believers in speech, in conduct, in love, in faith, and in purity.” – 1 Timothy 4:12</p>
          </div>
          <div className={styles['ministry-img']}>
            <img src={hs} alt="High School Ministry" />
          </div>
        </div>

        <div className={styles['hr-ministries']}></div>

        <div className={styles['ministry-section']} id='ushering'>
          <div className={styles['ministry-section--flex']}>
            <h3 className={styles['ministry-name']}>Ushering</h3>
            <p className={styles['ministry-content']}>The Ushering Ministry is the welcoming heart of our church, committed to creating a warm and inviting atmosphere where everyone feels valued and at home. Our ushers serve as the hands and feet of Christ, greeting each person with kindness, guiding them with care, and ensuring that every service runs smoothly and orderly.

From welcoming guests at the door to assisting with seating, offering directions, and facilitating worship elements, the Ushering Ministry plays a vital role in enhancing the worship experience. Our team is dedicated to embodying hospitality, joy, and excellence, reflecting God’s love in every interaction.

If you have a heart for service and a friendly smile, we invite you to join us in making every worship experience meaningful and memorable. Together, we can help create an environment where God’s presence is felt and His people are blessed.

“Better is one day in your courts than a thousand elsewhere; I would rather be a doorkeeper in the house of my God.” – Psalm 84:10</p>
          </div>
          <div className={styles['ministry-img']}>
            <img src={ushering} alt="Ushering Ministry" />
          </div>
        </div>

        <div className={styles['hr-ministries']}></div>

        <div className={`${styles['ministry-section']} ${styles['ministry-section--reverse']}`} id='creativity'>
          <div className={styles['ministry-section--flex']}>
            <h3 className={styles['ministry-name']}>Creativity</h3>
            <p className={styles['ministry-content']}>The Creativity Ministry is a vibrant community of individuals passionate about using their God-given talents to glorify Him and inspire others. Whether through visual arts, design, writing, drama, dance, media, or other creative expressions, our mission is to bring the message of Christ to life in unique and impactful ways.

We believe creativity is a reflection of the Creator and a powerful tool to communicate truth, evoke emotion, and build connections. From creating engaging visuals for worship, producing powerful performances, or crafting inspiring content, we strive to use our gifts to draw people closer to God.

If you have a creative spark and a desire to serve, we invite you to join us in transforming ideas into expressions of worship and outreach that make a difference in the church and beyond.

“Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.” – Colossians 3:23</p>
          </div>
          <div className={styles['ministry-img']}>
            <img src={creativity} alt="Creativity Ministry" />
          </div>
        </div>

        <div className={`${styles['ministry-section']} ${styles['ministry-section--reverse-choir']}`} id='choir'>
          <div className={styles['ministry-section--flex']}>
            <h3 className={styles['ministry-name']}>Choir</h3>
            
            {/* {ministries.includes("choir") && <Link className={styles['commitment-link']} to="/choir">Sign the commitment form here</Link> } */}
            
            <p className={styles['ministry-content']}>The Choir Ministry in KSUCU-MC is a vibrant team of dedicated vocalists committed to leading the congregation in worship through song. With a passion for glorifying God through music, the choir blends voices in harmony to create a powerful and uplifting worship atmosphere. Through practice, prayer, and dedication, they minister to the hearts of many, drawing people closer to God with every song they sing.</p>
          </div>
          
          <div className={styles['ministry-img']}>
            <img src={choir} alt="Choir Ministry" />
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default MinistriesPage;
