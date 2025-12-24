import React, { useState } from 'react';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import styles from '../styles/NewsAdmin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faLock, 
    faUnlock,
    faNewspaper,
    faCalendarAlt,
    faClock,
    faEdit,
    faSave,
    faTrash,
    faEye,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { getApiUrl } from '../config/environment';

interface NewsFormData {
    title: string;
    body: string;
    eventDate: string;
    eventTime: string;
}

const NewsAdmin: React.FC = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentNews, setCurrentNews] = useState<NewsFormData | null>(null);
    const [previewMode, setPreviewMode] = useState(false);

    // Check for existing authentication on mount
    React.useEffect(() => {
        const adminAuth = sessionStorage.getItem('adminAuth');
        if (adminAuth === 'Overseer') {
            setAuthenticated(true);
            setMessage('Already authenticated from admin dashboard');
            setTimeout(() => setMessage(''), 3000);
        }
    }, []);
    
    const [formData, setFormData] = useState<NewsFormData>({
        title: '',
        body: '',
        eventDate: '',
        eventTime: ''
    });

    // Authentication
    const handleLogin = () => {
        if (password === 'Overseer') {
            setAuthenticated(true);
            setAuthError('');
            setMessage('Successfully logged in to News Admin');
            setTimeout(() => setMessage(''), 3000);
            fetchCurrentNews();
        } else {
            setAuthError('Invalid password');
            setTimeout(() => setAuthError(''), 3000);
        }
        setPassword('');
    };

    // Fetch current news
    const fetchCurrentNews = async () => {
        try {
            const response = await fetch(getApiUrl('news'), {
                method: 'GET',
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                setCurrentNews(data);
                setFormData({
                    title: data.title || '',
                    body: data.body || '',
                    eventDate: data.eventDate ? new Date(data.eventDate).toISOString().split('T')[0] : '',
                    eventTime: data.eventTime || ''
                });
            }
        } catch (error) {
            console.error('Error fetching current news:', error);
        }
    };

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        console.log(`Form field changed: ${name} = "${value}"`);
        console.log('Target element:', e.target);
        console.log('Current formData before change:', formData);
        
        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: value
            };
            console.log('Setting new form data:', newData);
            console.log('Previous form data was:', prev);
            return newData;
        });
        
        // Force a re-render after a short delay to ensure state is updated
        setTimeout(() => {
            console.log('FormData after timeout:', formData);
        }, 100);
    };


    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Get form data using multiple methods as fallback
        const form = e.target as HTMLFormElement;
        const formDataObj = new FormData(form);
        
        // Try multiple approaches to get the data
        let title = formData.title?.trim() || '';
        let body = formData.body?.trim() || '';
        
        // Fallback to FormData if state is empty
        if (!title) {
            title = (formDataObj.get('title') as string || '').trim();
        }
        if (!body) {
            body = (formDataObj.get('body') as string || '').trim();
        }
        
        const eventDate = formData.eventDate?.trim() || '';
        const eventTime = formData.eventTime?.trim() || '';
        
        console.log('=== FORM SUBMISSION DEBUG ===');
        console.log('Current formData state:', formData);
        console.log('Title from processing:', JSON.stringify(title));
        console.log('Body from processing:', JSON.stringify(body));
        console.log('Title length:', title.length);
        console.log('Body length:', body.length);
        console.log('Title from FormData:', JSON.stringify(formDataObj.get('title')));
        console.log('Body from FormData:', JSON.stringify(formDataObj.get('body')));
        
        // Validation with better error messages
        if (!title || title.length === 0) {
            setMessage('Error: Title is required - Please enter a news title');
            setTimeout(() => setMessage(''), 5000);
            return;
        }
        
        if (!body || body.length === 0) {
            setMessage('Error: Body text is required - Please enter news content');
            setTimeout(() => setMessage(''), 5000);
            return;
        }

        // Check word count for body (max 15 words)
        const wordCount = body.split(/\s+/).filter(word => word.length > 0).length;
        if (wordCount > 15) {
            setMessage(`Error: Body text must be 15 words or less. Currently ${wordCount} words.`);
            setTimeout(() => setMessage(''), 5000);
            return;
        }
        
        setLoading(true);
        
        try {
            const submitData = {
                title: title,
                body: body,
                eventDate: eventDate || null,
                eventTime: eventTime || null
            };

            console.log('=== FINAL SUBMIT DATA ===');
            console.log('Sending to backend:', submitData);

            const response = await fetch(getApiUrl('newsUpdate'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(submitData)
            });

            if (response.ok) {
                setMessage('News updated successfully!');
                setCurrentNews(formData);
                setTimeout(() => setMessage(''), 5000);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update news');
            }
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
            setTimeout(() => setMessage(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    // Clear form
    const clearForm = () => {
        setFormData({
            title: '',
            body: '',
            eventDate: '',
            eventTime: ''
        });
    };

    if (!authenticated) {
        return (
            <>
                <UniversalHeader />
                <div className={styles.container}>
                    <div className={styles.loginCard}>
                        <FontAwesomeIcon icon={faLock} className={styles.lockIcon} />
                        <h2>News Administration</h2>
                        <p>Enter admin password to access news management</p>
                        
                        {authError && (
                            <div className={styles.error}>
                                {authError}
                            </div>
                        )}
                        
                        <div className={styles.inputGroup}>
                            <input
                                type="password"
                                className={styles.passwordInput}
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                            />
                        </div>
                        
                        <button 
                            className={styles.loginButton}
                            onClick={handleLogin}
                        >
                            <FontAwesomeIcon icon={faUnlock} />
                            Access News Admin
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
                  <UniversalHeader />
            <div className={styles.container}>
                <div className={styles.adminHeader}>
                    <h1>
                        <FontAwesomeIcon icon={faNewspaper} />
                        News Administration Panel
                    </h1>
                    <p>Update news and manage events with countdown timers</p>
                </div>

                {message && (
                    <div className={`${styles.message} ${message.includes('Error') ? styles.errorMessage : styles.successMessage}`}>
                        {message}
                    </div>
                )}

                <div className={styles.newsFormCard}>
                    <div className={styles.cardHeader}>
                        <h2>
                            <FontAwesomeIcon icon={faEdit} />
                            Update News Content
                        </h2>
                        <div className={styles.actionButtons}>
                            <button 
                                type="button"
                                onClick={() => setPreviewMode(!previewMode)}
                                className={styles.previewButton}
                            >
                                <FontAwesomeIcon icon={faEye} />
                                {previewMode ? 'Edit Mode' : 'Preview'}
                            </button>
                        </div>
                    </div>

                    {!previewMode ? (
                        <form onSubmit={handleSubmit} className={styles.newsForm}>
                            {/* Title Input */}
                            <div className={styles.formGroup}>
                                <label htmlFor="title">
                                    <FontAwesomeIcon icon={faNewspaper} />
                                    News Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter news title"
                                    className={styles.textInput}
                                />
                            </div>


                            {/* Event Date Input */}
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="eventDate">
                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                        Event Date (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        id="eventDate"
                                        name="eventDate"
                                        value={formData.eventDate}
                                        onChange={handleInputChange}
                                        className={styles.dateInput}
                                    />
                                    <small>Leave empty if this is not an event</small>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="eventTime">
                                        <FontAwesomeIcon icon={faClock} />
                                        Event Time (Optional)
                                    </label>
                                    <input
                                        type="time"
                                        id="eventTime"
                                        name="eventTime"
                                        value={formData.eventTime}
                                        onChange={handleInputChange}
                                        className={styles.timeInput}
                                        disabled={!formData.eventDate}
                                    />
                                    <small>Required for countdown timer</small>
                                </div>
                            </div>

                            {/* News Summary Section */}
                            <div className={styles.sectionDivider}>
                                <h3>News Summary (Appears on main page)</h3>
                                <p>This brief summary will be visible on the main page as a teaser</p>
                            </div>


                            {/* News Body */}
                            <div className={styles.formGroup}>
                                <label htmlFor="body">
                                    <FontAwesomeIcon icon={faEdit} />
                                    Brief News Summary * (Max 15 words for display)
                                </label>
                                <textarea
                                    id="body"
                                    name="body"
                                    value={formData.body}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter a brief summary (max 15 words). This appears as a teaser on the main page."
                                    className={styles.textArea}
                                    rows={3}
                                    maxLength={100}
                                />
                                <div>
                                    <small>This appears as a preview on the main page. Keep it concise!</small>
                                    <div 
                                        className={`${styles.wordCounter} ${
                                            formData.body.trim().split(/\s+/).filter(word => word.length > 0).length > 15 
                                                ? styles.wordCounterError 
                                                : ''
                                        }`}
                                    >
                                        {formData.body.trim().split(/\s+/).filter(word => word.length > 0).length}/15 words used
                                        {formData.body.trim().split(/\s+/).filter(word => word.length > 0).length > 15 && ' - Too many words!'}
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className={styles.formActions}>
                                <button
                                    type="button"
                                    onClick={clearForm}
                                    className={styles.clearButton}
                                    disabled={loading}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                    Clear Form
                                </button>
                                
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={loading}
                                >
                                    <FontAwesomeIcon icon={loading ? faClock : faSave} />
                                    {loading ? 'Publishing...' : 'Publish News'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className={styles.previewSection}>
                            <h3>Preview</h3>
                            <div className={styles.newsPreview}>
                                {formData.eventDate && (
                                    <div className={styles.previewEventInfo}>
                                        <h4>Event Information</h4>
                                        <p>Date: {new Date(formData.eventDate).toLocaleDateString()}</p>
                                        {formData.eventTime && <p>Time: {formData.eventTime}</p>}
                                    </div>
                                )}
                                
                                
                                <div className={styles.previewContent}>
                                    <h2>{formData.title || 'News Title'}</h2>
                                    <div className={styles.previewBody}>
                                        {formData.body ? formData.body.split('\n').map((paragraph, index) => (
                                            <p key={index}>{paragraph}</p>
                                        )) : <p>No content available</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Current News Display */}
                {currentNews && (
                    <div className={styles.currentNewsCard}>
                        <h3>
                            <FontAwesomeIcon icon={faCheckCircle} />
                            Currently Published News
                        </h3>
                        <div className={styles.currentNewsContent}>
                            <h4>{currentNews.title || 'No title available'}</h4>
                            <p>{currentNews.body || 'No content available'}</p>
                            {currentNews.eventDate && (
                                <div className={styles.currentEventInfo}>
                                    Event: {new Date(currentNews.eventDate).toLocaleDateString()}
                                    {currentNews.eventTime && ` at ${currentNews.eventTime}`}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default NewsAdmin;