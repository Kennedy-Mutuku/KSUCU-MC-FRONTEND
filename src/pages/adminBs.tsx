import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import styles from '../styles/savedSoulsList.module.css'; 
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import letterhead from '../assets/letterhead.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faUsers, faShuffle } from '@fortawesome/free-solid-svg-icons';
import { getBaseUrl } from '../config/environment'; 

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: AutoTableOptions) => { finalY: number };
  }

  interface AutoTableOptions {
    head: Array<string[]>;
    body: Array<string[]>;
    startY?: number;
  }
}

const BsMembersList: React.FC = () => {
  const [users, setUsers] = useState<Array<{ name: string, residence: string, yos: string, phone: string, gender: string }>>([]);
  const [groups, setGroups] = useState<Array<Array<{ name: string, phone: string, residence: string, yos: string, gender: string }>>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [groupSize, setGroupSize] = useState<number>(10); // Default group size is 10
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Residence management states
  const [residences, setResidences] = useState<Array<{_id: string, name: string, description: string}>>([]);
  const [showResidenceModal, setShowResidenceModal] = useState(false);
  const [newResidenceName, setNewResidenceName] = useState('');
  const [newResidenceDescription, setNewResidenceDescription] = useState('');
  const [editingResidence, setEditingResidence] = useState<{_id: string, name: string, description: string} | null>(null);
  const [residenceLoading, setResidenceLoading] = useState(false);

  const backEndURL = getBaseUrl();

  useEffect(() => {
    // Check if user is on localhost (auto-authenticate for development)
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
      setIsAuthenticated(true);
      fetchSavedSouls();
      fetchResidences();
    } else {
      // For production, check if coming from worship docket admin
      const adminAuth = sessionStorage.getItem('adminAuth');
      if (adminAuth === 'Overseer') {
        setShowLoginForm(true);
      } else {
        setError('Access restricted. Please access via Worship Docket Admin.');
        setLoading(false);
      }
    }
  }, []);

  const fetchSavedSouls = async () => {
    try {

      console.log('Fetching Bible study users...');
      const response = await axios.get(`${backEndURL}/adminBs/users`, { 
        withCredentials: true,
        timeout: 10000
      });
      
      console.log('Bible study users response:', response.data);
      setUsers(response.data);  
      setLoading(false);
      
      if (response.data.length === 0) {
        setError('ℹ️ No Bible study registrations found yet.');
        setTimeout(() => setError(''), 5000);
      }
      
    } catch (err: any) {
      console.error('Error fetching saved souls:', err);
      console.error('Full error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        code: err.code
      });
      
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError('⏱️ Request timeout. Server might be slow. Please try refreshing.');
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError('🔐 Authentication failed. Please login first.');
        setShowLoginForm(true);
        setIsAuthenticated(false);
      } else if (err.code === 'ERR_NETWORK' || !navigator.onLine) {
        setError('🌐 Network error. Please check your internet connection and try again.');
      } else if (err.response?.status >= 500) {
        setError('🔧 Server error. Please try again in a few moments.');
      } else {
        setError(`❌ ${err.response?.data?.message || err.message || 'Failed to fetch Bible study data'}. Please try again.`);
      }
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setError('');

    try {
      const response = await axios.post(`${backEndURL}/adminBs/login`, loginData, {
        withCredentials: true,
        timeout: 10000
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
        setShowLoginForm(false);
        setError('✅ Login successful! Loading Bible Study admin panel...');
        setTimeout(() => setError(''), 3000);
        
        // Now fetch data
        fetchSavedSouls();
        fetchResidences();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('❌ Invalid email or password. Please try again.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('❌ Network error. Please check your connection.');
      } else {
        setError('❌ Login failed. Please try again.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const fetchResidences = async () => {
    try {
      console.log('Fetching residences...');
      const response = await axios.get(`${backEndURL}/adminBs/residences`, {
        timeout: 8000
      });
      console.log('Residences fetched:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setResidences(response.data);
        console.log(`✅ Successfully loaded ${response.data.length} residences`);
        
        // If no residences exist, add default ones
        if (response.data.length === 0) {
          console.log('No residences found, creating defaults...');
          await createDefaultResidences();
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error('Error fetching residences:', err);
      console.error('Full error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        code: err.code
      });
      
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        console.log('Timeout error, using fallback residences');
        setError('⏱️ Residence fetch timeout. Using default residences.');
        setResidences([
          {_id: 'timeout1', name: 'Kisumu ndogo', description: 'Default residence (timeout fallback)'},
          {_id: 'timeout2', name: 'Nyamage', description: 'Default residence (timeout fallback)'},
          {_id: 'timeout3', name: 'Fanta', description: 'Default residence (timeout fallback)'}
        ]);
      } else if (err.response?.status >= 500) {
        console.log('Server error, trying to create defaults...');
        setError('🔧 Server error while fetching residences. Trying to create defaults...');
        await createDefaultResidences();
      } else if (err.code === 'ERR_NETWORK' || !navigator.onLine) {
        console.log('Network error, using offline fallback');
        setError('🌐 Network error. Using offline fallback residences.');
        setResidences([
          {_id: 'offline1', name: 'Kisumu ndogo', description: 'Default residence (offline)'},
          {_id: 'offline2', name: 'Nyamage', description: 'Default residence (offline)'},
          {_id: 'offline3', name: 'Fanta', description: 'Default residence (offline)'}
        ]);
      } else {
        console.log('Other error, using general fallback');
        setError(`⚠️ Residences unavailable: ${err.response?.data?.error || err.message}. Using defaults.`);
        // Still provide fallback
        setResidences([
          {_id: 'fallback1', name: 'Kisumu ndogo', description: 'Fallback residence'},
          {_id: 'fallback2', name: 'Nyamage', description: 'Fallback residence'},
          {_id: 'fallback3', name: 'Fanta', description: 'Fallback residence'}
        ]);
      }
      
      // Clear error after 5 seconds if using fallback
      setTimeout(() => {
        if (error && (error.includes('Using') || error.includes('unavailable'))) {
          setError('');
        }
      }, 5000);
    }
  };

  const createDefaultResidences = async () => {
    const adminAuth = sessionStorage.getItem('adminAuth');
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (!adminAuth && !isLocalhost) {
      setError('Cannot create default residences: Authentication required.');
      return;
    }

    // Auto-authenticate for localhost if needed
    if (isLocalhost && !adminAuth) {
      sessionStorage.setItem('adminAuth', 'Overseer');
    }

    const defaultResidences = [
      { name: 'Kisumu ndogo', description: 'Student residence area near campus' },
      { name: 'Nyamage', description: 'Popular student accommodation area' },
      { name: 'Fanta', description: 'Student housing area' }
    ];

    try {
      console.log('Creating default residences...');
      const createdResidences = [];
      
      for (const residence of defaultResidences) {
        try {
          const response = await axios.post(`${backEndURL}/adminBs/residences`, residence, { withCredentials: true });
          if (response.data && response.data.residence) {
            createdResidences.push(response.data.residence);
          }
        } catch (error: any) {
          console.log(`Failed to create residence ${residence.name}:`, error.response?.data?.message);
          // Continue with next residence even if one fails
        }
      }
      
      if (createdResidences.length > 0) {
        setResidences(createdResidences);
        setError(`✅ Created ${createdResidences.length} default residences successfully!`);
        setTimeout(() => setError(''), 3000);
      } else {
        // If all creation failed, use local fallback
        setResidences(defaultResidences.map((r, i) => ({ ...r, _id: `default${i}` })));
        setError('Using default residences (local fallback)');
      }
    } catch (error) {
      console.error('Error creating default residences:', error);
      setResidences(defaultResidences.map((r, i) => ({ ...r, _id: `default${i}` })));
      setError('Using default residences (creation failed)');
    }
  };

  const handleAddResidence = async () => {
    if (!newResidenceName.trim()) return;
    
    const adminAuth = sessionStorage.getItem('adminAuth');
    if (!adminAuth) {
      setError('Authentication required. Please access via Worship Docket Admin.');
      return;
    }
    
    setResidenceLoading(true);
    try {
      await axios.post(`${backEndURL}/adminBs/residences`, {
        name: newResidenceName.trim(),
        description: newResidenceDescription.trim()
      }, { withCredentials: true });
      
      setNewResidenceName('');
      setNewResidenceDescription('');
      setShowResidenceModal(false);
      fetchResidences();
      setError('✅ Residence added successfully!');
      setTimeout(() => setError(''), 3000);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Authentication failed. Please login through Worship Docket Admin first.');
      } else {
        setError(err.response?.data?.message || 'Failed to add residence');
      }
    } finally {
      setResidenceLoading(false);
    }
  };

  const handleEditResidence = async () => {
    if (!editingResidence || !newResidenceName.trim()) return;
    
    const adminAuth = sessionStorage.getItem('adminAuth');
    if (!adminAuth) {
      setError('Authentication required. Please access via Worship Docket Admin.');
      return;
    }
    
    setResidenceLoading(true);
    try {
      await axios.put(`${backEndURL}/adminBs/residences/${editingResidence._id}`, {
        name: newResidenceName.trim(),
        description: newResidenceDescription.trim()
      }, { withCredentials: true });
      
      setEditingResidence(null);
      setNewResidenceName('');
      setNewResidenceDescription('');
      setShowResidenceModal(false);
      fetchResidences();
      setError('✅ Residence updated successfully!');
      setTimeout(() => setError(''), 3000);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Authentication failed. Please login through Worship Docket Admin first.');
      } else {
        setError(err.response?.data?.message || 'Failed to update residence');
      }
    } finally {
      setResidenceLoading(false);
    }
  };

  const handleDeleteResidence = async (residenceId: string) => {
    if (!confirm('Are you sure you want to delete this residence?')) return;
    
    const adminAuth = sessionStorage.getItem('adminAuth');
    if (!adminAuth) {
      setError('Authentication required. Please access via Worship Docket Admin.');
      return;
    }
    
    try {
      await axios.delete(`${backEndURL}/adminBs/residences/${residenceId}`, { withCredentials: true });
      fetchResidences();
      setError('✅ Residence deleted successfully!');
      setTimeout(() => setError(''), 3000);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Authentication failed. Please login through Worship Docket Admin first.');
      } else {
        setError(err.response?.data?.message || 'Failed to delete residence');
      }
    }
  };

  const openEditModal = (residence: {_id: string, name: string, description: string}) => {
    setEditingResidence(residence);
    setNewResidenceName(residence.name);
    setNewResidenceDescription(residence.description);
    setShowResidenceModal(true);
  };

  const closeModal = () => {
    setShowResidenceModal(false);
    setEditingResidence(null);
    setNewResidenceName('');
    setNewResidenceDescription('');
  };

  const shuffleAndGroupUsers = (size: number) => {
    if (users.length === 0) return;
    
    // Create balanced groups with year of study, gender, and residence considerations
    const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
    
    const groups: Array<Array<{ name: string, phone: string, residence: string, yos: string, gender: string }>> = [];
    const totalGroups = Math.ceil(users.length / size);
    
    // Initialize empty groups
    for (let i = 0; i < totalGroups; i++) {
      groups.push([]);
    }
    
    // Distribute users in a round-robin fashion to balance groups
    let currentGroupIndex = 0;
    
    // Sort users by residence, then by year of study, then by gender for better distribution
    const sortedUsers = shuffledUsers.sort((a, b) => {
      if (a.residence !== b.residence) return a.residence.localeCompare(b.residence);
      if (a.yos !== b.yos) return parseInt(a.yos) - parseInt(b.yos);
      return a.gender.localeCompare(b.gender);
    });
    
    // Distribute users across groups
    sortedUsers.forEach((user) => {
      groups[currentGroupIndex].push(user);
      currentGroupIndex = (currentGroupIndex + 1) % totalGroups;
    });
    
    // Fill incomplete groups with empty slots for better visualization
    const newGroups = groups.map((group) => {
      const filledGroup = [...group];
      while (filledGroup.length < size && filledGroup.length > 0) {
        filledGroup.push({ 
          name: "", 
          phone: "", 
          residence: group[0]?.residence || "", 
          yos: "", 
          gender: "" 
        });
      }
      return filledGroup;
    }).filter(group => group.length > 0);
    
    setGroups(newGroups);
  };
  

  const handleShuffleClick = () => {
    shuffleAndGroupUsers(groupSize);
  };


const handleExportPdf = () => {
  try {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let yOffset = 45; // Set initial offset to allow space for the letterhead

    // Load and add the letterhead image to the first page
    doc.addImage(letterhead, 'PNG', 10, 10, 190, 35); // Use proper letterhead dimensions
    
    // Add a small space after the letterhead
    yOffset += 5; 

    // Document title and date
    const title = "Bible Study Groups Formation";
    const dateText = `Generated: ${new Date().toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })}`;
    const timeText = `Time: ${new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
    
    // Set title formatting
    doc.setTextColor(128, 0, 128); // Purple color to match KSUCU branding
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, doc.internal.pageSize.width / 2, yOffset, { align: "center" });
    
    // Add subtitle with stats
    yOffset += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    const stats = `Total Students: ${users.length} | Groups: ${groups.length} | Students per Group: ${groupSize}`;
    doc.text(stats, doc.internal.pageSize.width / 2, yOffset, { align: "center" });
    
    // Date and time
    yOffset += 8;
    doc.setFontSize(10);
    doc.text(dateText, 15, yOffset);
    doc.text(timeText, doc.internal.pageSize.width - 15, yOffset, { align: "right" });
    yOffset += 15;

    // Iterate through each group
    groups.forEach((group, index) => {
      // Filter out empty user slots for cleaner PDF
      const actualUsers = group.filter(user => user.name.trim() !== "");
      
      const tableData = actualUsers.map(user => [
        user.name,
        user.phone,
        user.residence,
        user.yos,
        user.gender === 'M' ? 'Male' : 'Female'
      ]);

      // Check if adding this table would exceed the page height
      const groupTitleHeight = 12;
      const rowHeight = 8;
      const estimatedTableHeight = (tableData.length + 1) * rowHeight + groupTitleHeight + 10;
      
      if (yOffset + estimatedTableHeight > pageHeight - 20) {
        doc.addPage();
        // Add letterhead to new page
        doc.addImage(letterhead, 'PNG', 10, 10, 190, 35);
        yOffset = 55;
      }

      // Add group title with better formatting
      doc.setTextColor(128, 0, 128); // Purple for group titles
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      const groupTitle = `Group ${index + 1} (${actualUsers.length} members)`;
      doc.text(groupTitle, 15, yOffset);
      yOffset += groupTitleHeight;

      // Group statistics
      const maleCount = actualUsers.filter(u => u.gender === 'M').length;
      const femaleCount = actualUsers.filter(u => u.gender === 'F').length;
      const year1 = actualUsers.filter(u => u.yos === '1').length;
      const year2 = actualUsers.filter(u => u.yos === '2').length;
      const year3 = actualUsers.filter(u => u.yos === '3').length;
      const year4 = actualUsers.filter(u => u.yos === '4').length;
      
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      const groupStats = `Male: ${maleCount}, Female: ${femaleCount} | Y1: ${year1}, Y2: ${year2}, Y3: ${year3}, Y4: ${year4}`;
      doc.text(groupStats, 15, yOffset);
      yOffset += 8;

      // Define table options with improved styling
      const tableOptions = {
        head: [['Name', 'Phone', 'Residence', 'Year', 'Gender']],
        body: tableData,
        startY: yOffset,
        theme: 'striped',
        headStyles: {
          fillColor: [128, 0, 128], // Purple header to match KSUCU branding
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250]
        },
        columnStyles: {
          0: { cellWidth: 45 }, // Name column
          1: { cellWidth: 30 }, // Phone column  
          2: { cellWidth: 35 }, // Residence column
          3: { cellWidth: 15, halign: 'center' }, // Year column
          4: { cellWidth: 20, halign: 'center' }  // Gender column
        },
        margin: { left: 15, right: 15 }
      };

      // Add table to PDF and update yOffset
      const { finalY } = doc.autoTable(tableOptions) || {};
      yOffset = finalY ? finalY + 15 : yOffset + estimatedTableHeight + 15;
    });

    // Add footer with generation info
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Generated by KSUCU-MC Bible Study Administration System', 15, pageHeight - 10);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 15, pageHeight - 10, { align: 'right' });
    }

    // Save PDF with descriptive filename
    const fileName = `KSUCU_Bible_Study_Groups_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

  if (loading) {
    return <p>Loading saved souls...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <> 
      <UniversalHeader />
      <div className={styles.container}>
        <h4>
          <FontAwesomeIcon icon={faUsers} style={{ marginRight: '10px' }} />
          Bible Study Administration
        </h4>

        {error && (
          <div className={`${styles.error} ${error.includes('✅') || error.includes('🔓') || error.includes('ℹ️') ? styles.success : styles.errorMsg}`}>
            {error}
          </div>
        )}

        {/* Login Form */}
        {showLoginForm && !isAuthenticated && (
          <div className={styles.authSection}>
            <h3>Bible Study Admin Login</h3>
            <form onSubmit={handleLogin} className={styles.authForm}>
              <div className={styles.authFormGroup}>
                <label htmlFor="email">Admin Email:</label>
                <input
                  type="email"
                  id="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  required
                  placeholder="Enter admin email"
                />
              </div>
              <div className={styles.authFormGroup}>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                  placeholder="Enter password"
                />
              </div>
              <button type="submit" disabled={loginLoading} className={styles.authSubmit}>
                {loginLoading ? 'Logging in...' : 'Login to Bible Study Admin'}
              </button>
            </form>
          </div>
        )}

        {/* Admin Sections - only show when authenticated */}
        {isAuthenticated && (
        <div className={styles.adminSections}>
          {/* Student Statistics */}
          <div className={styles.statsCard}>
            <h5>Student Statistics</h5>
            <div className={styles.userCount}>
              <strong>Total Registered Students: {users.length}</strong>
            </div>
            {users.length > 0 && (
              <div className={styles.stats}>
                <p><strong>Male:</strong> {users.filter(u => u.gender === 'M').length}</p>
                <p><strong>Female:</strong> {users.filter(u => u.gender === 'F').length}</p>
                <p><strong>Year 1:</strong> {users.filter(u => u.yos === '1').length}</p>
                <p><strong>Year 2:</strong> {users.filter(u => u.yos === '2').length}</p>
                <p><strong>Year 3:</strong> {users.filter(u => u.yos === '3').length}</p>
                <p><strong>Year 4:</strong> {users.filter(u => u.yos === '4').length}</p>
              </div>
            )}
          </div>

          {/* Residence Management */}
          <div className={styles.residenceSection}>
            <h5>
              <FontAwesomeIcon icon={faUsers} style={{ marginRight: '8px' }} />
              Residence Management
            </h5>
            <div className={styles.residenceButtons}>
              <button 
                onClick={() => setShowResidenceModal(true)} 
                className={styles.addButton}
              >
                <FontAwesomeIcon icon={faPlus} /> Add New Residence
              </button>
              <button 
                onClick={fetchResidences} 
                className={styles.refreshButton}
                title="Refresh residences list"
              >
                🔄 Refresh
              </button>
              {residences.length === 0 && (
                <button 
                  onClick={createDefaultResidences} 
                  className={styles.seedButton}
                  title="Create default residences"
                >
                  🏠 Create Defaults
                </button>
              )}
            </div>
            
            <div className={styles.residenceList}>
              {residences.map((residence) => (
                <div key={residence._id} className={styles.residenceItem}>
                  <div>
                    <strong>{residence.name}</strong>
                    {residence.description && <p>{residence.description}</p>}
                    <small>Students: {users.filter(u => u.residence === residence.name).length}</small>
                  </div>
                  <div className={styles.residenceActions}>
                    <button onClick={() => openEditModal(residence)} className={styles.editButton}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => handleDeleteResidence(residence._id)} className={styles.deleteButton}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group Formation */}
          <div className={styles.groupingSection}>
            <h5>
              <FontAwesomeIcon icon={faShuffle} style={{ marginRight: '8px' }} />
              Group Formation
            </h5>
            <div className={styles.groupingControls}>
              <label>Students per Group: </label>
              <input 
                type="number" 
                value={groupSize} 
                onChange={(e) => setGroupSize(Number(e.target.value))}
                min={1}
                max={50}
              />
              <button onClick={handleShuffleClick} className={styles.shuffleButton}>
                <FontAwesomeIcon icon={faShuffle} /> Create Balanced Groups
              </button>
              {groups.length > 0 && (
                <button onClick={handleExportPdf} className={styles.exportButton}>
                  Download Groups PDF
                </button>
              )}
            </div>
            <p className={styles.groupingInfo}>
              Groups will be balanced by year of study, gender, and residence for optimal Bible study sessions.
            </p>
          </div>
        </div>
        )}
        
        {groups.length > 0 ? (
          <div className={styles.groups}>
            {groups.map((group, index) => (
              <div key={index} className={styles.group}>
                <h5>Group {index + 1}</h5>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Residence</th>
                      <th>Yos</th>
                      <th>G</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.map((user, i) => (
                      <tr key={i}>
                        <td>{user.name}</td>
                        <td>{user.phone}</td>
                        <td>{user.residence}</td>
                        <td>{user.yos}</td>
                        <td>{user.gender}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ) : (
          <p>No groups formed. Adjust the group size and click "Create Balanced Groups" to generate groups.</p>
        )}

        {/* Residence Modal */}
        {showResidenceModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>{editingResidence ? 'Edit Residence' : 'Add New Residence'}</h3>
              <div className={styles.modalForm}>
                <div>
                  <label>Residence Name:</label>
                  <input
                    type="text"
                    value={newResidenceName}
                    onChange={(e) => setNewResidenceName(e.target.value)}
                    placeholder="Enter residence name"
                  />
                </div>
                <div>
                  <label>Description (Optional):</label>
                  <textarea
                    value={newResidenceDescription}
                    onChange={(e) => setNewResidenceDescription(e.target.value)}
                    placeholder="Enter description"
                    rows={3}
                  />
                </div>
                <div className={styles.modalButtons}>
                  <button 
                    onClick={editingResidence ? handleEditResidence : handleAddResidence} 
                    disabled={residenceLoading || !newResidenceName.trim()}
                    className={styles.saveButton}
                  >
                    {residenceLoading ? 'Saving...' : (editingResidence ? 'Update' : 'Add')}
                  </button>
                  <button onClick={closeModal} className={styles.cancelButton}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BsMembersList;
