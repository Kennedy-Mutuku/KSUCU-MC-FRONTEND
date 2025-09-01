import React, { useState } from 'react';
import axios from 'axios';
import cuLogo from '../assets/KSUCU logo updated document.png';
import { Link } from 'react-router-dom';
import styles from '../styles/signup.module.css'; 
import { ChevronDown } from 'lucide-react';
import { getApiUrl } from '../config/environment';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';

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

const AdmissionAdmin: React.FC = () => {
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
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedMinistries, setSelectedMinistries] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleMinistrySelection = (id: string) => {
    setSelectedMinistries(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(ministry => ministry !== id)
        : [...prevSelected, id]
    );
  };
  

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


  function validateYOS(input: string) {
    const regex = /^[1-6]$/;
    return regex.test(input);
  }

  function validatePhone(input: string) {
    const regex = /^0\d{9}$/;
    return regex.test(input);
  }

  const clearForm = () => {
    setFormData({
      username: '',
      phone: '',
      email: '',
      course: '',
      reg: '',
      yos: '',
      ministry: '',
      et: ''
    });
    setSelectedMinistries([]);
    setError('');
    setSuccess('');
  };
  
  const handleSubmit = async () => {
    const ministriesString = selectedMinistries.join(', ');
    const dataToSend = { ...formData, ministry: ministriesString };

    // Check if any field is empty
    for (const [key, value] of Object.entries(dataToSend)) {
      if (!value) {
        setError(`Please fill in the ${key} field 😊`);
        return;
      }
    }

    if (!validatePhone(dataToSend.phone)) {
      setError('Phone number must be 10 digits starting with 0 and having no spaces 🤨');
      return;
    }

    if (!validateYOS(dataToSend.yos)) {
      setError('Year of study must be a number between 1 and 6. 🤨');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log(dataToSend);
      
      const response = await axios.post(getApiUrl('admissionAdminAdmitUser'), dataToSend, {
        withCredentials: true,
      });
      
      if (response.status === 200 || response.status === 201) {
        setLoadingText('User admitted successfully! 🤗');
        setSuccess('User has been successfully admitted to the system!');
        setError('');
        clearForm();
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        setError('Email/Reg/Phone already exist.');
      } else if (error.response?.status === 401) {
        setError('Unauthorized. Please check your admin credentials.');
      } else {
        setError('Unexpected error occurred.');
      }
      setLoading(false);
    }
  };

  return (
    <>
      <UniversalHeader />
      <div className={styles.body}>
      <div className={styles['container']}>

        {loading && <div className={styles['hidden_div']}></div>}

        <Link to={"/"}>
          <div className={styles['logo_signUp']}><img src={cuLogo} alt="CU logo" /></div>
        </Link>
        <h2 className={styles['text']}>Admit New User</h2>
        
        {error && <p className={styles.error}>{error}</p>}
        {success && <p style={{color: 'green', textAlign: 'center', margin: '10px 0'}}>{success}</p>}

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

            <div className={styles['info-note']} style={{ 
              padding: '15px', 
              backgroundColor: '#e8f4fd', 
              border: '1px solid #bee5eb', 
              borderRadius: '5px', 
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, color: '#0c5460', fontSize: '14px' }}>
                📱 <strong>Note:</strong> The user's phone number will be set as their default password.
                <br />
                They can change it later from their profile settings.
              </p>
            </div>

        <div className={styles['submisions']}>
          <div className={styles['clearForm']} onClick={clearForm}>Clear</div>

          {loading ? <div className={styles['submitData']}>Processing...</div> : 
          <div className={styles['submitData']} onClick={handleSubmit}>Admit User</div>
          }
          
        </div>

        </div>

        <div className={styles['form-footer']}>
          <p><Link to={"/"}>Home</Link> | <Link to={"/user-management"}>Manage Users</Link></p>
        </div>

      </div>

        {/* Loading animation */}
        <div className={`${styles.loading} ${loading ? styles['loading-active'] : ''}`}>
          <p>{loadingText}</p>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default AdmissionAdmin;