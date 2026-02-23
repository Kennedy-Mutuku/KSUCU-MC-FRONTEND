import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User, ChevronDown, ChevronRight, ExternalLink, Menu,
  Home, Building2, Globe, Music,
  UsersRound, GraduationCap, Crown, LogIn,
  ClipboardList, BookOpen, Tv2, FileText, AlertCircle,
  MessageSquare, Coins, Heart, Folder, Book, UserPlus
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
  { key: 'ministries', icon: Music, label: 'Ministries' },
  { key: 'boards', icon: Building2, label: 'Boards' },
  { key: 'eteams', icon: Globe, label: 'E. Teams' },
  { key: 'mediadesk', icon: Tv2, label: 'Media Desk' },
  { key: 'fellowships', icon: UsersRound, label: 'Fellowships' },
  { key: 'biblestudy', icon: BookOpen, label: 'Bible Study' },
  { key: 'classes', icon: GraduationCap, label: 'Classes' },
  { key: 'feedback', icon: MessageSquare, label: 'Feedback' },
  { key: 'financials', icon: Coins, label: 'Financials' },
  { key: 'compassion', icon: Heart, label: 'Compassion' },
  { key: 'requisitions', icon: FileText, label: 'Requisitions' },
  { key: 'filemanager', icon: Folder, label: 'File Manager' },
  { key: 'library', icon: Book, label: 'Library' },
  { key: 'winasoul', icon: UserPlus, label: 'Win a Soul' },
  { key: 'leadership', icon: Crown, label: 'Leadership' },
  { key: 'governingdocs', icon: FileText, label: 'Governing Docs' },
  { key: 'committees', icon: UsersRound, label: 'Committees' },
  { key: 'attendance', icon: ClipboardList, label: 'Attendance' },
  { key: 'signin', icon: LogIn, label: 'Sign In' },
];

interface TabSection {
  title: string;
  icon: React.ElementType;
  items: { label: string; href?: string; external?: boolean; children?: { label: string; href?: string }[] }[];
}

const getTabSections = (key: string, activeSessions: Session[]): TabSection[] => {
  switch (key) {
    case 'ministries': return [{ title: 'Ministries', icon: Music, items: organizationSections[3].items }];
    case 'boards': return [{ title: 'Boards', icon: Building2, items: organizationSections[1].items }];
    case 'eteams': return [{ title: 'E. Teams', icon: Globe, items: organizationSections[2].items }];
    case 'fellowships': return [{ title: 'Fellowships', icon: UsersRound, items: organizationSections[4].items }];
    case 'biblestudy': return [{ title: 'Bible Study', icon: BookOpen, items: [{ label: 'Register for Bible Study', href: '/Bs' }, { label: 'View BS Groups', href: '/Bs' }] }];
    case 'classes': return [{ title: 'Classes', icon: GraduationCap, items: organizationSections[6].items }];
    case 'feedback': return [{ title: 'Feedback', icon: MessageSquare, items: [{ label: 'Submit Anonymously', href: '/recomendations' }, { label: 'Submit with Identity', href: '/recomendations' }] }];
    case 'financials': return [{ title: 'Financials', icon: Coins, items: [{ label: 'View Financial Statements', href: '/financial' }, { label: 'My Contributions', href: '/financial' }] }];
    case 'compassion': return [{ title: 'Compassion', icon: Heart, items: [{ label: 'Request Support', href: '/compassion-counseling' }, { label: 'Support the Ministry', href: '/compassion-counseling' }] }];
    case 'requisitions': return [{ title: 'Requisitions', icon: FileText, items: [{ label: 'My Requisitions', href: '/requisitions' }, { label: 'New Requisition', href: '/requisitions' }] }];
    case 'filemanager': return [{ title: 'File Manager', icon: Folder, items: [{ label: 'My Documents', href: '/my-docs' }, { label: 'Shared Files', href: '/my-docs' }] }];
    case 'library': return [{ title: 'Library', icon: Book, items: [{ label: 'Search Books', href: '/library' }, { label: 'My Borrows', href: '/library' }] }];
    case 'winasoul': return [{ title: 'Win a Soul', icon: UserPlus, items: [{ label: 'Mission Reports', href: '/save' }, { label: 'Evangelism Guide', href: '/save' }] }];
    case 'leadership': return [{ title: 'Leadership', icon: Crown, items: organizationSections[7].items }];
    case 'governingdocs': return [{ title: 'Governing Docs', icon: FileText, items: [{ label: 'Constitution', href: '/pdfs/constitution.pdf', external: true }, { label: 'Financial Policy', href: '#' }, { label: 'Leadership Manual', href: '#' }] }];
    case 'mediadesk': return [{
      title: 'Media Desk', icon: Tv2,
      items: [
        { label: 'News', href: '/news' },
        { label: 'Gallery', href: '/media' },
        {
          label: 'Socials', children: [
            { label: 'TikTok', href: 'https://tiktok.com/@ksucu_mc' },
            { label: 'YouTube', href: 'https://www.youtube.com/@ksucu-mc' },
            { label: 'Facebook', href: 'https://www.facebook.com/ksucumaincampus' },
            { label: 'Instagram', href: 'https://www.instagram.com/ksucu_mc' },
            { label: 'X (Twitter)', href: 'https://twitter.com/ksucumc' },
          ]
        },
      ]
    }];
    case 'attendance':
      if (activeSessions.length === 0) return [];
      return [{ title: 'Active Sessions', icon: ClipboardList, items: activeSessions.map(s => ({ label: s.title, href: `/attendance?session=${s._id}` })) }];
    case 'committees': return [{ title: 'Committees', icon: UsersRound, items: organizationSections[5].items }];
    default: return [];
  }
};


