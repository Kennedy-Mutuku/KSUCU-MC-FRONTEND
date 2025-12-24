import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../config/environment';
import styles from '../styles/compassionAdmin.module.css';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import { 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Eye, 
  Filter,
  Search,
  MessageCircle,
  DollarSign,
  User
} from 'lucide-react';

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

interface HelpRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  helpType: string;
  urgency: string;
  description: string;
  preferredContact: string;
  submittedAt: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'declined';
  assignedTo?: string;
  notes?: string;
  lastUpdated?: string;
}

interface Donation {
  _id: string;
  donorName: string;
  email: string;
  phone: string;
  amount?: string;
  donationType: string;
  message?: string;
  anonymous: boolean;
  submittedAt: string;
  status: 'pending' | 'confirmed' | 'received';
  notes?: string;
}

const CompassionCounselingAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'donations' | 'settings'>('requests');
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [settings, setSettings] = useState<Settings>({
    paymentMethods: [],
    contactInfo: []
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [showAddContactForm, setShowAddContactForm] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    name: '',
    type: 'mobile_money' as 'mobile_money' | 'bank' | 'other',
    details: [{ label: '', value: '' }]
  });
  const [newContactInfo, setNewContactInfo] = useState({
    type: 'phone' as 'phone' | 'email' | 'office',
    title: '',
    value: '',
    description: ''
  });

  useEffect(() => {
    fetchHelpRequests();
    fetchDonations();
    fetchSettings();
  }, []);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const fetchHelpRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('compassionHelpAdmin'), {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setHelpRequests(data.requests || []);
      } else {
        throw new Error('Failed to fetch help requests');
      }
    } catch (error: any) {
      console.error('Error fetching help requests:', error);
      showMessage('Failed to load help requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchDonations = async () => {
    try {
      const response = await fetch(getApiUrl('compassionDonationAdmin'), {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setDonations(data.donations || []);
      } else {
        throw new Error('Failed to fetch donations');
      }
    } catch (error: any) {
      console.error('Error fetching donations:', error);
      showMessage('Failed to load donations', 'error');
    }
  };

  const fetchSettings = async () => {
    try {
      setSettingsLoading(true);
      const response = await fetch(getApiUrl('compassionAdminSettings'), {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      } else {
        throw new Error('Failed to fetch settings');
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      showMessage('Failed to load settings', 'error');
    } finally {
      setSettingsLoading(false);
    }
  };

  const updatePaymentMethods = async (paymentMethods: PaymentMethod[]) => {
    try {
      setSettingsLoading(true);
      const response = await fetch(getApiUrl('compassionUpdatePaymentMethods'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ paymentMethods })
      });

      if (response.ok) {
        await fetchSettings();
        showMessage('Payment methods updated successfully', 'success');
      } else {
        throw new Error('Failed to update payment methods');
      }
    } catch (error: any) {
      console.error('Error updating payment methods:', error);
      showMessage('Failed to update payment methods', 'error');
    } finally {
      setSettingsLoading(false);
    }
  };

  const updateContactInfo = async (contactInfo: ContactInfo[]) => {
    try {
      setSettingsLoading(true);
      const response = await fetch(getApiUrl('compassionUpdateContactInfo'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ contactInfo })
      });

      if (response.ok) {
        await fetchSettings();
        showMessage('Contact information updated successfully', 'success');
      } else {
        throw new Error('Failed to update contact information');
      }
    } catch (error: any) {
      console.error('Error updating contact info:', error);
      showMessage('Failed to update contact information', 'error');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    try {
      if (!newPaymentMethod.name.trim() || newPaymentMethod.details.some(d => !d.label.trim() || !d.value.trim())) {
        showMessage('Please fill in all payment method fields', 'error');
        return;
      }

      setSettingsLoading(true);
      const response = await fetch(getApiUrl('compassionAddPaymentMethod'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: newPaymentMethod.name,
          type: newPaymentMethod.type,
          details: newPaymentMethod.details
        })
      });

      if (response.ok) {
        await fetchSettings();
        showMessage('Payment method added successfully', 'success');
        setShowAddPaymentForm(false);
        setNewPaymentMethod({
          name: '',
          type: 'mobile_money',
          details: [{ label: '', value: '' }]
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add payment method');
      }
    } catch (error: any) {
      console.error('Error adding payment method:', error);
      showMessage(`Failed to add payment method: ${error.message}`, 'error');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleAddContactInfo = async () => {
    try {
      if (!newContactInfo.title.trim() || !newContactInfo.value.trim()) {
        showMessage('Please fill in title and value fields', 'error');
        return;
      }

      setSettingsLoading(true);
      const response = await fetch(getApiUrl('compassionAddContactInfo'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: newContactInfo.type,
          title: newContactInfo.title,
          value: newContactInfo.value,
          description: newContactInfo.description,
          priority: settings.contactInfo.length + 1
        })
      });

      if (response.ok) {
        await fetchSettings();
        showMessage('Contact information added successfully', 'success');
        setShowAddContactForm(false);
        setNewContactInfo({
          type: 'phone',
          title: '',
          value: '',
          description: ''
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add contact');
      }
    } catch (error: any) {
      console.error('Error adding contact:', error);
      showMessage(`Failed to add contact: ${error.message}`, 'error');
    } finally {
      setSettingsLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: string, notes?: string) => {
    try {
      const response = await fetch(getApiUrl('compassionHelpUpdate'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          requestId,
          status,
          notes,
          lastUpdated: new Date().toISOString()
        })
      });

      if (response.ok) {
        await fetchHelpRequests();
        showMessage('Request status updated successfully', 'success');
        setShowModal(false);
      } else {
        throw new Error('Failed to update request status');
      }
    } catch (error: any) {
      console.error('Error updating request:', error);
      showMessage('Failed to update request status', 'error');
    }
  };

  const updateDonationStatus = async (donationId: string, status: string, notes?: string) => {
    try {
      const response = await fetch(getApiUrl('compassionDonationUpdate'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          donationId,
          status,
          notes
        })
      });

      if (response.ok) {
        await fetchDonations();
        showMessage('Donation status updated successfully', 'success');
        setShowModal(false);
      } else {
        throw new Error('Failed to update donation status');
      }
    } catch (error: any) {
      console.error('Error updating donation:', error);
      showMessage('Failed to update donation status', 'error');
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'in_progress': return '#17a2b8';
      case 'resolved': return '#28a745';
      case 'confirmed': return '#28a745';
      case 'received': return '#007bff';
      case 'declined': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const filteredRequests = helpRequests.filter(request => {
    const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || request.urgency === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const RequestModal = () => {
    if (!selectedRequest) return null;
    
    return (
      <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h3>Help Request Details</h3>
            <button onClick={() => setShowModal(false)}>×</button>
          </div>
          
          <div className={styles.modalBody}>
            <div className={styles.requestDetails}>
              <div className={styles.detailItem}>
                <User className={styles.icon} />
                <div>
                  <strong>Name:</strong> {selectedRequest.name}
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <Mail className={styles.icon} />
                <div>
                  <strong>Email:</strong> {selectedRequest.email}
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <Phone className={styles.icon} />
                <div>
                  <strong>Phone:</strong> {selectedRequest.phone}
                  <button 
                    className={styles.callButton}
                    onClick={() => window.open(`tel:${selectedRequest.phone}`)}
                  >
                    Call Now
                  </button>
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <MapPin className={styles.icon} />
                <div>
                  <strong>Location:</strong> {selectedRequest.location}
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <Heart className={styles.icon} />
                <div>
                  <strong>Help Type:</strong> {selectedRequest.helpType}
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <AlertTriangle className={styles.icon} />
                <div>
                  <strong>Urgency:</strong> 
                  <span 
                    className={styles.urgencyBadge}
                    style={{ backgroundColor: getUrgencyColor(selectedRequest.urgency) }}
                  >
                    {selectedRequest.urgency}
                  </span>
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <MessageCircle className={styles.icon} />
                <div>
                  <strong>Preferred Contact:</strong> {selectedRequest.preferredContact}
                </div>
              </div>
              
              <div className={styles.descriptionSection}>
                <strong>Description:</strong>
                <p>{selectedRequest.description}</p>
              </div>
              
              <div className={styles.statusActions}>
                <strong>Update Status:</strong>
                <div className={styles.statusButtons}>
                  <button 
                    className={styles.statusButton}
                    style={{ backgroundColor: '#17a2b8' }}
                    onClick={() => updateRequestStatus(selectedRequest._id, 'in_progress')}
                  >
                    Mark In Progress
                  </button>
                  <button 
                    className={styles.statusButton}
                    style={{ backgroundColor: '#28a745' }}
                    onClick={() => updateRequestStatus(selectedRequest._id, 'resolved')}
                  >
                    Mark Resolved
                  </button>
                  <button 
                    className={styles.statusButton}
                    style={{ backgroundColor: '#dc3545' }}
                    onClick={() => updateRequestStatus(selectedRequest._id, 'declined')}
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DonationModal = () => {
    if (!selectedDonation) return null;
    
    return (
      <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h3>Donation Details</h3>
            <button onClick={() => setShowModal(false)}>×</button>
          </div>
          
          <div className={styles.modalBody}>
            <div className={styles.requestDetails}>
              <div className={styles.detailItem}>
                <User className={styles.icon} />
                <div>
                  <strong>Donor:</strong> {selectedDonation.anonymous ? 'Anonymous' : selectedDonation.donorName}
                </div>
              </div>
              
              {!selectedDonation.anonymous && (
                <>
                  <div className={styles.detailItem}>
                    <Mail className={styles.icon} />
                    <div>
                      <strong>Email:</strong> {selectedDonation.email}
                    </div>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <Phone className={styles.icon} />
                    <div>
                      <strong>Phone:</strong> {selectedDonation.phone}
                      <button 
                        className={styles.callButton}
                        onClick={() => window.open(`tel:${selectedDonation.phone}`)}
                      >
                        Call Now
                      </button>
                    </div>
                  </div>
                </>
              )}
              
              <div className={styles.detailItem}>
                <DollarSign className={styles.icon} />
                <div>
                  <strong>Type:</strong> {selectedDonation.donationType}
                  {selectedDonation.amount && (
                    <span> - KSh {selectedDonation.amount}</span>
                  )}
                </div>
              </div>
              
              {selectedDonation.message && (
                <div className={styles.descriptionSection}>
                  <strong>Message:</strong>
                  <p>{selectedDonation.message}</p>
                </div>
              )}
              
              <div className={styles.statusActions}>
                <strong>Update Status:</strong>
                <div className={styles.statusButtons}>
                  <button 
                    className={styles.statusButton}
                    style={{ backgroundColor: '#28a745' }}
                    onClick={() => updateDonationStatus(selectedDonation._id, 'confirmed')}
                  >
                    Confirm
                  </button>
                  <button 
                    className={styles.statusButton}
                    style={{ backgroundColor: '#007bff' }}
                    onClick={() => updateDonationStatus(selectedDonation._id, 'received')}
                  >
                    Mark Received
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <UniversalHeader />
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <Heart className={styles.headerIcon} />
          <h1>Compassion & Counseling Admin</h1>
          <p>Manage help requests and donations</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </div>
        )}

        {/* Tab Navigation */}
        <div className={styles.tabNavigation}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'requests' ? styles.active : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <MessageCircle className={styles.tabIcon} />
            Help Requests ({helpRequests.length})
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'donations' ? styles.active : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            <DollarSign className={styles.tabIcon} />
            Donations ({donations.length})
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'settings' ? styles.active : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Filter className={styles.tabIcon} />
            Settings
          </button>
        </div>

        {/* Filters */}
        <div className={styles.filtersSection}>
          <div className={styles.searchFilter}>
            <Search className={styles.filterIcon} />
            <input
              type="text"
              placeholder="Search by name, phone, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.statusFilter}>
            <Filter className={styles.filterIcon} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="confirmed">Confirmed</option>
              <option value="received">Received</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          {activeTab === 'requests' && (
            <div className={styles.urgencyFilter}>
              <AlertTriangle className={styles.filterIcon} />
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
              >
                <option value="all">All Urgency</option>
                <option value="emergency">Emergency</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          )}
        </div>

        {/* Content */}
        {activeTab === 'requests' ? (
          <div className={styles.requestsList}>
            <h2>Help Requests</h2>
            {loading ? (
              <div className={styles.loading}>Loading requests...</div>
            ) : filteredRequests.length === 0 ? (
              <div className={styles.emptyState}>No help requests found</div>
            ) : (
              <div className={styles.requestsGrid}>
                {filteredRequests.map((request) => (
                  <div key={request._id} className={styles.requestCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.urgencyIndicator}>
                        <AlertTriangle 
                          style={{ color: getUrgencyColor(request.urgency) }}
                          className={styles.urgencyIcon}
                        />
                        <span>{request.urgency}</span>
                      </div>
                      <div 
                        className={styles.statusBadge}
                        style={{ backgroundColor: getStatusColor(request.status) }}
                      >
                        {request.status}
                      </div>
                    </div>
                    
                    <div className={styles.cardBody}>
                      <h3>{request.name}</h3>
                      <p className={styles.helpType}>{request.helpType}</p>
                      <p className={styles.description}>
                        {request.description.length > 100 
                          ? `${request.description.substring(0, 100)}...`
                          : request.description
                        }
                      </p>
                      
                      <div className={styles.contactInfo}>
                        <div className={styles.contactItem}>
                          <Phone className={styles.contactIcon} />
                          <span>{request.phone}</span>
                        </div>
                        <div className={styles.contactItem}>
                          <MapPin className={styles.contactIcon} />
                          <span>{request.location}</span>
                        </div>
                      </div>
                      
                      <div className={styles.timestamp}>
                        <Calendar className={styles.timestampIcon} />
                        <span>{new Date(request.submittedAt).toLocaleDateString()}</span>
                        <Clock className={styles.timestampIcon} />
                        <span>{new Date(request.submittedAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    
                    <div className={styles.cardActions}>
                      <button 
                        className={styles.viewButton}
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowModal(true);
                        }}
                      >
                        <Eye className={styles.buttonIcon} />
                        View Details
                      </button>
                      <button 
                        className={styles.callButton}
                        onClick={() => window.open(`tel:${request.phone}`)}
                      >
                        <Phone className={styles.buttonIcon} />
                        Call
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.donationsList}>
            <h2>Donations</h2>
            {loading ? (
              <div className={styles.loading}>Loading donations...</div>
            ) : filteredDonations.length === 0 ? (
              <div className={styles.emptyState}>No donations found</div>
            ) : (
              <div className={styles.donationsGrid}>
                {filteredDonations.map((donation) => (
                  <div key={donation._id} className={styles.donationCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.donationType}>
                        <DollarSign className={styles.donationIcon} />
                        <span>{donation.donationType}</span>
                      </div>
                      <div 
                        className={styles.statusBadge}
                        style={{ backgroundColor: getStatusColor(donation.status) }}
                      >
                        {donation.status}
                      </div>
                    </div>
                    
                    <div className={styles.cardBody}>
                      <h3>{donation.anonymous ? 'Anonymous Donor' : donation.donorName}</h3>
                      {donation.amount && (
                        <p className={styles.amount}>KSh {donation.amount}</p>
                      )}
                      {donation.message && (
                        <p className={styles.message}>
                          {donation.message.length > 100 
                            ? `${donation.message.substring(0, 100)}...`
                            : donation.message
                          }
                        </p>
                      )}
                      
                      {!donation.anonymous && (
                        <div className={styles.contactInfo}>
                          <div className={styles.contactItem}>
                            <Mail className={styles.contactIcon} />
                            <span>{donation.email}</span>
                          </div>
                          <div className={styles.contactItem}>
                            <Phone className={styles.contactIcon} />
                            <span>{donation.phone}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className={styles.timestamp}>
                        <Calendar className={styles.timestampIcon} />
                        <span>{new Date(donation.submittedAt).toLocaleDateString()}</span>
                        <Clock className={styles.timestampIcon} />
                        <span>{new Date(donation.submittedAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    
                    <div className={styles.cardActions}>
                      <button 
                        className={styles.viewButton}
                        onClick={() => {
                          setSelectedDonation(donation);
                          setShowModal(true);
                        }}
                      >
                        <Eye className={styles.buttonIcon} />
                        View Details
                      </button>
                      {!donation.anonymous && (
                        <button 
                          className={styles.callButton}
                          onClick={() => window.open(`tel:${donation.phone}`)}
                        >
                          <Phone className={styles.buttonIcon} />
                          Call
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className={styles.settingsContainer}>
            <h2>Payment Methods & Contact Information</h2>
            
            {settingsLoading ? (
              <div className={styles.loading}>Loading settings...</div>
            ) : (
              <div className={styles.settingsGrid}>
                
                {/* Payment Methods Section */}
                <div className={styles.settingsSection}>
                  <h3>Payment Methods</h3>
                  <div className={styles.settingsItems}>
                    {settings.paymentMethods.map((method, index) => (
                      <div key={method._id || index} className={styles.settingItem}>
                        <div className={styles.settingHeader}>
                          <h4>{method.name}</h4>
                          <span className={`${styles.statusBadge} ${method.isActive ? styles.active : styles.inactive}`}>
                            {method.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className={styles.settingDetails}>
                          {method.details.map((detail, detailIndex) => (
                            <p key={detailIndex}>
                              <strong>{detail.label}:</strong> {detail.value}
                            </p>
                          ))}
                        </div>
                        <div className={styles.settingActions}>
                          <button 
                            className={styles.toggleButton}
                            onClick={() => {
                              const updatedMethods = [...settings.paymentMethods];
                              updatedMethods[index].isActive = !updatedMethods[index].isActive;
                              updatePaymentMethods(updatedMethods);
                            }}
                          >
                            {method.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className={styles.addMethodSection}>
                    <h4>Add New Payment Method</h4>
                    {!showAddPaymentForm ? (
                      <div className={styles.quickAddButtons}>
                        <button 
                          className={styles.quickAddButton}
                          onClick={() => {
                            setNewPaymentMethod({
                              name: 'M-Pesa',
                              type: 'mobile_money',
                              details: [
                                { label: 'Paybill', value: '' },
                                { label: 'Account', value: '' }
                              ]
                            });
                            setShowAddPaymentForm(true);
                          }}
                        >
                          + Add M-Pesa
                        </button>
                        <button 
                          className={styles.quickAddButton}
                          onClick={() => {
                            setNewPaymentMethod({
                              name: 'Bank Transfer',
                              type: 'bank',
                              details: [
                                { label: 'Bank', value: '' },
                                { label: 'Account', value: '' },
                                { label: 'Name', value: '' }
                              ]
                            });
                            setShowAddPaymentForm(true);
                          }}
                        >
                          + Add Bank Account
                        </button>
                        <button 
                          className={styles.quickAddButton}
                          onClick={() => {
                            setNewPaymentMethod({
                              name: 'Other Payment Method',
                              type: 'other',
                              details: [
                                { label: 'Method', value: '' },
                                { label: 'Details', value: '' }
                              ]
                            });
                            setShowAddPaymentForm(true);
                          }}
                        >
                          + Add Other Method
                        </button>
                      </div>
                    ) : (
                      <div className={styles.addForm}>
                        <div className={styles.formGroup}>
                          <label>Payment Method Name:</label>
                          <input
                            type="text"
                            value={newPaymentMethod.name}
                            onChange={(e) => setNewPaymentMethod({
                              ...newPaymentMethod,
                              name: e.target.value
                            })}
                            placeholder="Enter payment method name"
                          />
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label>Type:</label>
                          <select
                            value={newPaymentMethod.type}
                            onChange={(e) => setNewPaymentMethod({
                              ...newPaymentMethod,
                              type: e.target.value as 'mobile_money' | 'bank' | 'other'
                            })}
                          >
                            <option value="mobile_money">Mobile Money</option>
                            <option value="bank">Bank</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div className={styles.detailsSection}>
                          <label>Payment Details:</label>
                          {newPaymentMethod.details.map((detail, index) => (
                            <div key={index} className={styles.detailRow}>
                              <input
                                type="text"
                                value={detail.label}
                                onChange={(e) => {
                                  const updatedDetails = [...newPaymentMethod.details];
                                  updatedDetails[index].label = e.target.value;
                                  setNewPaymentMethod({
                                    ...newPaymentMethod,
                                    details: updatedDetails
                                  });
                                }}
                                placeholder="Label (e.g., Paybill)"
                              />
                              <input
                                type="text"
                                value={detail.value}
                                onChange={(e) => {
                                  const updatedDetails = [...newPaymentMethod.details];
                                  updatedDetails[index].value = e.target.value;
                                  setNewPaymentMethod({
                                    ...newPaymentMethod,
                                    details: updatedDetails
                                  });
                                }}
                                placeholder="Value (e.g., 522522)"
                              />
                              {newPaymentMethod.details.length > 1 && (
                                <button
                                  type="button"
                                  className={styles.removeDetailButton}
                                  onClick={() => {
                                    const updatedDetails = newPaymentMethod.details.filter((_, i) => i !== index);
                                    setNewPaymentMethod({
                                      ...newPaymentMethod,
                                      details: updatedDetails
                                    });
                                  }}
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          ))}
                          
                          <button
                            type="button"
                            className={styles.addDetailButton}
                            onClick={() => {
                              setNewPaymentMethod({
                                ...newPaymentMethod,
                                details: [...newPaymentMethod.details, { label: '', value: '' }]
                              });
                            }}
                          >
                            + Add Detail
                          </button>
                        </div>

                        <div className={styles.formActions}>
                          <button
                            className={styles.saveButton}
                            onClick={handleAddPaymentMethod}
                            disabled={settingsLoading}
                          >
                            {settingsLoading ? 'Adding...' : 'Add Payment Method'}
                          </button>
                          <button
                            className={styles.cancelButton}
                            onClick={() => {
                              setShowAddPaymentForm(false);
                              setNewPaymentMethod({
                                name: '',
                                type: 'mobile_money',
                                details: [{ label: '', value: '' }]
                              });
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className={styles.settingsSection}>
                  <h3>Contact Information</h3>
                  <div className={styles.settingsItems}>
                    {settings.contactInfo
                      .sort((a, b) => a.priority - b.priority)
                      .map((contact, index) => (
                      <div key={contact._id || index} className={styles.settingItem}>
                        <div className={styles.settingHeader}>
                          <h4>{contact.title}</h4>
                          <span className={`${styles.statusBadge} ${contact.isActive ? styles.active : styles.inactive}`}>
                            {contact.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className={styles.settingDetails}>
                          <p><strong>Type:</strong> {contact.type}</p>
                          <p><strong>Value:</strong> {contact.value}</p>
                          {contact.description && (
                            <p><strong>Description:</strong> {contact.description}</p>
                          )}
                          <p><strong>Priority:</strong> {contact.priority}</p>
                        </div>
                        <div className={styles.settingActions}>
                          <button 
                            className={styles.toggleButton}
                            onClick={() => {
                              const updatedContacts = [...settings.contactInfo];
                              const contactIndex = updatedContacts.findIndex(c => c._id === contact._id || 
                                (c.title === contact.title && c.value === contact.value));
                              if (contactIndex !== -1) {
                                updatedContacts[contactIndex].isActive = !updatedContacts[contactIndex].isActive;
                                updateContactInfo(updatedContacts);
                              }
                            }}
                          >
                            {contact.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className={styles.addContactSection}>
                    <h4>Add New Contact</h4>
                    {!showAddContactForm ? (
                      <div className={styles.quickAddButtons}>
                        <button 
                          className={styles.quickAddButton}
                          onClick={() => {
                            setNewContactInfo({
                              type: 'phone',
                              title: 'Phone Contact',
                              value: '',
                              description: 'Available during office hours'
                            });
                            setShowAddContactForm(true);
                          }}
                        >
                          + Add Phone
                        </button>
                        <button 
                          className={styles.quickAddButton}
                          onClick={() => {
                            setNewContactInfo({
                              type: 'email',
                              title: 'Email Contact',
                              value: '',
                              description: 'Response within 24 hours'
                            });
                            setShowAddContactForm(true);
                          }}
                        >
                          + Add Email
                        </button>
                        <button 
                          className={styles.quickAddButton}
                          onClick={() => {
                            setNewContactInfo({
                              type: 'office',
                              title: 'Office Contact',
                              value: '',
                              description: 'Visit during office hours'
                            });
                            setShowAddContactForm(true);
                          }}
                        >
                          + Add Office
                        </button>
                      </div>
                    ) : (
                      <div className={styles.addForm}>
                        <div className={styles.formGroup}>
                          <label>Contact Type:</label>
                          <select
                            value={newContactInfo.type}
                            onChange={(e) => setNewContactInfo({
                              ...newContactInfo,
                              type: e.target.value as 'phone' | 'email' | 'office'
                            })}
                          >
                            <option value="phone">Phone</option>
                            <option value="email">Email</option>
                            <option value="office">Office</option>
                          </select>
                        </div>

                        <div className={styles.formGroup}>
                          <label>Contact Title:</label>
                          <input
                            type="text"
                            value={newContactInfo.title}
                            onChange={(e) => setNewContactInfo({
                              ...newContactInfo,
                              title: e.target.value
                            })}
                            placeholder="e.g., Emergency Hotline, Support Email"
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label>Contact Value:</label>
                          <input
                            type="text"
                            value={newContactInfo.value}
                            onChange={(e) => setNewContactInfo({
                              ...newContactInfo,
                              value: e.target.value
                            })}
                            placeholder={
                              newContactInfo.type === 'phone' ? '+254 700 000 000' :
                              newContactInfo.type === 'email' ? 'contact@ksucu.ac.ke' :
                              'Office Location/Address'
                            }
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label>Description (Optional):</label>
                          <textarea
                            value={newContactInfo.description}
                            onChange={(e) => setNewContactInfo({
                              ...newContactInfo,
                              description: e.target.value
                            })}
                            placeholder="Additional information about this contact method"
                            rows={3}
                          />
                        </div>

                        <div className={styles.formActions}>
                          <button
                            className={styles.saveButton}
                            onClick={handleAddContactInfo}
                            disabled={settingsLoading}
                          >
                            {settingsLoading ? 'Adding...' : 'Add Contact'}
                          </button>
                          <button
                            className={styles.cancelButton}
                            onClick={() => {
                              setShowAddContactForm(false);
                              setNewContactInfo({
                                type: 'phone',
                                title: '',
                                value: '',
                                description: ''
                              });
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modals */}
        {showModal && selectedRequest && <RequestModal />}
        {showModal && selectedDonation && <DonationModal />}
      </div>
      <Footer />
    </>
  );
};

export default CompassionCounselingAdmin;