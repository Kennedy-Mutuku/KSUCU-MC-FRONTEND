import { useState, useEffect } from 'react';
import { Search, Upload, Archive, Trash2, Plus } from 'lucide-react';
import { getApiUrl } from '../config/environment';
import AdminUserSelector from '../components/AdminUserSelector';
import AdminDocumentUploader from '../components/AdminDocumentUploader';
import CategoryManager from '../components/CategoryManager';

interface Document {
  _id: string;
  originalName: string;
  fileSize: number;
  uploadedAt: string;
  categoryName: string;
  status: string;
  downloadCount: number;
  userId: {
    username: string;
    email: string;
    phone: string;
    reg: string;
  };
}

interface Category {
  _id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  reg: string;
  course: string;
  yos: string;
}

interface Stats {
  totalDocuments: number;
  totalUsers: number;
  totalCategories: number;
  byStatus: {
    active: number;
    archived: number;
    expired: number;
  };
}

const SuperAdminDocumentDashboard = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);

  useEffect(() => {
    fetchDashboardData();
    fetchCategories();
  }, [searchTerm, filterStatus, filterCategory, sortBy]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      let url = getApiUrl('getDocumentsDashboard');
      const params = new URLSearchParams();

      if (searchTerm) params.append('searchTerm', searchTerm);
      if (filterStatus) params.append('status', filterStatus);
      if (filterCategory) params.append('categoryId', filterCategory);
      if (sortBy) params.append('sortBy', sortBy);

      if (params.toString()) {
        url += '?' + params.toString();
      }

      const response = await fetch(url, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDocuments(data.documents || []);
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(getApiUrl('getDocumentCategories'), {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleDeleteDocument = async (docId: string, docName: string) => {
    if (!window.confirm(`Delete "${docName}"? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(
        getApiUrl('deleteDocument').replace(':documentId', docId),
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      setSuccess('Document deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchDashboardData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    }
  };

  const handleArchiveDocument = async (docId: string) => {
    try {
      const response = await fetch(
        getApiUrl('archiveDocument').replace(':documentId', docId),
        {
          method: 'POST',
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to archive document');
      }

      setSuccess('Document archived successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchDashboardData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive document');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', color: '#000', margin: '0 0 10px 0' }}>Document Management Dashboard</h1>
        <p style={{ color: '#666', fontSize: '1rem', margin: 0 }}>Manage all uploaded documents and categories</p>
      </div>

      {/* Messages */}
      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: '#e8f5e9',
          color: '#2e7d32',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          ✓ {success}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '30px'
        }}>
          <div style={{
            backgroundColor: '#f8f8f8',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #eee'
          }}>
            <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '0.9rem' }}>Total Documents</p>
            <h3 style={{ margin: 0, fontSize: '2rem', color: '#00c6ff' }}>{stats.totalDocuments}</h3>
          </div>
          <div style={{
            backgroundColor: '#f8f8f8',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #eee'
          }}>
            <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '0.9rem' }}>Total Users</p>
            <h3 style={{ margin: 0, fontSize: '2rem', color: '#00c6ff' }}>{stats.totalUsers}</h3>
          </div>
          <div style={{
            backgroundColor: '#f8f8f8',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #eee'
          }}>
            <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '0.9rem' }}>Categories</p>
            <h3 style={{ margin: 0, fontSize: '2rem', color: '#00c6ff' }}>{stats.totalCategories}</h3>
          </div>
          <div style={{
            backgroundColor: '#f8f8f8',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #eee'
          }}>
            <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '0.9rem' }}>Active Documents</p>
            <h3 style={{ margin: 0, fontSize: '2rem', color: '#4CAF50' }}>{stats.byStatus.active}</h3>
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        border: '1px solid #eee'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input
              type="text"
              placeholder="Search documents, users, categories..."
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

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '0.95rem',
              backgroundColor: '#fff'
            }}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="expired">Expired</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '0.95rem',
              backgroundColor: '#fff'
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '0.95rem',
              backgroundColor: '#fff'
            }}
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowUploader(true)}
            style={{
              padding: '12px 20px',
              backgroundColor: '#00c6ff',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0099cc'}
            onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#00c6ff'}
          >
            <Upload size={18} />
            Upload Documents
          </button>
          <button
            onClick={() => setShowCategoryManager(true)}
            style={{
              padding: '12px 20px',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333'}
            onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#000'}
          >
            <Plus size={18} />
            Manage Categories
          </button>
        </div>
      </div>

      {/* User Selector & Uploader Modal */}
      {showUploader && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <AdminUserSelector
                onUserSelected={(user) => setSelectedUser(user)}
                selectedUserId={selectedUser?._id}
              />
              {selectedUser && (
                <AdminDocumentUploader
                  key={uploadKey}
                  userId={selectedUser._id}
                  userName={selectedUser.username}
                  categories={categories}
                  onUploadSuccess={() => {
                    setShowUploader(false);
                    setSelectedUser(null);
                    setUploadKey(uploadKey + 1);
                    fetchDashboardData();
                  }}
                  onClose={() => {
                    setShowUploader(false);
                    setSelectedUser(null);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      <CategoryManager
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
        onCategoryCreated={() => {
          fetchCategories();
          setShowCategoryManager(false);
        }}
        categories={categories}
      />

      {/* Documents Table */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #eee',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Loading documents...
          </div>
        ) : documents.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
            No documents found
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#000', color: 'white' }}>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>File Name</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Category</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>User</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Size</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Downloads</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, index) => (
                  <tr
                    key={doc._id}
                    style={{
                      borderBottom: '1px solid #eee',
                      backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9'
                    }}
                  >
                    <td style={{ padding: '15px' }}>
                      <div style={{ fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                        {doc.originalName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#999' }}>
                        {formatFileSize(doc.fileSize)}
                      </div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        backgroundColor: '#f0f0f0',
                        fontSize: '0.85rem',
                        color: '#333'
                      }}>
                        {doc.categoryName}
                      </div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ color: '#333', fontSize: '0.9rem' }}>
                        {doc.userId.username}
                      </div>
                      <div style={{ color: '#999', fontSize: '0.8rem' }}>
                        {doc.userId.email}
                      </div>
                    </td>
                    <td style={{ padding: '15px', color: '#666' }}>
                      {formatFileSize(doc.fileSize)}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        backgroundColor: doc.status === 'active' ? '#e8f5e9' : doc.status === 'archived' ? '#fff3e0' : '#ffebee',
                        color: doc.status === 'active' ? '#2e7d32' : doc.status === 'archived' ? '#e65100' : '#c62828'
                      }}>
                        {doc.status.toUpperCase()}
                      </div>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center', color: '#666' }}>
                      {doc.downloadCount}
                    </td>
                    <td style={{ padding: '15px', color: '#666', fontSize: '0.9rem' }}>
                      {formatDate(doc.uploadedAt)}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleArchiveDocument(doc._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#ff9800',
                          marginRight: '10px',
                          transition: 'color 0.3s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.color = '#f57c00'}
                        onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.color = '#ff9800'}
                        title="Archive"
                      >
                        <Archive size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc._id, doc.originalName)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#f44336',
                          transition: 'color 0.3s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.color = '#d32f2f'}
                        onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.color = '#f44336'}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDocumentDashboard;
