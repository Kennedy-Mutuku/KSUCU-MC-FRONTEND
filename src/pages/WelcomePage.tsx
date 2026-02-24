import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';
import { Heart, ArrowRight } from 'lucide-react';

const WelcomePage: React.FC = () => {
    const [userData, setUserData] = useState<any>(null);
    const [photoUploaded, setPhotoUploaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data from existing session
        const fetchUserData = async () => {
            try {
                const response = await fetch('/users/data', {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);

                    // If user already has a photo, redirect to landing
                    if (data.profilePhoto) {
                        navigate('/');
                    }
                } else {
                    // No session, redirect to login
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleUploadSuccess = (photoUrl: string) => {
        setPhotoUploaded(true);
    };

    const handleContinue = () => {
        navigate('/');
    };

    if (!userData) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fafafa'
            }}>
                <div style={{
                    textAlign: 'center',
                    fontSize: '1.2rem',
                    color: '#666'
                }}>
                    Loading...
                </div>
            </div>
        );
    }

    const firstName = userData.username?.split(' ')[0] || 'Friend';

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #730051 0%, #2c3e50 100%)',
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Welcome Message */}
            <div style={{
                textAlign: 'center',
                marginBottom: '40px',
                animation: 'fadeIn 0.8s ease-in'
            }}>
                <Heart
                    size={64}
                    color="#ffffff"
                    fill="#ff69b4"
                    style={{
                        margin: '0 auto 20px',
                        display: 'block',
                        animation: 'heartbeat 1.5s ease-in-out infinite'
                    }}
                />

                <h1 style={{
                    color: '#ffffff',
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    marginBottom: '10px',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}>
                    Welcome back beloved, {firstName}!
                </h1>

                <p style={{
                    color: '#ffccee',
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    maxWidth: '600px',
                    margin: '0 auto',
                    lineHeight: '1.6'
                }}>
                    We're thrilled to see you again! 🎉
                </p>
            </div>

            {/* Encouragement Card */}
            {!photoUploaded && (
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '20px',
                    padding: '30px',
                    maxWidth: '700px',
                    marginBottom: '30px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                    textAlign: 'center'
                }}>
                    <h2 style={{
                        color: '#730051',
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        marginBottom: '15px'
                    }}>
                        Let's Complete Your Profile! 📸
                    </h2>

                    <p style={{
                        color: '#555',
                        fontSize: '1.1rem',
                        lineHeight: '1.7',
                        marginBottom: '10px'
                    }}>
                        A profile photo helps your fellow believers recognize you in the community.
                        It's quick and easy - just upload, crop, and you're done!
                    </p>

                    <p style={{
                        color: '#730051',
                        fontSize: '1rem',
                        fontWeight: '600',
                        fontStyle: 'italic'
                    }}>
                        "For we are God's handiwork, created in Christ Jesus" - Ephesians 2:10
                    </p>
                </div>
            )}

            {/* Upload Component */}
            <ProfilePhotoUpload
                onUploadSuccess={handleUploadSuccess}
            />

            {/* Continue Button */}
            {photoUploaded && (
                <div style={{
                    marginTop: '30px',
                    textAlign: 'center',
                    animation: 'slideUp 0.5s ease-out'
                }}>
                    <p style={{
                        color: '#ffffff',
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        marginBottom: '20px'
                    }}>
                        ✨ Perfect! Your profile is complete
                    </p>

                    <button
                        onClick={handleContinue}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '16px 40px',
                            backgroundColor: '#00c6ff',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '50px',
                            fontSize: '1.2rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            boxShadow: '0 6px 20px rgba(0, 198, 255, 0.4)',
                            transition: 'all 0.3s ease',
                            animation: 'pulse 2s ease-in-out infinite'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 198, 255, 0.6)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 198, 255, 0.4)';
                        }}
                    >
                        Continue to KSUCUMC
                        <ArrowRight size={24} />
                    </button>
                </div>
            )}

            {/* CSS Animations */}
            <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          10%, 30% {
            transform: scale(0.9);
          }
          20%, 40%, 50%, 60%, 70%, 80% {
            transform: scale(1.1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
        }
      `}</style>
        </div>
    );
};

export default WelcomePage;
