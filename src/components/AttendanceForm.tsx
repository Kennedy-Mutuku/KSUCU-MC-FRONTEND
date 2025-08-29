import React, { useState } from 'react';
import styles from '../styles/attendanceForm.module.css';

interface AttendanceFormProps {
  ministry: string;
  onSubmit: (data: AttendanceSubmission) => void;
}

export interface AttendanceSubmission {
  name: string;
  regNo: string;
  year: number;
  ministry: string;
  timestamp: string;
  id: string;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({ ministry, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    regNo: '',
    year: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deviceAttendance, setDeviceAttendance] = useState<AttendanceSubmission[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // Validation
    if (!formData.name.trim() || !formData.regNo.trim() || !formData.year) {
      setMessage('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    // Create attendance submission
    const submission: AttendanceSubmission = {
      name: formData.name.trim(),
      regNo: formData.regNo.trim().toUpperCase(),
      year: parseInt(formData.year),
      ministry,
      timestamp: new Date().toISOString(),
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    try {
      // Save to localStorage (will be moved to proper backend later)
      const existingAttendance = JSON.parse(localStorage.getItem('ministryAttendance') || '[]');
      
      // Check for duplicate registration number (not tied to specific session or date)
      const isDuplicate = existingAttendance.some((record: AttendanceSubmission) => 
        record.regNo === submission.regNo && 
        record.ministry === ministry
      );

      if (isDuplicate) {
        setMessage(`Registration number ${submission.regNo} has already signed attendance for ${ministry} ministry`);
        setIsSubmitting(false);
        return;
      }

      existingAttendance.push(submission);
      localStorage.setItem('ministryAttendance', JSON.stringify(existingAttendance));

      // Update device attendance list
      setDeviceAttendance(prev => [...prev, submission]);

      onSubmit(submission);
      setMessage(`✅ Attendance signed successfully for ${submission.name}!`);
      setFormData({ name: '', regNo: '', year: '' });
      
      // Keep form open for more users, just show success message
      setTimeout(() => {
        setMessage('');
      }, 3000);

    } catch (error) {
      setMessage('❌ Error signing attendance. Please try again.');
      console.error('Attendance submission error:', error);
    }

    setIsSubmitting(false);
  };

  // Load device attendance on component mount
  React.useEffect(() => {
    const existingAttendance = JSON.parse(localStorage.getItem('ministryAttendance') || '[]');
    const ministryAttendance = existingAttendance.filter((record: AttendanceSubmission) => 
      record.ministry === ministry
    );
    setDeviceAttendance(ministryAttendance);
  }, [ministry]);

  if (!showForm) {
    return (
      <div className={styles.attendanceToggle}>
        {deviceAttendance.length > 0 && (
          <div className={styles.attendanceCount}>
            <p>📊 {deviceAttendance.length} user{deviceAttendance.length !== 1 ? 's' : ''} signed from this device:</p>
            <div className={styles.usersList}>
              {deviceAttendance.map((record, index) => (
                <span key={record.id} className={styles.userBadge}>
                  {record.name} ({record.regNo})
                </span>
              ))}
            </div>
          </div>
        )}
        <button 
          className={styles.toggleButton}
          onClick={() => setShowForm(true)}
        >
          📝 Sign Attendance for {ministry}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.attendanceContainer}>
      <div className={styles.formHeader}>
        <h3 className={styles.formTitle}>
          📝 {ministry} Attendance
        </h3>
        <button 
          className={styles.closeButton}
          onClick={() => setShowForm(false)}
          type="button"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.attendanceForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="regNo" className={styles.label}>
            Registration Number *
          </label>
          <input
            type="text"
            id="regNo"
            name="regNo"
            value={formData.regNo}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="e.g., KU/2024/001234"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="year" className={styles.label}>
            Year of Study *
          </label>
          <select
            id="year"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            className={styles.select}
            required
          >
            <option value="">Select your year</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
            <option value="5">Year 5</option>
            <option value="6">Year 6</option>
          </select>
        </div>

        {message && (
          <div className={`${styles.message} ${message.includes('✅') ? styles.success : styles.error}`}>
            {message}
          </div>
        )}

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setMessage('');
            }}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            Done Signing
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? '📝 Signing...' : '✅ Sign Attendance'}
          </button>
        </div>
      </form>

      {deviceAttendance.length > 0 && (
        <div className={styles.deviceAttendance}>
          <h4>✅ Users signed from this device ({deviceAttendance.length}):</h4>
          <div className={styles.signedUsersList}>
            {deviceAttendance.map((record, index) => (
              <div key={record.id} className={styles.signedUserItem}>
                <span className={styles.signedUserName}>{record.name}</span>
                <span className={styles.signedUserRegNo}>({record.regNo})</span>
                <span className={styles.signedUserTime}>
                  {new Date(record.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className={styles.formFooter}>
        <p className={styles.footerText}>
          🕐 Current time: {new Date().toLocaleString()}
        </p>
        <p className={styles.footerNote}>
          💡 You can sign attendance for multiple users from this device
        </p>
      </div>
    </div>
  );
};

export default AttendanceForm;