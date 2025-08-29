import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import SignatureCanvas from "react-signature-canvas";
import styles from "../styles/InstrumentalistsCommitment.module.css"; // Reusing the same styles
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';

const PraiseandWorshipCommitment: React.FC = () => {
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
  // const [isSubmitted, setIsSubmitted] = useState(false);
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
          // setIsSubmitted(data.hasSubmitted);
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
        // setIsSubmitted(true);
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
        alert("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <UniversalHeader />
      <div className={styles.containerForm}>
        <div className={styles.commitmentForm}>
          <h2 className={styles.formTitle}>🙌 Praise & Worship Ministry Commitment Form</h2>
          <p className={styles.textMuted}>"Serving with Excellence and Integrity"</p>

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

            {/* Practices & Service Ministration */}
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>🎵 Practices & Service Ministration</h4>
              <ul className={styles.customList}>
                <li>Leads must select one song that has not been used in the past three weeks.</li>
                <li>BGVs should study the song structure, instrumentation, and voices.</li>
                <li>Attendance to ministry meetings, prayer sessions, rehearsals, and services is mandatory.</li>
                <li>Leads and BGVs must arrive at least <b>10 minutes before</b> practice time.</li>
                <li>Members absent from practices/prayers cannot back up songs.</li>
              </ul>
            </div>

            {/* Clothing Section */}
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>👗 Clothing Guidelines</h4>
              <ul className={styles.customList}>
                <li>🚫 <b>Not Allowed:</b> 
                  <ul>
                    <li>Short skirts/dresses, trousers (for ladies), T-shirts, shorts, tight or rugged trousers (for gents).</li>
                    <li>Open shoes for men.</li>
                  </ul>
                </li>
                <li>✅ Members must wear the prescribed attire for worship services.</li>
                <li>🛑 No one will minister without approved attire during worship weekends.</li>
                <li>✨ Maintain neatness at all times.</li>
              </ul>
            </div>

            {/* PROBATION SECTION */}
            <div className={styles.probationSection}>
              <h4 className={styles.sectionTitle}>🕰️ Probation Guidelines</h4>
              <ul className={styles.customList}>
                <li>New members:
                  <ul>
                    <li>🎤 5 weeks probation before back-up singing.</li>
                    <li>🎼 10 weeks probation before leading worship.</li>
                  </ul>
                </li>
                <li>🚨 Probation for:
                  <ul>
                    <li>Secularism</li>
                    <li>Sexual immorality (fornication, cohabiting, etc.)</li>
                    <li>Sexual advances (towards any gender)</li>
                  </ul>
                </li>
                <li>❌ Inconsistent members will remain on probation until consistency is shown.</li>
              </ul>
            </div>

            {/* Commitment Section */}
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>✍️ Why Do You Wish to Join the Ministry?</h4>
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

            <div className={styles.personalCommitment}>
              <h4 className={styles.sectionTitle}>💖 Personal Commitment</h4>
              <p>By signing below, I commit to actively participating in the ministry, upholding its values, and dedicating my time to service.</p>

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

export default PraiseandWorshipCommitment;
