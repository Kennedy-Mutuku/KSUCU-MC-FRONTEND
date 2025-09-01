import React, { useState, useRef } from 'react';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import styles from '../styles/NewsAdmin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faLock, 
    faUnlock,
    faNewspaper,
    faImage,
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
    summary: string;
    body: string;
    imageUrl: string;
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [formData, setFormData] = useState<NewsFormData>({
        title: '',
        summary: '',
        body: '',
        imageUrl: '',
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
                    summary: data.summary || '',
                    body: data.body || '',
                    imageUrl: data.imageUrl || '',
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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    imageUrl: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const submitData = {
                title: formData.title,
                summary: formData.summary,
                body: formData.body,
                imageUrl: formData.imageUrl,
                eventDate: formData.eventDate || null,
                eventTime: formData.eventTime || null
            };

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
            summary: '',
            body: '',
            imageUrl: '',
            eventDate: '',
            eventTime: ''
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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
                    <p>Update news, manage events with countdown timers, and add photos</p>
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

                            {/* News Summary - Shows in modal */}
                            <div className={styles.formGroup}>
                                <label htmlFor="summary">
                                    <FontAwesomeIcon icon={faEdit} />
                                    News Summary * (Modal Preview)
                                </label>
                                <textarea
                                    id="summary"
                                    name="summary"
                                    value={formData.summary}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Brief summary for modal preview (max 120 characters recommended)"
                                    className={styles.textArea}
                                    rows={2}
                                    maxLength={150}
                                />
                                <small>This text appears in the modal countdown page. Keep it brief!</small>
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

                            {/* Full News Section */}
                            <div className={styles.sectionDivider}>
                                <h3>Full News Content (Appears on /news page only)</h3>
                                <p>This content will only be visible when users click "Read Full Communication"</p>
                            </div>

                            {/* Image Upload */}
                            <div className={styles.formGroup}>
                                <label>
                                    <FontAwesomeIcon icon={faImage} />
                                    News Image (For Full Page Only)
                                </label>
                                <div className={styles.imageUploadSection}>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        className={styles.fileInput}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className={styles.uploadButton}
                                    >
                                        <FontAwesomeIcon icon={faImage} />
                                        Choose Image
                                    </button>
                                </div>
                                {formData.imageUrl && (
                                    <div className={styles.imagePreview}>
                                        <img src={formData.imageUrl} alt="Preview" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, imageUrl: '' }));
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                            className={styles.removeImageButton}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                )}
                                <small>Images will only appear on the full news page, not in the modal</small>
                            </div>

                            {/* News Body */}
                            <div className={styles.formGroup}>
                                <label htmlFor="body">
                                    <FontAwesomeIcon icon={faEdit} />
                                    Full News Content *
                                </label>
                                <textarea
                                    id="body"
                                    name="body"
                                    value={formData.body}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter the complete news content here. This will only appear on the full news page. Use line breaks to separate paragraphs."
                                    className={styles.textArea}
                                    rows={8}
                                />
                                <small>This content appears only on the full news page when users click "Read Full Communication"</small>
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
                                
                                {formData.imageUrl && (
                                    <div className={styles.previewImage}>
                                        <img src={formData.imageUrl} alt="News" />
                                    </div>
                                )}
                                
                                <div className={styles.previewContent}>
                                    <h2>{formData.title || 'News Title'}</h2>
                                    <div className={styles.previewBody}>
                                        {formData.body.split('\n').map((paragraph, index) => (
                                            <p key={index}>{paragraph}</p>
                                        ))}
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
                            <h4>{currentNews.title}</h4>
                            <p>{currentNews.body.substring(0, 100)}...</p>
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