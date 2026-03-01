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
  graduationYear: string;
  currentPassword: string;
  password: string;
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
    graduationYear: '',
    currentPassword: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedMinistries, setSelectedMinistries] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'associate'>('student');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<Record<string, string> | null>(null);
  const [isAdminSession, setIsAdminSession] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ phone?: string; reg?: string }>({});
  const [checkingField, setCheckingField] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<{ phone: string; reg: string }>({ phone: '', reg: '' });

  const isAssociate = userRole === 'associate';

  const checkFieldExists = async (field: 'phone' | 'reg', value: string) => {
    if (!value || value.trim() === '') return;
    // Skip check if value hasn't changed from what's already saved
    if (field === 'phone' && value === originalData.phone) {
      setFieldErrors(prev => ({ ...prev, phone: undefined }));
      return;
    }
    if (field === 'reg' && value.trim().toUpperCase() === originalData.reg.trim().toUpperCase()) {
      setFieldErrors(prev => ({ ...prev, reg: undefined }));
      return;
    }
    if (field === 'phone' && !/^0\d{9}$/.test(value)) return;

    setCheckingField(field);
    try {
      const bodyKey = field === 'reg' ? 'regNo' : field;
      const bodyValue = field === 'reg' ? value.trim().toUpperCase() : value.trim();
      const response = await axios.post(getApiUrl('usersCheckExists'), { [bodyKey]: bodyValue });
      const label = field === 'reg' ? 'Reg number' : 'Phone number';
      if (response.data.exists) {
        setFieldErrors(prev => ({ ...prev, [field]: `${label} already in use by another account.` }));
      } else {
        setFieldErrors(prev => ({ ...prev, [field]: undefined }));
      }
    } catch (err) {
      console.error(`Error checking ${field}:`, err);
    } finally {
      setCheckingField(null);
    }
  };

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
  //         setError('Please complete your registration. Google sign-up doesn't provide this information.')
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

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const loginToken = Cookies.get('loginToken');
      const response = await axios.get(getApiUrl('users'), { withCredentials: true });

      if (loginToken && !response.data.reg) {
        setError('Please complete your registration. Google sign-up doesn\'t provide this information.');
      } else {
        console.log('clear');
      }
      const ministriesArray = response.data.ministry
        ? response.data.ministry.split(", ").map((m: string) => m.trim().toLocaleLowerCase())
        : [];

      if (response.data.role) {
        setUserRole(response.data.role === 'associate' ? 'associate' : 'student');
      }

      setFormData({
        username: response.data.username || '',
        phone: response.data.phone || '',
        email: response.data.email || '',
        course: response.data.course || '',
        reg: response.data.reg || '',
        yos: response.data.yos || '',
        ministry: response.data.ministry || '',
        et: response.data.et || '',
        graduationYear: response.data.graduationYear || '',
        currentPassword: '',
        password: '',
      });

      setSelectedMinistries(ministriesArray);
      setOriginalData({ phone: response.data.phone || '', reg: response.data.reg || '' });

    } catch (error: any) {
      console.error('Error fetching user data:', error);
      if (error.response && error.response.status === 400) {
        setError('Email/Reg/Phone already exists 😖');
      } else if (error.response && error.response.status === 401) {
        setIsAdminSession(true);
      } else {
        setError('Failed to load user data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    // Minimum 4 characters — kept simple since default password is phone number
    return input.length >= 4;
  }

  const handleLogout = async () => {
    try {
      setLoading(true);
      console.log('Starting logout process...');
      
      // Call logout API
      const response = await axios.post(getApiUrl('usersLogout'), {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Logout API response:', response);
      
      // Clear cookies more thoroughly
      const cookiesToClear = ['loginToken', 'sessionToken', 'authToken', 'token'];
      cookiesToClear.forEach(cookieName => {
        Cookies.remove(cookieName);
        Cookies.remove(cookieName, { path: '/' });
        Cookies.remove(cookieName, { domain: window.location.hostname });
        Cookies.remove(cookieName, { domain: `.${window.location.hostname}` });
      });
      
      // Clear all cookies fallback
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
      });
      
      // Clear local storage and session storage
      localStorage.clear();
      sessionStorage.clear();
      
      console.log('Logout successful, redirecting to login...');
      
      // Show success message briefly before redirecting
      setSuccessMessage('Successfully logged out!');
      setTimeout(() => {
        navigate('/signIn', { replace: true });
      }, 1000);
      
    } catch (error: any) {
      console.error('Logout API error:', error);
      
      // Even if API fails, clear local data and redirect
      const cookiesToClear = ['loginToken', 'sessionToken', 'authToken', 'token'];
      cookiesToClear.forEach(cookieName => {
        Cookies.remove(cookieName);
        Cookies.remove(cookieName, { path: '/' });
        Cookies.remove(cookieName, { domain: window.location.hostname });
        Cookies.remove(cookieName, { domain: `.${window.location.hostname}` });
      });
      
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
      });
      
      localStorage.clear();
      sessionStorage.clear();
      
      setError('Logged out successfully (with warning)');
      setTimeout(() => {
        navigate('/signIn', { replace: true });
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (fieldErrors.phone || fieldErrors.reg) {
      setError('Please fix the errors above before updating.');
      return;
    }

    const { password, currentPassword, ...dataWithoutPassword } = formData;

    let finalFormData: Record<string, string>;

    if (isAssociate) {
      // Associates: only send relevant fields
      finalFormData = {
        username: dataWithoutPassword.username,
        phone: dataWithoutPassword.phone,
        email: dataWithoutPassword.email,
        course: dataWithoutPassword.course,
      };

      // Check required fields for associates
      for (const [key, value] of Object.entries(finalFormData)) {
        if (!value) {
          const fieldName = key === 'username' ? 'Name' : key.charAt(0).toUpperCase() + key.slice(1);
          setError(`Please fill in the ${fieldName} field 😊`);
          return;
        }
      }

      // Graduation year is required for associates
      if (!dataWithoutPassword.graduationYear) {
        setError('Please fill in the Graduation Year field 😊');
        return;
      }
      finalFormData.graduationYear = dataWithoutPassword.graduationYear;
    } else {
      // Students: all fields required
      const ministriesString = selectedMinistries.join(', ');
      finalFormData = {
        username: dataWithoutPassword.username,
        phone: dataWithoutPassword.phone,
        email: dataWithoutPassword.email,
        course: dataWithoutPassword.course,
        reg: dataWithoutPassword.reg,
        yos: dataWithoutPassword.yos,
        ministry: ministriesString,
        et: dataWithoutPassword.et,
      };

      // Check if any field is empty
      for (const [key, value] of Object.entries(finalFormData)) {
        if (!value) {
          const fieldName = key === 'yos' ? 'Year of Study' : key === 'et' ? 'ET' : key.charAt(0).toUpperCase() + key.slice(1);
          setError(`Please fill in the ${fieldName} field 😊`);
          return;
        }
      }

      // Validate ET selection
      if (finalFormData.et === "choose..." || finalFormData.et.trim() === "") {
        setError("Please select a valid ET option 😊");
        return;
      }

      if (!validateYOS(finalFormData.yos)) {
        setError('Year of study must be a number between 1 and 6. 🤨');
        return;
      }
    }

    if (!validatePhone(finalFormData.phone)) {
      setError('Phone number must be 10 digits starting with 0 and having no spaces 🤨');
      return;
    }

    // Password validation (only if new password is provided)
    if (password && password.trim() !== '') {
      if (!formData.currentPassword || formData.currentPassword.trim() === '') {
        setError('Please enter your current password 😊');
        return;
      }
      if (!validatePassword(password)) {
        setError('Password must be at least 4 characters long 🤨');
        return;
      }

      // Verify old password with backend FIRST before showing confirm dialog
      setLoading(true);
      setError('');
      try {
        await axios.post(getApiUrl('usersVerifyPassword'), { currentPassword: formData.currentPassword }, {
          withCredentials: true,
        });
        // Old password is correct — now show confirmation dialog
        const payload = { ...finalFormData, currentPassword: formData.currentPassword, password };
        setPendingPayload(payload);
        setShowConfirmDialog(true);
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          setError('Current password is incorrect');
        } else {
          setError('Failed to verify password. Please try again.');
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    // No password change — submit directly
    await submitUpdate(finalFormData);
  };

  const submitUpdate = async (payload: Record<string, string>) => {
    setLoading(true);

    try {
      const response = await axios.put(getApiUrl('usersUpdate'), payload, {
        withCredentials: true,
      });

      console.log(response.data);
      setSuccessMessage('Details updated successfully');
      setError('');

      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);

      // Re-fetch user data to show updated values
      await fetchUserData();

    } catch (error: any) {
      console.error('Error updating details', error);
      if (error.response && error.response.status === 401) {
        setError('Current password is incorrect');
      } else if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Error updating details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPasswordChange = async () => {
    setShowConfirmDialog(false);
    if (pendingPayload) {
      await submitUpdate(pendingPayload);
      setPendingPayload(null);
    }
  };

  const handleCancelPasswordChange = () => {
    setShowConfirmDialog(false);
    setPendingPayload(null);
    setFormData(prev => ({ ...prev, password: '', currentPassword: '' }));
  };
  
  if (isAdminSession) {
    return (
      <div className={styles.body}>
        <div className={styles['container']}>
          <Link to={"/"}>
            <div className={styles['logo_signUp']}><img src={cuLogo} alt="CU logo" /></div>
          </Link>
          <h2 className={styles['text']}>Admin Session</h2>

          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <span style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #2c3e50, #34495e)',
              color: 'white',
              padding: '4px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              letterSpacing: '0.5px'
            }}>
              Admin Account
            </span>
          </div>

          <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', margin: '20px 0' }}>
            You are signed in as an admin. Account details cannot be changed from here.
          </p>

          <div style={{
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '2px solid #e0e0e0',
            textAlign: 'center'
          }}>
            <button
              onClick={handleLogout}
              disabled={loading}
              style={{
                backgroundColor: '#730051',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 10px rgba(115, 0, 81, 0.3)',
              }}
            >
              {loading ? 'Processing...' : 'Log Out'}
            </button>
          </div>

          <div className={styles['form-footer']}>
            <p><Link to={"/"}>Home</Link></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.body}>
      <div className={styles['container']}>
        <Link to={"/"}>
          <div className={styles['logo_signUp']}><img src={cuLogo} alt="CU logo" /></div>
        </Link>
        <h2 className={styles['text']}>Update Details</h2>

        {isAssociate && (
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <span style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #730051, #a0006e)',
              color: 'white',
              padding: '4px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              letterSpacing: '0.5px'
            }}>
              Associate / Alumni
            </span>
          </div>
        )}

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

          <div className={styles['form-div']} style={{ flexWrap: 'wrap' }}>
            <label htmlFor="phone">PHONE</label>
            <input type="text" id="phone" className={styles['input']} value={formData.phone} onChange={handleChange} onBlur={() => checkFieldExists('phone', formData.phone)} style={fieldErrors.phone ? { border: '2px solid #dc2626', outline: 'none' } : {}} />
            {checkingField === 'phone' && (
              <p style={{ width: '100%', fontSize: '12px', color: '#666', margin: '2px 0 0', textAlign: 'right' }}>Checking...</p>
            )}
            {fieldErrors.phone && (
              <p style={{ width: '100%', color: '#dc2626', fontSize: '11px', margin: '2px 0 0', textAlign: 'right' }}>{fieldErrors.phone}</p>
            )}
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" className={styles['input']} value={formData.email} onChange={handleChange}  disabled={true} />
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="course">COURSE</label>
            <input type="text" id="course" className={styles['input']} value={formData.course} onChange={handleChange} />
          </div>

          {!isAssociate && (
            <>
              <div className={styles['form-div']} style={{ flexWrap: 'wrap' }}>
                <label htmlFor="reg">REG</label>
                <input type="text" id="reg" className={styles['input']} value={formData.reg} onChange={handleChange} onBlur={() => checkFieldExists('reg', formData.reg)} style={fieldErrors.reg ? { border: '2px solid #dc2626', outline: 'none' } : {}} />
                {checkingField === 'reg' && (
                  <p style={{ width: '100%', fontSize: '12px', color: '#666', margin: '2px 0 0', textAlign: 'right' }}>Checking...</p>
                )}
                {fieldErrors.reg && (
                  <p style={{ width: '100%', color: '#dc2626', fontSize: '11px', margin: '2px 0 0', textAlign: 'right' }}>{fieldErrors.reg}</p>
                )}
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
            </>
          )}

          {isAssociate && (
            <div className={styles['form-div']}>
              <label htmlFor="graduationYear">GRAD. YEAR</label>
              <input
                type="number"
                id="graduationYear"
                className={styles['input']}
                value={formData.graduationYear}
                onChange={handleChange}
                min="2000"
                max={new Date().getFullYear()}
                placeholder="e.g. 2023"
              />
            </div>
          )}

          {/* Password Change Section */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e0e0e0', width: '100%' }}>
            <h3 style={{ marginBottom: '16px', color: '#2c3e50', textAlign: 'center', fontSize: '0.95em' }}>Change Password (Optional)</h3>
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="currentPassword">OLD PSWD</label>
            <div className={styles['password-wrapper']} style={{ position: 'relative', width: '65%' }}>
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                className={styles['input']}
                style={{ width: '100%' }}
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className={styles['form-div']}>
            <label htmlFor="password">NEW PSWD</label>
            <div className={styles['password-wrapper']} style={{ position: 'relative', width: '65%' }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={styles['input']}
                style={{ width: '100%' }}
                value={formData.password}
                onChange={handleChange}
                placeholder="New password"
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

        {/* Logout Button Section */}
        <div style={{ 
          marginTop: '30px', 
          paddingTop: '20px', 
          borderTop: '2px solid #e0e0e0',
          textAlign: 'center'
        }}>
          <button
            onClick={handleLogout}
            disabled={loading}
            style={{
              backgroundColor: '#730051',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 10px rgba(115, 0, 81, 0.3)',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#5a0040';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(115, 0, 81, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#730051';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(115, 0, 81, 0.3)';
            }}
          >
            {loading ? 'Processing...' : 'Log Out'}
          </button>
        </div>

        <div className={styles['form-footer']}>
          <p> <Link to={"/"}>Home</Link></p>
        </div>
      </div>

        {/* Loading animation */}
        <div className={`${styles.loading} ${loading ? styles['loading-active'] : ''}`}>
          <p>Loading...</p>
        </div>

        {/* Password Confirmation Dialog */}
        {showConfirmDialog && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '30px',
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #730051, #a0006e)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Eye size={24} color="#fff" />
              </div>
              <h3 style={{ margin: '0 0 8px', color: '#2c3e50', fontSize: '1.1rem' }}>Confirm Password Change</h3>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
                Are you sure you want to change your password?
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleCancelPasswordChange}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #ddd',
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPasswordChange}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #730051, #a0006e)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

    </div>
  );
};

export default ChangeDetails;
