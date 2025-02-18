// import React, { useRef, useState } from "react";
// import axios from "axios";
// import SignatureCanvas from "react-signature-canvas";
// import styles from "../styles/InstrumentalistsCommitment.module.css"; // Import your CSS module
// import Header from "../components/header";
// import Footer from "../components/footer";
// import ImageUploader from "../components/ImageUploader";
// import "react-image-crop/dist/ReactCrop.css";

// const InstrumentalistsCommitment: React.FC = () => {
//   const sigCanvas = useRef<SignatureCanvas | null>(null);
//   const [croppedImage, setCroppedImage] = useState<string | null>(null);
//   const [fullName, setFullName] = useState<string>("");
//   const [phoneNumber, setPhoneNumber] = useState<string>("");
//   const [reasonForJoining, setReasonForJoining] = useState<string>("");
//   const [date, setDate] = useState<string>("");
//   const [ministryLeader, setMinistryLeader] = useState<string>("");
//   const [dateApproved, setDateApproved] = useState<string>("");
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const showError = (field: string, message: string) => {
//     setErrors((prevErrors) => ({ ...prevErrors, [field]: message }));
//     setTimeout(() => {
//       setErrors((prevErrors) => {
//         const { [field]: removed, ...rest } = prevErrors;
//         return rest;
//       });
//     }, 5000); // Error disappears after 5 seconds
//   };

//   const clearSignature = () => {
//     if (sigCanvas.current) {
//       sigCanvas.current.clear();
//     }
//   };

//   const handleImageCropped = (image: string) => {
//     setCroppedImage(image);
//   };

//   // const handleSubmit = async () => {
//   //   if (
//   //     !fullName.trim() ||
//   //     !phoneNumber.trim() ||
//   //     !reasonForJoining.trim() ||
//   //     !date ||
//   //     !sigCanvas.current ||
//   //     sigCanvas.current.isEmpty() || // Check if signature is empty
//   //     !croppedImage
//   //   ) {
//   //     alert("Please fill in all required fields, provide a signature, and upload an image.");
//   //     return;
//   //   }
  
//   //   setIsSubmitting(true);
  
//   //   const signatureData = sigCanvas.current.toDataURL(); // Get the signature as a data URL
  
//   //   const formData = {
//   //     fullName,
//   //     phoneNumber,
//   //     reasonForJoining,
//   //     date,
//   //     signature: signatureData,
//   //     croppedImage,
//   //     ministryLeader,
//   //     dateApproved,
//   //   };
  
//   //   try {
//   //     console.log(formData);
      
//   //     const response = await axios.post("/api/submit-commitment", formData, {
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //     });
  
//   //     if (response.status === 200) {
//   //       alert("Thank you for your commitment!");
//   //       // Reset form fields
//   //       setFullName("");
//   //       setPhoneNumber("");
//   //       setReasonForJoining("");
//   //       setDate("");
//   //       setMinistryLeader("");
//   //       setDateApproved("");
//   //       sigCanvas.current.clear();
//   //       setCroppedImage(null);
//   //     } else {
//   //       alert("Submission failed. Please try again.");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error submitting form:", error);
//   //     alert("An error occurred. Please try again.");
//   //   } finally {
//   //     setIsSubmitting(false);
//   //   }
//   // };
  
//   const handleSubmit = async () => {
//     let valid = true;
  
//     if (!fullName.trim()) {
//       showError("fullName", "Full Name is required.");
//       valid = false;
//     }
//     if (!phoneNumber.trim()) {
//       showError("phoneNumber", "Phone Number is required.");
//       valid = false;
//     }
//     if (!reasonForJoining.trim()) {
//       showError("reasonForJoining", "Reason for Joining is required.");
//       valid = false;
//     }
//     if (!date) {
//       showError("date", "Date is required.");
//       valid = false;
//     }
    
//     // Safely check for signature before proceeding
//     if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
//       showError("signature", "Signature is required.");
//       valid = false;
//     }
  
//     if (!croppedImage) {
//       showError("croppedImage", "Image is required.");
//       valid = false;
//     }
  
//     if (!valid) return;
  
//     // Proceed with the submission if all fields are valid
//     setIsSubmitting(true);
  
//     const signatureData = sigCanvas.current ? sigCanvas.current.toDataURL() : "";
//     const formData = {
//       fullName,
//       phoneNumber,
//       reasonForJoining,
//       date,
//       signature: signatureData,
//       croppedImage,
//       ministryLeader,
//       dateApproved,
//     };
  
//     try {
//       const response = await axios.post("/api/submit-commitment", formData, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
  
//       if (response.status === 200) {
//         alert("Thank you for your commitment!");
//         // Reset form fields after successful submission
//         setFullName("");
//         setPhoneNumber("");
//         setReasonForJoining("");
//         setDate("");
//         setMinistryLeader("");
//         setDateApproved("");
//         sigCanvas.current?.clear();
//         setCroppedImage(null);
//       } else {
//         alert("Submission failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert("An error occurred. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  

//   return (
//     <div className={styles.container}>
//       <Header />
//       <div className={styles.containerForm}>
//         <div className={styles.commitmentForm}>
//           <h2 className={styles.formTitle}>🎸 Instrumentalists Ministry Commitment Form</h2>
//           <p className={styles.textMuted}>"Honoring God Through Music"</p>

//           {/* Ministry Commitment */}
//           <div className={styles.section}>
//             <h4 className={styles.sectionTitle}>🎶 Ministry Commitment</h4>
//             <p>
//               I commit to serving as an instrumentalist, understanding that my role extends beyond playing music—it is a
//               ministry to glorify God, support worship, and build unity. By signing this form, I agree to:
//             </p>
//             <ul className={styles.customList}>
//               <li>🎵 <b>Regular Attendance:</b> Participating in rehearsals, services, and special events.</li>
//               <li>⏳ <b>Punctuality & Preparation:</b> Arriving on time and fully prepared.</li>
//               <li>🤝 <b>Unity & Respect:</b> Collaborating with the worship team and leadership.</li>
//               <li>📈 <b>Growth:</b> Continuously improving my musical skills for God's glory.</li>
//             </ul>
//           </div>

//           {/* Ministry Activities */}
//           <div className={styles.section}>
//             <h4 className={styles.sectionTitle}>🎹 Ministry Activities</h4>
//             <ul className={styles.customList}>
//               <li>📅 Playing during Friday fellowships, Sunday services, and special worship events.</li>
//               <li>🎼 Attending weekly rehearsals and extra practice when required.</li>
//               <li>🎤 Supporting CU concerts, outreach services, and worship experiences.</li>
//               <li>📊 Participating in team meetings for ministry improvement.</li>
//             </ul>
//           </div>

//           {/* Ministry Policies */}
//           <div className={styles.section}>
//             <h4 className={styles.sectionTitle}>📜 Ministry Policies</h4>
//             <ul className={styles.customList}>
//               <li>🕒 <b>Punctuality:</b> Must arrive on time for all rehearsals and services.</li>
//               <li>📖 <b>Preparation:</b> Reviewing assigned music beforehand.</li>
//               <li>👕 <b>Dress Code:</b> Adhering to church guidelines for neat and respectful attire.</li>
//               <li>🎸 <b>Instrument Care:</b> Taking responsibility for instrument maintenance.</li>
//               <li>🙏 <b>Spiritual Growth:</b> Engaging in prayer, scripture, and church life.</li>
//               <li>🚨 <b>Probation:</b> Misconduct (e.g., inconsistency, secularism, immorality) may lead to probation.</li>
//               <li>📆 <b>New Members:</b> Must complete a 10-week probation period before ministering.</li>
//             </ul>
//           </div>

//           {/* Reason for Joining */}
//           <div className={styles.section}>
//             <h4 className={styles.sectionTitle}>📝 Why Do You Want to Join?</h4>
//             <textarea
//               className={styles.formControl}
//               rows={3}
//               placeholder="Write your reasons here..."
//               value={reasonForJoining}
//               onChange={(e) => setReasonForJoining(e.target.value)}
//             ></textarea>
//           </div>

//           {/* Acknowledgment & Signature */}
//           <div className={styles.section}>
//             <h4 className={styles.sectionTitle}>✅ Acknowledgment & Signature</h4>
//             <p>By signing below, I confirm that I have read, understood, and agree to abide by the ministry policies.</p>
//             <div className={styles.row}>
//               <div className={styles.col}>
//                 <label className={styles.formLabel}>Full Name:</label>
//                 <input
//                   type="text"
//                   className={styles.formControl}
//                   placeholder="Enter your full name"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                 />
//               </div>
//               <div className={styles.col}>
//                 <label className={styles.formLabel}>Phone Number:</label>
//                 <input
//                   type="text"
//                   className={styles.formControl}
//                   placeholder="Enter your phone number"
//                   value={phoneNumber}
//                   onChange={(e) => setPhoneNumber(e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className={styles.row}>
//               <div className={styles.col}>
//                 <label className={styles.formLabel}>Signature:</label>
//                 <SignatureCanvas
//                   ref={sigCanvas}
//                   penColor="black"
//                   canvasProps={{ className: styles.signatureCanvas }}
//                 />
//                 <button className={styles.btnSecondary} onClick={clearSignature}>
//                   Clear Signature
//                 </button>
//               </div>
//               <div className={styles.col}>
//                 <label className={styles.formLabel}>Date:</label>
//                 <input
//                   type="date"
//                   className={styles.formControl}
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Image Uploader */}
//           <ImageUploader onImageCropped={handleImageCropped} />

