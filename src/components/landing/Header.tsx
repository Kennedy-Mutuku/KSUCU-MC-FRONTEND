import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, ChevronDown, ChevronRight, ExternalLink, Menu, X,
  Home, Briefcase, Building2, Info,
  Users, Globe, Music, UsersRound, GraduationCap, Crown, LogIn,
  AlertCircle, ClipboardList
} from 'lucide-react';
import { getApiUrl } from '../../config/environment';
import { headerNavGroups, organizationSections, type NavItem, type NavSection } from '../../data/navigationData';
import cuLogo from '../../assets/cuLogoUAR.png';
import QuickAttendanceSign from '../attendance/QuickAttendanceSign';

interface UserData {
  username: string;
  email: string;
}

interface Session {
  _id: string;
  title: string;
  ministry: string;
  leadershipRole: string;
  isActive: boolean;
  startTime: string;
  durationMinutes: number;
}

// Cascading flyout menu item for desktop - children appear to the right (or left if near edge)
const FlyoutItem = ({ item, onClose, forceLeft = false }: { item: NavItem; onClose: () => void; forceLeft?: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [openLeft, setOpenLeft] = useState(forceLeft);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const hasChildren = item.children && item.children.length > 0;

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
          className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors text-left ${isHovered ? 'text-[#730051] bg-purple-50' : 'text-gray-700 hover:bg-gray-50'
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

// Mobile sidebar nav item
const MobileSidebarItem = ({ item, depth = 0, onClose }: { item: NavItem; depth?: number; onClose: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between py-2 px-3 rounded-md text-left transition-colors ${isOpen ? 'text-[#730051] bg-purple-50' : 'text-gray-700 hover:bg-gray-50'
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
  { key: 'about', icon: Info, label: 'About' },
  { key: 'services', icon: Briefcase, label: 'Services' },
  { key: 'boards', icon: Building2, label: 'Boards' },
  { key: 'ets', icon: Globe, label: 'E.Teams' },
  { key: 'ministries', icon: Music, label: 'Ministries' },
  { key: 'fellowships', icon: UsersRound, label: 'Fellowships' },
  { key: 'committees', icon: Users, label: 'Committees' },
  { key: 'classes', icon: GraduationCap, label: 'Classes' },
  { key: 'leadership', icon: Crown, label: 'Leadership' },
  { key: 'attendance', icon: ClipboardList, label: 'Attendance' },
  { key: 'signin', icon: LogIn, label: 'Sign In' },
];

const getTabContent = (key: string, activeSessions: Session[] = []): NavItem[] | null => {
  switch (key) {
    case 'services': return organizationSections[0].items;
    case 'boards': return organizationSections[1].items;
    case 'ets': return organizationSections[2].items;
    case 'ministries': return organizationSections[3].items;
    case 'fellowships': return organizationSections[4].items;
    case 'committees': return organizationSections[5].items;
    case 'classes': return organizationSections[6].items;
    case 'leadership': return organizationSections[7].items;
    case 'attendance':
      if (activeSessions.length === 0) return null;
      return activeSessions.map(s => ({
        label: s.title,
        href: `/attendance?session=${s._id}`
      }));
    default: return null;
  }
};

const MobileSidebarMenu = ({ userData, activeSessions, onNavigate, showLabels, setShowLabels, activeTab, setActiveTab }: {
  userData: UserData | null;
  activeSessions: Session[];
  onNavigate: (path: string) => void;
  showLabels: boolean;
  setShowLabels: (v: boolean) => void;
  activeTab: string | null;
  setActiveTab: (v: string | null) => void;
}) => {
  const isExpanded = showLabels || activeTab !== null;

  const handleTabClick = (key: string) => {
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
    setActiveTab(activeTab === key ? null : key);
  };

  const collapsePanel = () => { setActiveTab(null); setShowLabels(false); };
  const tabContent = activeTab ? getTabContent(activeTab, activeSessions) : null;
  const activeLabel = mobileNavTabs.find(t => t.key === activeTab)?.label || 'Menu';

  return (
    <>
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

      <div className="flex md:hidden fixed top-16 left-0 bottom-0" style={{ zIndex: 99999 }}>
        {/* Icon strip */}
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
            const isAttendance = tab.key === 'attendance';
            const hasActiveSessions = activeSessions.length > 0;

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
                  position: 'relative',
                }}
                title={tab.label}
              >
                <Icon size={16} />
                {isAttendance && hasActiveSessions && (
                  <span className="absolute top-2 right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                )}
                <span style={{ fontSize: '7px', lineHeight: 1, fontWeight: isActive ? 600 : 400 }}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Expanded Panel */}
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
          {showLabels && !activeTab && (
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '4px 6px' }}>
              {mobileNavTabs.map((tab) => {
                const Icon = tab.icon;
                const hasContent = getTabContent(tab.key, activeSessions) !== null;
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
                  >
                    <Icon size={18} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{tab.label}</span>
                    {hasContent && <ChevronRight size={14} style={{ color: '#9ca3af', flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          )}

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
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<string | null>(null);
  const [signingSession, setSigningSession] = useState<Session | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchActiveSessions = async () => {
    try {
      const timestamp = Date.now();
      const response = await fetch(`${getApiUrl('attendanceSessionStatus')}?t=${timestamp}`, {
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (response.ok) {
        const data = await response.json();
        setActiveSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Error loading active sessions:', error);
    }
  };

  useEffect(() => {
    fetchActiveSessions();
    const interval = setInterval(fetchActiveSessions, 5000);
    return () => clearInterval(interval);
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
      } catch { }
    };
    fetchUser();
  }, []);

  const handleMouseEnter = (key: string) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const closeDropdown = () => setActiveDropdown(null);

  const renderCascadePanel = (sections: NavSection[], alignRight = false) => (
    <div className={`absolute top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[220px] z-50 ${alignRight ? 'right-0' : 'left-0'}`}>
      {sections.map((section) => (
        <FlyoutItem key={section.title} item={{ label: section.title, children: section.items }} onClose={closeDropdown} />
      ))}
    </div>
  );

  const renderServicesCascade = () => (
    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[220px] z-50">
      {headerNavGroups.services.items.map((item, i) => (
        <FlyoutItem key={i} item={item} onClose={closeDropdown} />
      ))}
    </div>
  );

  const renderAttendanceDropdown = () => (
    <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 min-w-[280px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="px-4 py-2 border-b border-gray-50 mb-2">
        <h4 className="text-xs font-black text-[#730051] uppercase tracking-wider">Active Sessions</h4>
      </div>
      {activeSessions.length === 0 ? (
        <div className="px-4 py-6 text-center">
          <AlertCircle size={24} className="mx-auto text-gray-200 mb-2" />
          <p className="text-xs font-bold text-gray-400">No sessions currently open</p>
        </div>
      ) : (
        <div className="max-h-[350px] overflow-y-auto px-2 space-y-1">
          {activeSessions.map((s) => (
            <div key={s._id} className="w-full text-left px-3 py-3 rounded-lg hover:bg-purple-50 transition-all group border border-transparent hover:border-purple-100">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="min-w-0 flex-1">
                  <h5 className="text-sm font-bold text-gray-900 group-hover:text-[#730051] truncate">{s.title}</h5>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{s.leadershipRole}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setSigningSession(s); closeDropdown(); }}
                className="w-full py-1.5 bg-white border border-gray-200 text-[#730051] text-[10px] font-black rounded-lg shadow-sm hover:bg-[#730051] hover:text-white hover:border-[#730051] transition-all transform active:scale-95 flex items-center justify-center gap-1.5"
              >
                Sign Attendance
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center h-16 md:h-20 md:pl-0">
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

            <Link to="/" className="md:hidden flex-1 flex items-center justify-center gap-2">
              <img src={cuLogo} alt="KSUCU Logo" className="w-9 h-9 object-contain" />
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-900 leading-none text-[11px] tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  KISII UNIVERSITY CHRISTIAN UNION
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="h-[1px] w-3 bg-[#730051]/30"></div>
                  <span className="text-[#730051] text-[10px] whitespace-nowrap" style={{ fontFamily: 'Satisfy, cursive' }}>
                    Transforming Campus, Impacting nations
                  </span>
                  <div className="h-[1px] w-3 bg-[#730051]/30"></div>
                </div>
              </div>
            </Link>

            <Link to="/" className="hidden md:flex items-center gap-3 flex-shrink-0">
              <img src={cuLogo} alt="KSUCU Logo" className="w-12 h-12 lg:w-14 lg:h-14 object-contain" />
              <div className="flex flex-col">
                <div className="font-extrabold text-gray-900 leading-none text-xs lg:text-base tracking-tight uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  KISII UNIVERSITY CHRISTIAN UNION
                </div>
                <div className="flex items-center gap-2 mt-1 lg:mt-1.5 w-full">
                  <div className="h-[1px] flex-1 bg-[#730051]/30"></div>
                  <span className="text-[#730051] text-[10px] lg:text-sm whitespace-nowrap px-1" style={{ fontFamily: 'Satisfy, cursive' }}>
                    Transforming Campus, Impacting nations
                  </span>
                  <div className="h-[1px] flex-1 bg-[#730051]/30"></div>
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center justify-center gap-0 lg:gap-0.5 flex-1 min-w-0">
              <Link to="/" className="px-2 lg:px-3 py-2 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap">Home</Link>
              <a href="#about" className="px-3 py-2 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-100 transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>About</a>

              <div className="relative" onMouseEnter={() => handleMouseEnter('services')} onMouseLeave={handleMouseLeave}>
                <button className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${activeDropdown === 'services' ? 'text-[#730051] bg-purple-50' : 'text-gray-700 hover:bg-gray-100'}`}>
                  Services
                  <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'services' && renderServicesCascade()}
              </div>

              <div className="relative" onMouseEnter={() => handleMouseEnter('governance')} onMouseLeave={handleMouseLeave}>
                <button className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${activeDropdown === 'governance' ? 'text-[#730051] bg-purple-50' : 'text-gray-700 hover:bg-gray-100'}`}>
                  Governance
                  <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'governance' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'governance' && renderCascadePanel(headerNavGroups.governance, true)}
              </div>

              <div className="relative" onMouseEnter={() => handleMouseEnter('attendance')} onMouseLeave={handleMouseLeave}>
                <button className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all relative ${activeDropdown === 'attendance' ? 'text-[#730051] bg-purple-50' : 'text-gray-700 hover:bg-gray-100'}`}>
                  Attendance
                  {activeSessions.length > 0 && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    </span>
                  )}
                  <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'attendance' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'attendance' && renderAttendanceDropdown()}
              </div>
            </nav>

            <div className="hidden md:flex items-center flex-shrink-0 ml-4">
              {userData ? (
                <button onClick={() => navigate('/home')} className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  <User size={18} />
                  {userData.username}
                </button>
              ) : (
                <Link to="/signIn" className="px-5 py-2 bg-[#730051] text-white font-medium text-sm rounded-lg hover:bg-[#5a0040] transition-colors shadow-lg shadow-purple-900/10 active:scale-95 transform transition-all">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {activeDropdown && <div className="fixed inset-0 z-40 hidden md:block" onClick={closeDropdown} />}

      <MobileSidebarMenu
        userData={userData}
        activeSessions={activeSessions}
        onNavigate={(path: string) => navigate(path)}
        showLabels={showLabels}
        setShowLabels={setShowLabels}
        activeTab={mobileActiveTab}
        setActiveTab={setMobileActiveTab}
      />

      {signingSession && (
        <QuickAttendanceSign
          session={signingSession}
          onClose={() => setSigningSession(null)}
        />
      )}

      <style>{`
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .animate-pulse-red {
          animation: pulse-red 2s infinite;
        }
      `}</style>
    </>
  );
};

export default Header;
