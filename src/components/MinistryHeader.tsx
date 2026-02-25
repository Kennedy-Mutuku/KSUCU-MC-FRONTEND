import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, ChevronDown, LogOut } from 'lucide-react';
import { getApiUrl } from '../config/environment';
import cuLogo from '../assets/cuLogoUAR.png';
import loadingAnime from '../assets/Animation - 1716747954931.gif';
import styles from '../styles/index.module.css';

interface UserData {
    username: string;
    email: string;
}

const MinistryHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [showQuickLinks, setShowQuickLinks] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [generalLoading, setGeneralLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

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
        const isAdminRoute = location.pathname === '/admin' || location.pathname.startsWith('/admin/');

        if (isAdminRoute) {
            checkSuperAdminSession();
        } else {
            fetchUserData();
        }

        const handleFocus = () => {
            if (isAdminRoute) {
                checkSuperAdminSession();
            } else {
                fetchUserData();
            }
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [location.pathname]);

    const checkSuperAdminSession = async () => {
        try {
            const apiUrl = getApiUrl('superAdmin').replace('/login', '');
            const response = await fetch(`${apiUrl}/verify`, {
                credentials: 'include'
            });

            if (response.ok) {
                setIsSuperAdmin(true);
                setUserData({ username: 'Admin', email: '' });
            }
        } catch (error) {
            console.error('Error checking super admin session:', error);
        }
    };

    const fetchUserData = async () => {
        try {
            setGeneralLoading(true);
            const apiUrl = getApiUrl('users');
            const response = await fetch(apiUrl, {
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.message === 'Authentication failed: jwt expired') {
                    // Silent fail or redirect to home if expired on a ministry page
                    // We don't force redirect if they are just browsing
                }
                return;
            }

            // Business logic from UniversalHeader: redirect for incomplete profiles
            if (!data.phone || !data.reg || !data.yos) {
                navigate('/changeDetails');
                return;
            }

            const firstName = data.username?.split(' ')[0] || data.username;
            setUserData({ ...data, username: firstName });

        } catch (error) {
            console.error('Header: Error fetching user data:', error);
        } finally {
            setGeneralLoading(false);
        }
    };

    const handleLogout = async () => {
        if (isSuperAdmin) {
            try {
                const apiUrl = getApiUrl('superAdmin').replace('/login', '');
                await fetch(`${apiUrl}/logout`, {
                    method: 'POST',
                    credentials: 'include'
                });
                setIsSuperAdmin(false);
                setUserData(null);
                navigate('/');
            } catch (error) {
                console.error('Error logging out super admin:', error);
            }
        } else {
            // For regular users, logout logic is usually in userController or similar
            // For now, redirecting to login page or handling as requested
            navigate('/signIn');
        }
    };

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
            {generalLoading && (
                <div className={styles['loading-screen']}>
                    <p className={styles['loading-text']}>Please wait...🤗</p>
                    <img src={loadingAnime} alt="loading" />
                </div>
            )}

            <header
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled
                    ? 'bg-white shadow-md'
                    : 'bg-white/95 backdrop-blur-sm'
                    }`}
            >
                <div className="max-w-6xl mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between h-12 md:h-14">
                        {/* Logo and Title */}
                        <Link to="/" className="flex items-center gap-2">
                            <img
                                src={cuLogo}
                                alt="KSUCU Logo"
                                className="w-8 h-8 md:w-10 md:h-10 object-contain"
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
                                className="px-3 py-1 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Home
                            </Link>

                            <div className="relative">
                                <button
                                    onClick={() => setShowQuickLinks(!showQuickLinks)}
                                    className="flex items-center gap-1 px-3 py-1 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
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

                            <Link
                                to="/#about"
                                className="px-3 py-1 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                About
                            </Link>

                            {userData ? (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => navigate(isSuperAdmin ? '/admin' : '/profile')}
                                        className="flex items-center gap-2 px-3 py-1 rounded-lg font-medium text-[#730051] bg-purple-50 hover:bg-purple-100 transition-colors"
                                    >
                                        <User size={18} />
                                        {userData.username}
                                    </button>
                                    {isSuperAdmin && (
                                        <button
                                            onClick={handleLogout}
                                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                            title="Logout Admin"
                                        >
                                            <LogOut size={18} />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to="/signIn"
                                    className="ml-2 px-4 py-1.5 bg-[#730051] text-white font-medium rounded-lg hover:bg-[#5a0040] transition-colors"
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

            {/* Mobile Menu */}
            {isMenuVisible && (
                <div
                    style={{
                        position: 'fixed',
                        top: '48px',
                        left: 0,
                        right: 0,
                        zIndex: 1000,
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
                        className="flex flex-col p-4 gap-1 bg-white"
                    >
                        <Link
                            to="/"
                            className="px-4 py-3 text-gray-800 font-medium rounded-lg hover:bg-gray-50"
                            onClick={closeMenu}
                        >
                            Home
                        </Link>

                        {quickLinks.map((link, index) => (
                            <Link
                                key={index}
                                to={link.href}
                                className="px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-50"
                                onClick={closeMenu}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <Link
                            to="/#about"
                            className="px-4 py-3 text-gray-800 font-medium rounded-lg hover:bg-gray-50"
                            onClick={closeMenu}
                        >
                            About
                        </Link>

                        <div className="pt-4 mt-4 border-t border-gray-100">
                            {userData ? (
                                <div className="space-y-2">
                                    <button
                                        onClick={() => {
                                            navigate(isSuperAdmin ? '/admin' : '/profile');
                                            closeMenu();
                                        }}
                                        className="w-full flex items-center justify-center gap-2 p-3 bg-purple-50 text-[#730051] font-medium rounded-lg"
                                    >
                                        <User size={18} />
                                        {userData.username}
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 p-3 text-gray-600 font-medium rounded-lg hover:bg-gray-50 text-red-600"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/signIn"
                                    className="block w-full text-center p-3 bg-[#730051] text-white font-medium rounded-lg"
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

export default MinistryHeader;
