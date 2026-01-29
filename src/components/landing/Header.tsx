import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { getApiUrl } from '../../config/environment';
import cuLogo from '../../assets/cuLogoUAR.png';

interface UserData {
  username: string;
  email: string;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showQuickLinks, setShowQuickLinks] = useState(false);
  const navigate = useNavigate();

  // Handle menu open/close with animation
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
      } catch (err) {
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

  const quickLinks = [
    { label: 'Boards', href: '/boards' },
    { label: 'Ministries', href: '/ministries' },
    { label: 'Evangelical Teams', href: '/ets' },
    { label: 'Fellowships', href: '/fellowshipsandclasses' },
    { label: 'Bible Study', href: '/Bs' },
    { label: 'Library', href: '/library' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white shadow-md'
          : 'bg-white/95 backdrop-blur-sm'
          }`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo and Title */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src={cuLogo}
                alt="KSUCU Logo"
                className="w-12 h-12 md:w-14 md:h-14 object-contain"
              />
              <div className="font-bold text-gray-800">
                <span className="hidden md:inline text-lg">Kisii University CU</span>
                <span className="md:hidden text-base">KSUCU-MC</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Home
              </Link>

              <div className="relative">
                <button
                  onClick={() => setShowQuickLinks(!showQuickLinks)}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Quick Links
                  <ChevronDown size={16} className={`transition-transform ${showQuickLinks ? 'rotate-180' : ''}`} />
                </button>

                {showQuickLinks && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowQuickLinks(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      {quickLinks.map((link, index) => (
                        <Link
                          key={index}
                          to={link.href}
                          className="block px-4 py-2.5 text-gray-600 hover:text-[#730051] hover:bg-purple-50 transition-colors"
                          onClick={() => setShowQuickLinks(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <a
                href="#about"
                className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                About
              </a>

              {userData ? (
                <button
                  onClick={() => navigate('/home')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <User size={18} />
                  {userData.username}
                </button>
              ) : (
                <Link
                  to="/signIn"
                  className="ml-2 px-5 py-2 bg-[#730051] text-white font-medium rounded-lg hover:bg-[#5a0040] transition-colors"
                >
                  Sign In
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuVisible ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Outside header to escape backdrop-blur stacking context */}
      {isMenuVisible && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            zIndex: 999999,
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
            maxHeight: 'calc(100vh - 80px)',
            overflowY: 'auto',
            opacity: isMenuOpen ? 1 : 0,
            transform: isMenuOpen ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
        >
          <nav
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '16px',
              gap: '4px',
              backgroundColor: '#ffffff',
            }}
          >
            <Link
              to="/"
              style={{
                padding: '12px 16px',
                color: '#1f2937',
                fontWeight: 500,
                borderRadius: '8px',
                backgroundColor: '#ffffff',
              }}
              onClick={closeMenu}
            >
              Home
            </Link>

            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                style={{
                  padding: '12px 16px',
                  color: '#4b5563',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                }}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}

            <a
              href="#about"
              style={{
                padding: '12px 16px',
                color: '#1f2937',
                fontWeight: 500,
                borderRadius: '8px',
                backgroundColor: '#ffffff',
              }}
              onClick={closeMenu}
            >
              About
            </a>

            <div style={{ paddingTop: '16px', marginTop: '16px', borderTop: '1px solid #e5e7eb' }}>
              {userData ? (
                <button
                  onClick={() => {
                    navigate('/home');
                    closeMenu();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    fontWeight: 500,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <User size={18} />
                  {userData.username}
                </button>
              ) : (
                <Link
                  to="/signIn"
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                    padding: '12px 16px',
                    backgroundColor: '#730051',
                    color: 'white',
                    fontWeight: 500,
                    borderRadius: '8px',
                  }}
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
