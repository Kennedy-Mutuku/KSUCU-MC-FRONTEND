import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/mediaAdmin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faImages,
    faPlus,
    faTrash,
    faEdit,
    faSave,
    faCancel,
    faCalendarAlt,
    faEye,
    faSync,
    faExclamationTriangle,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { getApiUrl, getImageUrl, getBaseUrl, isDevMode } from '../config/environment';
import { useOverseerAuth } from '../hooks/useOverseerAuth';
import OverseerLogoutButton from '../components/OverseerLogoutButton';
import ToastContainer from '../components/ToastContainer';
import { ToastProps } from '../components/Toast';

interface MediaItem {
    _id?: string;
    id?: string;
    event: string;
    date: string;
    link: string;
    imageUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Default events as fallback
const defaultEvents: MediaItem[] = [
    { event: "Subcomm photos", date: "2025-01-20", link: "https://photos.app.goo.gl/PrxWoMuyRNEet22b7" },
    { event: "Sunday service", date: "2025-22-13", link: "https://photos.app.goo.gl/Vt6HDo1xEtgA3Nmn9" },
    { event: "Worship Weekend", date: "2025-02-10", link: "https://photos.app.goo.gl/wbNV3coJREGEUSZX7" },
    { event: "Bible Study weekend", date: "2025-01-26", link: "https://photos.app.goo.gl/otVcso25sG6fkxjR8" },
    { event: "Evangelism photos", date: "2025-02-02", link: "https://photos.app.goo.gl/JvqV19BaGGZwrVFS7" },
    { event: "Weekend Photos", date: "2025-02-09", link: "https://photos.app.goo.gl/HkBvW67gyDSvLqgS7" },
    { event: "KSUCU-MC MEGA HIKE", date: "2025-02-15", link: "https://photos.app.goo.gl/RaNP4ikjEjXLHBmbA" },
    { event: "Creative Night photos", date: "2025-02-11", link: "https://photos.app.goo.gl/qYjukQAuWAdzBpaA7" },
    { event: "Valentine's concert ", date: "2025-02-17", link: "https://photos.app.goo.gl/BvYon9KCNPL1uMu87" },
    { event: "Weekend Photos", date: "2025-02-17", link: "https://photos.app.goo.gl/gMuMfKPvCx3rTRRn8" },
    { event: "Worship Weekend", date: "14th - 16th march", link: "https://photos.app.goo.gl/t2uVjvUSepDBcx3LA" },
    { event: "Prayer Week", date: "7th - 9th March", link: "https://photos.app.goo.gl/24sm1zdBxdUege3Y6" },
    { event: "Elders Day", date: "22nd March", link: "https://photos.app.goo.gl/L9Hkr8BxnVP1MSsD6" },
    { event: "Hymn Sunday", date: "23nd March", link: "https://photos.app.goo.gl/RWWRM2zp9LkmVgtU6" },
    { event: "Sunday service", date: "24nd March", link: "https://photos.app.goo.gl/UnA7f6Aqp3kHtsxaA" },
    { event: "Missions Trip", date: "2025-03-30", link: "https://photos.app.goo.gl/example123" },
];

const MediaAdmin: React.FC = () => {
    const navigate = useNavigate();
    const { authenticated, loading: authLoading } = useOverseerAuth();
    const [mediaItems, setMediaItems] = useState<MediaItem[]>(defaultEvents);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingItem, setEditingItem] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
    const [newItem, setNewItem] = useState<MediaItem>({
        event: '',
        date: new Date().toISOString().split('T')[0],
        link: '',
        imageUrl: ''
    });
    const [newItemPreviewUrl, setNewItemPreviewUrl] = useState<string>('');
    const [toasts, setToasts] = useState<Omit<ToastProps, 'onClose'>[]>([]);
    const [confirmModal, setConfirmModal] = useState<{
        show: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        type: 'danger' | 'warning';
    }>({ show: false, title: '', message: '', onConfirm: () => {}, type: 'danger' });

