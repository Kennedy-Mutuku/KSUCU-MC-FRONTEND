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
  
  // Search and member management states
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<Array<{ name: string, residence: string, yos: string, phone: string, gender: string, isPastor?: boolean }>>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const backEndURL = getBaseUrl();

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        user.residence.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.yos.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [users, searchTerm]);

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
      
      // Use users as they come from the database, with proper isPastor field
      const processedUsers = response.data.map((user: any) => ({
        ...user,
        isPastor: user.isPastor === true // Only rely on database field
      }));
      
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

  const togglePastorStatus = async (userIndex: number) => {
    const user = users[userIndex];
    const newPastorStatus = !user.isPastor;
    
    try {
      setError(`🔄 Updating ${user.name}'s pastor status...`);
      
      const response = await axios.put(
        `${backEndURL}/adminBs/users/${user.phone}/pastor`,
        { isPastor: newPastorStatus },
        { 
          withCredentials: true,
          timeout: 10000
        }
      );
      
      if (response.status === 200) {
        // Update local state only after successful API call
        const updatedUsers = [...users];
        updatedUsers[userIndex].isPastor = newPastorStatus;
        setUsers(updatedUsers);
        
        const status = newPastorStatus ? 'marked as Pastor' : 'unmarked as Pastor';
        setError(`✅ ${user.name} ${status} successfully!`);
        setTimeout(() => setError(''), 3000);
        
        console.log(`Pastor status updated for ${user.name}: ${newPastorStatus}`);
      }
    } catch (err: any) {
      console.error('Error updating pastor status:', err);
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('❌ Authentication failed. Please login again.');
        setIsAuthenticated(false);
        setShowLoginForm(true);
      } else if (err.response?.status === 404) {
        setError(`❌ User ${user.name} not found. They may have been deleted.`);
        // Refresh the users list
        fetchSavedSouls();
      } else if (err.code === 'ERR_NETWORK' || !navigator.onLine) {
        setError('❌ Network error. Please check your connection and try again.');
      } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError('❌ Request timeout. Please try again.');
      } else {
        const message = err.response?.data?.message || 'Failed to update pastor status';
        setError(`❌ ${message}. Please try again.`);
      }
    }
  };


  const deleteMember = async (phone: string, name: string) => {
    const confirmDelete = confirm(`⚠️ Are you sure you want to remove "${name}" from Bible Study?\n\nThis action cannot be undone. The member will need to re-register if they want to join again.`);
    
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    setError(`🗑️ Removing ${name} from Bible Study...`);
    
    try {
      const response = await axios.delete(`${backEndURL}/adminBs/users/${phone}`, {
        withCredentials: true,
        timeout: 10000
      });
      
      if (response.status === 200) {
        // Remove from local state
        const updatedUsers = users.filter(user => user.phone !== phone);
        setUsers(updatedUsers);
        
        // Clear groups if the deleted member was in them
        if (groups.length > 0) {
          setGroups([]);
          setReshuffleCount(0);
        }
        
        setError(`✅ ${name} has been successfully removed from Bible Study!`);
        setTimeout(() => setError(''), 4000);
      }
    } catch (err: any) {
      console.error('Error deleting member:', err);
      
      if (err.response?.status === 404) {
        setError('❌ Member not found. They may have already been removed.');
        // Still remove from local state in case of sync issues
        const updatedUsers = users.filter(user => user.phone !== phone);
        setUsers(updatedUsers);
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError('❌ Authentication failed. Please login again.');
        setIsAuthenticated(false);
        setShowLoginForm(true);
      } else if (err.code === 'ERR_NETWORK' || !navigator.onLine) {
        setError('❌ Network error. Please check your connection and try again.');
      } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError('❌ Request timeout. Please try again.');
      } else {
        setError(`❌ Failed to remove ${name}. ${err.response?.data?.message || 'Please try again.'}`);
      }
    } finally {
      setIsDeleting(false);
    }
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
            console.log(`🎯 Total users to group: ${users.length}`);
            
            // Separate pastors and regular users
            const allPastors = users.filter(u => u.isPastor);
            const allRegularUsers = users.filter(u => !u.isPastor);
            
            console.log(`✝️ Total pastors: ${allPastors.length}`);
            console.log(`👥 Total regular users: ${allRegularUsers.length}`);
            
            // Calculate the EXACT number of groups needed to include ALL users
            const totalUsersToGroup = users.length;
            const totalGroups = Math.ceil(totalUsersToGroup / size);
            console.log(`📊 MUST create EXACTLY ${totalGroups} groups for ${totalUsersToGroup} users (${size} per group)`);
            
            // Create empty groups array
            const finalGroups: Array<Array<{ name: string, phone: string, residence: string, yos: string, gender: string, isPastor?: boolean }>> = [];
            
            // Initialize all groups as empty arrays
            for (let i = 0; i < totalGroups; i++) {
              finalGroups.push([]);
            }
            
            // RESIDENCE-BASED GROUPING: Group all users from same residence together
            // 1. Group users by residence (alphabetical order)
            const regularUsersByResidence: { [residence: string]: Array<{ name: string, phone: string, residence: string, yos: string, gender: string, isPastor?: boolean }> } = {};
            allRegularUsers.forEach(user => {
              if (!regularUsersByResidence[user.residence]) regularUsersByResidence[user.residence] = [];
              regularUsersByResidence[user.residence].push(user);
            });
            
            // 2. Sort residences alphabetically
            const residences = Object.keys(regularUsersByResidence).sort();
            console.log(`📍 Processing residences in alphabetical order: [${residences.join(', ')}]`);
            
            // 3. Create residence-based groups: All users from same residence grouped together
            const regularUsersQueue: Array<{ name: string, phone: string, residence: string, yos: string, gender: string, isPastor?: boolean }> = [];
            
            for (const residence of residences) {
              const residenceUsers = regularUsersByResidence[residence];
              console.log(`🏠 Processing ${residence}: ${residenceUsers.length} users`);
              
              // Calculate how many groups this residence will occupy
              const groupsNeededForResidence = Math.ceil(residenceUsers.length / size);
              console.log(`   ${residence} will need ${groupsNeededForResidence} groups`);
              
              // Separate by gender and year for optimal mixing
              const malesByYear: { [year: string]: Array<{ name: string, phone: string, residence: string, yos: string, gender: string, isPastor?: boolean }> } = {};
              const femalesByYear: { [year: string]: Array<{ name: string, phone: string, residence: string, yos: string, gender: string, isPastor?: boolean }> } = {};
              
              residenceUsers.forEach(user => {
                if (user.gender === 'M') {
                  if (!malesByYear[user.yos]) malesByYear[user.yos] = [];
                  malesByYear[user.yos].push(user);
                } else {
                  if (!femalesByYear[user.yos]) femalesByYear[user.yos] = [];
                  femalesByYear[user.yos].push(user);
                }
              });
              
              // Shuffle within each gender/year group for randomness
              Object.values(malesByYear).forEach(yearGroup => {
                yearGroup.sort(() => Math.random() - 0.5);
              });
              Object.values(femalesByYear).forEach(yearGroup => {
                yearGroup.sort(() => Math.random() - 0.5);
              });
              
              // Create perfectly distributed queue - round-robin across ALL groups this residence will have
              const residenceQueue: Array<{ name: string, phone: string, residence: string, yos: string, gender: string, isPastor?: boolean }> = [];
              
              // Create temporary arrays to hold users for round-robin distribution
              const allYears = [...new Set([...Object.keys(malesByYear), ...Object.keys(femalesByYear)])].sort();
              const distributionPool: Array<{ name: string, phone: string, residence: string, yos: string, gender: string, isPastor?: boolean }> = [];
              
              // Create a balanced pool alternating gender and year
              let currentYear = 0;
              let addedAny = true;
              
              while (addedAny && distributionPool.length < residenceUsers.length) {
                addedAny = false;
                
                for (let yearIndex = 0; yearIndex < allYears.length; yearIndex++) {
                  const year = allYears[(currentYear + yearIndex) % allYears.length];
                  
                  // Try to add one male and one female from this year
                  if (malesByYear[year] && malesByYear[year].length > 0) {
                    distributionPool.push(malesByYear[year].shift()!);
                    addedAny = true;
                  }
                  
                  if (femalesByYear[year] && femalesByYear[year].length > 0) {
                    distributionPool.push(femalesByYear[year].shift()!);
                    addedAny = true;
                  }
                }
                currentYear++;
              }
              
              // Now distribute the pool round-robin across the groups for this residence
              // This ensures EVERY group gets mixed years and gender
              const tempGroups: Array<Array<{ name: string, phone: string, residence: string, yos: string, gender: string, isPastor?: boolean }>> = [];
              for (let i = 0; i < groupsNeededForResidence; i++) {
                tempGroups.push([]);
              }
              
              // Round-robin distribution to ensure perfect mixing across ALL groups
              distributionPool.forEach((user, index) => {
                const targetGroupIndex = index % groupsNeededForResidence;
                tempGroups[targetGroupIndex].push(user);
              });
              
              // Flatten back to a queue, but now perfectly distributed
              tempGroups.forEach(group => {
                residenceQueue.push(...group);
              });
              
              console.log(`   ✅ Created perfectly mixed distribution for ${residence}`);
              console.log(`   📊 Each of the ${groupsNeededForResidence} groups will have mixed years/gender`);
              
              // Add ALL users from this residence to the main queue (residence-based blocks)
              regularUsersQueue.push(...residenceQueue);
              console.log(`✅ Added all ${residenceQueue.length} users from ${residence} to queue`);
            }
            
            console.log(`📋 Regular users queue: ${regularUsersQueue.length} users`);
            console.log(`👑 Pastors to distribute: ${allPastors.length} pastors`);
            
            // STEP 1: Enhanced Residence-Based Pastor Assignment
            // Priority: Each pastor gets a group from their residence first, only if residence pastors are insufficient
            
            // 1.1: Group pastors by residence
            const pastorsByResidence: { [residence: string]: Array<{ name: string, phone: string, residence: string, yos: string, gender: string, isPastor?: boolean }> } = {};
            allPastors.forEach(pastor => {
              if (!pastorsByResidence[pastor.residence]) pastorsByResidence[pastor.residence] = [];
              pastorsByResidence[pastor.residence].push(pastor);
            });
            
            console.log(`👑 Enhanced Pastor distribution by residence:`);
            Object.keys(pastorsByResidence).sort().forEach(residence => {
              console.log(`   ${residence}: ${pastorsByResidence[residence].length} pastor${pastorsByResidence[residence].length !== 1 ? 's' : ''}`);
            });
            
            // 1.2: Calculate which groups belong to which residence (based on regularUsersQueue order)
            const residenceGroupRanges: { [residence: string]: { start: number, end: number, groups: number[] } } = {};
            let currentResidence = '';
            let groupIndex = 0;
            let userIndex = 0;
            
            // Track which groups each residence fills
            while (userIndex < regularUsersQueue.length && groupIndex < totalGroups) {
              const user = regularUsersQueue[userIndex];
              
              // If we're starting a new residence
              if (user.residence !== currentResidence) {
                currentResidence = user.residence;
                if (!residenceGroupRanges[currentResidence]) {
                  residenceGroupRanges[currentResidence] = { start: groupIndex, end: groupIndex, groups: [] };
                }
              }
              
              // Add users to current group until full, then move to next group
              let usersInCurrentGroup = 0;
              while (userIndex < regularUsersQueue.length && 
                     regularUsersQueue[userIndex].residence === currentResidence && 
                     usersInCurrentGroup < size) {
                userIndex++;
                usersInCurrentGroup++;
              }
              
              // Record this group for the current residence
              residenceGroupRanges[currentResidence].groups.push(groupIndex);
              residenceGroupRanges[currentResidence].end = groupIndex;
              
              groupIndex++;
            }
            
            console.log(`🏠 Residence group mapping:`);
            Object.keys(residenceGroupRanges).sort().forEach(residence => {
              const range = residenceGroupRanges[residence];
              console.log(`   ${residence}: Groups [${range.groups.map(g => g + 1).join(', ')}] (${range.groups.length} groups)`);
            });
            
            // 1.3: ENHANCED Pastor Assignment with STRICT residence priority
            let unassignedPastors: Array<{ name: string, phone: string, residence: string, yos: string, gender: string, isPastor?: boolean }> = [...allPastors];
            
            console.log(`👑 ENHANCED PASTOR ASSIGNMENT: Assigning ${allPastors.length} pastors with residence priority...`);
            
            // PHASE 1: MANDATORY residence-first assignment - Each residence's pastors get assigned to residence groups FIRST
            for (const residence of Object.keys(pastorsByResidence).sort()) {
              const residencePastors = pastorsByResidence[residence];
              const availableGroups = residenceGroupRanges[residence]?.groups || [];
              
              console.log(`🏠 PRIORITY ASSIGNMENT - ${residence}: ${residencePastors.length} pastors for ${availableGroups.length} residence groups`);
              
              // Assign residence pastors to residence groups (one pastor per group)
              const pastorsToAssign = Math.min(residencePastors.length, availableGroups.length);
              
              for (let i = 0; i < pastorsToAssign; i++) {
                const pastor = residencePastors[i];
                const targetGroupIndex = availableGroups[i];
                
                // Assign pastor to their residence group (guaranteed assignment)
                finalGroups[targetGroupIndex].push(pastor);
                unassignedPastors = unassignedPastors.filter(p => p.phone !== pastor.phone);
                console.log(`✝️ RESIDENCE MATCH: Pastor ${pastor.name} → Group ${targetGroupIndex + 1} (${residence}) - PERFECT MATCH`);
              }
              
              // Log if residence has more pastors than groups
              if (residencePastors.length > availableGroups.length) {
                const excessPastors = residencePastors.length - availableGroups.length;
                console.log(`⚡ ${residence} has ${excessPastors} excess pastor${excessPastors > 1 ? 's' : ''} (will assign to other groups)`);
              }
              
              // Log if residence has fewer pastors than groups
              if (residencePastors.length < availableGroups.length) {
                const missingPastors = availableGroups.length - residencePastors.length;
                console.log(`📍 ${residence} needs ${missingPastors} more pastor${missingPastors > 1 ? 's' : ''} for all groups (will receive from other residences)`);
              }
            }
            
            // PHASE 2: SMART residence-proximity assignment for remaining pastors
            console.log(`👑 PHASE 2: Assigning ${unassignedPastors.length} remaining pastors with residence proximity priority...`);
            
            // Find all groups that still don't have pastors with their primary residence
            const groupsWithoutPastors: Array<{groupIndex: number, primaryResidence: string, allResidences: string[]}> = [];
            for (let i = 0; i < totalGroups; i++) {
              if (!finalGroups[i].some(member => member.isPastor)) {
                const groupResidences = finalGroups[i].map(u => u.residence);
                const primaryResidence = groupResidences.length > 0 ? groupResidences[0] : 'Unknown';
                const uniqueResidences = [...new Set(groupResidences)];
                
                groupsWithoutPastors.push({
                  groupIndex: i,
                  primaryResidence: primaryResidence,
                  allResidences: uniqueResidences
                });
              }
            }
            
            console.log(`📋 Groups without pastors:`);
            groupsWithoutPastors.forEach(group => {
              console.log(`   Group ${group.groupIndex + 1}: Primary residence ${group.primaryResidence} (contains: ${group.allResidences.join(', ')})`);
            });
            
            // Smart assignment: Try to match pastors to groups from their residence first
            for (const pastor of unassignedPastors) {
              let assigned = false;
              
              // PRIORITY 1: Find a group that contains members from the pastor's residence
              for (let i = 0; i < groupsWithoutPastors.length; i++) {
                const group = groupsWithoutPastors[i];
                if (group.allResidences.includes(pastor.residence)) {
                  finalGroups[group.groupIndex].push(pastor);
                  console.log(`✝️ RESIDENCE PROXIMITY: Pastor ${pastor.name} (${pastor.residence}) → Group ${group.groupIndex + 1} (contains ${pastor.residence} members) - GOOD MATCH`);
                  groupsWithoutPastors.splice(i, 1); // Remove this group from available list
                  assigned = true;
                  break;
                }
              }
              
              // PRIORITY 2: If no residence match, assign to any available group
              if (!assigned && groupsWithoutPastors.length > 0) {
                const group = groupsWithoutPastors.shift()!; // Take the first available group
                finalGroups[group.groupIndex].push(pastor);
                console.log(`✝️ CROSS-RESIDENCE: Pastor ${pastor.name} (${pastor.residence}) → Group ${group.groupIndex + 1} (primarily ${group.primaryResidence}) - FALLBACK ASSIGNMENT`);
                assigned = true;
              }
              
              // EMERGENCY: If all groups have pastors but this pastor still needs assignment
              if (!assigned) {
                console.warn(`⚠️ WARNING: All groups already have pastors, but ${pastor.name} still unassigned!`);
                
                // Find the group with the most members from this pastor's residence
                let bestGroupIndex = 0;
                let maxSameResidenceMembers = 0;
                
                for (let i = 0; i < totalGroups; i++) {
                  const sameResidenceCount = finalGroups[i].filter(u => u.residence === pastor.residence).length;
                  if (sameResidenceCount > maxSameResidenceMembers) {
                    maxSameResidenceMembers = sameResidenceCount;
                    bestGroupIndex = i;
                  }
                }
                
                finalGroups[bestGroupIndex].push(pastor);
                console.log(`🚨 EMERGENCY: Added ${pastor.name} to Group ${bestGroupIndex + 1} (has ${maxSameResidenceMembers} ${pastor.residence} members) - MULTIPLE PASTORS`);
              }
            }
            
            // STEP 2: Distribute regular users SEQUENTIALLY (residence-based blocks)
            let regularUserIndex = 0;
            let currentGroupIndex = 0;
            
            console.log(`🎯 Starting sequential distribution of ${regularUsersQueue.length} users into ${totalGroups} groups`);
            
            // Fill groups sequentially to keep residence blocks together
            while (regularUserIndex < regularUsersQueue.length) {
              // Find the next group that has space
              while (currentGroupIndex < totalGroups && finalGroups[currentGroupIndex].length >= size) {
                currentGroupIndex++;
              }
              
              // If we've filled all groups to capacity and still have users, they go in the last group
              if (currentGroupIndex >= totalGroups) {
                // All groups are full, add remaining users to the last group
                finalGroups[totalGroups - 1].push(regularUsersQueue[regularUserIndex]);
                console.log(`📝 Added ${regularUsersQueue[regularUserIndex].name} to final group (overflow)`);
                regularUserIndex++;
              } else {
                // Add user to current group
                const user = regularUsersQueue[regularUserIndex];
                finalGroups[currentGroupIndex].push(user);
                regularUserIndex++;
                
                // If current group is now full, move to next group
                if (finalGroups[currentGroupIndex].length >= size) {
                  console.log(`✅ Group ${currentGroupIndex + 1} filled with ${size} members`);
                  currentGroupIndex++;
                }
              }
            }
            
            console.log(`🎯 Sequential distribution complete: ${regularUserIndex} users placed`);
            
            // Log final residence distribution pattern (including pastors)
            const residenceDistribution: { [residence: string]: { groups: number[], pastors: number, regulars: number } } = {};
            finalGroups.forEach((group, groupIndex) => {
              group.forEach(user => {
                if (!residenceDistribution[user.residence]) {
                  residenceDistribution[user.residence] = { groups: [], pastors: 0, regulars: 0 };
                }
                residenceDistribution[user.residence].groups.push(groupIndex + 1);
                if (user.isPastor) {
                  residenceDistribution[user.residence].pastors++;
                } else {
                  residenceDistribution[user.residence].regulars++;
                }
              });
            });
            
            console.log(`🏠 FINAL RESIDENCE DISTRIBUTION (with pastors):`);
            Object.keys(residenceDistribution).sort().forEach(residence => {
              const data = residenceDistribution[residence];
              const groupNumbers = [...new Set(data.groups)].sort((a, b) => a - b);
              console.log(`   ${residence}: Groups [${groupNumbers.join(', ')}] | ${data.pastors} pastor${data.pastors !== 1 ? 's' : ''}, ${data.regulars} regular member${data.regulars !== 1 ? 's' : ''}`);
            });
            
            // Log detailed group creation with diversity analysis
            finalGroups.forEach((group, index) => {
              if (group.length > 0) {
                const groupPastors = group.filter(u => u.isPastor);
                const males = group.filter(u => u.gender === 'M').length;
                const females = group.filter(u => u.gender === 'F').length;
                const residencesInGroup = [...new Set(group.map(u => u.residence))].sort();
                const yearsInGroup = [...new Set(group.map(u => u.yos))].sort();
                
                console.log(`✅ Group ${index + 1}: ${group.length} members | ${groupPastors.length} pastor${groupPastors.length !== 1 ? 's' : ''} | M:${males} F:${females} | Years:[${yearsInGroup.join(',')}] | Residences:[${residencesInGroup.join(', ')}]`);
              }
            });

            
            // Verify ALL users are grouped
            const totalGrouped = finalGroups.reduce((sum, group) => sum + group.length, 0);
            console.log(`\n🔍 VERIFICATION: ${totalGrouped}/${users.length} users grouped`);
            
            if (totalGrouped === users.length) {
              console.log(`✅ SUCCESS: ALL ${users.length} users have been grouped successfully!`);
            } else {
              console.error(`❌ ERROR: Only ${totalGrouped}/${users.length} users were grouped. ${users.length - totalGrouped} users are missing!`);
            }
            
            // Final verification and logging
            console.log(`\n📊 FINAL GROUP ANALYSIS:`);
            const nonEmptyGroups = finalGroups.filter(group => group.length > 0);
            const groupsWithPastors = nonEmptyGroups.filter(group => group.some(u => u.isPastor)).length;
            const totalPastorsUsed = nonEmptyGroups.reduce((sum, group) => sum + group.filter(u => u.isPastor).length, 0);
            const groupsWithMultiplePastors = nonEmptyGroups.filter(group => group.filter(u => u.isPastor).length > 1).length;
            
            console.log(`📈 Total groups created: ${nonEmptyGroups.length}/${totalGroups} (expected: ${Math.ceil(users.length / size)})`);
            console.log(`📈 Groups with pastors: ${groupsWithPastors}/${nonEmptyGroups.length}`);
            console.log(`📈 Total pastors assigned: ${totalPastorsUsed}/${allPastors.length}`);
            console.log(`📈 Groups with multiple pastors: ${groupsWithMultiplePastors} (should be 0)`);
            
            // Calculate diversity statistics
            const totalResidencesInGroups = nonEmptyGroups.reduce((sum, group) => sum + new Set(group.map(u => u.residence)).size, 0);
            const avgResidencesPerGroup = (totalResidencesInGroups / nonEmptyGroups.length).toFixed(1);
            const totalYearsInGroups = nonEmptyGroups.reduce((sum, group) => sum + new Set(group.map(u => u.yos)).size, 0);
            const avgYearsPerGroup = (totalYearsInGroups / nonEmptyGroups.length).toFixed(1);
            const genderBalanceScore = nonEmptyGroups.reduce((sum, group) => {
              const males = group.filter(u => u.gender === 'M').length;
              const females = group.filter(u => u.gender === 'F').length;
              return sum + Math.min(males, females) / Math.max(males, females, 1);
            }, 0) / nonEmptyGroups.length;
            
            console.log(`📈 Average residences per group: ${avgResidencesPerGroup}`);
            console.log(`📈 Average years per group: ${avgYearsPerGroup}`);
            console.log(`📈 Gender balance score: ${(genderBalanceScore * 100).toFixed(1)}% (higher is better)`);
            
            if (groupsWithMultiplePastors > 0) {
              console.warn(`⚠️ WARNING: ${groupsWithMultiplePastors} groups have multiple pastors!`);
            }
            
            // Ensure pastors are always first in their groups and log details
            finalGroups.forEach((group, index) => {
              // Sort to put pastor first
              group.sort((a, b) => {
                if (a.isPastor && !b.isPastor) return -1;
                if (!a.isPastor && b.isPastor) return 1;
                return 0;
              });
              
              // Log group composition
              const pastors = group.filter(u => u.isPastor);
              const totalMembers = group.length;
              const males = group.filter(u => u.gender === 'M').length;
              const females = group.filter(u => u.gender === 'F').length;
              const pastorName = pastors.length > 0 ? pastors[0].name : 'None';
              const residences = [...new Set(group.map(u => u.residence))];
              
              const years = [...new Set(group.map(u => u.yos))].sort();
              console.log(`📋 Group ${index + 1}: ${totalMembers} members | Pastor: ${pastorName} | M:${males} F:${females} | Years:[${years.join(',')}] | Residences:[${residences.join(', ')}]`);
              
              // Only warn if not the last group (last group may have fewer members)
              if (totalMembers !== size && index < finalGroups.length - 1) {
                console.warn(`⚠️ Group ${index + 1} has ${totalMembers} members instead of target ${size}`);
              } else if (totalMembers !== size && index === finalGroups.length - 1) {
                console.log(`📝 Final group ${index + 1} has ${totalMembers} members (acceptable for last group)`);
              }
            });
            
            // Use all groups (including potentially smaller last group)
            console.log(`\n✅ FINAL RESULT: ${nonEmptyGroups.length} groups created, ALL ${users.length} users included!`);
            console.log(`📈 Expected groups: ${Math.ceil(users.length / size)} | Actual groups: ${nonEmptyGroups.length}`);
            
            if (nonEmptyGroups.length === Math.ceil(users.length / size)) {
              console.log(`🎯 PERFECT: Exactly the right number of groups created!`);
            } else {
              console.warn(`⚠️ Group count mismatch: Expected ${Math.ceil(users.length / size)}, got ${nonEmptyGroups.length}`);
            }
            
            setGroups(nonEmptyGroups);
            
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
      const year5 = actualUsers.filter(u => u.yos === '5').length;
      const year6 = actualUsers.filter(u => u.yos === '6').length;
      
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      const groupStats = `M:${maleCount} F:${femaleCount} | Y1:${year1} Y2:${year2} Y3:${year3} Y4:${year4} Y5:${year5} Y6:${year6}`;
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
          {users.length > 0 && (
            <span style={{ 
              fontSize: '16px', 
              fontWeight: 'normal', 
              color: '#666', 
              marginLeft: '15px' 
            }}>
              ({users.length} registered, {users.filter(u => u.isPastor === true).length} pastors)
            </span>
          )}
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
            <h5>Registration Overview</h5>
            
            {/* Key Stats Summary */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <div style={{
                textAlign: 'center',
                padding: '15px',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}>
                <div style={{ fontSize: '24px' }}>{users.length}</div>
                <div style={{ fontSize: '12px' }}>Total Registered</div>
              </div>
              
              <div style={{
                textAlign: 'center',
                padding: '15px',
                backgroundColor: '#800080',
                color: 'white',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}>
                <div style={{ fontSize: '24px' }}>{users.filter(u => u.isPastor === true).length}</div>
                <div style={{ fontSize: '12px' }}>Pastors Available</div>
              </div>
              
              <div style={{
                textAlign: 'center',
                padding: '15px',
                backgroundColor: '#28a745',
                color: 'white',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}>
                <div style={{ fontSize: '24px' }}>{users.filter(u => !u.isPastor).length}</div>
                <div style={{ fontSize: '12px' }}>Regular Members</div>
              </div>
              
              {groups.length > 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '15px',
                  backgroundColor: '#ff8c00',
                  color: 'white',
                  borderRadius: '8px',
                  fontWeight: 'bold'
                }}>
                  <div style={{ fontSize: '24px' }}>{groups.length}</div>
                  <div style={{ fontSize: '12px' }}>Groups Formed</div>
                </div>
              )}
              
              {groups.length > 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '15px',
                  backgroundColor: '#6f42c1',
                  color: 'white',
                  borderRadius: '8px',
                  fontWeight: 'bold'
                }}>
                  <div style={{ fontSize: '24px' }}>{groups.filter(group => group.some(u => u.isPastor)).length}/{groups.length}</div>
                  <div style={{ fontSize: '12px' }}>Groups with Pastors</div>
                </div>
              )}
            </div>
            
            {users.length > 0 && (
              <div>
                <h6 style={{ marginBottom: '10px', color: '#666' }}>Detailed Breakdown:</h6>
                <div className={styles.stats} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
                  <p><strong>Male:</strong> {users.filter(u => u.gender === 'M').length}</p>
                  <p><strong>Female:</strong> {users.filter(u => u.gender === 'F').length}</p>
                  <p><strong>Year 1:</strong> {users.filter(u => u.yos === '1').length}</p>
                  <p><strong>Year 2:</strong> {users.filter(u => u.yos === '2').length}</p>
                  <p><strong>Year 3:</strong> {users.filter(u => u.yos === '3').length}</p>
                  <p><strong>Year 4:</strong> {users.filter(u => u.yos === '4').length}</p>
                  <p><strong>Year 5:</strong> {users.filter(u => u.yos === '5').length}</p>
                  <p><strong>Year 6:</strong> {users.filter(u => u.yos === '6').length}</p>
                </div>
                
                {/* Residence-Based Pastor Analysis */}
                <div style={{ marginTop: '20px' }}>
                  <h6 style={{ marginBottom: '10px', color: '#666' }}>🏠 Pastor Distribution by Residence:</h6>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '10px',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {(() => {
                      // Group users by residence
                      const residenceStats = residences.reduce((acc, residence) => {
                        const residenceUsers = users.filter(u => u.residence === residence.name);
                        const residencePastors = residenceUsers.filter(u => u.isPastor);
                        
                        if (residenceUsers.length > 0) {
                          acc[residence.name] = {
                            total: residenceUsers.length,
                            pastors: residencePastors.length,
                            regular: residenceUsers.length - residencePastors.length
                          };
                        }
                        return acc;
                      }, {} as Record<string, {total: number, pastors: number, regular: number}>);
                      
                      return Object.keys(residenceStats).sort().map(residence => {
                        const stats = residenceStats[residence];
                        const needsPastors = stats.pastors === 0;
                        const hasSufficientPastors = stats.pastors >= Math.ceil(stats.total / groupSize);
                        
                        return (
                          <div key={residence} style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ddd',
                            backgroundColor: needsPastors ? '#ffebee' : hasSufficientPastors ? '#e8f5e8' : '#fff3e0',
                            fontSize: '14px'
                          }}>
                            <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                              {residence}
                              {needsPastors && <span style={{color: '#d32f2f', marginLeft: '5px'}}>⚠️</span>}
                              {hasSufficientPastors && <span style={{color: '#2e7d32', marginLeft: '5px'}}>✅</span>}
                            </div>
                            <div style={{ color: '#666', fontSize: '12px' }}>
                              <div>Total: {stats.total} members</div>
                              <div style={{color: needsPastors ? '#d32f2f' : '#2e7d32'}}>
                                Pastors: {stats.pastors}
                              </div>
                              <div>Est. groups: ~{Math.ceil(stats.total / groupSize)}</div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                    <span style={{color: '#d32f2f'}}>⚠️ Needs pastors</span> • 
                    <span style={{color: '#2e7d32', marginLeft: '8px'}}>✅ Well covered</span> • 
                    <span style={{color: '#f57c00', marginLeft: '8px'}}>⚡ Moderate coverage</span>
                  </div>
                </div>
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
              <strong>🏠 ENHANCED RESIDENCE-BASED PASTOR ASSIGNMENT:</strong> Each pastor is prioritized for groups within their own residence area first. Only when a residence lacks enough pastors will pastors from other residences be assigned. This ensures maximum community cohesion while guaranteeing every group has pastoral leadership. All registered members are included with optimal gender/year balance.
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
                    {(() => {
                      const residences = [...new Set(group.map(u => u.residence))];
                      const primaryResidence = residences.length === 1 ? residences[0] : `Mixed (${residences.join(', ')})`;
                      return (
                        <span style={{ color: '#666', marginLeft: '10px', fontSize: '12px', fontWeight: 'normal' }}>
                          🏠 {primaryResidence}
                        </span>
                      );
                    })()}
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
                User Management ({filteredUsers.length} of {users.length} members)
              </h5>
              
              {/* Registration Summary */}
              <div className={styles.registrationSummary} style={{
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap',
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #dee2e6'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 15px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '16px'
                }}>
                  <FontAwesomeIcon icon={faUsers} />
                  <span>Total Registered: {users.length}</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 15px',
                  backgroundColor: '#800080',
                  color: 'white',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '16px'
                }}>
                  <span>✝️</span>
                  <span>Total Pastors: {users.filter(u => u.isPastor === true).length}</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 15px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '16px'
                }}>
                  <span>👥</span>
                  <span>Regular Members: {users.filter(u => !u.isPastor).length}</span>
                </div>
                
                {groups.length > 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 15px',
                    backgroundColor: '#ff8c00',
                    color: 'white',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}>
                    <span>🏠</span>
                    <span>Groups Formed: {groups.length}</span>
                  </div>
                )}
              </div>
              
              {/* Search Bar */}
              <div className={styles.searchSection} style={{ marginBottom: '20px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  flexWrap: 'wrap'
                }}>
                  <input
                    type="text"
                    placeholder="🔍 Search by name, phone, residence, or year..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      flex: '1',
                      minWidth: '250px',
                      padding: '10px 15px',
                      border: '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#800080'}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      style={{
                        padding: '10px 15px',
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                {searchTerm && (
                  <p style={{ 
                    margin: '8px 0 0 0', 
                    color: '#666', 
                    fontSize: '14px' 
                  }}>
                    {filteredUsers.length === 0 
                      ? `No members found matching "${searchTerm}"` 
                      : `Found ${filteredUsers.length} member${filteredUsers.length !== 1 ? 's' : ''} matching "${searchTerm}"`
                    }
                  </p>
                )}
              </div>
              
              <p className={styles.userManagementInfo}>
                Search members and manage their roles. Click "Mark as Pastor" to identify pastors or "🗑️ Remove" to delete a member.
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
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => {
                      const originalIndex = users.findIndex(u => u.phone === user.phone);
                      return (
                        <tr key={user.phone} className={user.isPastor ? styles.pastorUserRow : ''}>
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
                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                              <button
                                onClick={() => togglePastorStatus(originalIndex)}
                                disabled={isDeleting}
                                style={{
                                  backgroundColor: user.isPastor ? '#ff6b6b' : '#800080',
                                  color: 'white',
                                  border: 'none',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                                  opacity: isDeleting ? 0.6 : 1
                                }}
                              >
                                {user.isPastor ? '✕ Remove Pastor' : '✝️ Mark as Pastor'}
                              </button>
                              <button
                                onClick={() => deleteMember(user.phone, user.name)}
                                disabled={isDeleting}
                                style={{
                                  backgroundColor: '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                                  opacity: isDeleting ? 0.6 : 1
                                }}
                              >
                                🗑️ Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
                {filteredUsers.map((user) => {
                  const originalIndex = users.findIndex(u => u.phone === user.phone);
                  return (
                    <div key={user.phone} className={`userCard ${user.isPastor ? 'pastorCard' : ''}`}>
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
                      
                      <div className="userCardAction" style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => togglePastorStatus(originalIndex)}
                          disabled={isDeleting}
                          className="userCardButton"
                          style={{
                            backgroundColor: user.isPastor ? '#ff6b6b' : '#800080',
                            color: 'white',
                            opacity: isDeleting ? 0.6 : 1,
                            cursor: isDeleting ? 'not-allowed' : 'pointer',
                            minWidth: '120px'
                          }}
                        >
                          {user.isPastor ? '✕ Remove Pastor' : '✝️ Mark as Pastor'}
                        </button>
                        <button
                          onClick={() => deleteMember(user.phone, user.name)}
                          disabled={isDeleting}
                          className="userCardButton"
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            opacity: isDeleting ? 0.6 : 1,
                            cursor: isDeleting ? 'not-allowed' : 'pointer',
                            minWidth: '100px'
                          }}
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
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
