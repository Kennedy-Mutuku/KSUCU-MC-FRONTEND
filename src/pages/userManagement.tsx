import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/signup.module.css';
import cuLogo from '../assets/KSUCU logo updated document.png';
import { getApiUrl, getImageUrl } from '../config/environment';
import { Search, RefreshCw, Phone, Mail, User, BookOpen, X } from 'lucide-react';

interface UserData {
  _id: string;
  username: string;
  email: string;
  phone: string;
  course: string;
  reg: string;
  yos: string;
  et: string;
  ministry: string;
  profilePhoto?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resettingUser, setResettingUser] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editFormData, setEditFormData] = useState<UserData | null>(null);
  const [savingUser, setSavingUser] = useState(false);
  const [showFullSize, setShowFullSize] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(getApiUrl('admissionAdminGetUsers'), {
        withCredentials: true,
      });
      
      setUsers(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError('Unauthorized. Please check your admin credentials.');
      } else {
        setError('Failed to fetch users. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = users.filter(user =>
      user.username?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.phone?.includes(searchTerm) ||
      user.reg?.toLowerCase().includes(term) ||
      user.course?.toLowerCase().includes(term)
    );
    
    setFilteredUsers(filtered);
  };

  const resetUserPassword = async (userId: string, phone: string, username: string) => {
    if (!confirm(`Reset password for ${username} to their phone number (${phone})?`)) {
      return;
    }

    setResettingUser(userId);
    setError('');
    setSuccess('');

    try {
      await axios.post(getApiUrl('admissionAdminResetPassword'), {
        userId: userId,
        newPassword: phone
      }, {
        withCredentials: true,
      });

      setSuccess(`Password reset successfully for ${username}. New password is: ${phone}`);
      setTimeout(() => setSuccess(''), 5000);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError('Unauthorized. Please check your admin credentials.');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setResettingUser(null);
    }
  };

  const handleEditClick = (user: UserData) => {
    setEditingUser(user);
    setEditFormData({ ...user });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editFormData) return;
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData || !editingUser) return;

    setSavingUser(true);
    setError('');
    setSuccess('');

    try {
        const updateUrl = getApiUrl('admissionAdminUpdateUser').replace(':userId', editingUser._id);
        const response = await axios.put(updateUrl, editFormData, {
            withCredentials: true,
        });

        setSuccess(`User ${editFormData.username} updated successfully!`);
        setUsers(users.map(u => u._id === editingUser._id ? response.data.user : u));
        setEditingUser(null);
        setEditFormData(null);
        
        setTimeout(() => setSuccess(''), 5000);
    } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to update user. Please try again.');
    } finally {
        setSavingUser(false);
    }
  };

  return (
    <>
      {/* Full Size Photo Viewer Modal - Moved to top for better stacking context */}
      {showFullSize && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.95)',
            backdropFilter: 'blur(15px)',
            padding: '20px',
            cursor: 'zoom-out',
            animation: 'fadeIn 0.3s ease-out',
            touchAction: 'none'
          }}
          onClick={() => setShowFullSize(null)}
        >
          <div 
            style={{
              position: 'relative',
              width: 'auto',
              maxWidth: '95vw',
              maxHeight: '90vh',
              animation: 'zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowFullSize(null)}
              style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                color: 'white',
                background: '#730051',
                border: '2px solid white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                zIndex: 100001
              }}
              title="Close"
            >
              <X size={24} />
            </button>
            <img
              src={showFullSize}
              alt="Full view"
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 0 60px rgba(0,0,0,0.9)',
                border: '4px solid white',
                backgroundColor: 'rgba(255,255,255,0.05)'
              }}
            />
          </div>
        </div>
      )}

      <div className={styles.body}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo_div}>
          <div className={styles['logo_signUp']}>
            <img src={cuLogo} alt="CU logo" />
          </div>
        </Link>

        <h2 className={styles.text}>User Management</h2>

        {error && (
          <div style={{ 
            background: '#f8d7da', 
            color: '#721c24', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ 
            background: '#d4edda', 
            color: '#155724', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {success}
          </div>
        )}

        {/* Edit Modal */}
        {editingUser && editFormData && (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                padding: '20px'
            }}>
                <div style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '12px',
                    width: '100%',
                    maxWidth: '500px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}>
                    <h3 style={{ marginBottom: '20px', color: '#730051', borderBottom: '2px solid #730051', paddingBottom: '10px' }}>Edit User Details</h3>
                    <form onSubmit={handleUpdateSubmit}>
                        <div className={styles.editFormGrid}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Full Name</label>
                                <input type="text" name="username" value={editFormData.username} onChange={handleEditChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Email</label>
                                <input type="email" name="email" value={editFormData.email} onChange={handleEditChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Phone</label>
                                <input type="text" name="phone" value={editFormData.phone} onChange={handleEditChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>REG No</label>
                                <input type="text" name="reg" value={editFormData.reg} onChange={handleEditChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Course</label>
                                <input type="text" name="course" value={editFormData.course} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Ministry</label>
                                <input type="text" name="ministry" value={editFormData.ministry} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Year of Study</label>
                                <select name="yos" value={editFormData.yos} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                    {[1, 2, 3, 4, 5, 6].map(yr => <option key={yr} value={yr}>{yr}</option>)}
                                </select>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>ET</label>
                                <input type="text" name="et" value={editFormData.et} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button type="submit" disabled={savingUser} style={{ flex: 1, padding: '10px', background: '#730051', color: 'white', border: 'none', borderRadius: '6px', cursor: savingUser ? 'not-allowed' : 'pointer' }}>
                                {savingUser ? 'Saving...' : 'Update Details'}
                            </button>
                            <button type="button" onClick={() => setEditingUser(null)} style={{ flex: 1, padding: '10px', background: '#ccc', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Search and Controls */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            alignItems: 'center', 
            marginBottom: '15px' 
          }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search 
                size={20} 
                style={{ 
                  position: 'absolute', 
                  left: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#666' 
                }} 
              />
              <input
                type="text"
                placeholder="Search by name, email, phone, reg, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 40px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
            </div>
            <button
              onClick={fetchUsers}
              disabled={loading}
              style={{
                padding: '10px 15px',
                border: 'none',
                borderRadius: '5px',
                background: '#007bff',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          <div style={{ 
            fontSize: '14px', 
            color: '#666',
            padding: '10px',
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '5px'
          }}>
            📋 <strong>Total Users:</strong> {filteredUsers.length} {searchTerm && `(filtered from ${users.length})`}
          </div>
        </div>

        {/* User List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Loading users...</p>
          </div>
        ) : (
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {filteredUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                {searchTerm ? 'No users found matching your search.' : 'No users found.'}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div 
                  key={user._id} 
                  style={{
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '20px',
                    backgroundColor: '#f8f9fa',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ 
                    display: 'flex',
                    gap: '15px',
                    marginBottom: '15px',
                    alignItems: 'flex-start'
                  }}>
                    {/* Profile Photo - Whole Circle is Clickable */}
                    <div 
                      onClick={() => user.profilePhoto && setShowFullSize(getImageUrl(user.profilePhoto))}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '3px solid #730051',
                        flexShrink: 0,
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(115,0,81,0.2)',
                        transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                      }}
                      className="photo-container"
                      title="Click to view full size"
                    >
                      {user.profilePhoto ? (
                        <img 
                          src={getImageUrl(user.profilePhoto)} 
                          alt={user.username} 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=User';
                          }}
                        />
                      ) : (
                        <User size={40} color="#730051" />
                      )}
                    </div>

                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: '10px',
                      flex: 1
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={16} color="#730051" />
                        <div>
                          <strong>Name:</strong> {user.username}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={16} color="#730051" />
                        <div>
                          <strong>Email:</strong> {user.email}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone size={16} color="#730051" />
                        <div>
                          <strong>Phone:</strong> {user.phone}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BookOpen size={16} color="#730051" />
                        <div>
                          <strong>Course:</strong> {user.course}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                    gap: '10px',
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '15px'
                  }}>
                    <div><strong>REG:</strong> {user.reg}</div>
                    <div><strong>Year:</strong> {user.yos}</div>
                    <div><strong>ET:</strong> {user.et}</div>
                    <div><strong>Ministry:</strong> {user.ministry}</div>
                  </div>

                  <div style={{ 
                    borderTop: '1px solid #dee2e6', 
                    paddingTop: '15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#28a745',
                      background: '#d4edda',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}>
                      Default Password: {user.phone}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleEditClick(user)}
                          style={{
                            padding: '8px 15px',
                            border: '1px solid #730051',
                            borderRadius: '5px',
                            background: 'white',
                            color: '#730051',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                        >
                          Edit Details
                        </button>

                        <button
                          onClick={() => resetUserPassword(user._id, user.phone, user.username)}
                          disabled={resettingUser === user._id}
                          style={{
                            padding: '8px 12px',
                            border: 'none',
                            borderRadius: '5px',
                            background: resettingUser === user._id ? '#6c757d' : '#dc3545',
                            color: 'white',
                            cursor: resettingUser === user._id ? 'not-allowed' : 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          {resettingUser === user._id ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className={styles['form-footer']}>
          <p><Link to="/admission">Back to Admission</Link> | <Link to="/">Home</Link></p>
        </div>
      </div>
    </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .photo-container:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(115,0,81,0.3);
        }
        .photo-container:active {
          transform: scale(0.95);
        }
      `}</style>
    </>
  );
};

export default UserManagement;