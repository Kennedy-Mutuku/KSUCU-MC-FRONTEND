import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import styles from "../styles/ChoirCommitment.module.css"; // Import CSS module
import Header from "../components/header";
import Footer from "../components/footer";

const ChoirCommitment: React.FC = () => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  return (
    <div className={styles.container}>
      <Header />
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

        {/* Reason for Joining */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>📝 Why Do You Want to Join?</h4>
          <textarea className={styles.formControl} rows={3} placeholder="Write your reasons here..."></textarea>
        </div>

        {/* Personal Commitment */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>✅ Personal Commitment</h4>
          <p>By signing below, I commit to fully participating in the Choir Ministry and adhering to the policies set forth.</p>

          <div className={styles.row}>
            <div className={styles.col}>
              <label className={styles.formLabel}>Name:</label>
              <input type="text" className={styles.formControl} placeholder="Enter your name" />
            </div>
            <div className={styles.col}>
              <label className={styles.formLabel}>Year of Study:</label>
              <input type="text" className={styles.formControl} placeholder="Enter your year of study" />
            </div>
          </div>

          {/* Signature Canvas */}
          <div className={styles.row}>
            <div className={styles.col}>
              <label className={styles.formLabel}>Signature:</label>
              <div className={styles.signatureContainer}>
                <SignatureCanvas 
                  ref={sigCanvas}
                  penColor="black"
                  canvasProps={{ width: 300, height: 100, className: styles.signatureCanvas }}
                />
                <button className={styles.clearButton} onClick={clearSignature}>Clear</button>
              </div>
            </div>
            <div className={styles.col}>
              <label className={styles.formLabel}>Date:</label>
              <input type="date" className={styles.formControl} />
            </div>
          </div>
        </div>

        {/* Church Use Only */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>📜 For Church Use Only</h4>
          <div className={styles.row}>
            <div className={styles.col}>
              <label className={styles.formLabel}>Ministry Leader:</label>
              <input type="text" className={styles.formControl} placeholder="Leader's Name" />
            </div>
            <div className={styles.col}>
              <label className={styles.formLabel}>Date Approved:</label>
              <input type="date" className={styles.formControl} />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className={styles.textCenter}>
          <button className={styles.btnPrimary} onClick={() => alert("Thank you for your commitment!")}>Submit Commitment</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChoirCommitment;
