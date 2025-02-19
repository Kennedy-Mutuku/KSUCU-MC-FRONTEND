import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import SignatureCanvas from "react-signature-canvas";
import styles from "../styles/InstrumentalistsCommitment.module.css"; // Import your CSS module
import Header from "../components/header";
import Footer from "../components/footer";
import ImageUploader from "../components/ImageUploader";
import "react-image-crop/dist/ReactCrop.css";

const InstrumentalistsCommitment: React.FC = () => {
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [reasonForJoining, setReasonForJoining] = useState<string>("");
  const [date, setDate] = useState<string>(""); // Will set this automatically in useEffect
  const [ministryLeader, setMinistryLeader] = useState<string>("");
  const [dateApproved, setDateApproved] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const showError = (field: string, message: string) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: message }));
    setTimeout(() => {
      setErrors((prevErrors) => {
        const { [field]: removed, ...rest } = prevErrors;
        return rest;
      });
    }, 5000); // Error disappears after 5 seconds
  };

  useEffect(() => {
    // Set the current date as default
    const today = new Date().toISOString().split('T')[0]; // Format to YYYY-MM-DD
    setDate(today);
    setDateApproved(today);
  }, []);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/commitmentForm/user-details", { withCredentials: true });
        const data = response.data;
        console.log(data);
        
        // Populate only available fields
        if (data.username) setFullName(data.username);
        if (data.phone) setPhoneNumber(data.phone);
        if (data.reasonForJoining) setReasonForJoining(data.reasonForJoining);
        if (data.date) setDate(data.date);
        if (data.ministryLeader) setMinistryLeader(data.ministryLeader);
        if (data.dateApproved) setDateApproved(data.dateApproved);
        if (data.signature && sigCanvas.current) {
          sigCanvas.current.fromDataURL(data.signature);
        }
        if (data.croppedImage) setCroppedImage(data.croppedImage);
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };
  
    fetchFormData();
  }, []);

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  const handleImageCropped = (image: string) => {
    setCroppedImage(image);
  };

  const handleSubmit = async () => {
    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);

    const signatureData = sigCanvas.current ? sigCanvas.current.toDataURL() : "";
    const formData = {
      fullName,
      phoneNumber,
      reasonForJoining,
      date,
      signature: signatureData,
      croppedImage,
      ministryLeader,
      dateApproved,
    };

    try {
      const response = await axios.post("http://localhost:3000/commitmentForm/submit-commitment", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("Thank you for your commitment!");
        setIsSubmitted(true);
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.containerForm}>
        <div className={styles.commitmentForm}>
          <h2 className={styles.formTitle}>🎸 Instrumentalists Ministry Commitment Form</h2>
          <p className={styles.textMuted}>"Honoring God Through Music"</p>

          {/* Ministry Commitment */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>🎶 Ministry Commitment</h4>
            <p>
              I commit to serving as an instrumentalist, understanding that my role extends beyond playing music—it is a
              ministry to glorify God, support worship, and build unity. By signing this form, I agree to:
            </p>
            <ul className={styles.customList}>
              <li>🎵 <b>Regular Attendance:</b> Participating in rehearsals, services, and special events.</li>
              <li>⏳ <b>Punctuality & Preparation:</b> Arriving on time and fully prepared.</li>
              <li>🤝 <b>Unity & Respect:</b> Collaborating with the worship team and leadership.</li>
              <li>📈 <b>Growth:</b> Continuously improving my musical skills for God's glory.</li>
            </ul>
          </div>

          {/* Ministry Activities */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>🎹 Ministry Activities</h4>
            <ul className={styles.customList}>
              <li>📅 Playing during Friday fellowships, Sunday services, and special worship events.</li>
              <li>🎼 Attending weekly rehearsals and extra practice when required.</li>
              <li>🎤 Supporting CU concerts, outreach services, and worship experiences.</li>
              <li>📊 Participating in team meetings for ministry improvement.</li>
            </ul>
          </div>

          {/* Ministry Policies */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>📜 Ministry Policies</h4>
            <ul className={styles.customList}>
              <li>🕒 <b>Punctuality:</b> Must arrive on time for all rehearsals and services.</li>
              <li>📖 <b>Preparation:</b> Reviewing assigned music beforehand.</li>
              <li>👕 <b>Dress Code:</b> Adhering to church guidelines for neat and respectful attire.</li>
              <li>🎸 <b>Instrument Care:</b> Taking responsibility for instrument maintenance.</li>
              <li>🙏 <b>Spiritual Growth:</b> Engaging in prayer, scripture, and church life.</li>
              <li>🚨 <b>Probation:</b> Misconduct (e.g., inconsistency, secularism, immorality) may lead to probation.</li>
              <li>📆 <b>New Members:</b> Must complete a 10-week probation period before ministering.</li>
            </ul>
          </div>

          {/* Reason for Joining */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>📝 Why Do You Want to Join?</h4>
            {errors.reasonForJoining && <div className={styles.error}>{errors.reasonForJoining}</div>}
            <textarea
              className={styles.formControl}
              rows={3}
              placeholder="Write your reasons here..."
              value={reasonForJoining}
              onChange={(e) => setReasonForJoining(e.target.value)}
              disabled={isSubmitted}
            ></textarea>
          </div>

          {/* Acknowledgment & Signature */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>✅ Acknowledgment & Signature</h4>
            {errors.signature && <div className={styles.error}>{errors.signature}</div>}
            <p>By signing below, I confirm that I have read, understood, and agree to abide by the ministry policies.</p>
            <div className={styles.row}>
              <div className={styles.col}>
                <label className={styles.formLabel}>Full Name:</label>
                {errors.fullName && <div className={styles.error}>{errors.fullName}</div>}
                <input
                  type="text"
                  className={styles.formControl}
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isSubmitted}
                />
              </div>
              <div className={styles.col}>
                <label className={styles.formLabel}>Phone Number:</label>
                {errors.phoneNumber && <div className={styles.error}>{errors.phoneNumber}</div>}
                <input
                  type="text"
                  className={styles.formControl}
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isSubmitted}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.col}>
                <label className={styles.formLabel}>Signature:</label>
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="black"
                  canvasProps={{ className: styles.signatureCanvas }}
                />
                <button className={styles.btnSecondary} onClick={clearSignature}>
                  Clear Signature
                </button>
              </div>
              <div className={styles.col}>
                <label className={styles.formLabel}>Date:</label>
                <input
                  type="date"
                  className={styles.formControl}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={isSubmitted}
                />
              </div>
            </div>
          </div>

          {/* Image Uploader */}
          <ImageUploader onImageCropped={handleImageCropped} initialImage={croppedImage} />


          {/* Church Use Only */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>📜 For Church Use Only</h4>
            <div className={styles.row}>
              <div className={styles.col}>
                <label className={styles.formLabel}>Ministry Leader:</label>
                <input
                  type="text"
                  className={styles.formControl}
                  placeholder="Leader's Name"
                  value={ministryLeader}
                  onChange={(e) => setMinistryLeader(e.target.value)}
                />
              </div>
              <div className={styles.col}>
                <label className={styles.formLabel}>Date Approved:</label>
                <input
                  type="date"
                  className={styles.formControl}
                  value={date}
                  onChange={(e) => setDateApproved(e.target.value)}
                  disabled={isSubmitted}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className={styles.textCenter}>
            
          {errors.phoneNumber && <div className={styles.error}>{errors.phoneNumber}</div>}
          {errors.reasonForJoining && <div className={styles.error}>{errors.reasonForJoining}</div>}
          {errors.fullName && <div className={styles.error}>{errors.fullName}</div>}
          {errors.signature && <div className={styles.error}>{errors.signature}</div>}
          {errors.croppedImage && <div className={styles.error}>{errors.croppedImage}</div>}
          
            <button
              className={styles.btnPrimary}
              onClick={handleSubmit}
              disabled={isSubmitting || isSubmitted}
            >
              {isSubmitting ? "Submitting..." : "Submit Commitment"}
            </button>
          </div>

          {/* Confirmation Modal */}
          {showConfirmation && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <h3>Are you sure?</h3>
                <p>You won’t be able to change your submission once it's submitted.</p>
                <button className={styles.btnPrimary} onClick={confirmSubmit} disabled={isSubmitting}>
                  Yes, Submit
                </button>
                <button className={styles.btnSecondary} onClick={() => setShowConfirmation(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InstrumentalistsCommitment;

