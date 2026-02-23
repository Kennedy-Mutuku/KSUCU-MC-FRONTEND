import React, { useState } from 'react';
import axios from 'axios';
import cuLogo from '../assets/KSUCU logo updated document.png';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/signup.module.css';
import { ChevronDown } from 'lucide-react';
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
};

type RegistrationSuccess = {
  email: string;
  password: string;
  instructions: string;
} | null;


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
  const navigate = useNavigate();
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
  const [error, setError] = useState('');
  const [selectedMinistries, setSelectedMinistries] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<RegistrationSuccess>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    phone?: string;
    reg?: string;
  }>({});
  const [checkingField, setCheckingField] = useState<string | null>(null);

  // Check if a field value already exists in database
  const checkFieldExists = async (field: 'email' | 'phone', value: string) => {
    if (!value || value.trim() === '') return;

    // For phone, validate format first
    if (field === 'phone' && !/^0\d{9}$/.test(value)) return;

    setCheckingField(field);
    try {
      const response = await axios.post(getApiUrl('usersCheckExists'), {
        [field]: value.trim().toLowerCase()
      });

      if (response.data.exists) {
        setFieldErrors(prev => ({
          ...prev,
          [field]: `This ${field} is already registered.`
        }));
      } else {
        setFieldErrors(prev => ({
          ...prev,
          [field]: undefined
        }));
      }
    } catch (err) {
      console.error(`Error checking ${field}:`, err);
    } finally {
      setCheckingField(null);
    }
  };

  const toggleMinistrySelection = (id: string) => {
    setSelectedMinistries(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(ministry => ministry !== id)
        : [...prevSelected, id]
    );
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

  function validateYOS(input: string) {
    const regex = /^[1-6]$/; // Matches only one digit between 1 and 6
    return regex.test(input);
  }

  function validatePhone(input: string) {
    const regex = /^0\d{9}$/; // Matches exactly 10 digits starting with 0, no spaces allowed
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
    setFieldErrors({});
  };

  const handleSubmit = async () => {
    // Check if there are any field errors (duplicate email/phone)
    if (fieldErrors.email || fieldErrors.phone) {
      setError('Please fix the errors above before registering.');
      return;
    }

    // Convert selected ministries array to a comma-separated string
    const ministriesString = selectedMinistries.join(', ');

    // Update formData to include ministries as a string
    const dataToSend = { ...formData, ministry: ministriesString };

    // Check if any field is empty
    for (const [key, value] of Object.entries(dataToSend)) {
      if (!value) {
        const fieldName = key === 'yos' ? 'Year of Study' : key === 'et' ? 'ET' : key.charAt(0).toUpperCase() + key.slice(1);
        setError(`Please fill in the ${fieldName} field`);
        return;
      }
    }

    if (!validatePhone(dataToSend.phone)) {
      setError('Phone number must be 10 digits starting with 0 (e.g., 0712345678)');
      return;
    }

    if (!validateYOS(dataToSend.yos)) {
      setError('Year of study must be a number between 1 and 6');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Registering user:', dataToSend);

      const response = await axios.post(getApiUrl('usersSignup'), dataToSend);

      if (response.status === 201) {
        // Registration successful - show success message with login guide
        setRegistrationSuccess({
          email: dataToSend.email,
          password: dataToSend.phone,
          instructions: response.data.loginGuide?.instructions || 'Use your email and phone number to login'
        });
        clearForm();
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.response?.status === 400) {
        setError(error.response.data?.message || 'Email, Phone, or Registration number already exists');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show success screen if registration was successful
  if (registrationSuccess) {
    return (
      <div className={styles.body}>
        <div className={styles['container']}>
          <Link to={"/"}>
            <div className={styles['logo_signUp']}><img src={cuLogo} alt="CU logo" /></div>
          </Link>

          <div style={{
            background: '#dcfce7',
            border: '2px solid #16a34a',
            borderRadius: '12px',
            padding: '25px',
            textAlign: 'center',
            marginTop: '20px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>✅</div>
            <h2 style={{ color: '#166534', marginBottom: '15px' }}>Registration Successful!</h2>
            <p style={{ color: '#166534', marginBottom: '20px' }}>
              Your account has been created successfully.
            </p>

            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              <h3 style={{ color: '#166534', marginBottom: '15px', textAlign: 'center' }}>
                How to Login
              </h3>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ color: '#166534', fontWeight: 'bold', marginBottom: '5px' }}>
                  Email (Username):
                </p>
                <p style={{
                  background: 'white',
                  padding: '10px',
                  borderRadius: '5px',
                  fontFamily: 'monospace',
                  color: '#730051',
                  wordBreak: 'break-all'
                }}>
                  {registrationSuccess.email}
                </p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ color: '#166534', fontWeight: 'bold', marginBottom: '5px' }}>
                  Password:
                </p>
                <p style={{
                  background: 'white',
                  padding: '10px',
                  borderRadius: '5px',
                  fontFamily: 'monospace',
                  color: '#730051'
                }}>
                  {registrationSuccess.password}
                </p>
                <p style={{ fontSize: '12px', color: '#166534', marginTop: '5px' }}>
                  (Your phone number is your password)
                </p>
              </div>
            </div>

            <Link
              to="/signIn"
              style={{
                display: 'inline-block',
                background: '#730051',
                color: 'white',
                padding: '12px 30px',
                borderRadius: '25px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              Go to Login
            </Link>
          </div>

          <div className={styles['form-footer']} style={{ marginTop: '20px' }}>
            <p><Link to={"/Home"}>← Back to Home</Link></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.body}>
      <div className={styles['container']}>

        {loading && <div className={styles['hidden_div']}></div>}

        <Link to={"/"}>
          <div className={styles['logo_signUp']}><img src={cuLogo} alt="CU logo" /></div>
        </Link>
        <h2 className={styles['text']}>Sign Up</h2>

        <p style={{ fontSize: '13px', color: '#777', textAlign: 'center', marginBottom: '15px' }}>
          Create your account • Phone number is your password
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles['form']}>
          <div className={styles['form-div']}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="username"
              className={styles['input']}
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              minLength={3}
              maxLength={100}
            />
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              className={styles['input']}
              value={formData.phone}
              onChange={handleChange}
              onBlur={() => checkFieldExists('phone', formData.phone)}
              placeholder="e.g., 0712345678"
              pattern="0[0-9]{9}"
              title="Phone number must start with 0 and be exactly 10 digits"
              required
              maxLength={10}
              style={fieldErrors.phone ? { borderColor: '#dc2626' } : {}}
            />
            {checkingField === 'phone' && (
              <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0' }}>Checking...</p>
            )}
            {fieldErrors.phone && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                padding: '10px',
                marginTop: '8px'
              }}>
                <p style={{ color: '#dc2626', fontSize: '13px', margin: '0 0 8px' }}>
                  {fieldErrors.phone}
                </p>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                  Already have an account? <Link to="/signIn" style={{ color: '#730051', fontWeight: 'bold' }}>Login here</Link> or <Link to="/forgotPassword" style={{ color: '#730051', fontWeight: 'bold' }}>Forgot Password</Link>
                </p>
              </div>
            )}
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              className={styles['input']}
              value={formData.email}
              onChange={handleChange}
              onBlur={() => checkFieldExists('email', formData.email)}
              placeholder="Enter your email"
              required
              maxLength={100}
              style={fieldErrors.email ? { borderColor: '#dc2626' } : {}}
            />
            {checkingField === 'email' && (
              <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0' }}>Checking...</p>
            )}
            {fieldErrors.email && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                padding: '10px',
                marginTop: '8px'
              }}>
                <p style={{ color: '#dc2626', fontSize: '13px', margin: '0 0 8px' }}>
                  {fieldErrors.email}
                </p>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                  Already have an account? <Link to="/signIn" style={{ color: '#730051', fontWeight: 'bold' }}>Login here</Link> or <Link to="/forgotPassword" style={{ color: '#730051', fontWeight: 'bold' }}>Forgot Password</Link>
                </p>
              </div>
            )}
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="course">Course</label>
            <input
              type="text"
              id="course"
              className={styles['input']}
              value={formData.course}
              onChange={handleChange}
              placeholder="e.g., Computer Science"
              required
              maxLength={100}
            />
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="reg">Reg Number</label>
            <input
              type="text"
              id="reg"
              className={styles['input']}
              value={formData.reg}
              onChange={handleChange}
              placeholder="e.g., BCS/1234/21"
              required
              maxLength={50}
            />
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="yos">Year of Study</label>
            <input
              type="number"
              id="yos"
              className={styles['input']}
              value={formData.yos}
              onChange={handleChange}
              min="1"
              max="6"
              placeholder="1-6"
              required
            />
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="ministry">Ministry</label>
            <div className={styles['ministry-container']} tabIndex={0} onBlur={handleBlur}>
              <div className={styles['ministry-header']} onClick={() => setShowDropdown(!showDropdown)}>
                <span>
                  {selectedMinistries.length > 0 ? selectedMinistries.join(', ') : 'Select your ministry...'}
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
            <label htmlFor="et">ET Group</label>
            <select id="et" className={styles['select']} value={formData.et} onChange={handleChange} required>
              <option value="">Select ET...</option>
              <option value="rivet">Rivet</option>
              <option value="cet">Cet</option>
              <option value="eset">Eset</option>
              <option value="net">Net</option>
              <option value="weso">Weso</option>
            </select>
          </div>

          <div className={styles['submisions']}>
            <div className={styles['clearForm']} onClick={() => {
              clearForm();
              setError('');
            }}>Clear</div>

            {loading ? (
              <div className={styles['submitData']} style={{ opacity: 0.7 }}>Registering...</div>
            ) : (
              <div className={styles['submitData']} onClick={handleSubmit}>Register</div>
            )}
          </div>

          <div className={styles['form-footer']}>
            <p><Link to={"/Home"}>← Back to Home</Link></p>
          </div>

          <div className={styles['signup-link']}>
            <p>Already have an account? <Link to={"/signIn"} className={styles['register-link']}>Login here</Link></p>
          </div>

        </div>
      </div>

      {/* Loading animation */}
      <div className={`${styles.loading} ${loading ? styles['loading-active'] : ''}`}>
        <p>Registering your account...</p>
      </div>

    </div>
  );
};

export default SignUp;