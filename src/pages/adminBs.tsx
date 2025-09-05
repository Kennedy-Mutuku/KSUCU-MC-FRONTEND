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
  
  // Residence management states
  const [residences, setResidences] = useState<Array<{_id: string, name: string, description: string}>>([]);
  const [showResidenceModal, setShowResidenceModal] = useState(false);
  const [newResidenceName, setNewResidenceName] = useState('');
  const [newResidenceDescription, setNewResidenceDescription] = useState('');
  const [editingResidence, setEditingResidence] = useState<{_id: string, name: string, description: string} | null>(null);
  const [residenceLoading, setResidenceLoading] = useState(false);

  const backEndURL = 'https://ksucu-mc.co.ke';

  useEffect(() => {
    fetchSavedSouls();
    fetchResidences();
  }, []);

  const fetchSavedSouls = async () => {
    try {
      // Check if admin is authenticated via session storage (from worship docket admin)
      const adminAuth = sessionStorage.getItem('adminAuth');
      if (!adminAuth) {
        setError('Authentication required. Please access via Worship Docket Admin.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${backEndURL}/adminBs/users`, { withCredentials: true });
      setUsers(response.data);  
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching saved souls:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Authentication failed. Please login through Worship Docket Admin first.');
      } else {
        setError('Failed to fetch saved souls. Please check your connection.');
      }
      setLoading(false);
    }
  };

  const fetchResidences = async () => {
    try {
      const response = await axios.get(`${backEndURL}/adminBs/residences`);
      setResidences(response.data);
    } catch (err) {
      console.error('Error fetching residences:', err);
      setError('Failed to fetch residences');
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
    const newGroups = groups.map((group, index) => {
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
    const pageCount = doc.internal.getNumberOfPages();
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
          <div className={`${styles.error} ${error.includes('✅') ? styles.success : styles.errorMsg}`}>
            {error}
          </div>
        )}

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
            <button 
              onClick={() => setShowResidenceModal(true)} 
              className={styles.addButton}
            >
              <FontAwesomeIcon icon={faPlus} /> Add New Residence
            </button>
            
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
