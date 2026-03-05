import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    X,
    Home,
    Users,
    Music,
    Heart,
    Lightbulb,
    GraduationCap,
    Handshake,
    Church,
    Sparkles,
    Baby,
} from 'lucide-react';

interface MinistryLink {
    icon: React.ElementType;
    label: string;
    href: string;
}

const ministryLinks: MinistryLink[] = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Handshake, label: 'Ushering', href: '/ministries/ushering' },
    { icon: Lightbulb, label: 'Creativity', href: '/ministries/creativity' },
    { icon: Heart, label: 'Compassion', href: '/ministries/compassion' },
    { icon: Sparkles, label: 'Intercessory', href: '/ministries/intercessory' },
    { icon: GraduationCap, label: 'High School', href: '/ministries/highSchool' },
    { icon: Music, label: 'Wananzambe', href: '/ministries/wananzambe' },
    { icon: Baby, label: 'Church School', href: '/ministries/churchSchool' },
    { icon: Music, label: 'Praise & Worship', href: '/ministries/praiseAndWorship' },
    { icon: Users, label: 'Choir', href: '/ministries/choir' },
];

const MinistryNavButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFabCentered, setIsFabCentered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    // Check for mobile viewport
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Arc configuration - responsive (Increased spacing for better viewing)
    // Arc configuration - responsive (Balanced spacing for sweet spot)
    const linkHeight = isMobile ? 58 : 62;
    const totalHeight = linkHeight * (ministryLinks.length - 1);
    const arcDepth = isMobile ? 65 : 130;

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                // Sequenced close: tabs first, then FAB moves down
                setIsOpen(false);
                const totalCloseTime = 400 + (ministryLinks.length * 30);
                setTimeout(() => {
                    setIsFabCentered(false);
                }, totalCloseTime);
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const handleLinkClick = (link: MinistryLink) => {
        navigate(link.href);
        // Sequenced close: tabs first, then FAB moves down
        setIsOpen(false);
        const totalCloseTime = 400 + (ministryLinks.length * 30);
        setTimeout(() => {
            setIsFabCentered(false);
        }, totalCloseTime);
    };

    const getPosition = (index: number) => {
        const y = -totalHeight / 2 + index * linkHeight;
        const normalizedY = y / (totalHeight / 2);
        const x = -arcDepth - (1 - normalizedY * normalizedY) * arcDepth;
        return { x, y };
    };

    // Mobile: bottom-right when closed, center-right when open
    // Desktop: always center-right
    const getContainerPosition = () => {
        if (!isMobile) {
            return 'fixed right-6 top-1/2 -translate-y-1/2';
        }
        return isFabCentered
            ? 'fixed right-3 top-1/2 -translate-y-1/2'
            : 'fixed right-4 bottom-6';
    };

    // Handle open/close with sequenced animations
    const handleToggle = () => {
        if (isOpen) {
            // Closing: first close tabs, then move FAB down
            setIsOpen(false);
            // Wait for tabs to close (~400ms for animation + stagger delays)
            const totalCloseTime = 400 + (ministryLinks.length * 30);
            setTimeout(() => {
                setIsFabCentered(false);
            }, totalCloseTime);
        } else {
            // Opening: first move FAB to center, then open tabs
            setIsFabCentered(true);
            // Start opening tabs just before FAB arrives
            setTimeout(() => {
                setIsOpen(true);
            }, 400);
        }
    };

    return (
        <>
            {/* Backdrop */}
            {(isOpen || isFabCentered) && (
                <div
                    className="fixed inset-0 z-[998] bg-black/60 backdrop-blur-sm"
                    onClick={handleToggle}
                />
            )}

            {/* Arc Menu Container */}
            <div
                className={`${getContainerPosition()} z-[999] transition-all duration-700 ease-in-out`}
            >
                {/* Arc Links - only render when open or desktop */}
                {ministryLinks.map((link, index) => {
                    const Icon = link.icon;
                    const { x, y } = getPosition(index);
                    const delay = index * 0.05;
                    const closeDelay = (ministryLinks.length - 1 - index) * 0.03;

                    return (
                        <button
                            key={index}
                            onClick={() => handleLinkClick(link)}
                            className={`absolute flex items-center gap-3 px-3 py-2 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 group outline-none focus:outline-none ${isMobile ? 'w-40' : 'w-48'}`}
                            style={{
                                right: 0,
                                top: '50%',
                                transform: isOpen
                                    ? `translate(${x}px, calc(-50% + ${y}px)) scale(1)`
                                    : 'translate(0, -50%) scale(0)',
                                opacity: isOpen ? 1 : 0,
                                transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${isOpen ? delay : closeDelay}s`,
                                pointerEvents: isOpen ? 'auto' : 'none',
                                transformOrigin: 'right center',
                            }}
                        >
                            <div className="w-9 h-9 flex items-center justify-center bg-purple-50 rounded-full group-hover:bg-[#730051] transition-colors duration-200 flex-shrink-0">
                                <Icon size={18} className="text-[#730051] group-hover:text-white transition-colors duration-200" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-[#730051] transition-colors duration-200 pr-1 whitespace-normal leading-tight text-left">
                                {link.label}
                            </span>
                        </button>
                    );
                })}

                {/* FAB Button */}
                <button
                    onClick={handleToggle}
                    className={`relative ${isMobile ? 'w-12 h-12' : 'w-14 h-14'} bg-[#730051] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-10 outline-none focus:outline-none ${!isOpen && !isFabCentered ? 'animate-pulse-soft' : ''}`}
                    aria-label={isOpen ? 'Close ministry navigation' : 'Open ministry navigation'}
                    style={{
                        boxShadow: '0 4px 20px rgba(115, 0, 81, 0.5)',
                    }}
                >
                    <div
                        className="transition-transform duration-300"
                        style={{ transform: (isOpen || isFabCentered) ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                        {(isOpen || isFabCentered) ? <X size={isMobile ? 22 : 26} strokeWidth={2.5} /> : <Church size={isMobile ? 22 : 26} strokeWidth={2.5} />}
                    </div>
                </button>
            </div>

            {/* Pulse animation */}
            <style>{`
        @keyframes pulse-soft {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 20px rgba(115, 0, 81, 0.5);
          }
          50% {
            transform: scale(1.08);
            box-shadow: 0 6px 25px rgba(115, 0, 81, 0.65);
          }
        }
        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }
      `}</style>
        </>
    );
};

export default MinistryNavButton;
