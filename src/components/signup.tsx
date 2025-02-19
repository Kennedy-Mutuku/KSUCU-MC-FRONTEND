import React, { useState } from 'react';
import axios from 'axios';
import cuLogo from '../assets/KSUCU logo updated document.png';
import { Link } from 'react-router-dom';
import styles from '../styles/signup.module.css'; 
import googleIcon from '../assets/googleIcon.png';
import {Eye, EyeOff} from 'lucide-react'
import { ChevronDown } from 'lucide-react';
const googleAuth = 'https://ksucu-mc.co.ke/auth/google';

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
  retype_p: string;
};


const ministriesList = [
  { id: 'wananzambe', label: 'Wananzambe' },
  { id: 'intercessory', label: 'Intercessory' },
  { id: 'ushering', label: 'Ushering' },
  { id: 'pw', label: 'Praise and Worship' },
  { id: 'cs', label: 'Church School' },
  { id: 'hs', label: 'High School' },
  { id: 'compassion', label: 'Compassion' },
  { id: 'creativity', label: 'Creativity' },
  { id: 'choir', label: 'Choir' }
];

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    phone: '',
    email: '',
    course: '',
    reg: '',
    yos: '',
    ministry: '',
    et: '', 
    password: '',
    retype_p: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');
  const [error, setError] = useState('');
  const [selectedMinistries, setSelectedMinistries] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleMinistrySelection = (id: string) => {
    setSelectedMinistries(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(ministry => ministry !== id)
        : [...prevSelected, id]
    );
  };
  
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to close dropdown when clicking outside
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setShowDropdown(false);
    }
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: value
    }));
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  function validateYOS(input: string) {
    const regex = /^[1-6]$/; // Matches only one digit between 1 and 6
    return regex.test(input);
  }

  function validatePhone(input: string) {
    const regex = /^0\d{9}$/; // Matches exactly 10 digits starting with 0, no spaces allowed
    return regex.test(input);
  }

  const clearForm = () => setFormData({
    username: '',
    phone: '',
    email: '',
    course: '',
    reg: '',
    yos: '',
    ministry: '',
    et: '', 
    password: '',
    retype_p: ''
  })
  
  const handleSubmit = async () => {
    // Convert selected ministries array to a comma-separated string
    const ministriesString = selectedMinistries.join(', ');
  
    // Update formData to include ministries as a string
    const updatedFormData = { ...formData, ministry: ministriesString };
    const { retype_p, ...dataToSend } = updatedFormData; // Exclude retype_p from submission
  
    // Check if any field is empty
    for (const [key, value] of Object.entries(updatedFormData)) {
      if (!value) {
        setError(`Please fill in the ${key} field 😊`);
        return;
      }
    }
  
    if (!validatePhone(updatedFormData.phone)) {
      setError('Phone number must be 10 digits starting with 0 and having no spaces 🤨');
      return;
    }
  
    if (!validateYOS(updatedFormData.yos)) {
      setError('Year of study must be a number between 1 and 6. 🤨');
      return;
    }
  
    if (!validatePassword(updatedFormData.password)) {
      setError('Password must be at least 8 characters long and contain at least one digit and one uppercase letter. 🤨');
      return;
    }
  
    if (updatedFormData.password !== updatedFormData.retype_p) {
      setError('Passwords do not match. 😕');
      return;
    }
  
    setLoading(true);
  
    try {

      console.log(dataToSend);
      
      const response = await axios.post('https://ksucu-mc.co.ke/users/signup', dataToSend);
      if (response.status === 200) {
        setLoadingText('Check your email... 🤗');
        setError('');
        clearForm();
        setSelectedMinistries([]); // Clear selected ministries after successful submission
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        setError('Email/Reg/Phone already exist 😖');
      } else {
        setError('Unexpected error occurred 💔');
      }
      setLoading(false);
    }
  };
  

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      setError('....redirecting to google auth')
      e.preventDefault();
      window.location.href = googleAuth; 
    } catch (error) {
      console.error('unexpected happened');
    }
  }

  return (
    <div className={styles.body}>
      <div className={styles['container']}>

        {loading && <div className={styles['hidden_div']}></div>}

        <Link to={"/"}>
          <div className={styles['logo_signUp']}><img src={cuLogo} alt="CU logo" /></div>
        </Link>
        <h2 className={styles['text']}>Sign Up</h2>
        
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles['form']}>
          <div className={styles['form-div']}>
            <label htmlFor="name">NAME</label>
            <input type="text" id="username" className={styles['input']} value={formData.username} onChange={handleChange} />
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="phone">PHONE</label>
            <input type="text" id="phone" className={styles['input']} value={formData.phone} onChange={handleChange} />
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" className={styles['input']} value={formData.email} onChange={handleChange} />
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="course">COURSE</label>
            <input type="text" id="course" className={styles['input']} value={formData.course} onChange={handleChange} />
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="reg">REG</label>
            <input type="text" id="reg" className={styles['input']} value={formData.reg} onChange={handleChange} />
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="yos">Y.O.S</label>
            <input type="number" id="yos" className={styles['input']} value={formData.yos} onChange={handleChange} />
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="ministry">MINISTRY</label>
            <div className={styles['ministry-container']} tabIndex={0} onBlur={handleBlur}>
              <div className={styles['ministry-header']} onClick={() => setShowDropdown(!showDropdown)}>
                <span>
                  {selectedMinistries.length > 0 ? selectedMinistries.join(', ') : 'choose...'}
                </span>
                <ChevronDown size={20} />
              </div>

              {showDropdown && (
                <div className={styles['ministry-menu']}>
                  {ministriesList.map(ministry => (
                    <label key={ministry.id} className={styles['ministry-item']}>
                      <input
                        type="checkbox"
                        checked={selectedMinistries.includes(ministry.id)}
                        onChange={() => toggleMinistrySelection(ministry.id)}
                      />
                      {ministry.label}
                    </label>
                  ))}
                </div>
              )} 

            </div>
          </div>

            <div className={styles['form-div']}>
              <label htmlFor="et">ET</label>
              <select id="et" className={styles['select']} value={formData.et} onChange={handleChange}>
                <option>choose...</option>
                <option value="rivet">Rivet</option>
                <option value="cet">Cet</option>
                <option value="ecet">Eset</option>
                <option value="net">Net</option>
                <option value="weso">Weso</option>
              </select>
            </div>

            <section className={styles['passwords']}>
              <div className={styles['password-container']}>
                <label htmlFor="password">PASSWORD</label>
                <section className={styles['password-wrapper']}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={styles['input-pswd']}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button type="button" className={styles['eye-button']} onClick={togglePasswordVisibility}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </section>
              </div>

              <div className={styles['password-container']}>
                <label htmlFor="retype_p">RETYPE</label>
                <section className={styles['password-wrapper']}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="retype_p"
                    className={styles['input-pswd']}
                    value={formData.retype_p}
                    onChange={handleChange}
                  />
                  <button type="button" className={styles['eye-button']} onClick={togglePasswordVisibility}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </section>
              </div>
            </section>

        <div className={styles['submisions']}>
          <div className={styles['clearForm']} onClick={() =>{
           setFormData({
            username: '',
            phone: '',
            email: '',
            course: '',
            reg: '',
            yos: '',
            ministry: '',
            et: '', 
            password: '',
            retype_p: ''
          });
          setError('')
        
          }
          
          }>Clear</div>

          {loading ? <div className={styles['submitData']}>Next</div> : 
          <div className={styles['submitData']} onClick={handleSubmit}>Next</div>
          }
          
        </div>

        <div className={styles['form-footer']}>
          <p>Already have an account? <Link to={"/signIn"}>Click Here</Link></p>
        </div>

        <button  className={styles['google-redirect-div']} onClick={handleLogin}>
                    <div className={styles['flex']}>
                        <span className={styles['google-icon-span']}>
                        <img src={googleIcon} alt="" />
                        </span>
                        <span className={styles['google-icon-text']}>continue with Google</span>
                    </div>
          </button>

        <div className={styles['form-footer']}>
          <p><Link to={"/Home"}>Home</Link></p>
        </div>

      </div>

        {/* Loading animation */}
        <div className={`${styles.loading} ${loading ? styles['loading-active'] : ''}`}>
          <p>{loadingText}</p>
        </div>

    </div>
    </div>
  );
};

export default SignUp;