import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/environment';
import { Download, Eye, File, AlertCircle } from 'lucide-react';

interface Document {
  _id: string;
  filename: string;
  originalName: string;
  fileSize: number;
  uploadedAt: string;
  description: string;
  categoryName: string;
  status: string;
  notes: string;
  uploadedBy: {
    username: string;
    email: string;
  };
}

const MyDocs = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const getFileIcon = () => {
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
                backgroundColor: '#000',
                color: 'white',
                fontWeight: '600'
              }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>File Name</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Size</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Uploaded By</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
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
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#f0f0f0';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.backgroundColor = index % 2 === 0 ? '#fff' : '#f9f9f9';
                  }}
                >
                  <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {getFileIcon()}
                    <div>
                      <div style={{ fontWeight: '600', color: '#333' }}>{doc.originalName}</div>
                      {doc.description && (
                        <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '3px' }}>
                          {doc.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      color: '#333'
                    }}>
                      {doc.categoryName || 'Uncategorized'}
                    </div>
                  </td>
                  <td style={{ padding: '15px', color: '#666' }}>
                    {formatFileSize(doc.fileSize)}
                  </td>
                  <td style={{ padding: '15px', color: '#666' }}>
                    <div style={{ fontSize: '0.9rem' }}>{doc.uploadedBy.username}</div>
                    <div style={{ fontSize: '0.8rem', color: '#999' }}>{doc.uploadedBy.email}</div>
                  </td>
                  <td style={{ padding: '15px', color: '#666', fontSize: '0.9rem' }}>
                    {formatDate(doc.uploadedAt)}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      backgroundColor: doc.status === 'active' ? '#e8f5e9' : doc.status === 'archived' ? '#fff3e0' : '#ffebee',
                      color: doc.status === 'active' ? '#2e7d32' : doc.status === 'archived' ? '#e65100' : '#c62828'
                    }}>
                      {doc.status ? doc.status.toUpperCase() : 'ACTIVE'}
                    </div>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleView(doc._id)}
                        style={{
                          backgroundColor: '#00c6ff',
                          color: '#000',
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
