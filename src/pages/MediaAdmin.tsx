import React, { useState, useEffect } from 'react';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import BackButton from '../components/BackButton';
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
    faEye
} from '@fortawesome/free-solid-svg-icons';

interface MediaItem {
    id: string;
    event: string;
    date: string;
    link: string;
    imageUrl?: string;
}

const MediaAdmin: React.FC = () => {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingItem, setEditingItem] = useState<string | null>(null);
    const [newItem, setNewItem] = useState<MediaItem>({
        id: '',
        event: '',
        date: '',
        link: '',
        imageUrl: ''
    });

    useEffect(() => {
        // Load existing media items from localStorage or API
        loadMediaItems();
    }, []);

    const loadMediaItems = () => {
        const savedItems = localStorage.getItem('ksucu-media-items');
        if (savedItems) {
            setMediaItems(JSON.parse(savedItems));
        } else {
            // Initialize with existing hardcoded items
            const defaultItems: MediaItem[] = [
                { id: '1', event: "Subcomm photos", date: "2025-01-20", link: "https://photos.app.goo.gl/PrxWoMuyRNEet22b7" },
                { id: '2', event: "Sunday service", date: "2025-22-13", link: "https://photos.app.goo.gl/Vt6HDo1xEtgA3Nmn9" },
                { id: '3', event: "Worship Weekend", date: "2025-02-10", link: "https://photos.app.goo.gl/wbNV3coJREGEUSZX7" },
                { id: '4', event: "Bible Study weekend", date: "2025-01-26", link: "https://photos.app.goo.gl/otVcso25sG6fkxjR8" },
                { id: '5', event: "Evangelism photos", date: "2025-02-02", link: "https://photos.app.goo.gl/JvqV19BaGGZwrVFS7" }
            ];
            setMediaItems(defaultItems);
            localStorage.setItem('ksucu-media-items', JSON.stringify(defaultItems));
        }
    };

    const saveMediaItems = (items: MediaItem[]) => {
        setMediaItems(items);
        localStorage.setItem('ksucu-media-items', JSON.stringify(items));
    };

    const handleAddNew = () => {
        if (newItem.event && newItem.date && newItem.link) {
            const item: MediaItem = {
                ...newItem,
                id: Date.now().toString()
            };
            const updatedItems = [item, ...mediaItems];
            saveMediaItems(updatedItems);
            setNewItem({ id: '', event: '', date: '', link: '', imageUrl: '' });
            setIsAddingNew(false);
        }
    };

    const handleEdit = (item: MediaItem) => {
        setEditingItem(item.id);
    };

    const handleSaveEdit = (id: string, updatedItem: MediaItem) => {
        const updatedItems = mediaItems.map(item => 
            item.id === id ? { ...updatedItem, id } : item
        );
        saveMediaItems(updatedItems);
        setEditingItem(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this media item?')) {
            const updatedItems = mediaItems.filter(item => item.id !== id);
            saveMediaItems(updatedItems);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, itemId?: string) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target?.result as string;
                if (itemId) {
                    // Update existing item
                    const updatedItems = mediaItems.map(item => 
                        item.id === itemId ? { ...item, imageUrl } : item
                    );
                    saveMediaItems(updatedItems);
                } else {
                    // Update new item
                    setNewItem(prev => ({ ...prev, imageUrl }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <BackButton />
            <UniversalHeader />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>
                        <FontAwesomeIcon icon={faImages} />
                        Media Gallery Management
                    </h1>
                    <p>Add, edit, or remove photos and links from the KSUCU media gallery</p>
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
                                type="text"
                                value={newItem.date}
                                onChange={(e) => setNewItem(prev => ({ ...prev, date: e.target.value }))}
                                placeholder="e.g., 2025-03-15"
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
                            <button className={styles.saveButton} onClick={handleAddNew}>
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

                {/* Media Items List */}
                <div className={styles.mediaList}>
                    <h2>Existing Media Items ({mediaItems.length})</h2>
                    <div className={styles.mediaGrid}>
                        {mediaItems.map((item) => (
                            <MediaItemCard 
                                key={item.id}
                                item={item}
                                isEditing={editingItem === item.id}
                                onEdit={handleEdit}
                                onSave={handleSaveEdit}
                                onDelete={handleDelete}
                                onCancel={() => setEditingItem(null)}
                                onImageUpload={(e) => handleImageUpload(e, item.id)}
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
}

const MediaItemCard: React.FC<MediaItemCardProps> = ({
    item,
    isEditing,
    onEdit,
    onSave,
    onDelete,
    onCancel,
    onImageUpload
}) => {
    const [editData, setEditData] = useState<MediaItem>(item);

    useEffect(() => {
        setEditData(item);
    }, [item]);

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
                        type="text"
                        value={editData.date}
                        onChange={(e) => setEditData(prev => ({ ...prev, date: e.target.value }))}
                        placeholder="Date"
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
                        <button onClick={() => onSave(item.id, editData)}>
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
                    <button className={styles.deleteButton} onClick={() => onDelete(item.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MediaAdmin;