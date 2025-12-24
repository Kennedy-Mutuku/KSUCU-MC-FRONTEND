import React from 'react';
import styles from '../styles/classes.module.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTiktok, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'; 
import betPImg from '../assets/Best-p.png'
import classImg from '../assets/class.png'
import disciplesipImg from '../assets/discipleship.png'
import fellowshipImg from '../assets/fellowship.png'

interface ClassInfo {
  title: string;
  description: string;
  imgSrc: any;
  delay: string;
  socialLink: string;
  socialIconClass: any;
}

const classData: ClassInfo[] = [
  {
    title: 'ICT board',
    description:'KSUCU ICT board is responsible for Managing KSUCU-MC website, Projection of all union activities, Managing the union facebook account, Preparation and updating of the database. It is headed by the publicity secretary as the overseer, the chairperson and the secretary who are nominated by the board members.',
    imgSrc: betPImg,
    delay: '0.1s',
    socialLink: 'https://www.facebook.com/ksucumc/',
    socialIconClass: faFacebook,
  },
  {
    title: 'Communication board',
    description:
    
      'The communication board is responsible for:Publizing the union activities within the university, Heads in creating awareness pf social networks and their publications, Managing KSUCUMC X account, It is headed by the publicity secretary as the overseer, the chairperson and the secretary who are nominated by the board members.',
    imgSrc: disciplesipImg,
    delay: '0.2s',
    socialLink: 'https://www.tiktok.com/@ksucumc',
    socialIconClass: faTiktok,
  },
  {
    title: 'Media production board',
    description:
      'KSU-CU Media production board is responsible for the following in the union, Covering all the KSUCU-MC activities where necessary, Managing KSUCU-MC youtube page, Edit and keep all coverage and/or provide them when need arise. It is headed by the publicity secretary as the overseer, the chairperson and the secretary who are nominated by the board members.',
    imgSrc: classImg,
    delay: '0.3s',
    socialLink: 'https://mobile.twitter.com/KSUCUMC',
    socialIconClass: faXTwitter,
  },
  {
    title: 'Editorial board',
    description:
      "KSU-CU editorial board is responsible for: Publication of the Beyond the Origin magazine and any other publications as directed by the executive committee. It is also responsible for the selling of the publications. It is headed by the Boards coordinator as the overseer, the chairperson and the secretary who are nominated by the board members.",
    imgSrc: fellowshipImg,
    delay: '0.4s',
    socialLink: 'http://ww.youtube.com/c/KISIIUNIVERSITYCUMAINCAMPUS',
    socialIconClass: faYoutube,
  },
];

const BoardsPage: React.FC = () => {
  return (
    <>
          <UniversalHeader />
      <div className={styles.container}>

        <div className={styles.title}>
          <h2>KSUCU-MC BOARDS</h2>
          <p>Meet the boards we have in KSUCU-MC :</p>
        </div>

        <div className={styles.row}>

          {classData.map((classInfo, index) => (
            <div
              key={index}
              className={`col-xs-12 col-sm-6 col-md-3 ${styles.animated} ${
                index % 2 === 0 ? styles.fadeInDown : styles.fadeInUp
              }`}
              style={{ animationDelay: classInfo.delay }}
            >
              <div className={styles.classimg}>
                <img src={classInfo.imgSrc} alt={classInfo.title} className="img-fluid" />
              </div>
              <div className={styles.classBox}>
                <h3>
                  <b>{classInfo.title}</b>
                </h3>
                <p>{classInfo.description}</p>
                <ul className={styles.socialLinks}>
                  <li>
                    <a href={classInfo.socialLink}>
                      <FontAwesomeIcon icon={classInfo.socialIconClass}  />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BoardsPage;


