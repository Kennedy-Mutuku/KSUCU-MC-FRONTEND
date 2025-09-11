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
  CheckCircle, 
  XCircle, 
  Eye, 
  Filter,
  Search,
  Download,
  MessageCircle,
  DollarSign,
  User
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'requests' | 'donations'>('requests');
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

  useEffect(() => {
    fetchHelpRequests();
    fetchDonations();
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
                    <span> - KES {selectedDonation.amount}</span>
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
                        <p className={styles.amount}>KES {donation.amount}</p>
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

        {/* Modals */}
        {showModal && selectedRequest && <RequestModal />}
        {showModal && selectedDonation && <DonationModal />}
      </div>
      <Footer />
    </>
  );
};

export default CompassionCounselingAdmin;