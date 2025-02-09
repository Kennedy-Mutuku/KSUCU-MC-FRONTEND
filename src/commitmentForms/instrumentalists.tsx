import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import styles from "../styles/InstrumentalistsCommitment.module.css"; // Import your CSS module
import Header from "../components/header";
import Footer from "../components/footer";

const InstrumentalistsCommitment: React.FC = () => {
  const sigCanvas = useRef<SignatureCanvas | null>(null);

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
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
            <textarea className={styles.formControl} rows={3} placeholder="Write your reasons here..."></textarea>
          </div>

          {/* Acknowledgment & Signature */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>✅ Acknowledgment & Signature</h4>
            <p>By signing below, I confirm that I have read, understood, and agree to abide by the ministry policies.</p>
            <div className={styles.row}>
                    <div className={styles.col}>
                    <label className={styles.formLabel}>Full Name:</label>
                    <input type="text" className={styles.formControl} placeholder="Enter your full name" />
                    </div>
                    <div className={styles.col}>
                    <label className={styles.formLabel}>Phone Number:</label>
                    <input type="text" className={styles.formControl} placeholder="Enter your phone number" />
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
            <button className={styles.btnPrimary} onClick={() => alert("Thank you for your commitment!")}>
              Submit Commitment
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InstrumentalistsCommitment;
