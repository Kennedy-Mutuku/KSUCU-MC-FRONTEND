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
    const [showSignupLink, setShowSignupLink] = useState(false);
    const [failedEmail, setFailedEmail] = useState('');

    const [resetSending, setResetSending] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    const handleSendResetLink = async () => {
        if (!failedEmail) return;
        setResetSending(true);
        try {
            await axios.post(getApiUrl('usersForgetPassword'), { email: failedEmail });
            setResetSent(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
        } finally {
            setResetSending(false);
        }
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

            // Check for profile photo if regular user login
            if (route === '/profile' && response.data.user && !response.data.user.profilePhoto) {
                navigate('/welcome');
            } else {
                // Navigate to the specified route
                navigate(route);
            }

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
            setShowSignupLink(false);

            if (error.response && error.response.status === 401) {
                // Check if user exists in database
                try {
                    const checkResponse = await axios.post(getApiUrl('usersCheckExists'), {
                        email: processedEmail
                    });

                    if (checkResponse.data.exists) {
                        // User exists but wrong password - show WhatsApp help
                        setError('Invalid password. Your account exists but the password is incorrect.');
                        setShowWhatsAppHelp(true);
                        setShowSignupLink(false);
                        setFailedEmail(processedEmail);

                    } else {
                        // User doesn't exist - show signup link
                        setError('Seems you don\'t have an account.');
                        setShowSignupLink(true);
                        setShowWhatsAppHelp(false);
                    }
                } catch (checkError) {
                    console.error('Error checking user existence:', checkError);
                    setError('Invalid credentials. Please check your email and password.');
                }
            } else if (error.response && error.response.status === 404) {
                setError('Login endpoint not found. Please check your email format.');
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
                            {resetSent ? (
                                <p style={{ margin: '0', color: '#16a34a', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>
                                    Reset link sent! Check your email inbox.
                                </p>
                            ) : (
                                <>
                                    <p style={{ margin: '0 0 12px 0', color: '#555', fontSize: '13px', textAlign: 'center' }}>
                                        We'll send a password reset link to <strong>{failedEmail}</strong>
                                    </p>
                                    <button
                                        onClick={handleSendResetLink}
                                        disabled={resetSending}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            background: '#730051',
                                            color: 'white',
                                            padding: '12px 20px',
                                            borderRadius: '25px',
                                            border: 'none',
                                            cursor: resetSending ? 'default' : 'pointer',
                                            fontWeight: 'bold',
                                            fontSize: '14px',
                                            opacity: resetSending ? 0.7 : 1
                                        }}
                                    >
                                        {resetSending ? 'Sending...' : 'Send Reset Link'}
                                    </button>
                                </>
                            )}
                            <p style={{ margin: '12px 0 0 0', color: '#730051', fontSize: '12px', textAlign: 'center' }}>
                                Tip: Your default password is your phone number
                            </p>
                        </div>
                    )}

                    {showSignupLink && (
                        <div style={{
                            background: '#f8f0f5',
                            border: '1px solid #e0c0d6',
                            borderRadius: '10px',
                            padding: '15px',
                            marginBottom: '15px',
                            textAlign: 'center'
                        }}>
                            <p style={{ margin: '0 0 10px 0', color: '#730051', fontSize: '14px' }}>
                                You don't have an account yet. Register now to get started!
                            </p>
                            <Link
                                to="/signUp"
                                style={{
                                    display: 'inline-block',
                                    background: '#730051',
                                    color: 'white',
                                    padding: '10px 25px',
                                    borderRadius: '25px',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                    fontSize: '14px'
                                }}
                            >
                                Click here to Sign Up
                            </Link>
                        </div>
                    )}

                    <div style={{
                        filter: showWhatsAppHelp ? 'blur(3px)' : 'none',
                        pointerEvents: showWhatsAppHelp ? 'none' : 'auto',
                        opacity: showWhatsAppHelp ? 0.5 : 1,
                        transition: 'all 0.3s ease'
                    }}>
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
                            <p><Link to={'/forgotPassword'}>Forgot password?</Link></p>
                        </div>

                        <div className={styles['form-footer']}>
                            <p><Link to={"/Home"}>← Back to Home</Link></p>
                        </div>

                        <div className={styles['signup-link']}>
                            <p>Don't have an account? <Link to={"/signUp"} className={styles['register-link']}>Register here</Link></p>
                        </div>
                    </div>

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
