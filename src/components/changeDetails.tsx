import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cuLogo from '../assets/KSUCU logo updated document.png';
import { Link } from 'react-router-dom';
import styles from '../styles/signup.module.css';
import Cookies from 'js-cookie'

type FormData = {
  username: string;
  phone: string;
  email: string;
  course: string;
  reg: string;
  yos: string;
  ministry: string;
  et: string;
  password: string;
};

const ChangeDetails: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    phone: '',
    email: '',
    course: '',
    reg: '',
    yos: '',
    ministry: '',
    et: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true)
    const fetchUserData = async () => {
      try {

        const loginToken = Cookies.get('loginToken');


        const response = await axios.get('https://ksucu-mc.co.ke/users/data', { withCredentials: true } );

        if(loginToken && !response.data.reg){
          setError('Please complete your registration. Google sign-up doesn’t provide this information.')
        }else{
          console.log('clear');
          
        }
        
        setFormData(response.data);
      } catch (error: any) { 
        if(error.response.status = 400){
        setError('Email/Reg/Phone already exist 😖')
        setLoading(false)
      }else{
        setError('Unexpected error occured 💔')
        setLoading(false)
      }
      }finally{
        setLoading(false)
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: value
    }));
  };

  function validateYOS(input: string) {
    const regex = /^[1-6]$/; // Matches only one digit between 1 and 6
    return regex.test(input);
  }

  function validatePhone(input: string) {
    const regex = /^0\d{9}$/; // Matches exactly 10 digits starting with 0, no spaces allowed
    return regex.test(input);
  }

  const handleSubmit = async () => {

    // Check if any field is empty
    for (const [key, value] of Object.entries(formData)) {
        if (!value) {
            setError(`Please fill in the ${key} field 😊`);
            return;
        }
    }

    if (!validatePhone(formData.phone)) {
      setError('Phone number must be 10 digits starting with 0 and having no spaces 🤨');
      return
    } 
    
    if (!validateYOS(formData.yos)) {
      setError('Year of study must be a number between 1 and 6. 🤨');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put('https://ksucu-mc.co.ke/users/update', formData, { withCredentials: true });
      console.log(response.data);
      setSuccessMessage('Details updated successfully')
      setError('')
    } catch (error) {
      console.error("Error updating details", error);
      setError('Error updating details')
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles['container']}>
        <Link to={"/"}>
          <div className={styles['logo_signUp']}><img src={cuLogo} alt="CU logo" /></div>
        </Link>
        <h2 className={styles['text']}>Update Details</h2>
        
        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}

        <div className={styles['form']}>
          <div>
            <label htmlFor="username">NAME</label>
            <input type="text" id="username" className={styles['input']} value={formData.username} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="phone">PHONE</label>
            <input type="text" id="phone" className={styles['input']} value={formData.phone} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" className={styles['input']} value={formData.email} onChange={handleChange}  disabled={true} />
          </div>

          <div>
            <label htmlFor="course">COURSE</label>
            <input type="text" id="course" className={styles['input']} value={formData.course} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="reg">REG</label>
            <input type="text" id="reg" className={styles['input']} value={formData.reg} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="yos">Y.O.S</label>
            <input type="number" id="yos" className={styles['input']} value={formData.yos} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="ministry">MINISTRY</label>
            <select id="ministry" className={styles['select']} value={formData.ministry} onChange={handleChange}>
              <option>choose...</option>
              <option value="wananzambe">Wananzambe</option>
              <option value="intercessory">Intercessory</option>
              <option value="ushering">Ushering</option>
              <option value="pw">Praise and Worship</option>
              <option value="cs">Church School</option>
              <option value="hs">High School</option>
              <option value="compassion">Compassion</option>
              <option value="creativity">Creativity</option>
            </select>
          </div>

          <div>
            <label htmlFor="et">ET</label>
            <select id="et" className={styles['select']} value={formData.et} onChange={handleChange}>
              <option>choose...</option>
              <option value="rivet">Rivet</option>
              <option value="cet">Cet</option>
              <option value="ecet">Ecet</option>
              <option value="net">Net</option>
              <option value="weso">Weso</option>
            </select>
          </div>
        </div>

        <div className={`${styles['submisions']} ${styles['submissions-change-details']}`}>
          {loading ? <div className={styles['submitData']} >Updating</div> : 
          <div className={styles['submitData']} onClick={handleSubmit}>Update</div>
          }
        </div>

        <div className={styles['form-footer']}>
          <p> <Link to={"/"}>Home</Link></p>
        </div>
      </div>

        {/* Loading animation */}
        <div className={`${styles.loading} ${loading ? styles['loading-active'] : ''}`}>
          <p>Loading...</p>
        </div>

    </div>
  );
};

export default ChangeDetails;
