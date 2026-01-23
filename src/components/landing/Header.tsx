import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { getApiUrl } from '../../config/environment';

interface UserData {
  username: string;
  email: string;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showQuickLinks, setShowQuickLinks] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch user data
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

  // Close menu on body overflow
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const quickLinks = [
    { label: 'Boards', href: '/boards' },
    { label: 'Ministries', href: '/ministries' },
    { label: 'Evangelical Teams', href: '/ets' },
    { label: 'Fellowships', href: '/fellowshipsandclasses' },
    { label: 'Bible Study', href: '/Bs' },
    { label: 'Library', href: '/library' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-sticky transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="KSUCU Logo"
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className={`font-bold transition-colors ${isScrolled ? 'text-text-primary' : 'text-white'}`}>
              <span className="hidden md:inline text-lg">Kisii University CU</span>
              <span className="md:hidden text-base">KSUCU</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isScrolled
                  ? 'text-text-primary hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Home
            </Link>

            {/* Quick Links Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowQuickLinks(!showQuickLinks)}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isScrolled
                    ? 'text-text-primary hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Quick Links
                <ChevronDown size={16} className={`transition-transform ${showQuickLinks ? 'rotate-180' : ''}`} />
              </button>

              {showQuickLinks && (
                <>
                  <div
                    className="fixed inset-0 z-dropdown"
                    onClick={() => setShowQuickLinks(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-card border border-border py-2 z-dropdown animate-slide-down">
                    {quickLinks.map((link, index) => (
                      <Link
                        key={index}
                        to={link.href}
                        className="block px-4 py-2.5 text-text-secondary hover:text-primary hover:bg-primary-50 transition-colors"
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
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isScrolled
                  ? 'text-text-primary hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              About
            </a>

            {/* User / Auth */}
            {userData ? (
              <button
                onClick={() => navigate('/home')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isScrolled
                    ? 'text-text-primary hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <User size={18} />
                {userData.username}
              </button>
            ) : (
              <Link
                to="/signIn"
                className="ml-2 px-5 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? 'text-text-primary' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-fixed animate-fade-in">
          <nav className="flex flex-col p-4 space-y-1">
            <Link
              to="/"
              className="px-4 py-3 text-text-primary font-medium rounded-lg hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="px-4 py-3 text-text-secondary rounded-lg hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <a
              href="#about"
              className="px-4 py-3 text-text-primary font-medium rounded-lg hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>

            <div className="pt-4 mt-4 border-t border-border">
              {userData ? (
                <button
                  onClick={() => {
                    navigate('/home');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-50 text-primary font-medium rounded-lg"
                >
                  <User size={18} />
                  {userData.username}
                </button>
              ) : (
                <Link
                  to="/signIn"
                  className="block w-full text-center px-4 py-3 bg-primary text-white font-medium rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
