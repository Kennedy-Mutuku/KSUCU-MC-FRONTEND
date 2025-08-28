import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/signup.module.css';
import cuLogo from '../assets/KSUCU logo updated document.png';
import { getApiUrl } from '../config/environment';
import { Search, RefreshCw, Phone, Mail, User, BookOpen } from 'lucide-react';
import Header from '../components/header';
import Footer from '../components/footer';

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
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resettingUser, setResettingUser] = useState<string | null>(null);

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

    const filtered = users.filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.reg.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.course.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <>
      <Header />
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
            textAlign: 'center'
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
            textAlign: 'center'
          }}>
            {success}
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
                    marginBottom: '10px',
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '10px',
                    marginBottom: '15px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={16} color="#495057" />
                      <div>
                        <strong>Name:</strong> {user.username}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={16} color="#495057" />
                      <div>
                        <strong>Email:</strong> {user.email}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={16} color="#495057" />
                      <div>
                        <strong>Phone:</strong> {user.phone}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <BookOpen size={16} color="#495057" />
                      <div>
                        <strong>Course:</strong> {user.course}
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
                    alignItems: 'center'
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
              ))
            )}
          </div>
        )}

        <div className={styles['form-footer']}>
          <p><Link to="/admission">Back to Admission</Link> | <Link to="/">Home</Link></p>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default UserManagement;