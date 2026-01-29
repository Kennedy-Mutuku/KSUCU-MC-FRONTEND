import React from 'react';
import '../styles/christianMinds.css';
import MemberCard from '../components/memberCard';
import Section from '../components/section';
import Header from '../components/landing/Header';
import Hero from '../components/Hero';
import AboutChristianMinds from '../components/AboutChristianMinds';
import Footer from '../components/footer';
import ValuesBanner from '../components/ValuesBanner';


function ChristianMinds() {
    const members = [
        {
            id: 1,
            name: "Stanley Otieno",
            position: "Overseer",
            bio: "Representing the committee to the executive committee and providing guidance."
        },
        {
            id: 2,
            name: "Jackson Mobui",
            position: "Chairperson",
            bio: "Leading the committee and chair the meetings."
        },
        {
            id: 3,
            name: "Emily Mbugua",
            position: "Secretary",
            bio: "Taking minutes and managing administrative tasks."
        },
        {
            id: 4,
            name: "Peace Makena",
            position: "Treasurer",
            bio: "Managing finances for the committee."
        },
        {
            id: 5,
            name: "Samuel Mutua",
            position: "Member",
            bio: "Engaging in the activities of the committee."
        },

         {
            id: 6,
            name: "Faith Wandia",
            position: "Member",
            bio: "Engaging in the activities of the committee."
        },

         {
            id: 7,
            name: "Emmanuel Baraka",
            position: "Member",
            bio: "Engaging in the activities of the committee."
        },

         {
            id: 8,
            name: "Clifton Khamala",
            position: "Member",
            bio: "Engaging in the activities of the committee."
        }
    ];

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

    return (
        <div className="app">
            <Header />
            <Hero />

            <Section id="team" title="Our Committee" background="gray">
                <div className="cards-grid">
                    {members.map(member => (
                        <MemberCard
                            key={member.id}
                            name={member.name}
                            position={member.position}
                            bio={member.bio}
                        />
                    ))}
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
