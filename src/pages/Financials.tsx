import React, { useState } from 'react';
import styles from '../styles/financials.module.css';

import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';

const FinancialsPage: React.FC = () => {
  
  const [isPaymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const [isFinancialStatementsOpen, setFinancialStatementsOpen] = useState(false);

  const togglePaymentHistory = () => {
    setPaymentHistoryOpen(!isPaymentHistoryOpen);
  };

  const toggleFinancialStatements = () => {
    setFinancialStatementsOpen(!isFinancialStatementsOpen);
  };

  return (
    <>
      <UniversalHeader />

      <main className={styles.main}>


        <div className={styles['hiding-container']}>
          <p>Module under development 😊</p>
        </div>


        <h2 className={styles['main-financial--title---text']}>KSUCU-MC FINANCIALS</h2>

        <p className={styles['financial-description']}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim
          praesentium ullam repellendus aperiam, quidem id modi commodi sint
          maiores eius earum quae libero impedit sit? Lorem ipsum dolor sit
          amet, consectetur adipisicing elit. Incidunt, fugiat? Suscipit,
          minima. Dignissimos molestias minima eum nostrum voluptas quibusdam
          sit. Cumque obcaecati sit veniam enim.
        </p>

        <form className={styles.offerring}>
          <div>
            <label htmlFor="phone">Phone</label>
            <input className={styles['inputs']} type="text" id="phone" />
          </div>
          <div>
            <label htmlFor="amount">Amount</label>
            <input className={styles['inputs']} type="text" id="amount" />
          </div>
          <div>
            <label htmlFor="category">Category</label>
            <select id="category" name="category" className={styles['inputs'] }>
              <option className={styles['payment-option']} value="">--select--</option>
                <option value='tithe' className={styles['payment-option']}>
                  tithe
                </option>
                <option value='offering' className={styles['payment-option']}>
                  offering
                </option>
                <option value='thanksgiving' className={styles['payment-option']}>
                  thanksgiving
                </option>
            </select>
          </div>
        </form>

        <div className={styles['btn-submit']}>Pay</div>

        <div className={styles['record-flex']}>
          <div className={styles['payment-history']}>
            <div className={styles['payment-history--title']} onClick={togglePaymentHistory}>
              <p className={styles['payment-history--text']}>myPayment History</p>
              <svg className={`${styles['dropdown-icon']} ${isPaymentHistoryOpen ? styles['rotate'] : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
              </svg>
            </div>
            <div className={`${styles['payment-history--record']} ${styles['records']} ${isPaymentHistoryOpen ? styles['active'] : ''}`}>
              <p>11th Feb 2024 - Ksh5,000</p>
              <p>11th Feb 2024 - Ksh5,000</p>
              <p>11th Feb 2024 - Ksh5,000</p>
              <p>11th Feb 2024 - Ksh5,000</p>
            </div>
          </div>
          <div className={styles['financial-statements']}>
            <div className={styles['financial-statement--title']} onClick={toggleFinancialStatements}>
              <p className={styles['financial-statement--text']}>financial statements</p>
              <svg className={`${styles['dropdown-icon']} ${isFinancialStatementsOpen ? styles['rotate'] : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
              </svg>
            </div>
            <div className={`${styles['financial-statement--record']} ${styles['records']} ${isFinancialStatementsOpen ? styles['active'] : ''}`}>
              <p>financial year 2021 - 2022</p>
              <p>financial year 2022 - 2023</p>
              <p>financial year 2024 - 2024</p>
              <p>financial year 2025 - 2026</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default FinancialsPage;
