import React, {useRef} from "react";
import styles from "../styles/KisiiCuCommitment.module.css"; // Import your CSS module
import Header from '../components/header';
import Footer from '../components/footer';
import SignatureCanvas from "react-signature-canvas";

const PraiseandWorshipCommitment: React.FC = () => {

  const sigCanvas = useRef<SignatureCanvas>(null);

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  return (
    <div className={styles.container}>
      <Header />
        {/* Commitment Form */}
        <div className={styles.containerForm}>
          <div className={styles.commitmentForm}>
            <h2 className={styles.formTitle}>🙌 Praise & Worship Ministry Commitment Form</h2>
            <p className={styles.textMuted}>"Serving with Excellence and Integrity"</p>

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
              <textarea className={styles.formControl} rows={3} placeholder="Write your reasons here..."></textarea>
            </div>

            <div className={styles.personalCommitment}>
              <h4 className={styles.sectionTitle}>💖 Personal Commitment</h4>
              <p>By signing below, I commit to actively participating in the ministry, upholding its values, and dedicating my time to service.</p>

              <div className={styles.row}>
                <div className={styles.col}>
                  <label className={styles.formLabel}>Name:</label>
                  <input type="text" className={styles.formControl} placeholder="Enter your name" />
                </div>
                <div className={styles.col}>
                  <label className={styles.formLabel}>Year of Study:</label>
                  <input type="text" className={styles.formControl} placeholder="Enter your year of study" />
                </div>
                <div className={styles.col}>
                  <label className={styles.formLabel}>Signature:</label>
                  <div className={styles.signatureContainer}>
                    <SignatureCanvas 
                      ref={sigCanvas}
                      penColor="black"
                      canvasProps={{ width: 240, height: 100, className: styles.signatureCanvas }}
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

            {/* CHURCH USE ONLY SECTION */}
            <div className={styles.churchUseOnly}>
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
        </div>
      <Footer />

    </div>
  );
};

export default PraiseandWorshipCommitment;
