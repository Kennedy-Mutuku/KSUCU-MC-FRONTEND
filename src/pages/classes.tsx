import React from 'react';
import styles from '../styles/classes.module.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import BackButton from '../components/BackButton';
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
    title: 'BEST-P CLASSES',
    description:
      '“BEST-P” is an acronym for Bible Expository Self-Training Program. It is a long term group oriented training program on inductive Bible study, principles of bible interpretation, expository preaching, and apologetics.',
    imgSrc: betPImg,
    delay: '0.1s',
    socialLink: 'https://www.facebook.com/ksucumc/',
    socialIconClass: faFacebook,
  },
  {
    title: 'DISCIPLESHIP CLASSES',
    description:
      'Introduces the process of Discipleship to members and explains the whole process of becoming an effective disciple and a discipler. We also get to discuss several topical subjects that benefit spiritually and socially.',
    imgSrc: disciplesipImg,
    delay: '0.2s',
    socialLink: 'https://www.tiktok.com/@ksucumc',
    socialIconClass: faTiktok,
  },
  {
    title: 'CLASS FELLOWSHIPS',
    description:
      'These are fellowships according to year of study. This is where members get to discuss topical issues and matters concerning the classes. The fellowships may be combined or separate as agreed by the responsible leaders.',
    imgSrc: classImg,
    delay: '0.3s',
    socialLink: 'https://mobile.twitter.com/KSUCUMC',
    socialIconClass: faXTwitter,
  },
  {
    title: 'B/S FELLOWSHIPS',
    description:
      "Brothers' fellowships deal with matters concerning gents and Sisters' fellowships for ladies. Both fellowships handle topics that benefit members academically, spiritually, financially, socially, and physically.",
    imgSrc: fellowshipImg,
    delay: '0.4s',
    socialLink: 'http://ww.youtube.com/c/KISIIUNIVERSITYCUMAINCAMPUS',
    socialIconClass: faYoutube,
  },
];

const ClassesSection: React.FC = () => {
  return (
    <section id="Classes" className="">
        <BackButton />
        <UniversalHeader />
      <div className={styles.container}>

        <div className={styles.title}>
          <h2>CLASSES AND FELLOWSHIPS</h2>
          <p>Meet some of our educative and interesting classes and fellowships:</p>
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
    </section>
  );
};

export default ClassesSection;


