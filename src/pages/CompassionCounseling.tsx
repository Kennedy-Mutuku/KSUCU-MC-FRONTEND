import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../config/environment';
import styles from '../styles/compassionCounseling.module.css';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import { Heart, Phone, MessageCircle, DollarSign, User, Mail, MapPin, Bell, CheckCircle, Eye, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaymentMethod {
  _id?: string;
  name: string;
  type: string;
  details: Array<{
    label: string;
    value: string;
  }>;
  isActive: boolean;
}

interface ContactInfo {
  _id?: string;
  type: string;
  title: string;
  value: string;
  description?: string;
  isActive: boolean;
  priority: number;
}

interface Settings {
  paymentMethods: PaymentMethod[];
  contactInfo: ContactInfo[];
}


interface User {
  _id: string;
  username: string;
  email: string;
  yos: number;
  phone: string;
  et: string;
  ministry: string;
  course?: string;
  reg?: string;
}

interface UserRequest {
  _id: string;
  userId: string;
  type: 'help' | 'donation';
  data: any;
  status: 'pending' | 'viewed' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  createdAt: string;
}

const CompassionCounselingPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<'help' | 'donate'>('help');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [settings, setSettings] = useState<Settings>({
    paymentMethods: [],
    contactInfo: []
  });
  const [userRequests, setUserRequests] = useState<UserRequest[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  
  const [helpRequest, setHelpRequest] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    helpType: 'material',
    urgency: 'medium',
    description: '',
    preferredContact: 'phone'
  });

  const [donation, setDonation] = useState({
    donorName: '',
    email: '',
    phone: '',
    amount: '',
    donationType: 'monetary',
    message: '',
    anonymous: false
  });

  useEffect(() => {
    checkUserAuthentication();
  }, []);

  useEffect(() => {
    if (user) {
      fetchSettings();
      fetchUserRequests();

      // Set up auto-refresh every 30 seconds for user requests
      const refreshInterval = setInterval(() => {
        fetchUserRequests(true); // Show refresh indicator for auto-refresh
      }, 30000);

      // Cleanup interval on component unmount or user change
      return () => clearInterval(refreshInterval);
    }
  }, [user]);

  const checkUserAuthentication = async (retryCount = 0) => {
    console.log('🔍 CompassionCounseling: Checking user authentication...');
    try {
      const apiUrl = getApiUrl('users');
      const response = await fetch(`${apiUrl}?t=${Date.now()}`, {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });

      console.log('🔍 CompassionCounseling: Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ CompassionCounseling: User authenticated, data:', data);
        setUser(data);
      } else {
        console.log('❌ CompassionCounseling: User not authenticated');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ CompassionCounseling: Authentication check failed:', error);
      
      if (retryCount < 2) {
        console.log(`🔄 Retrying authentication check (attempt ${retryCount + 1}/3)...`);
        setTimeout(() => checkUserAuthentication(retryCount + 1), 2000);
        return;
      }
      
      setUser(null);
    } finally {
      console.log('🔍 CompassionCounseling: Authentication check completed');
      setCheckingAuth(false);
    }
  };

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Show login required message if not authenticated
  if (!user) {
    return (
      <div className={styles.authRequiredContainer}>
        <div className={styles.authRequiredContent}>
          <Heart className={styles.authIcon} />
          <h2>Login Required</h2>
          <p>
            You must be logged in to access the Compassion & Counseling Ministry page.
            This helps us provide personalized support and track your requests.
          </p>
          <button 
            onClick={() => navigate('/signIn')}
            className={styles.loginButton}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const fetchUserRequests = async (showRefreshIndicator = false) => {
    try {
      if (!user?._id) {
        console.log('No user ID available for fetching requests');
        return;
      }

      if (showRefreshIndicator) {
        setIsRefreshing(true);
      }

      const response = await fetch(getApiUrl('compassionRequests', `userId=${user._id}`), {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserRequests(data.requests || []);
        setLastRefresh(new Date());
        console.log('User requests fetched:', data.requests?.length || 0);
      } else {
        console.error('Failed to fetch user requests:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user requests:', error);
    } finally {
      if (showRefreshIndicator) {
        setIsRefreshing(false);
      }
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch(getApiUrl('compassionSettings'), {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      } else {
        console.error('Failed to fetch settings');
        // Keep default empty arrays if fetch fails
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Keep default empty arrays if fetch fails
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleHelpRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(getApiUrl('compassionHelp'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...helpRequest,
          userId: user?._id,
          userEmail: user?.email,
          userName: user?.username,
          submittedAt: new Date().toISOString(),
          status: 'pending'
        })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('Your help request has been submitted successfully. Our compassion team will contact you soon.', 'success');
        fetchUserRequests(true); // Refresh requests list with indicator
        setHelpRequest({
          name: '',
          email: '',
          phone: '',
          location: '',
          helpType: 'material',
          urgency: 'medium',
          description: '',
          preferredContact: 'phone'
        });
      } else {
        throw new Error(data.message || 'Failed to submit help request');
      }
    } catch (error: any) {
      console.error('Error submitting help request:', error);
      showMessage(error.message || 'Failed to submit help request. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(getApiUrl('compassionDonation'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...donation,
          userId: user?._id,
          userEmail: user?.email,
          userName: user?.username,
          submittedAt: new Date().toISOString(),
          status: 'pending'
        })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('Thank you for your generous donation! Your contribution will help us serve those in need.', 'success');
        fetchUserRequests(true); // Refresh requests list with indicator
        setDonation({
          donorName: '',
          email: '',
          phone: '',
          amount: '',
          donationType: 'monetary',
          message: '',
          anonymous: false
        });
      } else {
        throw new Error(data.message || 'Failed to process donation');
      }
    } catch (error: any) {
      console.error('Error processing donation:', error);
      showMessage(error.message || 'Failed to process donation. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <UniversalHeader />
      <div className={styles.container}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <Heart className={styles.heroIcon} />
            <h1 className={styles.title}>Compassion & Counseling Ministry</h1>
            <p className={styles.subtitle}>
              Extending God's love through practical support and spiritual care
            </p>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </div>
        )}

        {/* Notifications Panel */}
        <div className={styles.notificationBar}>
          <button 
            className={styles.notificationButton}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className={`${styles.notificationIcon} ${isRefreshing ? styles.refreshing : ''}`} />
            <span>My Requests</span>
            {userRequests.length > 0 && (
              <span className={styles.notificationBadge}>{userRequests.length}</span>
            )}
            {isRefreshing && (
              <div className={styles.refreshIndicator}>●</div>
            )}
          </button>
        </div>

        {showNotifications && (
          <div className={styles.notificationsPanel}>
            <div className={styles.notificationHeader}>
              <div>
                <h3>Your Request History</h3>
                {lastRefresh && (
                  <small className={styles.lastRefresh}>
                    Last updated: {lastRefresh.toLocaleTimeString()}
                  </small>
                )}
              </div>
              <button 
                className={styles.refreshButton}
                onClick={() => fetchUserRequests(true)}
                disabled={isRefreshing}
                title="Refresh requests"
              >
                <Bell className={`${styles.refreshIcon} ${isRefreshing ? styles.spinning : ''}`} size={16} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            {userRequests.length === 0 ? (
              <p className={styles.noRequests}>No requests submitted yet</p>
            ) : (
              <div className={styles.requestsList}>
                {userRequests.map((request) => (
                  <div key={request._id} className={styles.requestItem}>
                    <div className={styles.requestHeader}>
                      <span className={styles.requestType}>
                        {request.type === 'help' ? 'Help Request' : 'Donation'}
                      </span>
                      <span className={styles.requestDate}>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={styles.requestStatus}>
                      <div className={`${styles.statusBadge} ${styles[request.status]}`}>
                        {request.status === 'pending' && <Clock size={14} />}
                        {request.status === 'viewed' && <Eye size={14} />}
                        {request.status === 'approved' && <CheckCircle size={14} />}
                        <span>{request.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className={styles.tabNavigation}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'help' ? styles.active : ''}`}
            onClick={() => setActiveTab('help')}
            aria-label="Request Help"
          >
            <MessageCircle className={styles.tabIcon} />
            <span>Request Help</span>
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'donate' ? styles.active : ''}`}
            onClick={() => setActiveTab('donate')}
            aria-label="Make a Donation"
          >
            <DollarSign className={styles.tabIcon} />
            <span>Make a Donation</span>
          </button>
        </div>

        {/* Help Request Tab */}
        {activeTab === 'help' && (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h2>Request Support</h2>
              <p>
                We're here to help you through difficult times. Whether you need material assistance, 
                counseling, or spiritual support, our compassion team is ready to serve.
              </p>
            </div>

            <form onSubmit={handleHelpRequest} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">
                    <User className={styles.inputIcon} />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={helpRequest.name}
                    onChange={(e) => setHelpRequest(prev => ({...prev, name: e.target.value}))}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">
                    <Mail className={styles.inputIcon} />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={helpRequest.email}
                    onChange={(e) => setHelpRequest(prev => ({...prev, email: e.target.value}))}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">
                    <Phone className={styles.inputIcon} />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={helpRequest.phone}
                    onChange={(e) => setHelpRequest(prev => ({...prev, phone: e.target.value}))}
                    required
                    placeholder="+254712345678"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="location">
                    <MapPin className={styles.inputIcon} />
                    Location/Address *
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={helpRequest.location}
                    onChange={(e) => setHelpRequest(prev => ({...prev, location: e.target.value}))}
                    required
                    placeholder="Your location or address"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="helpType">Type of Help Needed *</label>
                  <select
                    id="helpType"
                    value={helpRequest.helpType}
                    onChange={(e) => setHelpRequest(prev => ({...prev, helpType: e.target.value}))}
                    required
                  >
                    <option value="material">Material Assistance (Food, Clothing, etc.)</option>
                    <option value="financial">Financial Support</option>
                    <option value="counseling">Counseling & Emotional Support</option>
                    <option value="spiritual">Spiritual Guidance & Prayer</option>
                    <option value="medical">Medical Assistance</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="urgency">Urgency Level *</label>
                  <select
                    id="urgency"
                    value={helpRequest.urgency}
                    onChange={(e) => setHelpRequest(prev => ({...prev, urgency: e.target.value}))}
                    required
                  >
                    <option value="low">Low - Can wait a few days</option>
                    <option value="medium">Medium - Within 24-48 hours</option>
                    <option value="high">High - Urgent, same day</option>
                    <option value="emergency">Emergency - Immediate attention</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="preferredContact">Preferred Contact Method *</label>
                <select
                  id="preferredContact"
                  value={helpRequest.preferredContact}
                  onChange={(e) => setHelpRequest(prev => ({...prev, preferredContact: e.target.value}))}
                  required
                >
                  <option value="phone">Phone Call</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                  <option value="visit">Home Visit</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Describe Your Situation *</label>
                <textarea
                  id="description"
                  value={helpRequest.description}
                  onChange={(e) => setHelpRequest(prev => ({...prev, description: e.target.value}))}
                  required
                  rows={4}
                  placeholder="Please provide details about your situation and specific needs..."
                />
              </div>

              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Help Request'}
              </button>
            </form>
          </div>
        )}

        {/* Donation Tab */}
        {activeTab === 'donate' && (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h2>Support Our Ministry</h2>
              <p>
                Your generous donations help us provide essential support to those in need. 
                Every contribution, no matter the size, makes a meaningful difference in someone's life.
              </p>
            </div>

            <form onSubmit={handleDonation} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="donorName">
                    <User className={styles.inputIcon} />
                    Full Name {!donation.anonymous && '*'}
                  </label>
                  <input
                    type="text"
                    id="donorName"
                    value={donation.donorName}
                    onChange={(e) => setDonation(prev => ({...prev, donorName: e.target.value}))}
                    required={!donation.anonymous}
                    placeholder="Enter your full name"
                    disabled={donation.anonymous}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="donorEmail">
                    <Mail className={styles.inputIcon} />
                    Email Address {!donation.anonymous && '*'}
                  </label>
                  <input
                    type="email"
                    id="donorEmail"
                    value={donation.email}
                    onChange={(e) => setDonation(prev => ({...prev, email: e.target.value}))}
                    required={!donation.anonymous}
                    placeholder="your.email@example.com"
                    disabled={donation.anonymous}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="donorPhone">
                    <Phone className={styles.inputIcon} />
                    Phone Number {!donation.anonymous && '*'}
                  </label>
                  <input
                    type="tel"
                    id="donorPhone"
                    value={donation.phone}
                    onChange={(e) => setDonation(prev => ({...prev, phone: e.target.value}))}
                    required={!donation.anonymous}
                    placeholder="+254712345678"
                    disabled={donation.anonymous}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="donationType">Donation Type *</label>
                  <select
                    id="donationType"
                    value={donation.donationType}
                    onChange={(e) => setDonation(prev => ({...prev, donationType: e.target.value}))}
                    required
                  >
                    <option value="monetary">Monetary Donation</option>
                    <option value="food">Food Items</option>
                    <option value="clothing">Clothing</option>
                    <option value="medical">Medical Supplies</option>
                    <option value="other">Other Items</option>
                  </select>
                </div>
              </div>

              {donation.donationType === 'monetary' && (
                <div className={styles.formGroup}>
                  <label htmlFor="amount">
                    <DollarSign className={styles.inputIcon} />
                    Amount (KSh) *
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={donation.amount}
                    onChange={(e) => setDonation(prev => ({...prev, amount: e.target.value}))}
                    required
                    min="1"
                    placeholder="Enter amount in KSh"
                  />
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="donationMessage">Message (Optional)</label>
                <textarea
                  id="donationMessage"
                  value={donation.message}
                  onChange={(e) => setDonation(prev => ({...prev, message: e.target.value}))}
                  rows={3}
                  placeholder="Share your thoughts or specify how you'd like your donation to be used..."
                />
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={donation.anonymous}
                    onChange={(e) => setDonation(prev => ({...prev, anonymous: e.target.checked}))}
                  />
                  <span className={styles.checkmark}></span>
                  Make this donation anonymous
                </label>
              </div>

              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'Processing...' : 'Submit Donation'}
              </button>
            </form>

            {/* Payment Information */}
            {settings.paymentMethods.length > 0 && (
              <div className={styles.paymentInfo}>
                <h3>Payment Methods</h3>
                <div className={styles.paymentMethods}>
                  {settings.paymentMethods.map((method, index) => (
                    <div key={method._id || index} className={styles.paymentMethod}>
                      <h4>{method.name}</h4>
                      {method.details.map((detail, detailIndex) => (
                        <p key={detailIndex}>
                          {detail.label}: <strong>{detail.value}</strong>
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Information Section */}
        <div className={styles.infoSection}>
          <h2>How We Help</h2>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <Heart className={styles.serviceIcon} />
              <h3>Material Support</h3>
              <p>Food assistance, clothing, household items, and basic necessities for those in need.</p>
            </div>
            <div className={styles.serviceCard}>
              <MessageCircle className={styles.serviceIcon} />
              <h3>Counseling Services</h3>
              <p>Professional counseling, emotional support, and spiritual guidance during difficult times.</p>
            </div>
            <div className={styles.serviceCard}>
              <Phone className={styles.serviceIcon} />
              <h3>24/7 Support</h3>
              <p>Emergency response team available for urgent situations and crisis intervention.</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        {settings.contactInfo.length > 0 && (
          <div className={styles.contactSection}>
            <h2>Contact Our Team</h2>
            <div className={styles.contactInfo}>
              {settings.contactInfo.map((contact, index) => {
                const IconComponent = contact.type === 'phone' ? Phone : 
                                   contact.type === 'email' ? Mail : 
                                   MapPin;
                
                return (
                  <div key={contact._id || index} className={styles.contactItem}>
                    <IconComponent className={styles.contactIcon} />
                    <div>
                      <h4>{contact.title}</h4>
                      <p>{contact.value}</p>
                      {contact.description && <small>{contact.description}</small>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CompassionCounselingPage;