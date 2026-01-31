import { useRef, useState, useEffect } from 'react';
import '../styles/christianMinds.css';
import MemberCard from '../components/memberCard';
import Section from '../components/section';
import Header from '../components/landing/Header';
import Hero from '../components/Hero';
import AboutChristianMinds from '../components/AboutChristianMinds';
import Footer from '../components/footer';
import ValuesBanner from '../components/ValuesBanner';
import { CommitteeService, CommitteeMember } from '../services/committeeService';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

// Assets
import userImg from '../assets/userIMG.jpeg'; // Example fallback


function ChristianMinds() {
    const swiperRef = useRef<any>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [members, setMembers] = useState<CommitteeMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            const data = await CommitteeService.getMembers();
            setMembers(data);
        } catch (error) {
            console.error("Failed to load members", error);
        } finally {
            setLoading(false);
        }
    };

    const activities = [
        {
            title: "Panel talks and Discussions",
            desc: "Monthly sessions on relevant topics blending faith and intellect.",
            icon: "🎙️"
        },
        {
            title: "Chastity Week",
            desc: "A week dedicated to promoting purity and healthy relationships among youth.",
            icon: "🤍"
        },
        {
            title: "A coat of many colors",
            desc: "A collaboration with brothers and sisters fellowship every semister",
            icon: "🤝"
        }
    ];

    const handleAvatarClick = (index: number) => {
        setActiveIndex(index);
        if (swiperRef.current) {
            swiperRef.current.slideToLoop(index);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#6d0a51', fontWeight: 'bold' }}>
                Loading Committee...
            </div>
        );
    }

    return (
        <div className="app">
            <Header />
            <Hero />

            <Section id="team" title="Our Committee" background="gray">

                {/* Avatar Navigation Row */}
                <div className="avatar-nav-container">
                    {members.map((member, index) => (
                        <div
                            key={member.id}
                            className={`avatar-item ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => handleAvatarClick(index)}
                        >
                            <img src={member.image || userImg} alt={member.name} className="avatar-img" />

                            {/* Hover Tooltip */}
                            <div className="avatar-tooltip">
                                <span className="tooltip-name">{member.name}</span>
                                <span className="tooltip-role">{member.position}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="team-slider-container">
                    <Swiper
                        modules={[Navigation, Pagination, EffectCoverflow, Autoplay]}
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={'auto'}
                        spaceBetween={30}
                        slideToClickedSlide={true} /* Enable clicking side cards to center them */
                        loop={true}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        navigation={{
                            nextEl: '.nav-next',
                            prevEl: '.nav-prev',
                        }}
                        pagination={{ clickable: true }}
                        effect={'coverflow'}
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 0,
                            depth: 100,
                            modifier: 2.5,
                            slideShadows: false,
                        }}
                        breakpoints={{
                            320: {
                                slidesPerView: 'auto', // CSS controls width (85vw)
                                spaceBetween: 15,
                                centeredSlides: true,
                                effect: 'slide' // Simple slide on mobile for better usability
                            },
                            768: {
                                slidesPerView: 'auto', // CSS controls width (60vw)
                                spaceBetween: 30,
                                centeredSlides: true,
                                effect: 'coverflow' // 3D effect starts on tablet
                            },
                            1024: {
                                slidesPerView: 'auto', // CSS controls width (900px)
                                spaceBetween: 40,
                                centeredSlides: true,
                                effect: 'coverflow'
                            }
                        }}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                    >
                        {members.map(member => (
                            <SwiperSlide key={member.id}>
                                <MemberCard
                                    name={member.name}
                                    position={member.position}
                                    bio={member.bio}
                                    image={member.image}
                                    yearOfStudy={member.yearOfStudy}
                                    course={member.course}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation Buttons */}
                    <div className="custom-nav-btn nav-prev" onClick={() => swiperRef.current?.slidePrev()}>
                        &lt;
                    </div>
                    <div className="custom-nav-btn nav-next" onClick={() => swiperRef.current?.slideNext()}>
                        &gt;
                    </div>
                </div>
            </Section>

            <AboutChristianMinds />
            <ValuesBanner />

            <Section id="activities" title="Our Activities">
                <div className="activities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {activities.map((activity, index) => (
                        <div key={index} className="activity-card" style={{
                            padding: '2rem',
                            border: '1px solid #eee',
                            borderRadius: '8px',
                            textAlign: 'center',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{activity.icon}</div>
                            <h3 style={{ color: '#6d0a51', marginBottom: '0.5rem' }}>{activity.title}</h3>
                            <p style={{ color: '#666' }}>{activity.desc}</p>
                        </div>
                    ))}
                </div>
            </Section>

            <Footer />
        </div>
    );
}

export default ChristianMinds;
