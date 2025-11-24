import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../config/environment';
import styles from '../styles/minutesManager.module.css';

interface Minute {
  _id: string;
  title: string;
  date: string;
  uploadedAt: string;
  uploadedBy?: {
    fullName?: string;
    email?: string;
  };
  fileSize: number;
  mimeType: string;
  originalName: string;
  description?: string;
  downloadCount: number;
  status: string;
}

interface MinutesManagerProps {
  onClose?: () => void;
  onUploadSuccess?: () => void;
}

const MinutesManager: React.FC<MinutesManagerProps> = ({ onClose, onUploadSuccess }) => {
  const [minutes, setMinutes] = useState<Minute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Upload form state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDate, setUploadDate] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Filter state
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');

  const apiUrl = getApiUrl('minutes').replace('/login', '');

  // Fetch minutes on component mount and when filters change
  useEffect(() => {
    fetchMinutes();
  }, [filterStartDate, filterEndDate, statusFilter, searchTerm]);

  const fetchMinutes = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${apiUrl}?`;
      if (filterStartDate) url += `startDate=${filterStartDate}&`;
      if (filterEndDate) url += `endDate=${filterEndDate}&`;
      if (statusFilter) url += `status=${statusFilter}&`;
      if (searchTerm) url += `search=${searchTerm}&`;

      const response = await axios.get(url, { withCredentials: true });
      setMinutes(response.data.minutes || []);
    } catch (err: any) {
      console.error('Error fetching minutes:', err);
      setError(err.response?.data?.error || 'Failed to fetch minutes');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Please upload PDF or Word documents only.');
        setUploadFile(null);
        return;
      }

      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        setError('File size exceeds 50MB limit.');
        setUploadFile(null);
        return;
      }

      setUploadFile(file);
      setError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!uploadTitle || !uploadDate || !uploadFile) {
      setError('Please fill in all required fields');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', uploadTitle);
      formData.append('date', uploadDate);
      formData.append('description', uploadDescription);
      formData.append('document', uploadFile);

      await axios.post(`${apiUrl}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      setSuccessMessage('Minutes uploaded successfully!');
      setUploadTitle('');
      setUploadDate('');
      setUploadDescription('');
      setUploadFile(null);

      // Reset file input
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Refresh minutes list
      await fetchMinutes();

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err: any) {
      console.error('Error uploading minutes:', err);
      setError(err.response?.data?.error || 'Failed to upload minutes');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (minute: Minute) => {
    try {
      const response = await axios.get(`${apiUrl}/${minute._id}/download`, {
        responseType: 'blob',
        withCredentials: true
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', minute.originalName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error downloading minute:', err);
      setError('Failed to download document');
    }
  };

  const handleDelete = async (minuteId: string) => {
    if (!window.confirm('Are you sure you want to delete this minute?')) {
      return;
    }

    try {
      await axios.delete(`${apiUrl}/${minuteId}`, { withCredentials: true });
      setSuccessMessage('Minutes deleted successfully');
      await fetchMinutes();
    } catch (err: any) {
      console.error('Error deleting minute:', err);
      setError(err.response?.data?.error || 'Failed to delete minute');
    }
  };

  const handleArchive = async (minuteId: string) => {
    try {
      await axios.post(`${apiUrl}/${minuteId}/archive`, {}, { withCredentials: true });
      setSuccessMessage('Minutes archived successfully');
      await fetchMinutes();
    } catch (err: any) {
      console.error('Error archiving minute:', err);
      setError(err.response?.data?.error || 'Failed to archive minute');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2>Meeting Minutes Management</h2>
        {onClose && (
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      {/* Error and Success Messages */}
      {error && <div className={styles.errorMessage}>{error}</div>}
      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

      {/* Upload Section */}
      <div className={styles.uploadSection}>
        <h3>Upload New Minutes</h3>
        <form onSubmit={handleUpload} className={styles.uploadForm}>
          <div className={styles.formGroup}>
            <label htmlFor="uploadTitle">Minutes Title *</label>
            <input
              id="uploadTitle"
              type="text"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="e.g., Board Meeting - November 2024"
              maxLength={255}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="uploadDate">Meeting Date *</label>
            <input
              id="uploadDate"
              type="date"
              value={uploadDate}
              onChange={(e) => setUploadDate(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="uploadDescription">Description (Optional)</label>
            <textarea
              id="uploadDescription"
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
              placeholder="Add any additional notes about these minutes"
              maxLength={1000}
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="fileInput">Document *</label>
            <input
              id="fileInput"
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx"
              required
            />
            {uploadFile && (
              <p className={styles.fileName}>
                Selected: {uploadFile.name} ({formatFileSize(uploadFile.size)})
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={uploading || !uploadTitle || !uploadDate || !uploadFile}
            className={styles.uploadButton}
          >
            {uploading ? 'Uploading...' : 'Upload Minutes'}
          </button>
        </form>
      </div>

      {/* Filter Section */}
      <div className={styles.filterSection}>
        <h3>Filter Minutes</h3>
        <div className={styles.filterGrid}>
          <div className={styles.filterGroup}>
            <label htmlFor="searchTerm">Search</label>
            <input
              id="searchTerm"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or description"
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="filterStartDate">Start Date</label>
            <input
              id="filterStartDate"
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="filterEndDate">End Date</label>
            <input
              id="filterEndDate"
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="statusFilter">Status</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="">All</option>
            </select>
          </div>
        </div>
      </div>

      {/* Minutes List Section */}
      <div className={styles.listSection}>
        <h3>
          Minutes List {loading && <span className={styles.loading}>Loading...</span>}
        </h3>

        {minutes.length === 0 ? (
          <p className={styles.noData}>
            {loading ? 'Loading minutes...' : 'No minutes found. Upload one to get started!'}
          </p>
        ) : (
          <div className={styles.minutesTable}>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Meeting Date</th>
                  <th>Uploaded</th>
                  <th>File Type</th>
                  <th>Size</th>
                  <th>Downloads</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {minutes.map((minute) => (
                  <tr key={minute._id}>
                    <td className={styles.titleCell}>{minute.title}</td>
                    <td>{formatDate(minute.date)}</td>
                    <td>{formatDate(minute.uploadedAt)}</td>
                    <td>{minute.mimeType === 'application/pdf' ? 'PDF' : 'DOCX'}</td>
                    <td>{formatFileSize(minute.fileSize)}</td>
                    <td className={styles.centerCell}>{minute.downloadCount}</td>
                    <td className={styles.actionsCell}>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleDownload(minute)}
                        title="Download"
                      >
                        ⬇ Download
                      </button>
                      {minute.status === 'active' && (
                        <button
                          className={`${styles.actionButton} ${styles.archiveButton}`}
                          onClick={() => handleArchive(minute._id)}
                          title="Archive"
                        >
                          📦 Archive
                        </button>
                      )}
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => handleDelete(minute._id)}
                        title="Delete"
                      >
                        🗑 Delete
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

export default MinutesManager;
