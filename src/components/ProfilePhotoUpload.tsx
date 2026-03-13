import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Camera, Upload, X, Check } from 'lucide-react';
import { getApiUrl } from '../config/environment';

interface ProfilePhotoUploadProps {
    onUploadSuccess: (photoUrl: string) => void;
    onCancel?: () => void;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({ onUploadSuccess, onCancel }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string>('');
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 90,
        height: 90,
        x: 5,
        y: 5
    });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const imageRef = useRef<HTMLImageElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError('File size must be less than 10MB');
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result as string);
            setError(null);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const getCroppedImage = async (): Promise<Blob | null> => {
        if (!completedCrop || !imageRef.current) return null;

        const image = imageRef.current;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return null;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = 300;
        canvas.height = 300;

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            300,
            300
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/webp', 0.8);
        });
    };

    const handleUpload = async () => {
        if (!selectedFile || !completedCrop) {
            setError('Please select and crop an image');
            return;
        }

        try {
            setUploading(true);
            setError(null);

            const croppedBlob = await getCroppedImage();
            if (!croppedBlob) {
                setError('Error processing image');
                return;
            }

            const formData = new FormData();
            formData.append('profilePhoto', croppedBlob, 'profile.webp');

            const apiUrl = getApiUrl('api/users/upload-profile-photo');
            const response = await fetch(apiUrl, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Upload failed');
            }

            onUploadSuccess(data.photoUrl);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{
                textAlign: 'center',
                color: '#730051',
                marginBottom: '20px',
                fontSize: '1.5rem',
                fontWeight: '700'
            }}>
                Upload Profile Photo
            </h2>

            {!imageSrc ? (
                <div>
                    {/* Upload Options */}
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        style={{
                            border: `2px dashed ${dragActive ? '#730051' : '#ccc'}`,
                            borderRadius: '12px',
                            padding: '40px 20px',
                            textAlign: 'center',
                            backgroundColor: dragActive ? '#f9f3f7' : '#fafafa',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            marginBottom: '20px'
                        }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload size={48} color="#730051" style={{ margin: '0 auto 15px' }} />
                        <p style={{ fontSize: '1.1rem', color: '#333', marginBottom: '10px', fontWeight: '600' }}>
                            Drag & drop your photo here
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>
                            or click to browse files
                        </p>
                        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '10px' }}>
                            Supports: JPG, PNG, WebP (Max 10MB)
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button
                            onClick={() => cameraInputRef.current?.click()}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 24px',
                                backgroundColor: '#730051',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a0040'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#730051'}
                        >
                            <Camera size={20} />
                            Take Photo
                        </button>

                        {onCancel && (
                            <button
                                onClick={onCancel}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: '#f0f0f0',
                                    color: '#333',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        style={{ display: 'none' }}
                    />

                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={handleFileInput}
                        style={{ display: 'none' }}
                    />
                </div>
            ) : (
                <div>
                    {/* Enhanced Crop visibility styles */}
                    <style>{`
                        .ReactCrop__crop-selection {
                            border: 2px dashed #ffffff !important;
                            box-shadow: 0 0 10px rgba(0,0,0,0.5), inset 0 0 10px rgba(0,0,0,0.5) !important;
                        }
                        .ReactCrop__drag-handle {
                            width: 12px !important;
                            height: 12px !important;
                            background-color: #730051 !important;
                            border: 2px solid #ffffff !important;
                            box-shadow: 0 0 5px rgba(0,0,0,0.5) !important;
                        }
                        .ReactCrop__drag-handle::after {
                            display: none !important;
                        }
                        .ReactCrop__circular-selection {
                            border: 2px dashed #ffffff !important;
                        }
                    `}</style>
                    {/* Image Cropper */}
                    <div style={{ marginBottom: '20px' }}>
                        <ReactCrop
                            crop={crop}
                            onChange={c => setCrop(c)}
                            onComplete={c => setCompletedCrop(c)}
                            aspect={1}
                            circularCrop
                            style={{ maxHeight: '400px' }}
                        >
                            <img
                                ref={imageRef}
                                src={imageSrc}
                                alt="Upload preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '400px',
                                    objectFit: 'contain'
                                }}
                            />
                        </ReactCrop>
                    </div>

                    <p style={{
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        color: '#666',
                        marginBottom: '20px'
                    }}>
                        Adjust the circle to crop your photo
                    </p>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button
                            onClick={handleUpload}
                            disabled={uploading || !completedCrop}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '14px 28px',
                                backgroundColor: uploading ? '#ccc' : '#730051',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                cursor: uploading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease',
                                opacity: uploading ? 0.7 : 1
                            }}
                            onMouseOver={(e) => {
                                if (!uploading) e.currentTarget.style.backgroundColor = '#8e1a6b';
                            }}
                            onMouseOut={(e) => {
                                if (!uploading) e.currentTarget.style.backgroundColor = '#730051';
                            }}
                        >
                            <Check size={20} />
                            {uploading ? 'Uploading...' : 'Save Photo'}
                        </button>

                        <button
                            onClick={() => {
                                setImageSrc('');
                                setSelectedFile(null);
                                setCompletedCrop(null);
                                setError(null);
                            }}
                            disabled={uploading}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '14px 28px',
                                backgroundColor: '#f0f0f0',
                                color: '#333',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: uploading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                if (!uploading) e.currentTarget.style.backgroundColor = '#e0e0e0';
                            }}
                            onMouseOut={(e) => {
                                if (!uploading) e.currentTarget.style.backgroundColor = '#f0f0f0';
                            }}
                        >
                            <X size={20} />
                            Change Photo
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div style={{
                    marginTop: '20px',
                    padding: '12px',
                    backgroundColor: '#fee',
                    color: '#c00',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontSize: '0.95rem'
                }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoUpload;
