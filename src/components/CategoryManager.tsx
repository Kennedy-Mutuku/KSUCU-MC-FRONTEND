import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { getApiUrl } from '../config/environment';

interface Category {
  _id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated?: () => void;
  categories?: Category[];
}

const CategoryManager = ({ isOpen, onClose, onCategoryCreated, categories = [] }: CategoryManagerProps) => {
  const [newCategory, setNewCategory] = useState({ name: '', description: '', color: '#00c6ff', icon: '📄' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const colors = ['#00c6ff', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
  const icons = ['📄', '📋', '🎓', '💰', '📧', '🆔', '📊', '🔒'];

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategory.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch(getApiUrl('createDocumentCategory'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCategory)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create category');
      }

      setSuccess('Category created successfully!');
      setNewCategory({ name: '', description: '', color: '#00c6ff', icon: '📄' });

      setTimeout(() => {
        if (onCategoryCreated) {
          onCategoryCreated();
        }
      }, 1000);
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err instanceof Error ? err.message : 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
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
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#000' }}>Manage Categories</h2>
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
        </div>

        {/* Error Message */}
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

        {/* Success Message */}
        {success && (
          <div style={{
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '0.9rem'
          }}>
            ✓ {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleCreateCategory} style={{ marginBottom: '24px' }}>
          {/* Category Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Category Name
            </label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder="e.g., Admission Form, ID Copy, Payment Receipt"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '0.95rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Description (Optional)
            </label>
            <textarea
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              placeholder="Add a description for this category"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '0.95rem',
                minHeight: '60px',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Color Picker */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Color
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewCategory({ ...newCategory, color })}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: color,
                    border: newCategory.color === color ? '3px solid #000' : '1px solid #ddd',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Icon Picker */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Icon
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setNewCategory({ ...newCategory, icon })}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: newCategory.icon === icon ? '#f0f0f0' : '#fff',
                    border: newCategory.icon === icon ? '2px solid #00c6ff' : '1px solid #ddd',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#00c6ff',
                color: '#000',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: loading ? 0.6 : 1
              }}
            >
              <Plus size={18} />
              {loading ? 'Creating...' : 'Create Category'}
            </button>
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
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </form>

        {/* Existing Categories */}
        {categories && categories.length > 0 && (
          <div>
            <h3 style={{ marginTop: '24px', marginBottom: '16px', color: '#333' }}>Existing Categories</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: '#f8f8f8',
                    borderRadius: '8px',
                    border: `2px solid ${cat.color}`
                  }}
                >
                  <span style={{ fontSize: '1.5rem', marginRight: '12px' }}>{cat.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#333' }}>{cat.name}</div>
                    {cat.description && <div style={{ fontSize: '0.85rem', color: '#666' }}>{cat.description}</div>}
                  </div>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: cat.color,
                      border: '1px solid #ddd'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
