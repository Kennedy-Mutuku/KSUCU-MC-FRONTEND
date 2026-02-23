import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, ChevronDown, ChevronRight, ExternalLink, Menu, X,
  Home, Briefcase, Building2, Info,
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

// Mobile sidebar: icon strip always visible, expands on tap to show labels + sub-items
const MobileSidebarMenu = ({ userData, onNavigate, showLabels, setShowLabels, activeTab, setActiveTab }: {
  userData: UserData | null;
  onNavigate: (path: string) => void;
  showLabels: boolean;
  setShowLabels: (v: boolean) => void;
  activeTab: string | null;
  setActiveTab: (v: string | null) => void;
}) => {
  const isExpanded = showLabels || activeTab !== null;

  const handleTabClick = (key: string) => {
    // Direct navigation tabs
    if (key === 'dashboard') { setActiveTab(null); onNavigate('/'); return; }
    if (key === 'about') {
      setActiveTab(null);
      setTimeout(() => {
        const el = document.getElementById('about');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    if (key === 'signin') {
      setActiveTab(null);
      if (userData) { onNavigate('/home'); }
      else { onNavigate('/signIn'); }
      return;
    }

    // Toggle expandable tabs
    setActiveTab(activeTab === key ? null : key);
  };

  const collapsePanel = () => { setActiveTab(null); setShowLabels(false); };

  const tabContent = activeTab ? getTabContent(activeTab) : null;
  const activeLabel = mobileNavTabs.find(t => t.key === activeTab)?.label || '';

  return (
    <>
      {/* Backdrop when expanded */}
      {isExpanded && (
        <div
          className="md:hidden"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99998,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(1px)',
          }}
          onClick={collapsePanel}
        />
      )}

      {/* Sidebar container - always visible on mobile, hidden on desktop */}
      <div
        className="flex md:hidden fixed top-16 left-0 bottom-0"
        style={{ zIndex: 99999 }}
      >
        {/* Icon strip - always visible */}
        <div
          style={{
            width: '52px',
            backgroundColor: '#730051',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '2px',
            paddingBottom: '6px',
            overflowY: 'auto',
            gap: '1px',
          }}
        >
          {mobileNavTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            if (tab.key === 'signin' && userData) {
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab.key)}
                  style={{
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    gap: '1px',
                    flexShrink: 0,
                  }}
                  title={userData.username}
                >
                  <User size={16} />
                  <span style={{ fontSize: '7px', lineHeight: 1 }}>Profile</span>
                </button>
              );
            }

            return (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                style={{
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'white' : 'transparent',
                  color: isActive ? '#730051' : 'rgba(255,255,255,0.8)',
                  gap: '1px',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
                title={tab.label}
              >
                <Icon size={16} />
                <span style={{ fontSize: '7px', lineHeight: 1, fontWeight: isActive ? 600 : 400 }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Expanded panel - slides out when hamburger or a tab is active */}
        <div
          style={{
            width: isExpanded ? 'calc(100vw - 52px)' : '0px',
            maxWidth: isExpanded ? '240px' : '0px',
            backgroundColor: '#ffffff',
            boxShadow: isExpanded ? '4px 0 20px rgba(0,0,0,0.15)' : 'none',
            overflow: 'hidden',
            transition: 'width 0.25s ease, max-width 0.25s ease',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Labels list mode (hamburger) - show all items with icons + labels */}
          {showLabels && !activeTab && (
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '4px 6px' }}>
              {mobileNavTabs.map((tab) => {
                const Icon = tab.icon;
                const hasContent = getTabContent(tab.key) !== null;
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabClick(tab.key)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                      color: '#374151',
                      fontSize: '14px',
                      textAlign: 'left',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#faf5ff'; e.currentTarget.style.color = '#730051'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#374151'; }}
                  >
                    <Icon size={18} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{tab.label}</span>
                    {hasContent && <ChevronRight size={14} style={{ color: '#9ca3af', flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Specific tab content mode */}
          {tabContent && (
            <>
              <button
                onClick={() => setActiveTab(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  borderBottom: '1px solid #e5e7eb',
                  fontWeight: 600,
                  color: '#730051',
                  fontSize: '14px',
                  flexShrink: 0,
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: '#e5e7eb',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />
                {activeLabel}
              </button>
              <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '6px' }}>
                {tabContent.map((item, i) => (
                  <MobileSidebarItem key={i} item={item} depth={0} onClose={collapsePanel} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center h-16 md:h-20 md:pl-0">
            {/* Hamburger - far left on mobile, toggles Services panel */}
            <button
              onClick={() => {
                if (mobileActiveTab === 'services') { setMobileActiveTab(null); setShowLabels(false); }
                else { setMobileActiveTab('services'); setShowLabels(false); }
              }}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label="Toggle menu"
            >
              {mobileActiveTab === 'services' ? <X size={22} /> : <Menu size={22} />}
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
            <Link to="/" className="hidden md:flex items-center gap-2 flex-shrink-0">
              <img
                src={cuLogo}
                alt="KSUCU Logo"
                className="w-12 h-12 object-contain"
              />
              <div className="font-bold text-gray-800 text-sm lg:text-lg whitespace-nowrap">
                <span className="hidden lg:inline">Kisii University CU</span>
                <span className="lg:hidden">KSUCU</span>
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex items-center justify-center gap-0 lg:gap-0.5 flex-1 min-w-0">
              <Link
                to="/"
                className="px-2 lg:px-3 py-2 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
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
                  className={`flex items-center gap-1 px-2 lg:px-3 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
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
                  className={`flex items-center gap-1 px-2 lg:px-3 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
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
                  className={`flex items-center gap-1 px-2 lg:px-3 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
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
                className="px-2 lg:px-3 py-2 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
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
                  className="px-3 lg:px-5 py-2 bg-[#730051] text-white font-medium text-sm rounded-lg hover:bg-[#5a0040] transition-colors whitespace-nowrap"
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

      {/* Mobile Sidebar - always rendered, icon strip always visible */}
      <MobileSidebarMenu
        userData={userData}
        onNavigate={(path: string) => navigate(path)}
        showLabels={showLabels}
        setShowLabels={setShowLabels}
        activeTab={mobileActiveTab}
        setActiveTab={setMobileActiveTab}
      />
    </>
  );
};

export default Header;
