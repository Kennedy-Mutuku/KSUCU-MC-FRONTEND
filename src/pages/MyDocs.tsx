import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/environment';
import { Download, Eye, Trash2, File, AlertCircle } from 'lucide-react';
import styles from '../styles/index.module.css';

interface Document {
  _id: string;
  filename: string;
  originalName: string;
  fileSize: number;
  uploadedAt: string;
  description: string;
  uploadedBy: {
    username: string;
    email: string;
  };
}

const MyDocs = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(getApiUrl('myDocuments'), {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/signIn');
          return;
        }
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId: string, originalName: string) => {
    try {
      const response = await fetch(getApiUrl('downloadDocument').replace(':documentId', documentId), {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to download document');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading document:', err);
      setError('Failed to download document');
    }
  };

  const handleView = (documentId: string) => {
    const viewUrl = getApiUrl('viewDocument').replace(':documentId', documentId);
    window.open(viewUrl, '_blank');
  };

  const handleDelete = async (documentId: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const response = await fetch(getApiUrl('deleteDocument').replace(':documentId', documentId), {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      setSuccessMessage('Document deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Refresh documents list
      fetchDocuments();
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document');
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return <File size={20} />;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#730051', fontSize: '2rem', marginBottom: '10px' }}>My Documents</h1>
        <p style={{ color: '#666', fontSize: '1rem' }}>
          View and manage your personal documents uploaded by administrators
        </p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div style={{
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          color: '#c33'
        }}>
          <AlertCircle size={20} />
          <div>{error}</div>
        </div>
      )}

      {successMessage && (
        <div style={{
          backgroundColor: '#efe',
          border: '1px solid #cfc',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          color: '#3c3'
        }}>
          {successMessage}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '18px', color: '#666' }}>Loading documents...</div>
        </div>
      ) : documents.length === 0 ? (
        /* Empty State */
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '12px',
          border: '2px dashed #ddd'
        }}>
          <File size={48} style={{ color: '#ccc', marginBottom: '15px' }} />
          <h2 style={{ color: '#666', fontSize: '1.3rem', marginBottom: '10px' }}>No Documents Yet</h2>
          <p style={{ color: '#999' }}>
            Documents uploaded by administrators will appear here
          </p>
        </div>
      ) : (
        /* Documents Table */
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#00c6ff',
                color: 'white',
                fontWeight: '600'
              }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>File Name</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Size</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Uploaded By</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, index) => (
                <tr
                  key={doc._id}
                  style={{
                    borderBottom: '1px solid #eee',
                    backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9',
                    hover: { backgroundColor: '#f0f0f0' }
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#f0f0f0';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.backgroundColor = index % 2 === 0 ? '#fff' : '#f9f9f9';
                  }}
                >
                  <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {getFileIcon(doc.filename)}
                    <div>
                      <div style={{ fontWeight: '600', color: '#333' }}>{doc.originalName}</div>
                      {doc.description && (
                        <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '3px' }}>
                          {doc.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '15px', color: '#666' }}>
                    {formatFileSize(doc.fileSize)}
                  </td>
                  <td style={{ padding: '15px', color: '#666' }}>
                    {doc.uploadedBy.username}
                  </td>
                  <td style={{ padding: '15px', color: '#666', fontSize: '0.9rem' }}>
                    {formatDate(doc.uploadedAt)}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleView(doc._id)}
                        style={{
                          backgroundColor: '#00c6ff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.9rem',
                          transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0099cc';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#00c6ff';
                        }}
                      >
                        <Eye size={16} /> View
                      </button>
                      <button
                        onClick={() => handleDownload(doc._id, doc.originalName)}
                        style={{
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.9rem',
                          transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#45a049';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4CAF50';
                        }}
                      >
                        <Download size={16} /> Download
                      </button>
                      <button
                        onClick={() => handleDelete(doc._id)}
                        style={{
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.9rem',
                          transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#da190b';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f44336';
                        }}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyDocs;
