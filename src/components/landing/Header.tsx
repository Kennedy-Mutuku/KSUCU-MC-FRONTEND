import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, X, User, ChevronDown, ChevronRight, ExternalLink,
  Home, LayoutDashboard, Briefcase, Building2, Shield, Info,
  Newspaper, Image, Share2, MessageSquare, DollarSign, Heart,
  ClipboardList, BookOpen, FolderOpen, Library, HandHeart, FileText,
  Users, Globe, Music, UsersRound, GraduationCap, Crown, LogIn,
} from 'lucide-react';
import { getApiUrl } from '../../config/environment';
import { headerNavGroups, organizationSections, type NavItem, type NavSection } from '../../data/navigationData';
import cuLogo from '../../assets/cuLogoUAR.png';

interface UserData {
  username: string;
  email: string;
}

// Cascading flyout menu item for desktop - children appear to the right (or left if near edge)
// forceLeft: when a parent already opens left, all descendants also open left
const FlyoutItem = ({ item, onClose, forceLeft = false }: { item: NavItem; onClose: () => void; forceLeft?: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [openLeft, setOpenLeft] = useState(forceLeft);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const hasChildren = item.children && item.children.length > 0;

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // If parent already forced left, keep it. Otherwise check space.
    if (forceLeft) {
      setOpenLeft(true);
    } else if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      const spaceRight = window.innerWidth - rect.right;
      setOpenLeft(spaceRight < 220);
    }
    setIsHovered(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setIsHovered(false), 120);
  };

  if (hasChildren) {
    return (
      <div
        ref={itemRef}
        className="relative"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <button
          className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors text-left ${
            isHovered ? 'text-[#730051] bg-purple-50' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span>{item.label}</span>
          <ChevronRight size={14} className={`text-gray-400 flex-shrink-0 ml-2 ${openLeft && isHovered ? 'rotate-180' : ''}`} />
        </button>

        {isHovered && (
          <div
            className="absolute top-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
            style={{
              minWidth: '200px',
              maxWidth: '260px',
              ...(openLeft
                ? { right: '100%', marginRight: '4px' }
                : { left: '100%', marginLeft: '4px' }),
            }}
          >
            {item.children!.map((child, i) => (
              <FlyoutItem key={i} item={child} onClose={onClose} forceLeft={openLeft} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (item.external) {
    return (
      <a
        href={item.href || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-[#730051] hover:bg-purple-50 rounded-md transition-colors"
        onClick={onClose}
      >
        <span className="truncate">{item.label}</span>
        <ExternalLink size={12} className="text-gray-400 flex-shrink-0" />
      </a>
    );
  }

  return (
    <Link
      to={item.href || '#'}
      className="block px-3 py-2 text-sm text-gray-700 hover:text-[#730051] hover:bg-purple-50 rounded-md transition-colors truncate"
      onClick={onClose}
    >
      {item.label}
    </Link>
  );
};

// Mobile sidebar nav item - renders children recursively with indentation
const MobileSidebarItem = ({ item, depth = 0, onClose }: { item: NavItem; depth?: number; onClose: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between py-2 px-3 rounded-md text-left transition-colors ${
            isOpen ? 'text-[#730051] bg-purple-50' : 'text-gray-700 hover:bg-gray-50'
          }`}
          style={{ paddingLeft: `${12 + depth * 12}px` }}
        >
          <span className="text-sm break-words min-w-0">{item.label}</span>
          <ChevronRight
            size={14}
            className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`}>
          {item.children!.map((child, i) => (
            <MobileSidebarItem key={i} item={child} depth={depth + 1} onClose={onClose} />
          ))}
        </div>
      </div>
    );
  }

  if (item.external) {
    return (
      <a
        href={item.href || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 py-2 px-3 rounded-md text-sm text-gray-600 hover:text-[#730051] hover:bg-purple-50 transition-colors"
        style={{ paddingLeft: `${12 + depth * 12}px` }}
        onClick={onClose}
      >
        {item.label}
        <ExternalLink size={11} className="text-gray-400" />
      </a>
    );
  }

  return (
    <Link
      to={item.href || '#'}
      className="block py-2 px-3 rounded-md text-sm text-gray-600 hover:text-[#730051] hover:bg-purple-50 transition-colors"
      style={{ paddingLeft: `${12 + depth * 12}px` }}
      onClick={onClose}
    >
      {item.label}
    </Link>
  );
};

// Icon map for mobile sidebar tabs
const mobileNavTabs: { key: string; icon: React.ElementType; label: string; }[] = [
  { key: 'dashboard', icon: Home, label: 'Home' },
  { key: 'services', icon: Briefcase, label: 'Services' },
  { key: 'boards', icon: Building2, label: 'Boards' },
  { key: 'ets', icon: Globe, label: 'E.Teams' },
  { key: 'ministries', icon: Music, label: 'Ministries' },
  { key: 'fellowships', icon: UsersRound, label: 'Fellowships' },
  { key: 'committees', icon: Users, label: 'Committees' },
  { key: 'classes', icon: GraduationCap, label: 'Classes' },
  { key: 'leadership', icon: Crown, label: 'Leadership' },
  { key: 'about', icon: Info, label: 'About' },
  { key: 'signin', icon: LogIn, label: 'Sign In' },
];

// Map tab keys to their navigation data
const getTabContent = (key: string): NavItem[] | null => {
  switch (key) {
    case 'services': return organizationSections[0].items; // Quick Access
    case 'boards': return organizationSections[1].items;
    case 'ets': return organizationSections[2].items;
    case 'ministries': return organizationSections[3].items;
    case 'fellowships': return organizationSections[4].items;
    case 'committees': return organizationSections[5].items;
    case 'classes': return organizationSections[6].items;
    case 'leadership': return organizationSections[7].items;
    default: return null;
  }
};

// Mobile sidebar: icons on left, content expands to the right
const MobileSidebarMenu = ({ isOpen, userData, onClose, onNavigate }: {
  isOpen: boolean;
  userData: UserData | null;
  onClose: () => void;
  onNavigate: (path: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleTabClick = (key: string) => {
    // Direct navigation tabs
    if (key === 'dashboard') { onNavigate('/'); return; }
    if (key === 'about') {
      onClose();
      // Wait for menu close animation & body overflow restore before scrolling
      setTimeout(() => {
        const el = document.getElementById('about');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 350);
      return;
    }
    if (key === 'signin') {
      if (userData) { onNavigate('/home'); }
      else { onNavigate('/signIn'); }
      return;
    }

    // Toggle expandable tabs
    setActiveTab(prev => prev === key ? null : key);
  };

  const tabContent = activeTab ? getTabContent(activeTab) : null;
  const activeLabel = mobileNavTabs.find(t => t.key === activeTab)?.label || '';

  return (
    <div
      style={{
        position: 'fixed',
        top: '64px',
        left: 0,
        bottom: 0,
        zIndex: 999999,
        display: 'flex',
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
    >
      {/* Icon strip - left sidebar */}
      <div
        style={{
          width: '60px',
          backgroundColor: '#730051',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '8px',
          paddingBottom: '8px',
          overflowY: 'auto',
          gap: '2px',
        }}
      >
        {mobileNavTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          // Show user icon if logged in instead of signin
          if (tab.key === 'signin' && userData) {
            return (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  gap: '2px',
                  flexShrink: 0,
                }}
                title={userData.username}
              >
                <User size={18} />
                <span style={{ fontSize: '8px', lineHeight: 1 }}>Profile</span>
              </button>
            );
          }

          return (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              style={{
                width: '48px',
                height: '48px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isActive ? 'white' : 'transparent',
                color: isActive ? '#730051' : 'rgba(255,255,255,0.8)',
                gap: '2px',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
              title={tab.label}
            >
              <Icon size={18} />
              <span style={{ fontSize: '8px', lineHeight: 1, fontWeight: isActive ? 600 : 400 }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Expanded content panel - right side */}
      <div
        style={{
          width: tabContent ? 'calc(100vw - 60px)' : '0px',
          maxWidth: tabContent ? '280px' : '0px',
          backgroundColor: '#ffffff',
          boxShadow: tabContent ? '4px 0 20px rgba(0,0,0,0.1)' : 'none',
          overflow: 'hidden',
          transition: 'width 0.3s ease, max-width 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {tabContent && (
          <>
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #e5e7eb',
                fontWeight: 600,
                color: '#730051',
                fontSize: '14px',
                flexShrink: 0,
              }}
            >
              {activeLabel}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px' }}>
              {tabContent.map((item, i) => (
                <MobileSidebarItem key={i} item={item} depth={0} onClose={onClose} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const openMenu = () => {
    setIsMenuVisible(true);
    setTimeout(() => setIsMenuOpen(true), 10);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setTimeout(() => setIsMenuVisible(false), 300);
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(getApiUrl('users'), { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          const firstName = data.username?.split(' ')[0] || data.username;
          setUserData({ ...data, username: firstName });
        }
      } catch {
        // User not logged in
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (isMenuVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuVisible]);

  // Desktop dropdown handlers
  const handleMouseEnter = (key: string) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  // Render a cascading dropdown for a group of sections
  // First level shows section titles, hovering a title flyouts its items to the right
  const renderCascadePanel = (sections: NavSection[], alignRight = false) => (
    <div
      className={`absolute top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[220px] z-50 ${alignRight ? 'right-0' : 'left-0'}`}
    >
      {sections.map((section) => (
        <FlyoutItem
          key={section.title}
          item={{ label: section.title, children: section.items }}
          onClose={closeDropdown}
        />
      ))}
    </div>
  );

  // Render the services cascade - items are direct children, each can flyout further
  const renderServicesCascade = () => (
    <div
      className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[220px] z-50"
    >
      {headerNavGroups.services.items.map((item, i) => (
        <FlyoutItem key={i} item={item} onClose={closeDropdown} />
      ))}
    </div>
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white shadow-md'
          : 'bg-white/95 backdrop-blur-sm'
          } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center h-16 md:h-20">
            {/* Mobile Menu Button - Left on mobile */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors mr-2"
              aria-label="Toggle menu"
            >
              {isMenuVisible ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Title - Centered on mobile */}
            <div className="md:hidden flex-1 text-center">
              <Link to="/" className="font-bold text-base text-gray-800">
                KSUCU-MC
              </Link>
            </div>

            {/* Logo - Far right on mobile */}
            <Link to="/" className="md:hidden flex-shrink-0">
              <img
                src={cuLogo}
                alt="KSUCU Logo"
                className="w-10 h-10 object-contain"
              />
            </Link>

            {/* Desktop: Logo + Title together on left */}
            <Link to="/" className="hidden md:flex items-center gap-3 flex-shrink-0">
              <img
                src={cuLogo}
                alt="KSUCU Logo"
                className="w-14 h-14 object-contain"
              />
              <div className="font-bold text-gray-800 text-lg">
                Kisii University CU
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex items-center justify-center gap-0.5 flex-1">
              <Link
                to="/"
                className="px-3 py-2 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Home
              </Link>

              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('services')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                    activeDropdown === 'services' ? 'text-[#730051] bg-purple-50' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Services
                  <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'services' && renderServicesCascade()}
              </div>

              {/* Organization Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('organization')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                    activeDropdown === 'organization' ? 'text-[#730051] bg-purple-50' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Organization
                  <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'organization' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'organization' && renderCascadePanel(headerNavGroups.organization)}
              </div>

              {/* Governance Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('governance')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                    activeDropdown === 'governance' ? 'text-[#730051] bg-purple-50' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Governance
                  <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'governance' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'governance' && renderCascadePanel(headerNavGroups.governance, true)}
              </div>

              <a
                href="#about"
                className="px-3 py-2 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                About
              </a>
            </nav>

            {/* Auth - Far Right */}
            <div className="hidden md:flex items-center flex-shrink-0">
              {userData ? (
                <button
                  onClick={() => navigate('/home')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <User size={18} />
                  {userData.username}
                </button>
              ) : (
                <Link
                  to="/signIn"
                  className="px-5 py-2 bg-[#730051] text-white font-medium text-sm rounded-lg hover:bg-[#5a0040] transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Click-away overlay for desktop dropdowns */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-40 hidden md:block"
          onClick={closeDropdown}
        />
      )}

      {/* Mobile Menu Backdrop */}
      {isMenuVisible && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999998,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(2px)',
            opacity: isMenuOpen ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
          onClick={closeMenu}
        />
      )}

      {/* Mobile Sidebar Menu */}
      {isMenuVisible && (
        <MobileSidebarMenu
          isOpen={isMenuOpen}
          userData={userData}
          onClose={closeMenu}
          onNavigate={(path: string) => { navigate(path); closeMenu(); }}
        />
      )}
    </>
  );
};

export default Header;
