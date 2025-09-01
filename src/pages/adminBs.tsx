import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import styles from '../styles/savedSoulsList.module.css'; 
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import BackButton from '../components/BackButton';
import letterhead from '../assets/letterhead.png'; 

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

  const backEndURL = 'https://ksucu-mc.co.ke';

  useEffect(() => {
    fetchSavedSouls();
  }, []);

  const fetchSavedSouls = async () => {
    try {
      const response = await axios.get(`${backEndURL}/adminBs/users`, { withCredentials: true });
      setUsers(response.data);  
      setLoading(false);
    } catch (err) {
      console.error('Error fetching saved souls:', err);
      setError('Failed to fetch saved souls');
      setLoading(false);
    }
  };

  const shuffleAndGroupUsers = (size: number) => {
    const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
  
    // Group users by residence
    const groupedByResidence: Record<string, Array<{ name: string, residence: string, yos: string, phone: string, gender: string }>> = {};
    shuffledUsers.forEach((user) => {
      if (!groupedByResidence[user.residence]) {
        groupedByResidence[user.residence] = [];
      }
      groupedByResidence[user.residence].push(user);
    });
  
    const newGroups: Array<Array<{ name: string, phone: string, residence: string, yos: string, gender: string }>> = [];
  
    Object.values(groupedByResidence).forEach((residenceGroup) => {
      let currentGroup: Array<{ name: string, phone: string, residence: string, yos: string, gender: string }> = [];
  
      for (let user of residenceGroup) {
        currentGroup.push(user);
  
        // When the current group reaches the target size, add it to the groups list and reset
        if (currentGroup.length === size) {
          newGroups.push(currentGroup);
          currentGroup = [];
        }
      }
  
      // Add the remaining users and empty spots if the group is not full
      if (currentGroup.length > 0) {
        while (currentGroup.length < size) {
          currentGroup.push({ name: "", phone: "", residence: residenceGroup[0].residence, yos: "", gender: "" });
        }
        newGroups.push(currentGroup);
      }
    });
  
    setGroups(newGroups);
  };
  

  const handleShuffleClick = () => {
    shuffleAndGroupUsers(groupSize);
  };


const handleExportPdf = () => {
  try {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let yOffset = 40; // Set initial offset to allow space for the letterhead

    // Load and add the letterhead image to the first page
    doc.addImage(letterhead, 'PNG', 10, 10, 190, 30); // Adjust width and height as needed
    
    // Add a small space after the letterhead
    yOffset += 10; // Adjusted to provide space below the letterhead

    // Document title and date
    const title = "Bible Study Members List";
    const dateText = `Generated on: ${new Date().toLocaleDateString()}`;
    
    // Set color for title (specific shade of blue)
    doc.setTextColor(0, 0, 0); // RGB values for the specific shade of blue
    doc.setFontSize(14);
    doc.text(title, 10, yOffset);
    
    // Reset color for date text (optional)
    doc.setTextColor(0, 0, 0); // Black for the date
    doc.text(dateText, 150, yOffset, { align: "right" });
    yOffset += 15;

    // Iterate through each group
    groups.forEach((group, index) => {
      // Prepare table data with empty cells instead of placeholders
      const tableData = group.map(user => [
        user.name || "",      // If empty, leave cell blank
        user.phone || "",     // Leave phone cell blank if empty
        user.residence || "", // Residence blank if empty
        user.yos || "",       // Year of study blank if empty
        user.gender || ""     // Gender blank if empty
      ]);

      // Check if adding this table would exceed the page height
      const groupTitleHeight = 8;
      const rowHeight = 8;
      const estimatedTableHeight = tableData.length * rowHeight + groupTitleHeight;
      if (yOffset + estimatedTableHeight > pageHeight - 15) {
        doc.addPage();
        yOffset = 20; // Reset yOffset for the new page
      }

      // Add group title
      const groupTitle = `Group ${index + 1}`;
      doc.setTextColor(0, 0, 0); // Set the same shade of blue for the group title
      doc.setFontSize(12);
      doc.text(groupTitle, 10, yOffset);
      yOffset += groupTitleHeight;

       // Define table options with custom header styles
        const tableOptions = {
        head: [['Name', 'Phone', 'Residence', 'Year of Study', 'Gender']],
        body: tableData,
        startY: yOffset,
        theme: 'striped',
        headStyles: {
          fillColor: [0, 198, 255], // Set header background color
          textColor: [255, 255, 255], // Set header text color
          fontSize: 12, // Set font size for header
        },
        styles: {
          fontSize: 10, // Set font size for body
        },
      };

      // Add table to PDF and update yOffset based on finalY position
      const { finalY } = doc.autoTable(tableOptions) || {};
      yOffset = finalY ? finalY + 8 : yOffset + estimatedTableHeight + 8;

    });

    // Save PDF
    doc.save('GroupedUsers.pdf');
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
      <BackButton />
      <UniversalHeader />
      <div className={styles.container}>
        <h4>Saved Souls List</h4>
        <div className={styles.userCount}>
          <strong>Registered Students: {users.length}</strong>
        </div>

        <div>
          <label>Group Size: </label>
          <input 
            type="number" 
            value={groupSize} 
            onChange={(e) => setGroupSize(Number(e.target.value))}
            min={1} // Ensuring minimum group size of 1
          />
          <button onClick={handleShuffleClick} className={styles.shuffleButton}>Shuffle & Group</button>
          <button onClick={handleExportPdf} className={styles.exportButton}>Export to PDF</button>
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
          <p>No groups formed. Adjust the group size and click "Shuffle & Group" to generate groups.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BsMembersList;
