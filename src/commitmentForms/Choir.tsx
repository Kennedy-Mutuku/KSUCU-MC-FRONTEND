import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import SignatureCanvas from "react-signature-canvas";
import styles from "../styles/InstrumentalistsCommitment.module.css";
import Header from "../components/header";
import Footer from "../components/footer";

const ChoirCommitment: React.FC = () => {
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [regNo, setRegNo] = useState<string>("");
  const [yearOfStudy, setYearOfStudy] = useState<string>("");
  const [reasonForJoining, setReasonForJoining] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [commitmentStatus, setCommitmentStatus] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const showError = (field: string, message: string) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: message }));
    setTimeout(() => {
      setErrors((prevErrors) => {
        const { [field]: removed, ...rest } = prevErrors;
        return rest;
      });
    }, 5000);
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/commitmentForm/user-details", { withCredentials: true });
        const data = response.data;
        
        if (data.username) setFullName(data.username);
        if (data.phone) setPhoneNumber(data.phone);
        if (data.regNo) setRegNo(data.regNo);
        if (data.yearOfStudy) setYearOfStudy(data.yearOfStudy);
        if (data.reasonForJoining) setReasonForJoining(data.reasonForJoining);
        if (data.date) setDate(data.date);
        if (data.signature && sigCanvas.current) {
          sigCanvas.current.fromDataURL(data.signature);
        }
        if (data.status) setCommitmentStatus(data.status);
        if (data.hasSubmitted) {
          setHasSubmitted(data.hasSubmitted);
          setIsSubmitted(data.hasSubmitted);
        }
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


  const handleSubmit = async () => {
    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    setErrors({});
  
    let hasError = false;
    if (!fullName.trim()) {
      showError('fullName', 'Full name is required');
      hasError = true;
    }
    if (!phoneNumber.trim()) {
      showError('phoneNumber', 'Phone number is required');
      hasError = true;
    }
    if (!regNo.trim()) {
      showError('regNo', 'Registration number is required');
      hasError = true;
    }
    if (!yearOfStudy.trim()) {
      showError('yearOfStudy', 'Year of study is required');
      hasError = true;
    }
    if (!reasonForJoining.trim()) {
      showError('reasonForJoining', 'Reason for joining is required');
      hasError = true;
    }
    if (sigCanvas.current && sigCanvas.current.isEmpty()) {
      showError('signature', 'Signature is required');
      hasError = true;
    }
  
    if (hasError) return;
  
    setShowConfirmation(false);
    setIsSubmitting(true);
  
    const signatureData = sigCanvas.current ? sigCanvas.current.toDataURL() : "";
    const formData = {
      fullName,
      phoneNumber,
      regNo,
      yearOfStudy,
      reasonForJoining,
      date,
      signature: signatureData,
    };
  
    try {
      const response = await axios.post("http://localhost:3000/commitmentForm/submit-commitment", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      });
  
      if (response.status === 200) {
        alert("Thank you for your commitment! Waiting for admin approval.");
        setIsSubmitted(true);
        setHasSubmitted(true);
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already submitted')) {
        alert("You have already submitted a commitment form.");
        setHasSubmitted(true);
      } else {
        const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
        alert(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.containerForm}>
        <div className={styles.commitmentForm}>
        <h2 className={styles.formTitle}>🎶 Choir Ministry Commitment Form</h2>
        <p className={styles.textMuted}>"Worshiping Through Song & Unity"</p>

        {/* Ministry Overview */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>📜 Ministry Overview</h4>
          <p>
            The Choir Ministry is dedicated to worshiping God through live ministration, singing, and dancing, fostering a spirit of unity, encouragement, and praise within the congregation.
          </p>
        </div>

        {/* Ministry Policies */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>📌 Ministry Policies</h4>
          <ul className={styles.customList}>
            <li>🎤 <b>Attendance:</b> Members must attend all scheduled rehearsals and services unless excused.</li>
            <li>⏳ <b>Punctuality:</b> Arrive 15 minutes before rehearsals and ministrations.</li>
            <li>🎼 <b>Commitment:</b> A commitment to the choir means dedication to worship services.</li>
            <li>👕 <b>Ministry Attire:</b> Wear the attire specified by the Attire Committee.</li>
            <li>⚠️ <b>Probation:</b> Misconduct (secularism, sexual immorality, inconsistency) may lead to probation.</li>
          </ul>
        </div>

        {/* Ministry Activities */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>🎵 Ministry Activities</h4>
          <ul className={styles.customList}>
            <li>📆 Weekly Rehearsals</li>
            <li>🤝 Team Fellowship</li>
            <li>🎼 Workshops & Training</li>
            <li>🙏 Spiritual Growth</li>
          </ul>
        </div>

        {/* Status Display */}
        {hasSubmitted && (
          <div className={`${styles.statusAlert} ${
            commitmentStatus === 'approved' ? styles.approved :
            commitmentStatus === 'revoked' ? styles.revoked : styles.pending
          }`}>
            {commitmentStatus === 'pending' && '⏳ Waiting for admin approval'}
            {commitmentStatus === 'approved' && '✅ Commitment form approved!'}
            {commitmentStatus === 'revoked' && '❌ Commitment form revoked'}
          </div>
        )}

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
            disabled={hasSubmitted}
          ></textarea>
        </div>

        {/* Personal Commitment */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>✅ Personal Commitment</h4>
          <p>By signing below, I commit to fully participating in the Choir Ministry and adhering to the policies set forth.</p>

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
                disabled={hasSubmitted}
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
                disabled={hasSubmitted}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <label className={styles.formLabel}>Registration Number:</label>
              {errors.regNo && <div className={styles.error}>{errors.regNo}</div>}
              <input 
                type="text" 
                className={styles.formControl} 
                placeholder="Enter your registration number"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                disabled={hasSubmitted}
              />
            </div>
            <div className={styles.col}>
              <label className={styles.formLabel}>Year of Study:</label>
              {errors.yearOfStudy && <div className={styles.error}>{errors.yearOfStudy}</div>}
              <select
                className={styles.formControl}
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                disabled={hasSubmitted}
              >
                <option value="">Select your year of study</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="5th Year">5th Year</option>
                <option value="6th Year">6th Year</option>
              </select>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <label className={styles.formLabel}>Signature:</label>
              {errors.signature && <div className={styles.error}>{errors.signature}</div>}
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
                disabled={hasSubmitted}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className={styles.textCenter}>
          <button
            className={styles.btnPrimary}
            onClick={handleSubmit}
            disabled={isSubmitting || hasSubmitted}
          >
            {isSubmitting ? "Submitting..." : hasSubmitted ? "Already Submitted" : "Submit Commitment"}
          </button>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Are you sure?</h3>
              <p>You won't be able to change your submission once it's submitted.</p>
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

export default ChoirCommitment;
