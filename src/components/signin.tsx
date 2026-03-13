import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/signin.module.css';
import cuLogo from '../assets/KSUCU logo updated document.png';
import { Link, useNavigate } from 'react-router-dom';
import loadingAnime from '../assets/Animation - 1716747954931.gif';
import { Eye, EyeOff } from 'lucide-react'
import { getApiUrl, isDevMode } from '../config/environment';
import UserProfile from './userProfile';
import ErrorBoundary from './ErrorBoundary';


const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const [generalLoading, setgeneralLoading] = useState(false);
    const [error, setError] = useState('');
    const [userData, setUserData] = useState<{ username: string; email: string; yos: number; phone: string; et: string; ministry: string; course?: string; reg?: string } | null>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showWhatsAppHelp, setShowWhatsAppHelp] = useState(false);

    const [forgotRegNo, setForgotRegNo] = useState('');
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotPhone, setForgotPhone] = useState('');
    const [forgotError, setForgotError] = useState('');



    const handleSendResetLink = (adminPhone: string) => {
        if (!forgotRegNo || !forgotEmail || !forgotPhone) {
            setForgotError('Please fill in all fields (Reg No, Email, Phone).');
            return;
        }
        setForgotError('');

        const message = `Hello KSUCU-MC SYSTEM ADMIN, I accidentally lost my KSUCU-MC PORTAL Password kindly help me reset it at your soonest convenience, below are my details:\nReg No: ${forgotRegNo}\nEmail: ${forgotEmail}\nPhone: ${forgotPhone}`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/254${adminPhone.substring(1)}?text=${encodedMessage}`, '_blank');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const [showPassword, setShowPassword] = useState(false);

    // Check if user is already authenticated
    useEffect(() => {
        checkUserAuthentication();
    }, []);

    const checkUserAuthentication = async (retryCount = 0) => {
        console.log('🔍 SignIn: Checking user authentication...');
        try {
            const apiUrl = getApiUrl('users');
            console.log('🔍 SignIn: Fetching user data from:', apiUrl);

            // Add cache-busting and better headers for cross-device compatibility
            const response = await fetch(`${apiUrl}?t=${Date.now()}`, {
                credentials: 'include',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            });

            console.log('🔍 SignIn: Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ SignIn: User authenticated, data:', data);
                setUserData(data);
                // Check if profile photo exists
                if (!data.profilePhoto && !data.email.includes('admin')) {
                    navigate('/welcome');
                } else {
                    // Automatically redirect to profile page if user is already logged in
                    navigate('/profile');
                }
            } else {
                console.log('SignIn: User not authenticated, response not ok');
            }
        } catch (error) {
            console.log('SignIn: Authentication check failed:', error);

            // Retry logic for production connection issues
            if (retryCount < 2) {
                console.log(`🔄 Retrying authentication check (attempt ${retryCount + 1}/3)...`);
                setTimeout(() => checkUserAuthentication(retryCount + 1), 2000);
                return;
            }

        } finally {
            console.log('🔍 SignIn: Authentication check completed, setting checkingAuth to false');
            setCheckingAuth(false);
        }
    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async () => {
        // Define mappings for email domains to endpoints and routes

        if (formData.email === '' || formData.password === '') {
            setError('All fields required 🙂')
            return
        }

        // Auto-complete common admin emails if missing domain
        let processedEmail = formData.email.toLowerCase().trim();

        // More flexible auto-completion for admin emails
        const adminPatterns = [
            { pattern: /^admin@ksucumcsuperadmi/i, complete: 'admin@ksucumcsuperadmin.co.ke' },  // Handle typos
            { pattern: /^admin@ksucumcsuperadmin$/i, complete: 'admin@ksucumcsuperadmin.co.ke' },  // Exact match without .co.ke
            { pattern: /^admin@ksucumcbsadmin/i, complete: 'admin@ksucumcbsadmin.co.ke' },
            { pattern: /^admin@ksucumcadmissionadmin/i, complete: 'admin@ksucumcadmissionadmin.co.ke' }
        ];

        // Check if the email matches any pattern and doesn't already end with .co.ke
        if (!processedEmail.endsWith('.co.ke')) {
            for (const { pattern, complete } of adminPatterns) {
                if (pattern.test(processedEmail)) {
                    console.log('📧 SignIn: Auto-completing email from:', processedEmail, 'to:', complete);
                    processedEmail = complete;
                    break;
                }
            }
        }

        const domainMappings = [
            { domain: '@ksucumcnewsadmin.co.ke', endpoint: getApiUrl('newsAdmin'), route: '/adminnews' },

            { domain: '@ksucumcmissionadmin.co.ke', endpoint: getApiUrl('missionAdmin'), route: '/adminmission' },

            { domain: '@ksucumcbsadmin.co.ke', endpoint: getApiUrl('bsAdmin'), route: '/adminBs' },

            { domain: '@ksucumcsuperadmin.co.ke', endpoint: getApiUrl('superAdmin'), route: '/admin' },

            { domain: '@ksucumcadmissionadmin.co.ke', endpoint: getApiUrl('admissionAdmin'), route: '/admission' },
        ];

        // Offline check disabled - always try to login
        // if (!navigator.onLine) {
        //     setError('Check your internet and try again...');
        //     return;
        // }

        window.scrollTo({
            top: 0,
            behavior: 'auto', // 'auto' for instant scroll
        });

        setgeneralLoading(true);

        try {
            // Find the matching configuration based on the email domain
            const mapping = domainMappings.find(mapping =>
                processedEmail?.endsWith(mapping.domain)
            );

            // Determine endpoint and route
            let endpoint: string;
            let route: string;

            if (mapping) {
                // Admin domain found
                endpoint = mapping.endpoint;
                route = mapping.route;
            } else if (processedEmail.includes('officer')) {
                // Polling officer pattern detected
                endpoint = getApiUrl('pollingOfficerLogin');
                route = '/polling-officer-dashboard';
            } else {
                // Default to regular user login
                endpoint = getApiUrl('usersLogin');
                route = '/profile';
            }

            console.log('🔐 SignIn: Email entered:', formData.email);
            console.log('🔐 SignIn: Processed email:', processedEmail);
            console.log('🔐 SignIn: Password length:', formData.password?.length);
            console.log('🔐 SignIn: Mapping found:', mapping ? 'Yes (Admin)' : processedEmail.includes('officer') ? 'Yes (Officer Pattern)' : 'No (User)');
            console.log('🔐 SignIn: Attempting login to:', endpoint);
            console.log('🔐 SignIn: Will redirect to:', route);

            // Use the processed email for the request
            const loginData = {
                email: processedEmail,
                password: formData.password
            };

            console.log('📤 SignIn: Sending login data:', { email: loginData.email, password: '***hidden***' });

            const response = await axios.post(endpoint, loginData, {
                withCredentials: true, // Include cookies in the request
                timeout: 30000, // 30 second timeout
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('✅ SignIn: Login successful, response:', response.data);
            console.log('🔐 SignIn: Navigating to:', route);

            // Track admin session for navbar display
            if (mapping) {
                localStorage.setItem('adminSession', 'true');
            } else {
                localStorage.removeItem('adminSession');
            }

            // Check for profile photo if regular user login
            let finalRoute = route;
            if (route === '/profile' && response.data.user && !response.data.user.profilePhoto) {
                finalRoute = '/welcome';
            }



            navigate(finalRoute);

            return; // Exit early to prevent any other state updates


        } catch (error: any) {
            console.error('SignIn: Login error:', error);
            console.error('SignIn: Error response:', error.response);
            console.error('SignIn: Error code:', error.code);
            console.error('SignIn: Device info:', {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                onLine: navigator.onLine
            });

            // Reset help options
            setShowWhatsAppHelp(false);

            if (error.response && (error.response.status === 401 || error.response.status === 404)) {
                setError('Incorrect email or password, please enter correct details.');
            } else if (error.response) {
                setError(error.response.data?.message || 'Login failed. Please try again.');
            } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
                setError('Connection timeout. Please check your internet connection and try again.');
            } else if (error.code === 'ERR_NETWORK' || !navigator.onLine) {
                setError('Network error. Please check your internet connection and try again.');
            } else {
                // Handle other device-specific errors - ensure we only pass strings
                const errorMessage = typeof error === 'object' && error.message
                    ? error.message
                    : typeof error === 'string'
                        ? error
                        : 'Unknown connection error';
                setError(`Connection error. Please try again or contact support. (${errorMessage})`);
            }
        } finally {
            setgeneralLoading(false);
        }
    };


    // Show user profile if authenticated
    if (userData) {
        return <UserProfile userData={userData} isLoading={generalLoading} />;
    }

    // Show loading while checking authentication
    if (checkingAuth) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <img src={loadingAnime} alt="Loading..." className={styles['loading-gif']} />
                    <p>Checking authentication...</p>
                    {/* Fallback text for devices that might not load images */}
                    <noscript>
                        <p>Loading... Please ensure JavaScript is enabled.</p>
                    </noscript>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className={styles.body}>
                {generalLoading && (
                    <div className={styles['loading-screen']}>
                        <p className={styles['loading-text']}>Please wait...</p>
                        <img src={loadingAnime} alt="animation gif" />
                    </div>
                )}
                <div className={styles['container']}>
                    <Link to={"/"} style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                        <img src={cuLogo} alt="CU logo" style={{ width: '72px', height: '72px', objectFit: 'contain' }} />
                    </Link>

                    {error && <div className={styles.error}>{error}</div>}

                    {showWhatsAppHelp && (
                        <div style={{
                            background: '#f8f4f7',
                            border: '1px solid #730051',
                            borderRadius: '8px',
                            padding: '20px',
                            marginBottom: '15px'
                        }}>
                            <p style={{ margin: '0 0 15px 0', color: '#730051', fontSize: '15px', fontWeight: 'bold', textAlign: 'center' }}>
                                Forgot your password?
                            </p>
                            <p style={{ margin: '0 0 12px 0', color: '#555', fontSize: '13px', textAlign: 'center' }}>
                                Please provide your details below and choose an admin to message on WhatsApp for a password reset.
                            </p>
                            {forgotError && <p style={{ color: 'red', fontSize: '12px', textAlign: 'center', marginBottom: '10px' }}>{forgotError}</p>}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                                <input
                                    type="text"
                                    placeholder="Reg No (e.g., IN14/00000/22)"
                                    value={forgotRegNo}
                                    onChange={(e) => setForgotRegNo(e.target.value)}
                                    className={styles['input']}
                                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    className={styles['input']}
                                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone No (e.g., 0712345678)"
                                    value={forgotPhone}
                                    onChange={(e) => setForgotPhone(e.target.value)}
                                    className={styles['input']}
                                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button
                                    onClick={(e) => { e.preventDefault(); handleSendResetLink('0717481883'); }}
                                    style={{
                                        width: '100%',
                                        background: '#25D366',
                                        color: 'white',
                                        padding: '12px 10px',
                                        borderRadius: '25px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        transition: 'background 0.3s ease'
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                    Reset via Gent Admin
                                </button>
                                <button
                                    onClick={(e) => { e.preventDefault(); handleSendResetLink('0726379173'); }}
                                    style={{
                                        width: '100%',
                                        background: '#25D366',
                                        color: 'white',
                                        padding: '12px 10px',
                                        borderRadius: '25px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        transition: 'background 0.3s ease'
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                    Reset via Lady Admin
                                </button>
                            </div>
                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <button
                                    onClick={(e) => { e.preventDefault(); setShowWhatsAppHelp(false); }}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#730051',
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    ← Back to Log In
                                </button>
                            </div>
                        </div>
                    )}

                    {!showWhatsAppHelp && (
                        <div>
                            <h2 className={styles['text']}>Log in</h2>

                            <form action="" className={styles['form']}>

                                <div className={styles['form-div']}>
                                    <label htmlFor="email">E-mail</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className={styles['input']}
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <div className={styles['form-div']}>
                                    <label htmlFor="password">Password</label>
                                    <section className={styles['password-wrapper']}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            className={styles['input-pswd']}
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                        />
                                        <button type="button" className={styles['eye-button']} onClick={togglePasswordVisibility}>
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </section>
                                </div>

                            </form>

                            <div className={styles['submisions']}>
                                <div className={styles['clearForm']} onClick={() => setFormData({ email: '', password: '' })}>Clear</div>
                                <div className={styles['submitData']} onClick={handleSubmit}>Log In</div>
                            </div>

                            <div className={styles['form-footer']}>
                                <p><button type="button" onClick={() => setShowWhatsAppHelp(true)} style={{ background: 'none', border: 'none', color: '#730051', cursor: 'pointer', textDecoration: 'underline', fontSize: '1em', fontFamily: 'inherit' }}>Forgot password?</button></p>
                            </div>

                            <div className={styles['form-footer']}>
                                <p><Link to={"/Home"}>← Back to Home</Link></p>
                            </div>
                        </div>
                    )}

                    {isDevMode() && (
                        <div style={{
                            position: 'fixed',
                            top: '10px',
                            right: '10px',
                            background: '#ff9800',
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            zIndex: 1000
                        }}>
                            DEV MODE
                        </div>
                    )}

                </div>

            </div>
        </ErrorBoundary>
    );
};

export default SignIn;
