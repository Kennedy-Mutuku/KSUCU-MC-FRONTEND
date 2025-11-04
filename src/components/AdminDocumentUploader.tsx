import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../config/environment';

interface Category {
  _id: string;
  name: string;
  color: string;
  icon: string;
}

interface AdminDocumentUploaderProps {
  userId: string;
  userName: string;
  categories: Category[];
  onUploadSuccess?: () => void;
  onClose?: () => void;
}

const AdminDocumentUploader = ({
  userId,
  userName,
  categories,
  onUploadSuccess,
  onClose
}: AdminDocumentUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('Uncategorized');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  const handleFileSelect = (selectedFiles: FileList) => {
    setError('');
    setSuccess('');

    const newFiles: File[] = [];
    const errors: string[] = [];

    Array.from(selectedFiles).forEach((file) => {
      // Validate file type
      if (!allowedFileTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type`);
        return;
      }

      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        errors.push(`${file.name}: File size exceeds 50MB limit`);
        return;
      }

      newFiles.push(file);
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
    }

    if (newFiles.length > 0) {
      setFiles([...files, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      let uploadedCount = 0;
      const uploadErrors: string[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('document', file);
        formData.append('userId', userId);
        formData.append('description', description);
        formData.append('categoryId', categoryId);
        formData.append('categoryName', categoryName);
        if (expiryDate) {
          formData.append('expiryDate', expiryDate);
        }
        formData.append('notes', notes);

        const response = await fetch(getApiUrl('uploadDocumentAdmin'), {
          method: 'POST',
          credentials: 'include',
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          uploadErrors.push(`${file.name}: ${errorData.message || 'Upload failed'}`);
        } else {
          uploadedCount++;
        }
      }

      if (uploadErrors.length > 0) {
        setError(uploadErrors.join('\n'));
      }

      if (uploadedCount > 0) {
        setSuccess('Documents uploaded successfully!');
        setFiles([]);
        setDescription('');
        setNotes('');
        setExpiryDate('');

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        setTimeout(() => {
          if (onUploadSuccess) {
            onUploadSuccess();
          }
        }, 1500);
      }
    } catch (err) {
      console.error('Error uploading documents:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload documents');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '600px',
      width: '100%'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '1.3rem' }}>Upload Documents</h2>
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
            <strong>Success!</strong> Documents uploaded successfully
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
          color: '#c62828',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
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
            backgroundColor: files.length > 0 ? '#e3f2fd' : '#f0f9ff',
            marginBottom: '16px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = '#0099cc';
            (e.currentTarget as HTMLDivElement).style.backgroundColor = '#e3f2fd';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = '#00c6ff';
            (e.currentTarget as HTMLDivElement).style.backgroundColor = files.length > 0 ? '#e3f2fd' : '#f0f9ff';
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileSelect(e.target.files);
              }
            }}
            style={{ display: 'none' }}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.webp"
          />

          <Upload size={32} style={{ color: '#00c6ff', marginBottom: '10px' }} />
          <p style={{ margin: '10px 0 0 0', color: '#333', fontWeight: '600' }}>
            Drag files here or click to browse
          </p>
          <p style={{ margin: '5px 0 0 0', color: '#999', fontSize: '0.85rem' }}>
            Multiple files supported (Max 50MB each)
          </p>
        </div>

        {/* Selected Files List */}
        {files.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600' }}>
              Selected Files ({files.length})
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {files.map((file, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    backgroundColor: '#f8f8f8',
                    borderRadius: '6px',
                    border: '1px solid #eee'
                  }}
                >
                  <div>
                    <p style={{ margin: '0 0 4px 0', color: '#333', fontSize: '0.9rem' }}>
                      {file.name}
                    </p>
                    <p style={{ margin: 0, color: '#999', fontSize: '0.8rem' }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    style={{
                      background: '#ffebee',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      color: '#c62828'
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Selection */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600' }}>
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => {
              const selected = categories.find(c => c._id === e.target.value);
              setCategoryId(e.target.value);
              if (selected) {
                setCategoryName(selected.name);
              } else {
                setCategoryName('Uncategorized');
              }
            }}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '0.9rem',
              boxSizing: 'border-box'
            }}
          >
            <option value="">-- Select Category (Optional) --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600' }}>
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description for these documents..."
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              resize: 'vertical',
              minHeight: '60px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Admin Notes */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600' }}>
            Admin Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Internal notes about these documents..."
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              resize: 'vertical',
              minHeight: '60px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Expiry Date */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600' }}>
            Expiry Date (Optional)
          </label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '0.9rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={files.length === 0 || loading}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: files.length > 0 && !loading ? '#00c6ff' : '#ccc',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: files.length > 0 && !loading ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => {
              if (files.length > 0 && !loading) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0099cc';
              }
            }}
            onMouseLeave={(e) => {
              if (files.length > 0 && !loading) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#00c6ff';
              }
            }}
          >
            {loading ? 'Uploading...' : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
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
          Allowed: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG, GIF, WEBP (Max 50MB each)
        </p>
      </form>
    </div>
  );
};

export default AdminDocumentUploader;