const MobileSidebarMenu = ({ userData, activeSessions, onNavigate, isManualExpanded, setIsManualExpanded }: {
  userData: UserData | null;
  activeSessions: Session[];
  onNavigate: (path: string) => void;
  isManualExpanded: boolean;
  setIsManualExpanded: (val: boolean) => void;
}) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [expandedNestedItem, setExpandedNestedItem] = useState<string | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Expansion happens when any tab is active OR manually toggled via hamburger
  const isExpanded = !!activeTab || isManualExpanded;

  const handleTabClick = (key: string) => {
    if (key === 'dashboard') {
      setActiveTab(null);
      setExpandedNestedItem(null);
      onNavigate('/');
      return;
    }
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
      setExpandedNestedItem(null);
      onNavigate(userData ? '/home' : '/signIn');
      return;
    }
    if (activeTab === key) {
      setActiveTab(null);
      setExpandedNestedItem(null);
      return;
    }
    setActiveTab(key);
    setIsManualExpanded(true);
  };

  const closePanel = () => {
    setActiveTab(null);
    setExpandedNestedItem(null);
    setIsManualExpanded(false);
  };

  const sections = activeTab ? getTabSections(activeTab, activeSessions) : [];

  return (
    <div className="md:hidden">
      {/* Backdrop for click-outside collapse */}
      {isExpanded && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 99997, background: 'rgba(0,0,0,0.15)' }}
          onClick={closePanel}
        />
      )}

      {/* Icon strip / Sidebar */}
      <div style={{
        position: 'fixed', top: '64px', left: 0, bottom: 0,
        width: isExpanded ? '160px' : '48px',
        backgroundColor: '#730051',
        display: 'flex', flexDirection: 'column', alignItems: isExpanded ? 'flex-start' : 'center',
        paddingTop: '2px', paddingBottom: '4px',
        paddingLeft: isExpanded ? '6px' : '0',
        overflowY: 'auto', gap: '0px', zIndex: 99999,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease',
        boxShadow: isExpanded ? '4px 0 20px rgba(0,0,0,0.3)' : 'none',
      }}>
        {mobileNavTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const isAttendance = tab.key === 'attendance';
          const hasActiveSessions = activeSessions.length > 0;
          const hasSections = getTabSections(tab.key, activeSessions).length > 0;

          const isUser = tab.key === 'signin' && userData;

          return (
            <Fragment key={tab.key}>
              <button
                ref={el => { buttonRefs.current[tab.key] = el; }}
                onClick={() => handleTabClick(tab.key)}
                title={tab.label}
                style={{
                  width: isExpanded ? '148px' : '42px',
                  minHeight: '30px',
                  display: 'flex',
                  flexDirection: isExpanded ? 'row' : 'column',
                  alignItems: 'center',
                  justifyContent: isExpanded ? 'flex-start' : 'center',
                  paddingLeft: isExpanded ? '10px' : '0',
                  borderRadius: '6px', border: 'none', cursor: 'pointer',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.95)' : 'transparent',
                  color: isActive ? '#730051' : 'rgba(255,255,255,0.85)',
                  gap: isExpanded ? '6px' : '1px',
                  flexShrink: 0, position: 'relative',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isActive ? '0 1px 6px rgba(0,0,0,0.1)' : 'none',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px' }}>
                  {isUser ? <User size={18} /> : <Icon size={18} />}
                </div>

                {isAttendance && hasActiveSessions && (
                  <span style={{
                    position: 'absolute',
                    top: isExpanded ? '16px' : '6px',
                    left: isExpanded ? '28px' : 'auto',
                    right: isExpanded ? 'auto' : '6px',
                    width: '8px', height: '8px',
                    background: '#ef4444', borderRadius: '50%',
                    boxShadow: '0 0 8px rgba(239,68,68,0.8)',
                    animation: 'pulse 2s infinite',
                  }} />
                )}

                {isExpanded && (
                  <span style={{
                    fontSize: '10.5px',
                    lineHeight: 1,
                    fontWeight: isActive ? 750 : 600,
                    letterSpacing: '0.05px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s ease',
                  }}>
                    {isUser ? 'Profile' : tab.label}
                  </span>
                )}

                {hasSections && isExpanded && (
                  <div style={{ marginLeft: 'auto', marginRight: '6px', display: 'flex', alignItems: 'center' }}>
                    <ChevronDown size={12} style={{ opacity: isActive ? 0.8 : 0.4, transform: isActive ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
                  </div>
                )}
              </button>

              {/* Integrated Vertical Expansion */}
              {isExpanded && isActive && sections.length > 0 && (
                <div style={{
                  width: '148px',
                  background: 'rgba(255,255,255,0.98)',
                  borderRadius: '8px',
                  marginTop: '1px',
                  marginBottom: '2px',
                  overflow: 'hidden',
                  maxHeight: '400px', // Allow scroll if too long
                  overflowY: 'auto',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                  animation: 'accordionDown 0.3s ease-out',
                }}>
                  {sections.map((section, idx) => (
                    <div key={idx} style={{ padding: '4px 0' }}>
                      {/* Only show section title if it's not redundant or if there are multiple sections */}
                      {(section.title.toLowerCase() !== tab.label.toLowerCase() || sections.length > 1) && (
                        <div style={{
                          padding: '6px 16px 4px',
                          fontSize: '10px',
                          fontWeight: 700,
                          color: '#730051',
                          opacity: 0.7,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {section.title}
                        </div>
                      )}

                      {section.items.map((item, i) => (
                        <div key={i}>
                          <Link
                            to={item.href || '#'}
                            onClick={(e) => {
                              if (item.children && item.children.length > 0) {
                                e.preventDefault();
                                setExpandedNestedItem(expandedNestedItem === item.label ? null : item.label);
                              } else {
                                closePanel();
                              }
                            }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              padding: '6px 14px', color: '#374151', fontSize: '10px',
                              textDecoration: 'none', transition: 'all 0.15s',
                              fontWeight: 600
                            }}
                          >
                            <span style={{ flex: 1 }}>{item.label}</span>
                            {item.children && (
                              <ChevronRight
                                size={10}
                                style={{
                                  opacity: 0.5,
                                  transform: expandedNestedItem === item.label ? 'rotate(90deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.2s'
                                }}
                              />
                            )}
                          </Link>

                          {/* Nested children if any */}
                          {item.children && (
                            <div style={{
                              paddingLeft: '12px',
                              background: '#fafafa',
                              maxHeight: expandedNestedItem === item.label ? '500px' : '0',
                              overflow: 'hidden',
                              transition: 'all 0.3s ease-in-out'
                            }}>
                              {item.children.map((child, j) => (
                                <Link
                                  key={j}
                                  to={child.href || '#'}
                                  onClick={closePanel}
                                  style={{
                                    display: 'block', padding: '10px 16px',
                                    color: '#6b7280', fontSize: '11px',
                                    textDecoration: 'none',
                                    fontWeight: 400
                                  }}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </Fragment>
          );
        })}
      </div>

      <style>{`
        @keyframes accordionDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};


const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [signingSession, setSigningSession] = useState<Session | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine which nav group is active based on current path
  const getActiveNav = (path: string): string | null => {
    if (path.startsWith('/news') || path.startsWith('/media')) return 'mediadesk';
    if (path.startsWith('/ministries')) return 'ministries';
    if (path.startsWith('/ets/') || path.startsWith('/e-teams')) return 'eteams';
    if (['/brothersfellowship', '/sistersfellowship', '/fellowships'].some(p => path.startsWith(p))) return 'fellowships';
    if (path.startsWith('/classes') || path.startsWith('/bestpClass')) return 'classes';
    if (path.startsWith('/Bs') || path.startsWith('/biblestudy')) return 'biblestudy';
    if (path.startsWith('/financial')) return 'financials';
    if (path.startsWith('/recomendations')) return 'feedback';
    if (path.startsWith('/compassion-counseling')) return 'compassion';
    if (path.startsWith('/requisitions')) return 'requisitions';
    if (path.startsWith('/my-docs')) return 'filemanager';
    if (path.startsWith('/library')) return 'library';
    if (path.startsWith('/save')) return 'winasoul';
    if (path.startsWith('/boards')) return 'boards';
    if (path.startsWith('/other-committees')) return 'committees';
    if (path.startsWith('/leadership')) return 'leadership';
    if (path.startsWith('/governing-docs')) return 'governingdocs';
    if (path.startsWith('/attendance') || path.startsWith('/session')) return 'attendance';
    return null;
  };
  const activeNav = getActiveNav(location.pathname);

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

  const renderJoinUsPanel = () => (
    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[220px] z-50">
      {headerNavGroups.joinUs.map((section) => (
        <FlyoutItem
          key={section.title}
          item={{ label: section.title, children: section.items }}
          onClose={closeDropdown}
        />
      ))}
    </div>
  );

  const renderMediaDeskPanel = () => (
    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[220px] z-50">
      {headerNavGroups.mediaDesk.map((item, i) => (
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
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="md:hidden p-2 rounded-lg flex-shrink-0 hover:bg-gray-100 transition-colors"
              aria-label="Toggle Menu"
            >
              <Menu size={22} className="text-gray-700" />
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

            <Link to="/" className="hidden md:flex items-center gap-2 lg:gap-3 flex-shrink-0 max-w-[280px] lg:max-w-none">
              <img src={cuLogo} alt="KSUCU Logo" className="w-10 h-10 lg:w-14 lg:h-14 object-contain flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <div className="font-extrabold text-gray-900 leading-none text-[10px] lg:text-base tracking-tight uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  KISII UNIVERSITY CHRISTIAN UNION
                </div>
                <div className="flex items-center gap-2 mt-1 lg:mt-1.5 w-full">
                  <div className="h-[1px] flex-1 bg-[#730051]/30"></div>
                  <span className="text-[#730051] text-[8px] lg:text-sm whitespace-nowrap px-1" style={{ fontFamily: 'Satisfy, cursive' }}>
                    Transforming Campus, Impacting nations
                  </span>
                  <div className="h-[1px] flex-1 bg-[#730051]/30"></div>
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center justify-center gap-0.5 lg:gap-1.5 flex-1 min-w-0">
              <Link to="/" className="nav-link-underline px-1.5 lg:px-3 py-2 font-medium text-xs lg:text-sm text-gray-700 whitespace-nowrap">Home</Link>

              {/* Join Us dropdown */}
              <div className="relative" onMouseEnter={() => handleMouseEnter('joinUs')} onMouseLeave={handleMouseLeave}>
                <button className={`nav-link-underline flex items-center gap-0.5 lg:gap-1 px-1.5 lg:px-3 py-2 font-medium text-xs lg:text-sm whitespace-nowrap ${activeDropdown === 'joinUs' || activeNav === 'joinUs' ? 'text-[#730051] nav-link-active' : 'text-gray-700'}`}>
                  Join Us
                  <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'joinUs' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'joinUs' && renderJoinUsPanel()}
              </div>

              <div className="relative" onMouseEnter={() => handleMouseEnter('services')} onMouseLeave={handleMouseLeave}>
                <button className={`nav-link-underline flex items-center gap-0.5 lg:gap-1 px-1.5 lg:px-3 py-2 font-medium text-xs lg:text-sm whitespace-nowrap ${activeDropdown === 'services' || activeNav === 'services' ? 'text-[#730051] nav-link-active' : 'text-gray-700'}`}>
                  Services
                  <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'services' && renderServicesCascade()}
              </div>

              <div className="relative" onMouseEnter={() => handleMouseEnter('governance')} onMouseLeave={handleMouseLeave}>
                <button className={`nav-link-underline flex items-center gap-0.5 lg:gap-1 px-1.5 lg:px-3 py-2 font-medium text-xs lg:text-sm whitespace-nowrap ${activeDropdown === 'governance' || activeNav === 'governance' ? 'text-[#730051] nav-link-active' : 'text-gray-700'}`}>
                  Governance
                  <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'governance' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'governance' && renderCascadePanel(headerNavGroups.governance, true)}
              </div>

              {/* Media Desk dropdown */}
              <div className="relative" onMouseEnter={() => handleMouseEnter('mediaDesk')} onMouseLeave={handleMouseLeave}>
                <button className={`nav-link-underline flex items-center gap-0.5 lg:gap-1 px-1.5 lg:px-3 py-2 font-medium text-xs lg:text-sm whitespace-nowrap ${activeDropdown === 'mediaDesk' || activeNav === 'mediaDesk' ? 'text-[#730051] nav-link-active' : 'text-gray-700'}`}>
                  Media Desk
                  <ChevronDown size={14} className={`transition-transform ${activeDropdown === 'mediaDesk' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'mediaDesk' && renderMediaDeskPanel()}
              </div>

              <div className="relative" onMouseEnter={() => handleMouseEnter('attendance')} onMouseLeave={handleMouseLeave}>
                <button className={`nav-link-underline flex items-center gap-1 lg:gap-2 px-1.5 lg:px-3 py-2 font-medium text-xs lg:text-sm transition-all relative whitespace-nowrap ${activeDropdown === 'attendance' || activeNav === 'attendance' ? 'text-[#730051] nav-link-active' : 'text-gray-700'}`}>
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

              <div className="flex-shrink-0 ml-1 lg:ml-4">
                {userData ? (
                  <button onClick={() => navigate('/home')} className="flex items-center gap-2 px-2 lg:px-3 py-2 rounded-lg font-medium text-xs lg:text-sm text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap">
                    <User size={18} />
                    {userData.username}
                  </button>
                ) : (
                  <Link to="/signIn" className="px-3 lg:px-5 py-1.5 lg:py-2 bg-[#730051] text-white font-medium text-xs lg:text-sm rounded-lg hover:bg-[#5a0040] transition-colors shadow-lg shadow-purple-900/10 active:scale-95 transform transition-all whitespace-nowrap">Sign In</Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {activeDropdown && <div className="fixed inset-0 z-40 hidden md:block" onClick={closeDropdown} />}

      <MobileSidebarMenu
        userData={userData}
        activeSessions={activeSessions}
        onNavigate={(path: string) => navigate(path)}
        isManualExpanded={isSidebarExpanded}
        setIsManualExpanded={setIsSidebarExpanded}
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
        .nav-link-underline {
          position: relative;
          transition: color 0.2s ease;
        }
        .nav-link-underline::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          transform-origin: center;
          width: 80%;
          height: 3px;
          background: #730051;
          border-radius: 2px;
          transition: transform 0.25s ease;
        }
        .nav-link-underline:hover {
          color: #730051 !important;
        }
        .nav-link-underline:hover::after,
        .nav-link-underline.nav-link-active::after {
          transform: translateX(-50%) scaleX(1);
        }
        .nav-link-underline.nav-link-active {
          color: #730051 !important;
        }
      `}</style>
    </>
  );
};

export default Header;
