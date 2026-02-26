import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { Heart, ArrowRight, Upload, Camera, X, Check, ZoomIn, ZoomOut } from 'lucide-react';
import { getApiUrl } from '../config/environment';
import styles from '../styles/welcomePage.module.css';

const OUTPUT_SIZE = 300;

// Helper: crop the image to a square blob
async function getCroppedBlob(imageSrc: string, cropArea: Area): Promise<Blob | null> {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    await new Promise<void>((resolve) => {
        image.onload = () => resolve();
        image.src = imageSrc;
    });

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(
        image,
        cropArea.x, cropArea.y, cropArea.width, cropArea.height,
        0, 0, OUTPUT_SIZE, OUTPUT_SIZE
    );

    return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/webp', 0.85));
}

const WelcomePage: React.FC = () => {
    const [userData, setUserData] = useState<any>(null);
    const [photoUploaded, setPhotoUploaded] = useState(false);
    const navigate = useNavigate();

    // Photo state
    const [imageSrc, setImageSrc] = useState('');
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cropper state
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState<Area | null>(null);

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const cameraInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/users/data', { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                    if (data.profilePhoto) navigate('/');
                } else {
                    navigate('/login');
                }
            } catch {
                navigate('/login');
            }
        };
        fetchUserData();
    }, [navigate]);

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedArea(croppedAreaPixels);
    }, []);

    const handleFileSelect = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) { setError('Please select an image file'); return; }
        if (file.size > 10 * 1024 * 1024) { setError('File size must be less than 10MB'); return; }
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result as string);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setError(null);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
    };

    const handleFileDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === 'dragenter' || e.type === 'dragover');
    };

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
    };

    const handleUpload = async () => {
        if (!croppedArea) { setError('Please adjust your photo'); return; }
        try {
            setUploading(true);
            setError(null);
            const blob = await getCroppedBlob(imageSrc, croppedArea);
            if (!blob) { setError('Error processing image'); return; }

            const formData = new FormData();
            formData.append('profilePhoto', blob, 'profile.webp');
            const response = await fetch(getApiUrl('api/users/upload-profile-photo'), {
                method: 'POST', credentials: 'include', body: formData
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Upload failed');

            setPhotoUploaded(true);
            setImageSrc('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const resetPhoto = () => {
        setImageSrc('');
        setError(null);
        setPhotoUploaded(false);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedArea(null);
    };

    if (!userData) {
        return (
            <div className={styles.loadingPage}>
                <div className={styles.loadingText}>Loading...</div>
            </div>
        );
    }

    const firstName = userData.username?.split(' ')[0] || 'Friend';

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.iconCircle}>
                        <Heart size={26} color="#fff" fill="#fff" />
                    </div>
                    <h1 className={styles.title}>Welcome, {firstName}!</h1>
                    <p className={styles.subtitle}>We're glad to have you in the community.</p>
                </div>

                <p className={styles.verse}>
                    "For we are God's handiwork, created in Christ Jesus" — Ephesians 2:10
                </p>

                {/* Upload area */}
                {!photoUploaded && !imageSrc && (
                    <div className={styles.photoSection}>
                        <div className={styles.photoLabel}>
                            <span className={styles.photoLabelText}>Profile Photo</span>
                            <span className={styles.optionalBadge}>Optional</span>
                        </div>
                        <div
                            className={`${styles.uploadArea} ${dragActive ? styles.uploadAreaActive : ''}`}
                            onDragEnter={handleFileDrag}
                            onDragLeave={handleFileDrag}
                            onDragOver={handleFileDrag}
                            onDrop={handleFileDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload size={28} className={styles.uploadIcon} />
                            <p className={styles.uploadText}>Tap to upload a photo</p>
                            <p className={styles.uploadHint}>JPG, PNG, or WebP — Max 10MB</p>
                        </div>
                        <div className={styles.uploadActions}>
                            <button className={styles.cameraBtn} onClick={() => cameraInputRef.current?.click()}>
                                <Camera size={16} /> Take Photo
                            </button>
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} style={{ display: 'none' }} />
                        <input ref={cameraInputRef} type="file" accept="image/*" capture="user" onChange={handleFileInput} style={{ display: 'none' }} />
                    </div>
                )}

                {/* Cropper */}
                {imageSrc && !photoUploaded && (
                    <div className={styles.photoSection}>
                        <div className={styles.cropperWrapper}>
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>

                        <p className={styles.cropHint}>Drag to reposition</p>

                        <div className={styles.zoomRow}>
                            <ZoomOut size={16} color="#999" />
                            <input
                                type="range"
                                className={styles.zoomSlider}
                                min={100}
                                max={300}
                                value={zoom * 100}
                                step={1}
                                onChange={(e) => setZoom(Number(e.target.value) / 100)}
                            />
                            <ZoomIn size={16} color="#999" />
                        </div>

                        <div className={styles.cropActions}>
                            <button
                                className={styles.savePhotoBtn}
                                onClick={handleUpload}
                                disabled={uploading}
                            >
                                <Check size={16} />
                                {uploading ? 'Uploading...' : 'Save Photo'}
                            </button>
                            <button className={styles.changePhotoBtn} onClick={resetPhoto} disabled={uploading}>
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Success */}
                {photoUploaded && (
                    <div className={styles.photoSuccess}>
                        <Check size={18} color="#16a34a" />
                        <span className={styles.photoSuccessText}>Photo uploaded</span>
                        <button className={styles.photoChangeLink} onClick={resetPhoto}>Change</button>
                    </div>
                )}

                {error && <div className={styles.error}>{error}</div>}

                <button className={styles.continueBtn} onClick={() => navigate('/')}>
                    Continue <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default WelcomePage;
