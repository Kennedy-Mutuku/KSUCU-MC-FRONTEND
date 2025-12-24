import { useState, useEffect } from 'react';
import { Search, Mail, Phone } from 'lucide-react';
import { getApiUrl } from '../config/environment';

interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  reg: string;
  course: string;
  yos: string;
}

interface AdminUserSelectorProps {
  onUserSelected: (user: User) => void;
  selectedUserId?: string;
}

const AdminUserSelector = ({ onUserSelected, selectedUserId }: AdminUserSelectorProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(getApiUrl('admissionAdminGetUsers'), {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
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
      user.reg.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredUsers(filtered);
  };

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
      <h3 style={{ margin: '0 0 16px 0', color: '#000', fontSize: '1.1rem' }}>Select User</h3>

      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#999'
          }}
        />
        <input
          type="text"
          placeholder="Search by name, email, phone, or registration..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 12px 12px 40px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '0.95rem',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          Loading users...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
          {searchTerm ? 'No users found matching your search' : 'No users available'}
        </div>
      ) : (
        <div style={{
          maxHeight: '400px',
          overflowY: 'auto',
          border: '1px solid #eee',
          borderRadius: '8px'
        }}>
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => onUserSelected(user)}
              style={{
                padding: '16px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                backgroundColor: selectedUserId === user._id ? '#f0f9ff' : '#fff',
                borderLeft: selectedUserId === user._id ? '4px solid #00c6ff' : 'none',
                paddingLeft: selectedUserId === user._id ? '12px' : '16px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = '#f8f8f8';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = selectedUserId === user._id ? '#f0f9ff' : '#fff';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#000', fontSize: '0.95rem' }}>
                    {user.username}
                  </h4>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#666' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Mail size={14} />
                      {user.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={14} />
                      {user.phone}
                    </div>
                  </div>
                </div>
                {selectedUserId === user._id && (
                  <div style={{
                    backgroundColor: '#00c6ff',
                    color: '#000',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    SELECTED
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#999' }}>
                <div><strong>REG:</strong> {user.reg}</div>
                <div><strong>Course:</strong> {user.course}</div>
                <div><strong>Year:</strong> {user.yos}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{
        marginTop: '12px',
        fontSize: '0.85rem',
        color: '#666',
        textAlign: 'center'
      }}>
        {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
      </div>
    </div>
  );
};

export default AdminUserSelector;
