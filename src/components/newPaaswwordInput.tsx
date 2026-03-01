import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/signin.module.css';
import cuLogo from '../assets/cuLogoUAR.png';

const PasswordReset: React.FC = () => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [id]: value }));
  };

  const validatePassword = (password: string) => {
    // Minimum 4 characters — kept simple since default password is phone number
    return password.length >= 4;
  };

  const handleSubmit = async () => {
    const { password, confirmPassword } = formData;

    // Validate passwords
    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 4 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`https://ksucu-mc.co.ke/users/reset-password?token=${token}`, { password });
      if(response.status = 200){
        setSuccessMessage('Password reset successful! You can now log in ...redirecting to login');
        setTimeout(() => {
            navigate('/signIn')
        }, 3000);
      }
      setFormData({ password: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles['container']}>
        <Link to={"/"}>
          <div className={styles['logo_signUp']}><img src={cuLogo} alt="CU logo" /></div>
        </Link>
        <h2 className={styles['text']}>Reset Your Password</h2>

        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}

        <form action="" className={styles['form']}>
          <div>
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={formData.password} 
              onChange={handleChange} 
              className={styles['input']}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              className={styles['input']}
            />
          </div>
        </form>

        <div className={styles['submisions']}>
          <div className={styles['clearForm']} onClick={() => setFormData({ password: '', confirmPassword: '' })}>Clear</div>
          {loading ? <div className={styles['submitData']}>Reseting</div> : 
          <div className={styles['submitData']} onClick={handleSubmit}>Reset</div>
          }
        </div>

        <div className={styles['form-footer']}>
          <p> <Link to={"/signIn"}>Back to login</Link></p>
        </div>
        
      </div>
    </div>
  );
};

export default PasswordReset;
