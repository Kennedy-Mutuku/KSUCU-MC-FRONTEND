import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  X,
  Heart,
  BookOpen,
  Library as LibraryIcon,
  Building2,
  Users2,
  Globe,
  UsersRound,
  FileText,
  Award,
  Users,
  Scroll,
  School,
} from 'lucide-react';

interface QuickLink {
  icon: React.ElementType;
  label: string;
  href: string;
  requiresAuth?: boolean;
}

const quickLinks: QuickLink[] = [
  { icon: Building2, label: 'Boards', href: '/boards' },
  { icon: Users2, label: 'Ministries', href: '/ministries' },
  { icon: Globe, label: 'E.Ts', href: '/ets' },
  { icon: UsersRound, label: 'Fellowships', href: '/fellowshipsandclasses' },
  { icon: FileText, label: 'My Docs', href: '/my-docs' },
  { icon: Heart, label: 'Win a Soul', href: '/save' },
  { icon: BookOpen, label: 'Constitution', href: '/pdfs/constitution.pdf' },
  { icon: LibraryIcon, label: 'Library', href: '/library' },
  { icon: Award, label: 'Best-P', href: '/bestpClass' },
  { icon: Users, label: 'Brothers', href: '/brothersfellowship' },
  { icon: Users, label: 'Sisters', href: '/sistersfellowship' },
  { icon: Scroll, label: 'Discipleship', href: '/discipleship' },
  { icon: School, label: 'Classes', href: '/classFellowship' },
];

const QuickLinksButton = () => {
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

  // Arc configuration - responsive
  const linkHeight = isMobile ? 65 : 90;
  const totalHeight = linkHeight * (quickLinks.length - 1);
  const arcDepth = isMobile ? 35 : 120;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        // Sequenced close: tabs first, then FAB moves down
        setIsOpen(false);
        const totalCloseTime = 400 + (quickLinks.length * 30);
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

  const handleLinkClick = (link: QuickLink) => {
    if (link.href.endsWith('.pdf')) {
      const a = document.createElement('a');
      a.href = link.href;
      a.download = 'constitution.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      navigate(link.href);
    }
    // Sequenced close: tabs first, then FAB moves down
    setIsOpen(false);
    const totalCloseTime = 400 + (quickLinks.length * 30);
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
      const totalCloseTime = 400 + (quickLinks.length * 30);
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={handleToggle}
        />
      )}

      {/* Arc Menu Container */}
      <div
        className={`${getContainerPosition()} z-50 transition-all duration-700 ease-in-out`}
      >
        {/* Arc Links - only render when open or desktop */}
        {quickLinks.map((link, index) => {
          const Icon = link.icon;
          const { x, y } = getPosition(index);
          const delay = index * 0.05;
          const closeDelay = (quickLinks.length - 1 - index) * 0.03;

          return (
            <button
              key={index}
              onClick={() => handleLinkClick(link)}
              className={`absolute flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 group outline-none focus:outline-none ${isMobile ? 'w-40' : 'w-44'}`}
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
              <span className="text-sm font-medium text-gray-700 group-hover:text-[#730051] transition-colors duration-200 pr-1 whitespace-nowrap">
                {link.label}
              </span>
            </button>
          );
        })}

        {/* FAB Button */}
        <button
          onClick={handleToggle}
          className={`relative ${isMobile ? 'w-12 h-12' : 'w-14 h-14'} bg-white text-[#730051] rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-10 outline-none focus:outline-none ${!isOpen && !isFabCentered ? 'animate-pulse-soft' : ''}`}
          aria-label={isOpen ? 'Close quick links' : 'Open quick links'}
          style={{
            boxShadow: '0 4px 20px rgba(115, 0, 81, 0.3)',
          }}
        >
          <div
            className="transition-transform duration-300"
            style={{ transform: (isOpen || isFabCentered) ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            {(isOpen || isFabCentered) ? <X size={isMobile ? 22 : 26} strokeWidth={2.5} /> : <Plus size={isMobile ? 22 : 26} strokeWidth={2.5} />}
          </div>
        </button>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse-soft {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 20px rgba(115, 0, 81, 0.3);
          }
          50% {
            transform: scale(1.08);
            box-shadow: 0 6px 25px rgba(115, 0, 81, 0.45);
          }
        }
        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default QuickLinksButton;