    const showToast = useCallback((message: string, type: ToastProps['type']) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showConfirm = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'warning' = 'danger') => {
        setConfirmModal({ show: true, title, message, onConfirm, type });
    };

    const formatDateForInput = (dateStr: string): string => {
        if (!dateStr) return new Date().toISOString().split('T')[0];
        try {
            if (dateStr.includes('-')) {
                const parts = dateStr.split('-');
                if (parts.length === 3 && parts[0].length === 4) {
                    return dateStr;
                }
            }
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) {
                return new Date().toISOString().split('T')[0];
            }
            return date.toISOString().split('T')[0];
        } catch {
            return new Date().toISOString().split('T')[0];
        }
    };

    useEffect(() => {
        console.log('Environment Debug:', {
            isDev: isDevMode(),
            baseUrl: getBaseUrl(),
            hostname: window.location.hostname,
            sampleImageUrl: getImageUrl('/uploads/media/test.png')
        });
        loadMediaItems();
    }, []);

    const loadMediaItems = async () => {
        setLoading(true);
        setSyncStatus('syncing');

        try {
            const timestamp = new Date().getTime();
            const apiUrl = `${getApiUrl('api/media-items')}?t=${timestamp}`;

            const response = await fetch(apiUrl, {
                method: 'GET',
                credentials: 'include',
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const apiItems = data.data || [];

                const mergedItems = [...apiItems];
                defaultEvents.forEach(defaultItem => {
                    const exists = apiItems.some((apiItem: MediaItem) =>
                        apiItem.event === defaultItem.event &&
                        apiItem.link === defaultItem.link
                    );
                    if (!exists) {
                        mergedItems.push(defaultItem);
                    }
                });

                setMediaItems(mergedItems);
                localStorage.setItem('ksucu-media-items', JSON.stringify(mergedItems));
                setSyncStatus('success');

                window.dispatchEvent(new CustomEvent('mediaItemsUpdated', {
                    detail: mergedItems
                }));
            } else {
                const savedItems = localStorage.getItem('ksucu-media-items');
                if (savedItems) {
                    setMediaItems(JSON.parse(savedItems));
                } else {
                    setMediaItems(defaultEvents);
                    localStorage.setItem('ksucu-media-items', JSON.stringify(defaultEvents));
                }
                setSyncStatus('error');
            }
        } catch (error) {
            console.error('MediaAdmin: Error loading media items:', error);
            const savedItems = localStorage.getItem('ksucu-media-items');
            if (savedItems) {
                setMediaItems(JSON.parse(savedItems));
            } else {
                setMediaItems(defaultEvents);
                localStorage.setItem('ksucu-media-items', JSON.stringify(defaultEvents));
            }
            setSyncStatus('error');
        } finally {
            setLoading(false);
            setTimeout(() => setSyncStatus('idle'), 3000);
        }
    };

    const handleAddNew = async () => {
        if (newItem.event && newItem.date && newItem.link) {
            setLoading(true);
            setSyncStatus('syncing');
            try {
                const response = await fetch(getApiUrl('api/media-items'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(newItem)
                });

                if (response.ok) {
                    setSyncStatus('success');
                    setNewItem({ event: '', date: new Date().toISOString().split('T')[0], link: '', imageUrl: '' });
                    setNewItemPreviewUrl('');
                    setIsAddingNew(false);
                    await loadMediaItems();
                    showToast('Media item added successfully!', 'success');
                } else {
                    setSyncStatus('error');
                    showToast('Failed to add media item. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Error adding media item:', error);
                setSyncStatus('error');
                showToast('Failed to add media item. Please try again.', 'error');
            } finally {
                setLoading(false);
                setTimeout(() => setSyncStatus('idle'), 3000);
            }
        } else {
            showToast('Please fill in all required fields: Event Name, Date, and Photo Link', 'warning');
        }
    };

    const handleEdit = (item: MediaItem) => {
        setEditingItem(item._id || item.id || '');
    };

    const handleSaveEdit = async (id: string, updatedItem: MediaItem) => {
        setLoading(true);
        setSyncStatus('syncing');
        try {
            const itemId = updatedItem._id || id;
            const response = await fetch(getApiUrl(`api/media-items/${itemId}`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedItem)
            });

            if (response.ok) {
                setSyncStatus('success');
                setEditingItem(null);
                await loadMediaItems();
                showToast('Media item updated successfully!', 'success');
            } else {
                setSyncStatus('error');
                showToast('Failed to update media item. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error updating media item:', error);
            setSyncStatus('error');
            showToast('Failed to update media item. Please try again.', 'error');
        } finally {
            setLoading(false);
            setTimeout(() => setSyncStatus('idle'), 3000);
        }
    };

    const handleDelete = (id: string) => {
        const item = mediaItems.find(i => (i._id || i.id) === id);
        showConfirm(
            'Delete Media Item',
            `Are you sure you want to delete "${item?.event || 'this item'}"? This action cannot be undone.`,
            async () => {
                setConfirmModal(prev => ({ ...prev, show: false }));
                setLoading(true);
                setSyncStatus('syncing');
                try {
                    const itemId = item?._id || id;
                    const response = await fetch(getApiUrl(`api/media-items/${itemId}`), {
                        method: 'DELETE',
                        credentials: 'include'
                    });

                    if (response.ok) {
                        setSyncStatus('success');
                        await loadMediaItems();
                        showToast('Media item deleted successfully.', 'success');
                    } else {
                        setSyncStatus('error');
                        showToast('Failed to delete media item. Please try again.', 'error');
                    }
                } catch (error) {
                    console.error('Error deleting media item:', error);
                    setSyncStatus('error');
                    showToast('Failed to delete media item. Please try again.', 'error');
                } finally {
                    setLoading(false);
                    setTimeout(() => setSyncStatus('idle'), 3000);
                }
            },
            'danger'
        );
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, itemId?: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('Please select an image file (PNG, JPG, GIF, WebP)', 'warning');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            showToast('Image file is too large. Please select a file under 10MB.', 'warning');
            return;
        }

        // Show local preview immediately
        if (!itemId) {
            const blobUrl = URL.createObjectURL(file);
            setNewItemPreviewUrl(blobUrl);
        }

        setLoading(true);
        setSyncStatus('syncing');

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(getApiUrl('api/media-items/upload-image'), {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                const imageUrl = data.imageUrl;

                if (itemId) {
                    const item = mediaItems.find(i => (i._id || i.id) === itemId);
                    if (item) {
                        await handleSaveEdit(itemId, { ...item, imageUrl });
                    }
                } else {
                    setNewItem(prev => ({ ...prev, imageUrl }));
                    setSyncStatus('success');
                }
                showToast('Image uploaded successfully!', 'success');
            } else {
                const error = await response.json();
                setSyncStatus('error');
                showToast(`Failed to upload image: ${error.message || 'Unknown error'}`, 'error');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setSyncStatus('error');
            showToast('Failed to upload image. Please try again later.', 'error');
        } finally {
            setLoading(false);
            setTimeout(() => setSyncStatus('idle'), 3000);
        }
    };

    if (authLoading) {
        return (
            <div className={styles.container}>
                <p style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>Verifying session...</p>
            </div>
        );
    }

    if (!authenticated) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Media Admin - Authentication Required</h1>
                    <p>Please access this page through the Overseer dashboard.</p>
                    <button
                        onClick={() => navigate('/worship-docket-admin')}
                        style={{
                            padding: '10px 20px',
                            background: '#730051',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Go to Admin Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={styles.container}>
                <OverseerLogoutButton />
                <div className={styles.header}>
                    <h1>
                        <FontAwesomeIcon icon={faImages} />
                        Media Gallery Management
                    </h1>
                    <p>Add, edit, or remove photos and links from the KSUCU media gallery</p>
                </div>

                {/* Sync Status Indicator */}
                <div className={styles.syncStatus}>
                    {syncStatus === 'syncing' && (
                        <span className={styles.syncing}>
                            <FontAwesomeIcon icon={faSync} spin /> Syncing...
                        </span>
                    )}
                    {syncStatus === 'success' && (
                        <span className={styles.success}>
                            <FontAwesomeIcon icon={faSync} /> Synced
                        </span>
                    )}
                    {syncStatus === 'error' && (
                        <span className={styles.error}>
                            <FontAwesomeIcon icon={faSync} /> Sync Error - Using Offline Mode
                        </span>
                    )}
                </div>

                {/* Add New Media Item */}
                <div className={styles.addSection}>
                    <button
                        className={styles.addButton}
                        onClick={() => setIsAddingNew(!isAddingNew)}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Add New Media Item
                    </button>
                </div>

                {isAddingNew && (
                    <div className={styles.addForm}>
                        <h3>Add New Media Item</h3>
                        <div className={styles.formGroup}>
                            <label>Event Name</label>
                            <input
                                type="text"
                                value={newItem.event}
                                onChange={(e) => setNewItem(prev => ({ ...prev, event: e.target.value }))}
                                placeholder="e.g., Sunday Service"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Date</label>
                            <input
                                type="date"
                                value={newItem.date}
                                onChange={(e) => setNewItem(prev => ({ ...prev, date: e.target.value }))}
                                className={styles.dateInput}
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Photo Link (Google Photos, etc.)</label>
                            <input
                                type="url"
                                value={newItem.link}
                                onChange={(e) => setNewItem(prev => ({ ...prev, link: e.target.value }))}
                                placeholder="https://photos.app.goo.gl/..."
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Upload Thumbnail (Optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e)}
                                className={styles.fileInput}
                            />
                        </div>
                        {(newItemPreviewUrl || newItem.imageUrl) && (
                            <div className={styles.imagePreview}>
                                <img
                                    src={newItemPreviewUrl || getImageUrl(newItem.imageUrl || '')}
                                    alt="Preview"
                                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                                />
                            </div>
                        )}
                        <div className={styles.formActions}>
                            <button className={styles.saveButton} onClick={handleAddNew} disabled={loading}>
                                <FontAwesomeIcon icon={faSave} />
                                Add Item
                            </button>
                            <button className={styles.cancelButton} onClick={() => { setIsAddingNew(false); setNewItemPreviewUrl(''); }}>
                                <FontAwesomeIcon icon={faCancel} />
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Refresh Button */}
                <div className={styles.refreshSection}>
                    <button
                        className={styles.refreshButton}
                        onClick={loadMediaItems}
                        disabled={loading}
                    >
                        <FontAwesomeIcon icon={faSync} spin={loading} />
                        {loading ? 'Refreshing...' : 'Refresh Gallery'}
                    </button>
                </div>

                {/* Media Items List */}
                <div className={styles.mediaList}>
                    <h2>Existing Media Items ({mediaItems.length})</h2>
                    <div className={styles.mediaGrid}>
                        {mediaItems.map((item) => (
                            <MediaItemCard
                                key={item._id || item.id}
                                item={item}
                                isEditing={editingItem === (item._id || item.id)}
                                onEdit={handleEdit}
                                onSave={handleSaveEdit}
                                onDelete={handleDelete}
                                onCancel={() => setEditingItem(null)}
                                onImageUpload={(e) => handleImageUpload(e, item._id || item.id)}
                                formatDateForInput={formatDateForInput}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} onClose={removeToast} />

            {/* Confirmation Modal */}
            {confirmModal.show && (
                <div className={styles.modalOverlay} onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}>
                    <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
                        <div className={`${styles.confirmIcon} ${confirmModal.type === 'danger' ? styles.confirmDanger : styles.confirmWarning}`}>
                            <FontAwesomeIcon icon={confirmModal.type === 'danger' ? faExclamationTriangle : faCheckCircle} />
                        </div>
                        <h3 className={styles.confirmTitle}>{confirmModal.title}</h3>
                        <p className={styles.confirmMessage}>{confirmModal.message}</p>
                        <div className={styles.confirmActions}>
                            <button
                                className={styles.confirmCancelBtn}
                                onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
                            >
                                Cancel
                            </button>
                            <button
                                className={`${styles.confirmBtn} ${confirmModal.type === 'danger' ? styles.confirmBtnDanger : styles.confirmBtnWarning}`}
                                onClick={confirmModal.onConfirm}
                            >
                                {confirmModal.type === 'danger' ? 'Delete' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

interface MediaItemCardProps {
    item: MediaItem;
    isEditing: boolean;
    onEdit: (item: MediaItem) => void;
    onSave: (id: string, item: MediaItem) => void;
    onDelete: (id: string) => void;
    onCancel: () => void;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    formatDateForInput: (date: string) => string;
}

const MediaItemCard: React.FC<MediaItemCardProps> = ({
    item,
    isEditing,
    onEdit,
    onSave,
    onDelete,
    onCancel,
    onImageUpload,
    formatDateForInput
}) => {
    const [editData, setEditData] = useState<MediaItem>(item);

    useEffect(() => {
        setEditData({
            ...item,
            date: formatDateForInput(item.date)
        });
    }, [item, formatDateForInput]);

    if (isEditing) {
        return (
            <div className={styles.mediaCard + ' ' + styles.editing}>
                <div className={styles.editForm}>
                    <input
                        type="text"
                        value={editData.event}
                        onChange={(e) => setEditData(prev => ({ ...prev, event: e.target.value }))}
                        placeholder="Event name"
                    />
                    <input
                        type="date"
                        value={editData.date}
                        onChange={(e) => setEditData(prev => ({ ...prev, date: e.target.value }))}
                        className={styles.dateInput}
                        max={new Date().toISOString().split('T')[0]}
                    />
                    <input
                        type="url"
                        value={editData.link}
                        onChange={(e) => setEditData(prev => ({ ...prev, link: e.target.value }))}
                        placeholder="Photo link"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onImageUpload}
                        className={styles.fileInput}
                    />
                    {editData.imageUrl && (
                        <div className={styles.imagePreview}>
                            <img
                                src={getImageUrl(editData.imageUrl)}
                                alt="Preview"
                                style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                    <div className={styles.editActions}>
                        <button onClick={() => onSave(item._id || item.id || '', editData)}>
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button onClick={onCancel}>
                            <FontAwesomeIcon icon={faCancel} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.mediaCard}>
            {item.imageUrl ? (
                <div className={styles.mediaImage}>
                    <img
                        src={getImageUrl(item.imageUrl || '')}
                        alt={item.event}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent && !parent.querySelector('.fallback-icon')) {
                                const fallbackDiv = document.createElement('div');
                                fallbackDiv.className = 'fallback-icon';
                                fallbackDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 50px;';
                                fallbackDiv.textContent = '\uD83D\uDCF7';
                                parent.appendChild(fallbackDiv);
                            }
                        }}
                    />
                </div>
            ) : (
                <div className={styles.mediaPlaceholder}>
                    <FontAwesomeIcon icon={faImages} />
                </div>
            )}
            <div className={styles.mediaContent}>
                <h4>{item.event}</h4>
                <p className={styles.mediaDate}>
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    {item.date}
                </p>
                <div className={styles.mediaActions}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.viewButton}>
                        <FontAwesomeIcon icon={faEye} />
                        View
                    </a>
                    <button className={styles.editButton} onClick={() => onEdit(item)}>
                        <FontAwesomeIcon icon={faEdit} />
                        Edit
                    </button>
                    <button className={styles.deleteButton} onClick={() => onDelete(item._id || item.id || '')}>
                        <FontAwesomeIcon icon={faTrash} />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MediaAdmin;
