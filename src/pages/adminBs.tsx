import { useState, useEffect } from 'react';
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

const BsMembersList = () => {
  const [users, setUsers] = useState<Array<{ name: string, residence: string, yos: string, phone: string, gender: string, isPastor?: boolean }>>([]);
  const [groups, setGroups] = useState<Array<Array<{ name: string, phone: string, residence: string, yos: string, gender: string, isPastor?: boolean }>>>([]);
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
  
  // Reshuffling states
  const [isReshuffling, setIsReshuffling] = useState(false);
  const [reshuffleCount, setReshuffleCount] = useState(0);
  const [isGrouping, setIsGrouping] = useState(false);

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
        setLoading(false); // Stop loading to show login form
      } else {
        // Allow access but show login form for authentication
        setShowLoginForm(true);
        setLoading(false); // Stop loading to show login form
        setError('Please login to access Bible Study Administration.');
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
      
      // Process users to identify pastors
      const processedUsers = response.data.map((user: any) => {
        // Check if user is already marked as pastor or if their name contains "pastor"
        const isPastor = user.isPastor === true || 
                        user.name.toLowerCase().includes('pastor') || 
                        user.name.toLowerCase().includes('pst') ||
                        user.name.toLowerCase().includes('rev');
        
        return {
          ...user,
          isPastor: isPastor
        };
      });
      
      console.log('Processed users with pastor identification:', processedUsers);
      console.log('Number of pastors found:', processedUsers.filter((u: any) => u.isPastor).length);
      
      setUsers(processedUsers);  
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

  const togglePastorStatus = (userIndex: number) => {
    const updatedUsers = [...users];
    updatedUsers[userIndex].isPastor = !updatedUsers[userIndex].isPastor;
    setUsers(updatedUsers);
    
    const userName = updatedUsers[userIndex].name;
    const status = updatedUsers[userIndex].isPastor ? 'marked as Pastor' : 'unmarked as Pastor';
    setError(`✅ ${userName} ${status} successfully!`);
    setTimeout(() => setError(''), 3000);
  };

  const shuffleAndGroupUsers = async (size: number) => {
    if (users.length === 0) {
      setError('No users available for grouping');
      return;
    }
    
    if (size < 1 || size > 50) {
      setError('Group size must be between 1 and 50');
      return;
    }
    
    // Set loading state
    setIsGrouping(true);
    setError('🔄 Creating balanced groups...');
    
    try {
      console.log('🔍 Starting group formation with', users.length, 'users, target size:', size);
      
      // Use setTimeout to make the operation asynchronous and prevent UI freezing
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          try {
            // Separate pastors and regular users
            const allPastors = users.filter(user => user.isPastor);
            const allRegularUsers = users.filter(user => !user.isPastor);
            
            console.log('📊 Found', allPastors.length, 'pastors and', allRegularUsers.length, 'regular users');
            
            // Simple grouping algorithm to prevent complexity issues
            const totalUsers = users.length;
            const totalGroups = Math.max(
              Math.ceil(totalUsers / size),
              allPastors.length
            );
            
            console.log('🎯 Creating', totalGroups, 'groups with target size', size);
            
            // Create empty groups
            const allGroups: Array<Array<{ name: string, phone: string, residence: string, yos: string, gender: string, isPastor?: boolean }>> = [];
            for (let i = 0; i < totalGroups; i++) {
              allGroups.push([]);
            }
            
            // Step 1: Place pastors first
            allPastors.forEach((pastor, index) => {
              if (index < allGroups.length) {
                allGroups[index].push(pastor);
                console.log('✝️ Placed pastor', pastor.name, 'in Group', index + 1);
              }
            });
            
            // Step 2: Simplified user distribution
            const shuffledUsers = [...allRegularUsers].sort(() => Math.random() - 0.5);
            
            // Distribute users round-robin style to avoid complex loops
            let groupIndex = 0;
            for (const user of shuffledUsers) {
              // Find a group that's not full
              let placed = false;
              let attempts = 0;
              const maxAttempts = totalGroups * 2;
              
              while (!placed && attempts < maxAttempts) {
                if (allGroups[groupIndex].length < size) {
                  allGroups[groupIndex].push(user);
                  placed = true;
                } else {
                  groupIndex = (groupIndex + 1) % totalGroups;
                }
                attempts++;
              }
              
              // If still not placed, add to the last group
              if (!placed && allGroups.length > 0) {
                allGroups[allGroups.length - 1].push(user);
              }
              
              groupIndex = (groupIndex + 1) % totalGroups;
            }
            
            // Ensure pastors are first in their groups
            allGroups.forEach(group => {
              group.sort((a, b) => {
                if (a.isPastor && !b.isPastor) return -1;
                if (!a.isPastor && b.isPastor) return 1;
                return 0;
              });
            });
            
            // Remove empty groups
            const finalGroups = allGroups.filter(group => group.length > 0);
            
            console.log('✅ Final result:', finalGroups.length, 'groups created');
            setGroups(finalGroups);
            
            resolve();
          } catch (error) {
            reject(error);
          }
        }, 100); // Small delay to allow UI to update
      });
      
      setError(`✅ Successfully created ${groups.length} groups!`);
      setTimeout(() => setError(''), 3000);
      
    } catch (error) {
      console.error('Error during group formation:', error);
      setError('❌ Failed to create groups. Please try again.');
      setGroups([]);
    } finally {
      setIsGrouping(false);
    }
  };
  

  const handleShuffleClick = async () => {
    setReshuffleCount(0);
    await shuffleAndGroupUsers(groupSize);
  };

  const handleReshuffleClick = async () => {
    if (groups.length === 0) return;
    
    setIsReshuffling(true);
    setError('🔄 Reshuffling groups with different arrangement...');
    
    try {
      await shuffleAndGroupUsers(groupSize);
      setReshuffleCount(prev => prev + 1);
      setError(`✅ Groups reshuffled! (Attempt #${reshuffleCount + 1})`);
      setTimeout(() => setError(''), 3000);
    } catch (error) {
      setError('❌ Failed to reshuffle groups. Please try again.');
    } finally {
      setIsReshuffling(false);
    }
  };

  const resetGroups = () => {
    if (confirm('Are you sure you want to clear all current groups? This action cannot be undone.')) {
      setGroups([]);
      setReshuffleCount(0);
      setError('🗑️ Groups cleared. Click "Create Balanced Groups" to generate new ones.');
      setTimeout(() => setError(''), 3000);
    }
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
      
      // Number the members
      const tableData = actualUsers.map((user, i) => [
        (i + 1).toString(), // Row number
        user.isPastor ? `${user.name} (Pastor)` : user.name,
        user.phone,
        user.residence,
        user.yos,
        user.gender === 'M' ? 'Male' : 'Female'
      ]);

      // Check if adding this table would exceed the page height - optimized for ~20 rows
      const groupTitleHeight = 15;
      const statsHeight = 10;
      const rowHeight = 6; // Compact row height
      const headerHeight = 8;
      const estimatedTableHeight = (tableData.length * rowHeight) + headerHeight + groupTitleHeight + statsHeight + 15;
      
      if (yOffset + estimatedTableHeight > pageHeight - 20) {
        doc.addPage();
        // Add letterhead to new page
        doc.addImage(letterhead, 'PNG', 10, 10, 190, 35);
        yOffset = 55;
      }

      // Add group title with better formatting
      const hasPastor = actualUsers.some(u => u.isPastor === true);
      const pastorName = actualUsers.find(u => u.isPastor === true)?.name || '';
      
      doc.setTextColor(128, 0, 128); // Purple color
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      const groupTitle = `Group ${index + 1} (${actualUsers.length} members)${hasPastor ? ` - Pastor: ${pastorName}` : ' - No Pastor'}`;
      doc.text(groupTitle, 15, yOffset);
      yOffset += groupTitleHeight;

      // Group statistics in a compact format
      const maleCount = actualUsers.filter(u => u.gender === 'M').length;
      const femaleCount = actualUsers.filter(u => u.gender === 'F').length;
      const year1 = actualUsers.filter(u => u.yos === '1').length;
      const year2 = actualUsers.filter(u => u.yos === '2').length;
      const year3 = actualUsers.filter(u => u.yos === '3').length;
      const year4 = actualUsers.filter(u => u.yos === '4').length;
      
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      const groupStats = `M:${maleCount} F:${femaleCount} | Y1:${year1} Y2:${year2} Y3:${year3} Y4:${year4}`;
      doc.text(groupStats, 15, yOffset);
      yOffset += statsHeight;

      // Define compact table options optimized for ~20 names per page
      const tableOptions = {
        head: [['#', 'Name', 'Phone', 'Residence', 'Year', 'Gender']],
        body: tableData,
        startY: yOffset,
        theme: 'grid',
        headStyles: {
          fillColor: [128, 0, 128], // Purple header
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold',
          cellPadding: 2
        },
        styles: {
          fontSize: 8, // Smaller font for more rows
          cellPadding: 1.5, // Compact padding
          lineWidth: 0.1,
          lineColor: [200, 200, 200]
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250]
        },
        didParseCell: function(data: any) {
          // Highlight pastor rows
          const userIndex = data.row.index;
          const user = actualUsers[userIndex];
          if (user && user.isPastor) {
            data.cell.styles.fillColor = [255, 248, 220]; // Light gold background for pastor
            data.cell.styles.textColor = [128, 0, 128]; // Purple text for pastor
            data.cell.styles.fontStyle = 'bold';
          }
        },
        columnStyles: {
          0: { cellWidth: 12, halign: 'center' }, // # column
          1: { cellWidth: 45 }, // Name column
          2: { cellWidth: 30 }, // Phone column  
          3: { cellWidth: 35 }, // Residence column
          4: { cellWidth: 15, halign: 'center' }, // Year column
          5: { cellWidth: 20, halign: 'center' } // Gender column
        },
        margin: { left: 15, right: 15 }
      };

      // Add table to PDF and update yOffset
      const { finalY } = doc.autoTable(tableOptions) || {};
      yOffset = finalY ? finalY + 10 : yOffset + estimatedTableHeight;
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

  if (error && !showLoginForm && !isAuthenticated) {
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
                <p><strong>Pastors:</strong> {users.filter(u => u.isPastor === true).length}</p>
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
              <button 
                onClick={handleShuffleClick} 
                disabled={isGrouping}
                className={styles.shuffleButton}
                style={{
                  backgroundColor: isGrouping ? '#ccc' : undefined,
                  cursor: isGrouping ? 'not-allowed' : 'pointer'
                }}
              >
                {isGrouping ? (
                  <>🔄 Creating Groups...</>
                ) : (
                  <><FontAwesomeIcon icon={faShuffle} /> Create Balanced Groups</>
                )}
              </button>
              {groups.length > 0 && (
                <>
                  <button 
                    onClick={handleReshuffleClick} 
                    disabled={isReshuffling || isGrouping}
                    className={styles.reshuffleButton}
                    style={{
                      backgroundColor: (isReshuffling || isGrouping) ? '#ccc' : '#ff8c00',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: (isReshuffling || isGrouping) ? 'not-allowed' : 'pointer',
                      marginLeft: '10px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    {isReshuffling ? (
                      <>🔄 Reshuffling...</>
                    ) : (
                      <>🎲 Reshuffle Groups</>
                    )}
                  </button>
                  <button 
                    onClick={resetGroups} 
                    className={styles.resetButton}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      marginLeft: '10px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    🗑️ Clear Groups
                  </button>
                  <button onClick={handleExportPdf} className={styles.exportButton}>
                    Download Groups PDF
                  </button>
                </>
              )}
            </div>
            <p className={styles.groupingInfo}>
              Each Bible Study Pastor gets their own group within their residence location. Groups are organized by residence with balanced gender and year distribution. Pastors appear as the first member in their groups with special highlighting in the PDF. Groups with pastors are prioritized and listed first, with pastor names prominently displayed in group titles.
            </p>
            {groups.length > 0 && (
              <div className={styles.reshuffleInfo} style={{ 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #dee2e6', 
                borderRadius: '8px', 
                padding: '12px', 
                marginTop: '15px',
                fontSize: '14px'
              }}>
                <h6 style={{ margin: '0 0 8px 0', color: '#495057' }}>
                  🎯 Group Management Options:
                </h6>
                <ul style={{ margin: '0', paddingLeft: '20px', color: '#6c757d' }}>
                  <li><strong>🎲 Reshuffle Groups:</strong> Keep the same group size but create new random arrangements while maintaining balance</li>
                  <li><strong>🗑️ Clear Groups:</strong> Remove all current groups to start fresh</li>
                  <li><strong>📊 Download PDF:</strong> Export current groups to a formatted PDF document</li>
                </ul>
                {reshuffleCount > 0 && (
                  <p style={{ 
                    margin: '8px 0 0 0', 
                    color: '#28a745', 
                    fontWeight: '600',
                    fontSize: '13px'
                  }}>
                    ✨ Groups have been reshuffled {reshuffleCount} time{reshuffleCount > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Groups Display */}
          {groups.length > 0 ? (
            <div className={styles.groups}>
              {groups.map((group, index) => (
                <div key={index} className={styles.group}>
                  <h5>
                    Group {index + 1}
                    {group.some(u => u.isPastor) && (
                      <span style={{ color: '#800080', marginLeft: '10px', fontSize: '14px' }}>
                        ✝️ Pastor: {group.find(u => u.isPastor)?.name}
                      </span>
                    )}
                    {!group.some(u => u.isPastor) && (
                      <span style={{ color: '#ff6b6b', marginLeft: '10px', fontSize: '12px' }}>
                        ⚠️ No Pastor
                      </span>
                    )}
                  </h5>
                  <div style={{ overflowX: 'auto', marginBottom: '10px' }}>
                    <table className={styles.table} style={{ minWidth: '600px' }}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Residence</th>
                        <th>Yos</th>
                        <th>G</th>
                        <th>Pastor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.map((user, i) => (
                        <tr key={i} className={user.isPastor ? styles.pastorRow : ''}>
                          <td>{user.isPastor ? `${user.name} ✝️` : user.name}</td>
                          <td>{user.phone}</td>
                          <td>{user.residence}</td>
                          <td>{user.yos}</td>
                          <td>{user.gender}</td>
                          <td>
                            {user.isPastor ? (
                              <strong style={{ color: '#800080', backgroundColor: '#f0e6ff', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
                                ✓ PASTOR
                              </strong>
                            ) : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ margin: '0', color: '#6c757d', fontSize: '16px' }}>
                📋 No groups formed yet. Use the "Create Balanced Groups" button above to generate groups.
              </p>
            </div>
          )}

          {/* User Management */}
          {users.length > 0 && (
            <div className={styles.userManagementSection}>
              <h5>
                <FontAwesomeIcon icon={faUsers} style={{ marginRight: '8px' }} />
                User Management
              </h5>
              <p className={styles.userManagementInfo}>
                Click the "Mark as Pastor" button to identify pastors. Pastors will get their own groups and be clearly identified.
              </p>
              
              {/* Desktop Table View */}
              <div className={styles.userList} style={{ display: 'none' }}>
                <style>{`
                  @media (min-width: 768px) {
                    .userList { display: block !important; }
                    .userCards { display: none !important; }
                  }
                `}</style>
                <table className={styles.userTable}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Residence</th>
                      <th>Year</th>
                      <th>Gender</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={index} className={user.isPastor ? styles.pastorUserRow : ''}>
                        <td>{user.name}</td>
                        <td>{user.phone}</td>
                        <td>{user.residence}</td>
                        <td>{user.yos}</td>
                        <td>{user.gender === 'M' ? 'Male' : 'Female'}</td>
                        <td>
                          {user.isPastor ? (
                            <span style={{ color: '#800080', fontWeight: 'bold' }}>✝️ Pastor</span>
                          ) : (
                            <span style={{ color: '#666' }}>Member</span>
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => togglePastorStatus(index)}
                            style={{
                              backgroundColor: user.isPastor ? '#ff6b6b' : '#800080',
                              color: 'white',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            {user.isPastor ? '✕ Remove Pastor' : '✝️ Mark as Pastor'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className={styles.userCards}>
                <style>{`
                  @media (min-width: 768px) {
                    .userCards { display: none !important; }
                    .userList { display: block !important; }
                  }
                  .userCard {
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    margin-bottom: 12px;
                    padding: 16px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                  }
                  .userCard.pastorCard {
                    border-color: #800080;
                    background: #fef7ff;
                  }
                  .userCardHeader {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                    flex-wrap: wrap;
                    gap: 8px;
                  }
                  .userCardName {
                    font-weight: bold;
                    font-size: 16px;
                    color: #333;
                  }
                  .userCardStatus {
                    font-size: 14px;
                    padding: 4px 8px;
                    border-radius: 4px;
                    background: #f0f0f0;
                  }
                  .userCardStatus.pastor {
                    background: #f0e6ff;
                    color: #800080;
                    font-weight: bold;
                  }
                  .userCardDetails {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                    margin-bottom: 12px;
                    font-size: 14px;
                  }
                  .userCardDetail {
                    display: flex;
                    flex-direction: column;
                  }
                  .userCardLabel {
                    font-weight: 600;
                    color: #666;
                    font-size: 12px;
                    text-transform: uppercase;
                  }
                  .userCardValue {
                    color: #333;
                    margin-top: 2px;
                  }
                  .userCardAction {
                    display: flex;
                    justify-content: center;
                  }
                  .userCardButton {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    min-width: 140px;
                  }
                  .userCardButton:hover {
                    transform: translateY(-1px);
                  }
                `}</style>
                {users.map((user, index) => (
                  <div key={index} className={`userCard ${user.isPastor ? 'pastorCard' : ''}`}>
                    <div className="userCardHeader">
                      <div className="userCardName">{user.name}</div>
                      <div className={`userCardStatus ${user.isPastor ? 'pastor' : ''}`}>
                        {user.isPastor ? '✝️ Pastor' : 'Member'}
                      </div>
                    </div>
                    
                    <div className="userCardDetails">
                      <div className="userCardDetail">
                        <div className="userCardLabel">Phone</div>
                        <div className="userCardValue">{user.phone}</div>
                      </div>
                      <div className="userCardDetail">
                        <div className="userCardLabel">Residence</div>
                        <div className="userCardValue">{user.residence}</div>
                      </div>
                      <div className="userCardDetail">
                        <div className="userCardLabel">Year</div>
                        <div className="userCardValue">Year {user.yos}</div>
                      </div>
                      <div className="userCardDetail">
                        <div className="userCardLabel">Gender</div>
                        <div className="userCardValue">{user.gender === 'M' ? 'Male' : 'Female'}</div>
                      </div>
                    </div>
                    
                    <div className="userCardAction">
                      <button
                        onClick={() => togglePastorStatus(index)}
                        className="userCardButton"
                        style={{
                          backgroundColor: user.isPastor ? '#ff6b6b' : '#800080',
                          color: 'white'
                        }}
                      >
                        {user.isPastor ? '✕ Remove Pastor' : '✝️ Mark as Pastor'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
