import React, { useState, useRef } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import styles from "../styles/ImageUploader.module.css";

interface ImageUploaderProps {
  onImageCropped: (croppedImage: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageCropped }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (crop: PixelCrop) => {
    if (!imageRef.current || crop.width === 0 || crop.height === 0) return;

    setIsLoading(true);

    const image = imageRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Calculate the scale factor for the image
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas dimensions to match the cropped area
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    // Draw the cropped portion onto the canvas
    ctx.drawImage(
      image,
      crop.x * scaleX, crop.y * scaleY, // Source position in original image (scaled)
      crop.width * scaleX, crop.height * scaleY, // Crop dimensions (scaled)
      0, 0, // Start at the top-left of the canvas
      canvas.width, canvas.height // Scale exactly to fit
    );

    // Convert canvas to image data URL
    const croppedDataURL = canvas.toDataURL("image/png");

    // Store and update cropped image
    setCroppedImage(croppedDataURL);
    onImageCropped(croppedDataURL);
    setIsLoading(false);
  };

  return (
    <div className={styles.imageUploaderContainer}>
      <h4 className={styles.sectionTitle}>Upload & Crop Your Image</h4>
        
        <label htmlFor="fileInput" className={styles.fileInputLabel}>
            Choose Image
        </label>

        <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={styles.fileInput}
        />

      {selectedImage && (
        <div className={styles.cropContainer}>
          <h5>Crop Image</h5>
          <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={handleCropComplete} aspect={1}>
            <img
              ref={imageRef}
              src={selectedImage}
              alt="Upload Preview"
              className={styles.cropImage}
              style={{ maxWidth: "100%", maxHeight: "400px" }} // Limit the size of the image for cropping
            />
          </ReactCrop>
        </div>
      )}

      {croppedImage && (
          <div className={styles.previewContainerDiv}>
              <h5 className={styles.sectionTitle}>Cropped Image Preview</h5>
            <div className={styles.previewContainer}>
              <img
                src={croppedImage}
                alt="Cropped"
                className={styles.croppedImage}
                style={{ width: "100%", height: "auto", maxWidth: "400px", maxHeight: "400px" }} // Ensure the preview fits perfectly
              />
                      </div>
          </div>
      )}

    </div>
  );
};

export default ImageUploader;