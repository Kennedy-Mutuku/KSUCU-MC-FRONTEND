import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Upload } from 'lucide-react';
import styles from '../styles/superAdmin.module.css';
import { CommitteeService, CommitteeMember } from '../services/committeeService';

const CommitteeManager: React.FC = () => {
    const [members, setMembers] = useState<CommitteeMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);

    // Form State
    const [formData, setFormData] = useState<CommitteeMember>({
        id: 0,
        name: '',
        position: '',
        bio: '',
        image: '',
        yearOfStudy: '',
        course: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await CommitteeService.getMembers();
            setMembers(data);
        } catch (error) {
            console.error("Failed to load members", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (member?: CommitteeMember) => {
        if (member) {
            setEditingMember(member);
            setFormData(member);
        } else {
            setEditingMember(null);
            setFormData({
                id: Date.now(), // Use timestamp as simple ID
                name: '',
                position: '',
                bio: '',
                image: '',
                yearOfStudy: '',
                course: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMember(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // In a real app with backend, you would upload to server here.
            // For now, we create a local data URL. 
            // Warning: LocalStorage has a size limit (usually 5MB). Large images might crash it.
            // Real solution: Upload to server -> get URL.
            // Temp solution: Use FileReader.
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            await CommitteeService.saveMember(formData);
            await loadData(); // Reload to get fresh list
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save", error);
            alert("Failed to save member.");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this member?')) {
            try {
                await CommitteeService.deleteMember(id);
                await loadData(); // Reload
            } catch (error) {
                console.error("Failed to delete", error);
                alert("Failed to delete member.");
            }
        }
    };

    if (loading) return <div>Loading committee members...</div>;

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <div>
                    <h2 className={styles.sectionTitle}>Committee Management</h2>
                    <p className={styles.sectionDescription}>Manage Christian Minds committee members, roles, and details.</p>
                </div>
                <button className={styles.primaryButton} onClick={() => handleOpenModal()}>
                    <Plus size={18} style={{ marginRight: '8px' }} />
                    Add Member
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {members.map(member => (
                    <div key={member.id} style={{
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s'
                    }}>
                        <div style={{ height: '200px', background: '#f0f0f0', position: 'relative' }}>
                            {member.image ? (
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
                                    No Image
                                </div>
                            )}
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(255,255,255,0.9)',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: '#6d0a51'
                            }}>
                                Year {member.yearOfStudy}
                            </div>
                        </div>

                        <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0 0 5px', color: '#333', fontSize: '1.2rem' }}>{member.name}</h3>
                            <span style={{
                                display: 'inline-block',
                                background: 'rgba(109, 10, 81, 0.1)',
                                color: '#6d0a51',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                marginBottom: '10px',
                                alignSelf: 'flex-start'
                            }}>
                                {member.position}
                            </span>
                            <p style={{ margin: '0 0 15px', fontSize: '0.9rem', color: '#666', flex: 1 }}>{member.bio}</p>

                            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                                <button
                                    onClick={() => handleOpenModal(member)}
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        background: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '5px',
                                        color: '#333'
                                    }}
                                >
                                    <Edit2 size={16} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(member.id)}
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        border: '1px solid #fee2e2',
                                        borderRadius: '6px',
                                        background: '#fff1f2',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '5px',
                                        color: '#ef4444'
                                    }}
                                >``
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '25px',
                        position: 'relative',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                    }}>
                        <button
                            onClick={handleCloseModal}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <X size={24} color="#666" />
                        </button>

                        <h2 style={{ margin: '0 0 20px', color: '#6d0a51' }}>
                            {editingMember ? 'Edit Member' : 'Add New Member'}
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {/* Image Upload Area */}
                            <div style={{
                                width: '100%',
                                height: '150px',
                                border: '2px dashed #ddd',
                                borderRadius: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                position: 'relative',
                                background: formData.image ? `url(${formData.image}) center/cover` : '#f9f9f9'
                            }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                />
                                {!formData.image && (
                                    <>
                                        <Upload size={24} color="#999" />
                                        <span style={{ color: '#999', marginTop: '5px' }}>Click to upload photo</span>
                                    </>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#444' }}>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. John Doe"
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#444' }}>Position/Role</label>
                                    <input
                                        type="text"
                                        name="position"
                                        value={formData.position}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Secretary"
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#444' }}>Year of Study</label>
                                    <select
                                        name="yearOfStudy"
                                        value={formData.yearOfStudy}
                                        onChange={handleInputChange}
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
                                    >
                                        <option value="">Select Year</option>
                                        <option value="1">Year 1</option>
                                        <option value="2">Year 2</option>
                                        <option value="3">Year 3</option>
                                        <option value="4">Year 4</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#444' }}>Course</label>
                                    <input
                                        type="text"
                                        name="course"
                                        value={formData.course}
                                        onChange={handleInputChange}
                                        placeholder="e.g. B.Sc. Computer Science"
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: '500', color: '#444' }}>Short Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    placeholder="Brief description of responsibilities..."
                                    rows={4}
                                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                <button
                                    onClick={handleCloseModal}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        border: '1px solid #ddd',
                                        background: '#f9f9f9',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    style={{
                                        padding: '10px 25px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: '#6d0a51',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Save size={18} />
                                    Save Member
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommitteeManager;
