import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/ministryPage.module.css';
import MinistryHeader from './MinistryHeader';
import MinistryFooter from './MinistryFooter';
import { Link } from 'react-router-dom';
import MinistryRegistrationModal from './MinistryRegistrationModal';
import MinistryNavButton from './MinistryNavButton';
import axiosInstance from '../config/axios';

interface ScheduleCard {
    icon: React.ReactNode;
    title: string;
    time: string;
}

interface WhatWeDoCard {
    icon: React.ReactNode;
    title: string;
    description: string;
}

interface Testimonial {
    quote: string;
    author: string;
}

interface MinistryLayoutProps {
    title: string;
    subtitle: string;
    heroImage: string;
    ministryName: string;
    aboutText: React.ReactNode;
    missionText: React.ReactNode;
    joinTitle?: string;
    joinText: React.ReactNode;
    requirements: string[];
    whatWeDoHeader: string;
    whatWeDoCards: WhatWeDoCard[];
    ourRole: string;
    ensureList: string[];
    scheduleCards: ScheduleCard[];
    philosophyTitle?: string;
    philosophyText: React.ReactNode;
    communityImpactText: React.ReactNode;
    testimonials: Testimonial[];
    contactLabel?: string;
    contactPath?: string;
    heroActions?: React.ReactNode;
    joinPath?: string;
    ministryId?: string;
    testimonialTitle?: string;
}

