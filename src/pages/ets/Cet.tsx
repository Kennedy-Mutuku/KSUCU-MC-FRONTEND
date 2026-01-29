import React, { useEffect } from 'react';
import EtHeader from '../../components/EtHeader';
import EtFooter from '../../components/EtFooter';
import CET_IMG from '../../assets/CET.jpg';
import styles from '../../styles/ET.module.css';
import { Target, Eye, Activity, Users } from 'lucide-react';

const Cet: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={styles.etPage}>
            <EtHeader teamName="CET" />

            {/* Hero Banner */}
            <section className={styles.etPageHero}>
                <img src={CET_IMG} alt="CET" className={styles.pageHeroImg} />
                <div className={styles.pageHeroContent}>
                    <h1 className={styles.heroTitle}>Central Evangelistic Team</h1>
                </div>
            </section>

            <div className={styles.pageContent}>
                {/* Mission Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <Target className="inline-block mr-3 mb-1 text-[#4A90A4]" size={32} />
                        Our Mission
                    </h2>
                    <p className={styles.textContent}>
                        CET (Central Evangelistic Team) is a mission-driven ministry committed to evangelizing the Central region and Nairobi.
                        We aim to bring the light of the Gospel to urban centers and rural villages, nurturing spiritual growth and excellence in Christ.
                    </p>
                </section>

                {/* Vision Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <Eye className="inline-block mr-3 mb-1 text-[#4A90A4]" size={32} />
                        Our Vision
                    </h2>
                    <p className={styles.textContent}>
                        To transform the heart of the nation through Gospel-driven leadership and
                        vibrant fellowships that reflect the glory of God.
                    </p>
                </section>

                {/* What We Do Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <Activity className="inline-block mr-3 mb-1 text-[#4A90A4]" size={32} />
                        What We Do
                    </h2>
                    <div className={styles.textContent}>
                        <ul className="list-disc pl-5 space-y-4">
                            <li><strong>Urban Missions:</strong> Specialized outreaches designed for the unique challenges of Nairobi and other urban centers.</li>
                            <li><strong>Campus Fellowships:</strong> Strengthening the faith of students through dynamic and relevant ministry.</li>
                            <li><strong>Discipleship Programs:</strong> Deep-rooting new and existing believers in the knowledge of Christ.</li>
                            <li><strong>Annual Regional Missions:</strong> Expanding our reach to the interior parts of the Central region every year.</li>
                        </ul>
                    </div>
                </section>

                {/* Stats Section */}
                <section className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>10+</span>
                        <span className={styles.statLabel}>Regions Reached</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>2+</span>
                        <span className={styles.statLabel}>Missions/Year</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>1500+</span>
                        <span className={styles.statLabel}>Lives Impacted</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>100+</span>
                        <span className={styles.statLabel}>Active Members</span>
                    </div>
                </section>

                {/* CTA Section */}
                <section className={styles.ctaBox}>
                    <h2 className={styles.ctaTitle}>Impact the Heart of Kenya</h2>
                    <p className={styles.ctaText}>
                        Join CET in our mission to reach Nairobi and the Central region.
                        Be the light in the city and beyond.
                    </p>
                    <a href="#" className={styles.ctaBtn}>
                        <Users className="inline-block mr-2 mb-1" size={20} />
                        Join the Team
                    </a>
                </section>
            </div>

            <EtFooter currentTeam="CET" />
        </div>
    );
};

export default Cet;
