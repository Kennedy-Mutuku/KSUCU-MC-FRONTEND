import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/signin.module.css';
import cuLogo from '../assets/KSUCU logo updated document.png';
import { Link, useNavigate } from 'react-router-dom';
import loadingAnime from '../assets/Animation - 1716747954931.gif';
import {Eye, EyeOff} from 'lucide-react'
import { getApiUrl, isDevMode } from '../config/environment';
import UserProfile from './userProfile';


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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const [showPassword, setShowPassword] = useState(false);

    // Check if user is already authenticated
    useEffect(() => {
        checkUserAuthentication();
    }, []);

    const checkUserAuthentication = async () => {
        console.log('🔍 SignIn: Checking user authentication...');
        try {
            const apiUrl = getApiUrl('users');
            console.log('🔍 SignIn: Fetching user data from:', apiUrl);
            
            const response = await fetch(apiUrl, {
                credentials: 'include'
            });

            console.log('🔍 SignIn: Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ SignIn: User authenticated, data:', data);
                setUserData(data);
                // Automatically redirect to profile page if user is already logged in
                navigate('/profile');
            } else {
                console.log('SignIn: User not authenticated, response not ok');
            }
        } catch (error) {
            console.log('SignIn: Authentication check failed:', error);
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

        if(formData.email === '' || formData.password === ''){
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
            
            // If no mapping found, default to user login
            const { endpoint, route } = mapping || { endpoint: getApiUrl('usersLogin'), route: '/profile' };
    
            console.log('🔐 SignIn: Email entered:', formData.email);
            console.log('🔐 SignIn: Processed email:', processedEmail);
            console.log('🔐 SignIn: Password length:', formData.password?.length);
            console.log('🔐 SignIn: Mapping found:', mapping ? 'Yes' : 'No');
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
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('✅ SignIn: Login successful, response:', response.data);
            console.log('🔐 SignIn: Navigating to:', route);
    
            // Navigate to the specified route
            navigate(route);
    
        } catch (error: any) {
            console.error('SignIn: Login error:', error);
            console.error('SignIn: Error response:', error.response);
    
            if (error.response && error.response.status === 401) {
                setError('Invalid credentials. Please check your email and password.');
            } else if (error.response && error.response.status === 404) {
                setError('Login endpoint not found. Please check your email format.');
            } else if (error.response) {
                setError(error.response.data?.message || 'Login failed. Please try again.');
            } else {
                // Handle network or other errors
                setError('Network error. Please check your connection and try again.');
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
                </div>
            </div>
        );
    }

    return (
        <div className={styles.body}>
            {generalLoading && (
                <div className={styles['loading-screen']}>
                    <p className={styles['loading-text']}>Please wait...</p>
                    <img src={loadingAnime} alt="animation gif" />
                </div>
            )}
            <div className={styles['container']}>
                <Link to={"/"} className={styles.logo_div} style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <div className={styles['logo_signUp']} style={{ textAlign: 'center' }}>
                        <img src={cuLogo} alt="CU logo" style={{ maxWidth: '150px', height: 'auto' }} />
                    </div>
                </Link>
                
                {error && <div className={styles.error}>{error}</div>}

                <h2 className={styles['text']}>Log in</h2>

                <form action="" className={styles['form']}>

                    <div className={styles['form-div']}>
                        <label htmlFor="email">e-mail</label>
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
                                />
                                <button type="button" className={styles['eye-button']} onClick={togglePasswordVisibility}>
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </section>
                    </div>

                </form>

                <div className={styles['submisions']}>
                    <div className={styles['clearForm']} onClick={() => setFormData({ email: '', password: '' })}>Clear</div>
                    <div className={styles['submitData']} onClick={handleSubmit}>Next</div>
                </div>

                <div className={styles['form-footer']}>
                    <p><Link to={'/forgotPassword'}>Forgot pasword</Link></p>
                </div>



                <div className={styles['form-footer']}>
                    <p><Link to={"/Home"}>Home</Link></p>
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
    );
};

export default SignIn;