const MinistryLayout: React.FC<MinistryLayoutProps> = ({
    title,
    subtitle,
    heroImage,
    ministryName,
    aboutText,
    missionText,
    joinTitle = `Join the ${ministryName} Ministry`,
    joinText,
    requirements,
    whatWeDoHeader,
    whatWeDoCards,
    ourRole,
    ensureList,
    scheduleCards,
    philosophyTitle = "Our Service Philosophy",
    philosophyText,
    communityImpactText,
    testimonials,
    contactLabel = "Contact Overseer",
    contactPath = "/contact-us",
    heroActions,
    joinPath,
    ministryId,
    testimonialTitle
}) => {
    const contentRef1 = useRef<HTMLDivElement>(null);
    const [showModal, setShowModal] = useState(false);
    const [registrationStatus, setRegistrationStatus] = useState<string | null>(null);
    const [checkLoading, setCheckLoading] = useState(false);

    const checkStatus = async () => {
        setCheckLoading(true);
        try {
            // First get user details to get reg number
            const userRes = await axiosInstance.get('/commitmentForm/user-details');
            const regNo = userRes.data.regNo || userRes.data.registrationNumber || userRes.data.reg;

            if (regNo) {
                const statusRes = await axiosInstance.get(`/api/ministry-registration/check?registrationNumber=${encodeURIComponent(regNo)}&ministry=${encodeURIComponent(ministryName)}`);
                setRegistrationStatus(statusRes.data.status);
            }
        } catch (err) {
            console.error('Error checking registration status:', err);
        } finally {
            setCheckLoading(false);
        }
    };

    useEffect(() => {
        checkStatus();
    }, [ministryName]);

    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) entry.target.classList.add(styles.visible);
            });
        }, observerOptions);

        if (contentRef1.current) observer.observe(contentRef1.current);

        // Find all elements with 'animate' class and observe them
        const animatedElements = document.querySelectorAll(`.${styles.animate}`);
        animatedElements.forEach(el => observer.observe(el));

        return () => {
            document.documentElement.style.scrollBehavior = 'auto';
            observer.disconnect();
        };
    }, []);

    const handleJoinClick = () => {
        if (registrationStatus === 'pending') {
            alert("Your request has already been submitted and is awaiting overseer approval.");
            return;
        }
        if (registrationStatus === 'approved') {
            alert("You are already an approved member of this ministry.");
            return;
        }
        if (registrationStatus === 'revoked') {
            alert("Your membership has been revoked. Please contact the overseer for clarification.");
            return;
        }
        setShowModal(true);
    };

    const getJoinButton = () => {
        if (checkLoading) {
            return (
                <button className={`${styles.panelButton} ${styles.pendingButton}`} disabled>
                    Checking Status...
                </button>
            );
        }

        let buttonText = "Join Ministry";
        let buttonClass = styles.panelButton;

        if (registrationStatus === 'pending') {
            buttonText = "Pending";
            buttonClass = `${styles.panelButton} ${styles.pendingButton}`;
        } else if (registrationStatus === 'approved') {
            buttonText = "Approved";
            buttonClass = `${styles.panelButton} ${styles.approvedButton}`;
        } else if (registrationStatus === 'revoked') {
            buttonText = "Revoked";
            buttonClass = `${styles.panelButton} ${styles.revokedButton}`;
        }

        return (
            <button
                onClick={handleJoinClick}
                className={buttonClass}
                disabled={registrationStatus === 'pending' || registrationStatus === 'approved' || registrationStatus === 'revoked'}
            >
                {buttonText}
            </button>
        );
    };

    return (
        <>
            <MinistryHeader />
            <div className={styles.container}>
                <div
                    className={styles.heroSection}
                    style={{
                        backgroundImage: `url(${heroImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className={styles.heroOverlay}></div>
                    <div className={styles.heroContent}>
                        <h1 className={styles.title}>{title}</h1>
                        <p className={styles.subtitle}>{subtitle}</p>
                        {heroActions}
                    </div>
                </div>

                <div className={`${styles.contentSection} ${styles.fullWidthSection} ${styles.animate}`} ref={contentRef1}>
                    <div className={styles.description}>
                        <h2>About {title}</h2>
                        {aboutText}
                        <h3>Our Mission</h3>
                        {missionText}
                    </div>
                </div>

                <section className={styles.whatWeDoSection}>
                    <div className={styles.whatWeDoHeader}>
                        <h2>What We Do</h2>
                        <p>{whatWeDoHeader}</p>
                    </div>

                    <div className={styles.whatWeDoContent}>
                        {/* LEFT SIDE: Service Cards */}
                        <div className={styles.whatWeDoGrid}>
                            {whatWeDoCards.map((card, i) => (
                                <div key={i} className={styles.whatWeDoCard}>
                                    <div className={styles.whatWeDoIcon}>{card.icon}</div>
                                    <h4>{card.title}</h4>
                                    <p>{card.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT SIDE: Our Role & What We Ensure */}
                        <div className={styles.whatWeDoPanel}>
                            <h3>Our Role</h3>
                            <p>{ourRole}</p>
                            <h3>What We Ensure</h3>
                            <ul className={styles.ensureList}>
                                {ensureList.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    </div>
                </section>

                <section className={styles.serviceScheduleSection}>
                    <h2>Service Schedule</h2>
                    <p>Here's an overview of our weekly and special services.</p>
                    <div className={styles.scheduleCards}>
                        {scheduleCards.map((card, i) => (
                            <div key={i} className={styles.scheduleCard}>
                                <div className={styles.scheduleIcon}>{card.icon}</div>
                                <h3>{card.title}</h3>
                                <div className={styles.scheduleTime}>{card.time}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className={`${styles.joinContainer} ${styles.animate}`}>
                    <div className={styles.joinTextContent}>
                        <h2>{joinTitle}</h2>
                        {joinText}
                    </div>

                    <div className={styles.qualitiesCard}>
                        <h3>Qualities We Value</h3>
                        <ul className={styles.requirementsList}>
                            {requirements.map((req, i) => <li key={i}>{req}</li>)}
                        </ul>

                        <div className={styles.actionButtons}>
                            {getJoinButton()}

                            {(registrationStatus === 'pending' || registrationStatus === 'approved') && joinPath && (
                                <Link to={joinPath} className={styles.panelButton}>
                                    Sign Commitment
                                </Link>
                            )}

                            {(() => {
                                const contactTarget = contactPath === "/contact-us"
                                    ? `/contact-us?ministryId=${ministryId || ''}&ministryName=${encodeURIComponent(ministryName)}`
                                    : contactPath;

                                return (
                                    <Link to={contactTarget} className={styles.panelButton}>
                                        {contactLabel}
                                    </Link>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                <br />
                <div className={`${styles.contentSection} ${styles.animate}`}>
                    <div className={styles.joinSection}>
                        <h3>{philosophyTitle}</h3><br />
                        {philosophyText}
                    </div>
                    <div className={styles.joinSection}>
                        <h3>Community Impact</h3><br />
                        {communityImpactText}
                    </div>
                </div>

                <div className={`${styles.testimonialsSection} ${styles.animate}`}>
                    <h2>{testimonialTitle || "Hearts of Service"}</h2><br />
                    <div className={styles.testimonials}>
                        {testimonials.map((t, i) => (
                            <div key={i} className={styles.testimonial}>
                                <p>"{t.quote}"</p>
                                <span>- {t.author}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <MinistryFooter />
            <MinistryRegistrationModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    checkStatus(); // Re-check status when modal closes
                }}
                ministryName={ministryName}
                joinPath={joinPath}
            />
            <MinistryNavButton />
        </>
    );
};

export default MinistryLayout;