//           {/* Church Use Only */}
//           <div className={styles.section}>
//             <h4 className={styles.sectionTitle}>📜 For Church Use Only</h4>
//             <div className={styles.row}>
//               <div className={styles.col}>
//                 <label className={styles.formLabel}>Ministry Leader:</label>
//                 <input
//                   type="text"
//                   className={styles.formControl}
//                   placeholder="Leader's Name"
//                   value={ministryLeader}
//                   onChange={(e) => setMinistryLeader(e.target.value)}
//                 />
//               </div>
//               <div className={styles.col}>
//                 <label className={styles.formLabel}>Date Approved:</label>
//                 <input
//                   type="date"
//                   className={styles.formControl}
//                   value={dateApproved}
//                   onChange={(e) => setDateApproved(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className={styles.textCenter}>
//           <button
//             className={styles.btnPrimary}
//             onClick={handleSubmit}
//             disabled={
//               isSubmitting ||
//               !fullName.trim() ||
//               !phoneNumber.trim() ||
//               !reasonForJoining.trim() ||
//               !date ||
//               !sigCanvas.current ||
//               sigCanvas.current.isEmpty() ||
//               !croppedImage
//             }
//           >
//             {isSubmitting ? "Submitting..." : "Submit Commitment"}
//           </button>

//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default InstrumentalistsCommitment;

































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
    let valid = true;

    if (!fullName.trim()) {
      showError("fullName", "Full Name is required.");
      valid = false;
    }
    if (!phoneNumber.trim()) {
      showError("phoneNumber", "Phone Number is required.");
      valid = false;
    }
    if (!reasonForJoining.trim()) {
      showError("reasonForJoining", "Reason for Joining is required.");
      valid = false;
    }
    if (!date) {
      showError("date", "Date is required.");
      valid = false;
    }

    // Safely check for signature before proceeding
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      showError("signature", "Signature is required.");
      valid = false;
    }

    if (!croppedImage) {
      showError("croppedImage", "Image is required.");
      valid = false;
    }

    if (!valid) return;

    // Proceed with the submission if all fields are valid
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
      const response = await axios.post("/api/submit-commitment", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("Thank you for your commitment!");
        // Reset form fields after successful submission
        setFullName("");
        setPhoneNumber("");
        setReasonForJoining("");
        setDate(""); // Clear date if needed
        setMinistryLeader("");
        setDateApproved("");
        sigCanvas.current?.clear();
        setCroppedImage(null);
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
                />
              </div>
            </div>
          </div>

          {/* Image Uploader */}
          <ImageUploader onImageCropped={handleImageCropped} />

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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Commitment"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InstrumentalistsCommitment;

