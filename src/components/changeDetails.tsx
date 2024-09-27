import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cuLogo from '../assets/cuLogoUAR.png';
import { Link } from 'react-router-dom';
import styles from '../styles/signup.module.css'; 

type FormData = {
  username: string;
  phone: string;
  email: string;
  course: string;
  reg: string;
  yos: string;
  ministry: string;
  et: string;
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
    et: ''
  });

  useEffect(() => {
    // Fetch data from the server when the component loads
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users/details'); // Adjust the API endpoint as necessary
        setFormData(response.data); // Assuming the API response returns the correct shape
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/users/signup', formData);
      console.log(response.data);
      // Handle the response as needed
    } catch (error) {
      console.error(error);
      // Handle the error as needed
    }
  };

  return (
    <>
      <div className={styles['container']}>
        <Link to={"/"}>
          <div className={styles['logo_signUp']}><img src={cuLogo} alt="CU logo" /></div>
        </Link>
        <h2 className={styles['text']}>Change Details</h2>

        <div className={styles['form']}>
          <div>
            <label htmlFor="name">NAME</label>
            <input type="text" id="username" className={styles['input']} value={formData.username} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="phone">PHONE</label>
            <input type="text" id="phone" className={styles['input']} value={formData.phone} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" className={styles['input']} value={formData.email} onChange={handleChange} disabled /> {/* Disable email field */}
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

        <div className={styles['submisions']}>
          <div className={styles['clearForm']} onClick={() => setFormData({
            username: '',
            phone: '',
            email: '',
            course: '',
            reg: '',
            yos: '',
            ministry: '',
            et: '',
          })}>Clear</div>
          <div className={styles['submitData']} onClick={handleSubmit}>Next</div>
        </div>

        <div className={styles['form-footer']}>
          <p>Already have an account? <Link to={"/signIn"}>Click Here</Link></p>
        </div>
      </div>
    </>
  );
};

export default ChangeDetails;
