import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../config/environment';

interface DocumentUploaderProps {
  userId: string;
  onUploadSuccess?: () => void;
  onClose?: () => void;
  userName?: string;
}

const DocumentUploader = ({ userId, onUploadSuccess, onClose, userName }: DocumentUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif'
  ];

  const handleFileSelect = (selectedFile: File) => {
    setError('');
    setSuccess(false);

    if (!selectedFile) {
      return;
    }

    // Validate file type
    if (!allowedFileTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG, GIF are allowed.');
      return;
    }

    // Validate file size (50MB max)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit');
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      const formData = new FormData();
      formData.append('document', file);
      formData.append('userId', userId);
      formData.append('description', description);

      const response = await fetch(getApiUrl('uploadDocument'), {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      setSuccess(true);
      setFile(null);
      setDescription('');

      // Reset form
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Call success callback
      if (onUploadSuccess) {
        setTimeout(() => {
          onUploadSuccess();
        }, 1500);
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '500px',
      width: '100%'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '1.3rem' }}>Upload Document</h2>
          {userName && <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>For: <strong>{userName}</strong></p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#999',
              fontSize: '24px'
            }}
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div style={{
          backgroundColor: '#e8f5e9',
          border: '1px solid #4CAF50',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          display: 'flex',
          gap: '10px',
          color: '#2e7d32'
        }}>
          <CheckCircle size={20} />
          <div>
            <strong>Success!</strong> Document uploaded successfully
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          border: '1px solid #f44336',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          display: 'flex',
          gap: '10px',
          color: '#c62828'
        }}>
          <AlertCircle size={20} />
          <div>{error}</div>
        </div>
      )}

      <form onSubmit={handleUpload}>
        {/* File Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed #00c6ff',
            borderRadius: '8px',
            padding: '40px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: '#f0f9ff',
            marginBottom: '16px',
            transition: 'all 0.3s',
            backgroundColor: file ? '#e3f2fd' : '#f0f9ff'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = '#0099cc';
            (e.currentTarget as HTMLDivElement).style.backgroundColor = '#e3f2fd';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = '#00c6ff';
            (e.currentTarget as HTMLDivElement).style.backgroundColor = file ? '#e3f2fd' : '#f0f9ff';
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
              }
            }}
            style={{ display: 'none' }}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
          />

          {file ? (
            <div>
              <Upload size={32} style={{ color: '#00c6ff', marginBottom: '10px' }} />
              <p style={{ margin: '10px 0 0 0', color: '#333', fontWeight: '600' }}>
                {file.name}
              </p>
              <p style={{ margin: '5px 0 0 0', color: '#999', fontSize: '0.85rem' }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div>
              <Upload size={32} style={{ color: '#00c6ff', marginBottom: '10px' }} />
              <p style={{ margin: '10px 0 0 0', color: '#333', fontWeight: '600' }}>
                Drag and drop your file here
              </p>
              <p style={{ margin: '5px 0 0 0', color: '#999', fontSize: '0.9rem' }}>
                or click to browse
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600' }}>
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description for this document..."
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              resize: 'vertical',
              minHeight: '80px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={!file || loading}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: file && !loading ? '#00c6ff' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: file && !loading ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => {
              if (file && !loading) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0099cc';
              }
            }}
            onMouseLeave={(e) => {
              if (file && !loading) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#00c6ff';
              }
            }}
          >
            {loading ? 'Uploading...' : 'Upload Document'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 20px',
                backgroundColor: '#f0f0f0',
                color: '#333',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#e0e0e0';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f0f0f0';
              }}
            >
              Cancel
            </button>
          )}
        </div>

        {/* Allowed File Types */}
        <p style={{
          marginTop: '16px',
          fontSize: '0.85rem',
          color: '#999',
          textAlign: 'center'
        }}>
          Allowed: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG, GIF (Max 50MB)
        </p>
      </form>
    </div>
  );
};

export default DocumentUploader;
