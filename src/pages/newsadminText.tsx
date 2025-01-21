import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import styles from '../styles/newsStudio.module.css'

import Header from '../components/header';
import Footer from '../components/footer';

import 'react-image-crop/dist/ReactCrop.css';

const PhotoUploadPage: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!title || !body || !imageFile) {
      setError('Please fill out all fields and select an image.')
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    if (croppedImage) {
      formData.append('image', new File([croppedImage], 'cropped_image.png'));
    }
    setLoading(true)
    try {
      const response = await fetch('https://ksucu-mc.co.ke/adminnews/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        setSuccessMessage('Form submitted successfully!')
        handleLogout()
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form', error);
    }finally{
      setLoading(false)
    }

  };

  const handleLogout = async () => {
      try {
          const response = await fetch('https://ksucu-mc.co.ke/adminnews/logout', {
              method: 'POST',
              credentials: 'include'
          });

          if (!response.ok) {
              throw new Error('Logout failed');
          }
          navigate('/news')
      } catch (error) {
          console.error('Error during logout:');
          setError('An error occurred during logout');
      }
  };

  const onCropComplete = async (crop: PixelCrop) => {
    if (imageRef && crop.width && crop.height) {
      const croppedImageBlob = await getCroppedImage(imageRef, crop);
      setCroppedImage(croppedImageBlob);
    }
  };

  const getCroppedImage = (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width || 0;
      canvas.height = crop.height || 0;
      const ctx = canvas.getContext('2d');

      ctx?.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob(blob => {
        if (blob) resolve(blob);
      }, 'image/png');
    });
  };

  const onImageLoaded = (image: HTMLImageElement) => {
    setImageRef(image);
  };

  return (
    <div className={styles.bodyNewsPage}>

      <Header />

      <div className={styles.containerNewsStudio}>
          <h1 className={styles.title}>KSUCU-MC NEWS STUDIO</h1>

          {error && <p className={styles.error}>{error}</p>}
          {successMessage && <p className={styles.success}>{successMessage}</p>}

          <form className={styles.submitForm} onSubmit={handleFormSubmit} encType="multipart/form-data">
            <div>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="body">Body</label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="image">Upload Image</label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={onImageChange}
              />
            </div>

            {preview && (
              <div>
                <ReactCrop
                  crop={crop}
                  onChange={(newCrop) => setCrop(newCrop)}
                  onComplete={onCropComplete}
                  aspect={1} // This ensures a 1:1 aspect ratio
                >
                  <img src={preview} alt="To crop" onLoad={(e) => onImageLoaded(e.currentTarget)} />
                </ReactCrop>
              </div>
            )}

            <div className={styles.submitDiv}>

              {loading ? <button className={styles.submitBtn} >Submitting...</button> :
               <button className={styles.submitBtn} type="submit">Submit</button>
              }
               
            </div>

          </form>

      </div>

      <Footer />

    </div>

  );

};

export default PhotoUploadPage;
