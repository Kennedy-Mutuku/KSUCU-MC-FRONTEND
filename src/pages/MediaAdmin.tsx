import React, { useState, useEffect } from 'react';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
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
    faSync
} from '@fortawesome/free-solid-svg-icons';
import { getApiUrl } from '../config/environment';

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
    const [mediaItems, setMediaItems] = useState<MediaItem[]>(defaultEvents);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingItem, setEditingItem] = useState<string | null>(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
    const [newItem, setNewItem] = useState<MediaItem>({
        event: '',
        date: new Date().toISOString().split('T')[0],
        link: '',
        imageUrl: ''
    });

    // Helper function to format date for input field
    const formatDateForInput = (dateStr: string): string => {
        if (!dateStr) return new Date().toISOString().split('T')[0];
        
        try {
            // Handle various date formats
            if (dateStr.includes('-')) {
                // Already in YYYY-MM-DD format or similar
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
        // Check for authentication first
        const adminAuth = sessionStorage.getItem('adminAuth');
        console.log('MediaAdmin Debug: adminAuth =', adminAuth);
        console.log('MediaAdmin Debug: defaultEvents length =', defaultEvents.length);
        console.log('MediaAdmin Debug: current mediaItems length =', mediaItems.length);
        
        if (adminAuth === 'Overseer') {
            setAuthenticated(true);
            loadMediaItems();
        } else {
            // Load items for preview even without auth
            loadMediaItems();
        }
    }, []);

    const loadMediaItems = async () => {
        setLoading(true);
        setSyncStatus('syncing');
        
        try {
            const apiUrl = getApiUrl('api/media-items');
            console.log('MediaAdmin Debug: API URL =', apiUrl);
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                credentials: 'include',
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            
            console.log('MediaAdmin Debug: Response status =', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('MediaAdmin Debug: API Success, received data =', data);
                console.log('MediaAdmin Debug: Items count =', data.data?.length);
                
                // Temporary fix: If API returns less than 10 items, use defaults
                if (data.data && data.data.length >= 10) {
                    setMediaItems(data.data);
                    // Also update localStorage as fallback
                    localStorage.setItem('ksucu-media-items', JSON.stringify(data.data || []));
                } else {
                    console.log('MediaAdmin Debug: API returned insufficient items, using defaults');
                    setMediaItems(defaultEvents);
                    // Store defaults in localStorage
                    localStorage.setItem('ksucu-media-items', JSON.stringify(defaultEvents));
                }
                setSyncStatus('success');
                
                // Dispatch event for other components
                const itemsToDispatch = (data.data && data.data.length >= 10) ? data.data : defaultEvents;
                window.dispatchEvent(new CustomEvent('mediaItemsUpdated', { 
                    detail: itemsToDispatch
                }));
            } else {
                console.log('MediaAdmin Debug: API failed with status', response.status);
                // Fallback to localStorage if API fails
                const savedItems = localStorage.getItem('ksucu-media-items');
                if (savedItems) {
                    const parsedItems = JSON.parse(savedItems);
                    console.log('MediaAdmin Debug: Using localStorage items:', parsedItems.length);
                    setMediaItems(parsedItems);
                } else {
                    console.log('MediaAdmin Debug: Using default events:', defaultEvents.length);
                    setMediaItems(defaultEvents);
                }
                setSyncStatus('error');
            }
        } catch (error) {
            console.error('MediaAdmin Debug: Error loading media items:', error);
            // Fallback to localStorage, then default items
            const savedItems = localStorage.getItem('ksucu-media-items');
            if (savedItems) {
                const parsedItems = JSON.parse(savedItems);
                console.log('MediaAdmin Debug: Error fallback - Using localStorage:', parsedItems.length);
                setMediaItems(parsedItems);
            } else {
                console.log('MediaAdmin Debug: Error fallback - Using default events:', defaultEvents.length);
                setMediaItems(defaultEvents);
            }
            setSyncStatus('error');
        } finally {
            setLoading(false);
            setTimeout(() => setSyncStatus('idle'), 3000);
        }
    };

    const saveMediaItems = async (items: MediaItem[]) => {
        setMediaItems(items);
        // Update localStorage immediately for offline support
        localStorage.setItem('ksucu-media-items', JSON.stringify(items));
        
        // Dispatch custom event for same-tab synchronization
        window.dispatchEvent(new CustomEvent('mediaItemsUpdated', { 
            detail: items 
        }));
    };

    const handleAddNew = async () => {
        if (newItem.event && newItem.date && newItem.link) {
            setLoading(true);
            setSyncStatus('syncing');
            try {
                const response = await fetch(getApiUrl('api/media-items'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-admin-password': 'Overseer'
                    },
                    credentials: 'include',
                    body: JSON.stringify(newItem)
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const updatedItems = [data.data, ...mediaItems];
                    await saveMediaItems(updatedItems);
                    setSyncStatus('success');
                    setNewItem({ event: '', date: new Date().toISOString().split('T')[0], link: '', imageUrl: '' });
                    setIsAddingNew(false);
                    // Reload to get fresh data from server
                    await loadMediaItems();
                } else {
                    setSyncStatus('error');
                    alert('Failed to add media item. Please try again.');
                }
            } catch (error) {
                console.error('Error adding media item:', error);
                setSyncStatus('error');
                alert('Failed to add media item. Please try again.');
            } finally {
                setLoading(false);
                setTimeout(() => setSyncStatus('idle'), 3000);
            }
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
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-password': 'Overseer'
                },
                credentials: 'include',
                body: JSON.stringify(updatedItem)
            });
            
            if (response.ok) {
                setSyncStatus('success');
                setEditingItem(null);
                // Reload to get fresh data from server
                await loadMediaItems();
            } else {
                setSyncStatus('error');
                alert('Failed to update media item. Please try again.');
            }
        } catch (error) {
            console.error('Error updating media item:', error);
            setSyncStatus('error');
            alert('Failed to update media item. Please try again.');
        } finally {
            setLoading(false);
            setTimeout(() => setSyncStatus('idle'), 3000);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this media item?')) {
            setLoading(true);
            setSyncStatus('syncing');
            try {
                const item = mediaItems.find(i => (i._id || i.id) === id);
                const itemId = item?._id || id;
                
                const response = await fetch(getApiUrl(`api/media-items/${itemId}`), {
                    method: 'DELETE',
                    headers: {
                        'x-admin-password': 'Overseer'
                    },
                    credentials: 'include'
                });
                
                if (response.ok) {
                    setSyncStatus('success');
                    // Reload to get fresh data from server
                    await loadMediaItems();
                } else {
                    setSyncStatus('error');
                    alert('Failed to delete media item. Please try again.');
                }
            } catch (error) {
                console.error('Error deleting media item:', error);
                setSyncStatus('error');
                alert('Failed to delete media item. Please try again.');
            } finally {
                setLoading(false);
                setTimeout(() => setSyncStatus('idle'), 3000);
            }
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, itemId?: string) => {
        const file = event.target.files?.[0];
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file (PNG, JPG, GIF, WebP)');
            return;
        }
        
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('Image file is too large. Please select a file under 10MB.');
            return;
        }
        
        setLoading(true);
        setSyncStatus('syncing');
        
        try {
            const formData = new FormData();
            formData.append('image', file);
            
            const response = await fetch(getApiUrl('api/media-items/upload-image'), {
                method: 'POST',
                headers: {
                    'x-admin-password': 'Overseer'
                },
                credentials: 'include',
                body: formData
            });
            
            if (response.ok) {
                const data = await response.json();
                const imageUrl = data.imageUrl;
                
                if (itemId) {
                    // Update existing item with server image URL
                    const updatedItems = mediaItems.map(item => 
                        (item._id || item.id) === itemId ? { ...item, imageUrl } : item
                    );
                    setMediaItems(updatedItems);
                    
                    // Also save to localStorage
                    localStorage.setItem('ksucu-media-items', JSON.stringify(updatedItems));
                    
                    // Trigger event for other components
                    window.dispatchEvent(new CustomEvent('mediaItemsUpdated', { 
                        detail: updatedItems 
                    }));
                    
                    setSyncStatus('success');
                } else {
                    // Update new item with server image URL
                    setNewItem(prev => ({ ...prev, imageUrl }));
                    setSyncStatus('success');
                }
            } else {
                const error = await response.json();
                console.error('Upload failed:', error);
                setSyncStatus('error');
                alert(`Failed to upload image: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setSyncStatus('error');
            alert('Failed to upload image. Please try again later.');
        } finally {
            setLoading(false);
            setTimeout(() => setSyncStatus('idle'), 3000);
        }
    };

    if (!authenticated) {
        return (
            <>
                <UniversalHeader />
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1>Media Admin - Authentication Required</h1>
                        <p>Please access this page through the Password Overseer dashboard.</p>
                        <p>Items loaded: {mediaItems.length} (showing first 3 for preview)</p>
                        
                        <button 
                            onClick={() => {
                                sessionStorage.setItem('adminAuth', 'Overseer');
                                setAuthenticated(true);
                                loadMediaItems();
                            }}
                            style={{
                                padding: '10px 20px',
                                background: '#730051',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginRight: '10px'
                            }}
                        >
                            Quick Login (Dev)
                        </button>
                        <button 
                            onClick={() => window.location.href = '/worship-docket-admin'}
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
                    
                    {/* Preview of media items */}
                    <div className={styles.header}>
                        <h2>Media Items Preview</h2>
                        <p>Found {mediaItems.length} media items in database</p>
                        {mediaItems.slice(0, 3).map(item => (
                            <div key={item._id || item.id} style={{border: '1px solid #ccc', padding: '10px', margin: '10px', borderRadius: '5px'}}>
                                <h4>{item.event}</h4>
                                <p><strong>Date:</strong> {item.date}</p>
                                <p><strong>Link:</strong> <a href={item.link} target="_blank" rel="noopener noreferrer">{item.link.substring(0, 50)}...</a></p>
                                {item.imageUrl && <img src={item.imageUrl} alt={item.event} style={{maxWidth: '100px', maxHeight: '100px'}} />}
                            </div>
                        ))}
                        {mediaItems.length > 3 && <p>...and {mediaItems.length - 3} more items</p>}
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <UniversalHeader />
            <div className={styles.container}>
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
                        {newItem.imageUrl && (
                            <div className={styles.imagePreview}>
                                <img src={newItem.imageUrl} alt="Preview" />
                            </div>
                        )}
                        <div className={styles.formActions}>
                            <button className={styles.saveButton} onClick={handleAddNew} disabled={loading}>
                                <FontAwesomeIcon icon={faSave} />
                                Add Item
                            </button>
                            <button className={styles.cancelButton} onClick={() => setIsAddingNew(false)}>
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
            <Footer />
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
                            <img src={editData.imageUrl} alt="Preview" />
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
                    <img src={item.imageUrl} alt={item.event} />
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