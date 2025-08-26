import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cuLogo from '../assets/KSUCU logo updated document.png';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/changeDetails.module.css';
import Cookies from 'js-cookie';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';
import { getApiUrl } from '../config/environment';

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
  confirmPassword: string;
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

const ChangeDetails: React.FC = () => {
  const navigate = useNavigate();
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
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedMinistries, setSelectedMinistries] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleMinistrySelection = (id: string) => {
    setSelectedMinistries(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(ministry => ministry !== id)
        : [...prevSelected, id]
    );
  };
  
  // useEffect(() => {
  //   setLoading(true)
  //   const fetchUserData = async () => {
  //     try {

  //       const loginToken = Cookies.get('loginToken');


  //       const response = await axios.get('https://ksucu-mc.co.ke/users/data', { withCredentials: true } );

  //       if(loginToken && !response.data.reg){
  //         setError('Please complete your registration. Google sign-up doesn’t provide this information.')
  //       }else{
  //         console.log('clear');
          
  //       }
        
  //       setFormData(response.data);
  //       console.log(response.data);
        
  //     } catch (error: any) { 
  //       if(error.response.status = 400){
  //       setError('Email/Reg/Phone already exist 😖')
  //       setLoading(false)
  //     }else{
  //       setError('Unexpected error occured 💔')
  //       setLoading(false)
  //     }
  //     }finally{
  //       setLoading(false)
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        
      setLoading(true);
        const loginToken = Cookies.get('loginToken');
        const response = await axios.get(getApiUrl('users'), { withCredentials: true });
  
        if (loginToken && !response.data.reg) {
          setError('Please complete your registration. Google sign-up doesn’t provide this information.');
        } else {
          console.log('clear');
        }
        // Convert fetched string into an array
        const ministriesArray = response.data.ministry
          ? response.data.ministry.split(", ").map((m: string) => m.trim().toLocaleLowerCase())
          : [];

          //Ensure all form fields are set properly
          setFormData({
            username: response.data.username || '',
            phone: response.data.phone || '',
            email: response.data.email || '',
            course: response.data.course || '',
            reg: response.data.reg || '',
            yos: response.data.yos || '',
            ministry: response.data.ministry || '', // Store ministry string
            et: response.data.et || '',
            password: '', // Keep password empty for security
            confirmPassword: '' // Keep confirm password empty
          });
        
        setSelectedMinistries(ministriesArray); // Set selected ministries
  
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 400) {
          setError('Email/Reg/Phone already exists 😖');
        } else if (error.response && error.response.status === 401) {
          setError('Not authenticated. Redirecting to login...');
          setTimeout(() => navigate('/signIn'), 1500);
        } else {
          setError('Failed to load user data. Please try again.');
        }
      } finally {
        setLoading(false);
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

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setShowDropdown(false);
    }
  };
  
  function validateYOS(input: string) {
    const regex = /^[1-6]$/; // Matches only one digit between 1 and 6
    return regex.test(input);
  }

  function validatePhone(input: string) {
    const regex = /^0\d{9}$/; // Matches exactly 10 digits starting with 0, no spaces allowed
    return regex.test(input);
  }

  function validatePassword(input: string) {
    // At least 8 characters, 1 uppercase, 1 number
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(input);
  }

  const handleSubmit = async () => {
    // Convert selected ministries array to a comma-separated string
    const ministriesString = selectedMinistries.join(', ');
  
    // Prepare the final form data, excluding password if it's empty
    const { password, confirmPassword, ...dataWithoutPassword } = formData;
    const finalFormData = {
      ...dataWithoutPassword,
      ministry: ministriesString, // Ensure ministries are stored as a string
    };
  
    // Check if any field (except password) is empty
    for (const [key, value] of Object.entries(finalFormData)) {
      if (!value) {
        setError(`Please fill in the ${key} field 😊`);
        return;
      }
    }
  
    // Validate ET selection
    if (finalFormData.et === "choose..." || finalFormData.et.trim() === "") {
      setError("Please select a valid ET option 😊");
      return;
    }
  
    if (!validatePhone(finalFormData.phone)) {
      setError('Phone number must be 10 digits starting with 0 and having no spaces 🤨');
      return;
    }
  
    if (!validateYOS(finalFormData.yos)) {
      setError('Year of study must be a number between 1 and 6. 🤨');
      return;
    }

    // Password validation (only if password is provided)
    if (password && password.trim() !== '') {
      if (!validatePassword(password)) {
        setError('Password must be at least 8 characters long and contain at least one uppercase letter and one digit 🤨');
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match 😕');
        return;
      }
    }
  
    setLoading(true);
  
    try {
      // Include password in request only if user enters it
      const payload = (password && password.trim() !== '') ? { ...finalFormData, password } : finalFormData;
  
      const response = await axios.put(getApiUrl('usersUpdate'), payload, {
        withCredentials: true,
      });
  
      console.log(response.data);
      setSuccessMessage('Details updated successfully');
      setError('');
  
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
        confirmPassword: ''
      });
  
      setSelectedMinistries([]); // Clear selected ministries after submission
  
    } catch (error) {
      console.error('Error updating details', error);
      setError('Error updating details');
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
        <h2 className={styles['text']}>Update Details</h2>
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Loading your details...</p>
          </div>
        )}
        
        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}

        <div className={styles['form']}>

          <div className={styles['form-div']}>
            <label htmlFor="username">NAME</label>
            <input type="text" id="username" className={styles['input']} value={formData.username} onChange={handleChange} />
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="phone">PHONE</label>
            <input type="text" id="phone" className={styles['input']} value={formData.phone} onChange={handleChange} />
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" className={styles['input']} value={formData.email} onChange={handleChange}  disabled={true} />
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
            <div className={styles['ministry-container']} tabIndex={0} onBlur={handleBlur} >
              <div className={styles['ministry-header']} onClick={() => setShowDropdown(!showDropdown)} >
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
            <label htmlFor="et">E.T</label>
            <select id="et" className={styles['select']} value={formData.et} onChange={handleChange}>
              <option>choose...</option>
              <option value="rivet">Rivet</option>
              <option value="cet">Cet</option>
              <option value="eset">Eset</option>
              <option value="net">Net</option>
              <option value="weso">Weso</option>
            </select>
          </div>
        </div>

        {/* Password Change Section */}
        <div className={styles['form-section']} style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
          <h3 style={{ marginBottom: '20px', color: '#2c3e50', textAlign: 'center' }}>Change Password (Optional)</h3>
          
          <div className={styles['info-note']} style={{ 
            padding: '10px', 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '5px', 
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: '#856404', fontSize: '12px' }}>
              💡 Leave blank to keep your current password. Your current password is your phone number.
            </p>
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="password">NEW PASSWORD</label>
            <div className={styles['password-wrapper']} style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={styles['input']}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password (optional)"
              />
              <button 
                type="button" 
                onClick={togglePasswordVisibility}
                style={{ 
                  position: 'absolute', 
                  right: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  border: 'none', 
                  background: 'none', 
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
            <div className={styles['password-wrapper']} style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                className={styles['input']}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
              <button 
                type="button" 
                onClick={togglePasswordVisibility}
                style={{ 
                  position: 'absolute', 
                  right: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  border: 'none', 
                  background: 'none', 
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
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
