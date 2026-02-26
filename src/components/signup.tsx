import React, { useState } from 'react';
import axios from 'axios';
import cuLogo from '../assets/KSUCU logo updated document.png';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/signup.module.css';
import { ChevronDown, Copy, Check, LogIn, Home } from 'lucide-react';
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
  graduationYear: string;
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
  const [role, setRole] = useState<'student' | 'associate'>('student');
  const [formData, setFormData] = useState<FormData>({
    username: '',
    phone: '',
    email: '',
    course: '',
    reg: '',
    yos: '',
    ministry: '',
    et: '',
    graduationYear: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMinistries, setSelectedMinistries] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showETDropdown, setShowETDropdown] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<RegistrationSuccess>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    phone?: string;
    reg?: string;
  }>({});
  const [checkingField, setCheckingField] = useState<string | null>(null);

  const isAssociate = role === 'associate';

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

  const etGroups = [
    { id: 'rivet', label: 'Rivet' },
    { id: 'cet', label: 'Cet' },
    { id: 'eset', label: 'Eset' },
    { id: 'net', label: 'Net' },
    { id: 'weso', label: 'Weso' },
  ];

  // Function to close dropdown when clicking outside
  const handleMinistryBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setShowDropdown(false);
    }
  };

  const handleETBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setShowETDropdown(false);
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
      et: '',
      graduationYear: ''
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

    // Build data to send
    const dataToSend: any = {
      username: formData.username,
      phone: formData.phone,
      email: formData.email,
      course: formData.course,
      role
    };

    if (isAssociate) {
      // Associates: only required fields are name, phone, email, course
      if (!formData.username || !formData.phone || !formData.email || !formData.course) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.graduationYear) {
        dataToSend.graduationYear = formData.graduationYear;
      }
    } else {
      // Students: all fields required
      dataToSend.reg = formData.reg;
      dataToSend.yos = formData.yos;
      dataToSend.ministry = ministriesString;
      dataToSend.et = formData.et;

      for (const [key, value] of Object.entries(dataToSend)) {
        if (!value) {
          const fieldName = key === 'yos' ? 'Year of Study' : key === 'et' ? 'ET' : key.charAt(0).toUpperCase() + key.slice(1);
          setError(`Please fill in the ${fieldName} field`);
          return;
        }
      }

      if (!validateYOS(dataToSend.yos)) {
        setError('Year of study must be a number between 1 and 6');
        return;
      }
    }

    if (!validatePhone(dataToSend.phone)) {
      setError('Phone number must be 10 digits starting with 0 (e.g., 0712345678)');
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
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 400) {
        setError('Email, Phone, or Registration number already exists');
      } else if (!error.response) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show success screen if registration was successful
  if (registrationSuccess) {
    const CopyField = ({ label, value, hint }: { label: string; value: string; hint?: string }) => {
      const [copied, setCopied] = React.useState(false);
      const handleCopy = () => {
        navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      };
      return (
        <div style={{ marginBottom: '16px' }}>
          <p className={styles.copyFieldLabel}>{label}</p>
          <div className={styles.copyFieldRow}>
            <span className={styles.copyFieldValue}>{value}</span>
            <button
              onClick={handleCopy}
              className={`${styles.copyBtn} ${copied ? styles.copyBtnCopied : ''}`}
            >
              {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
            </button>
          </div>
          {hint && <p className={styles.copyFieldHint}>{hint}</p>}
        </div>
      );
    };

    return (
      <div className={styles.body}>
        <div className={`${styles.container} ${styles.successContainer}`}>
          <div className={styles.successAccentBar} />

          <div className={styles.successIconWrapper}>
            <div className={styles.successIcon}>
              <Check size={32} color="white" strokeWidth={3} />
            </div>
            <h2 className={styles.successTitle}>You're All Set!</h2>
            <p className={styles.successSubtitle}>
              Your {isAssociate ? 'associate' : 'student'} account is ready
            </p>
          </div>

          <div className={styles.credentialsCard}>
            <p className={styles.credentialsTitle}>Your Login Credentials</p>
            <CopyField label="Email (Username)" value={registrationSuccess.email} />
            <CopyField label="Password" value={registrationSuccess.password} hint="Your phone number is your password" />
          </div>

          <div className={styles.successActions}>
            <Link to="/signIn" className={styles.loginLink}>
              <LogIn size={18} /> Go to Login
            </Link>
            <Link to="/" className={styles.homeLink}>
              <Home size={16} /> Back to Home
            </Link>
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

        {/* Student / Associate Toggle */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
          position: 'relative',
          background: '#f3f4f6',
          borderRadius: '12px',
          padding: '4px',
        }}>
          <div style={{
            position: 'absolute',
            top: '4px',
            left: role === 'student' ? '4px' : '50%',
            width: 'calc(50% - 4px)',
            height: 'calc(100% - 8px)',
            background: 'linear-gradient(135deg, #730051, #a0006e)',
            borderRadius: '10px',
            transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 8px rgba(115, 0, 81, 0.3)',
          }} />
          <button
            type="button"
            onClick={() => { setRole('student'); setError(''); }}
            style={{
              flex: 1, padding: '10px 16px', border: 'none', cursor: 'pointer',
              backgroundColor: 'transparent',
              color: role === 'student' ? 'white' : '#6b7280',
              fontWeight: 600, fontSize: '13px',
              transition: 'color 0.3s ease',
              position: 'relative', zIndex: 1,
              borderRadius: '10px',
            }}
          >Student</button>
          <button
            type="button"
            onClick={() => { setRole('associate'); setError(''); }}
            style={{
              flex: 1, padding: '10px 16px', border: 'none', cursor: 'pointer',
              backgroundColor: 'transparent',
              color: role === 'associate' ? 'white' : '#6b7280',
              fontWeight: 600, fontSize: '13px',
              transition: 'color 0.3s ease',
              position: 'relative', zIndex: 1,
              borderRadius: '10px',
            }}
          >Associate / Alumni</button>
        </div>

        <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginBottom: '18px', letterSpacing: '0.3px' }}>
          {isAssociate
            ? 'Join as an alumni/associate \u2022 Phone number is your password'
            : 'Create your account \u2022 Phone number is your password'
          }
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
            <label htmlFor="course">{isAssociate ? 'Course (studied)' : 'Course'}</label>
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

          {/* Associate-only: Graduation Year */}
          {isAssociate && (
            <div className={styles['form-div']}>
              <label htmlFor="graduationYear">Year of Graduation (optional)</label>
              <input
                type="number"
                id="graduationYear"
                className={styles['input']}
                value={formData.graduationYear}
                onChange={handleChange}
                min="2000"
                max={new Date().getFullYear()}
                placeholder={`e.g., ${new Date().getFullYear() - 1}`}
              />
            </div>
          )}

          {/* Student-only fields */}
          {!isAssociate && (
            <>
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
                <div className={styles['ministry-container']} tabIndex={0} onBlur={handleMinistryBlur}>
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
                <div className={styles['ministry-container']} tabIndex={0} onBlur={handleETBlur}>
                  <div className={styles['ministry-header']} onClick={() => setShowETDropdown(!showETDropdown)}>
                    <span>
                      {formData.et ? etGroups.find(g => g.id === formData.et)?.label : 'Select ET group...'}
                    </span>
                    <ChevronDown size={20} />
                  </div>

                  {showETDropdown && (
                    <div className={styles['ministry-menu']}>
                      {etGroups.map(group => (
                        <label key={group.id} className={styles['ministry-item']}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, et: group.id }));
                            setShowETDropdown(false);
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <input
                            type="radio"
                            name="et-group"
                            checked={formData.et === group.id}
                            readOnly
                          />
                          {group.label}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

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
