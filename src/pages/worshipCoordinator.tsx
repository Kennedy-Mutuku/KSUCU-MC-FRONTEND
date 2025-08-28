import React, { useState, useEffect } from 'react';
import styles from '../styles/worshipCoordinator.module.css';
import Header from '../components/header';
import Footer from '../components/footer';

interface Member {
  id: string;
  name: string;
  ministry: string;
  phoneNumber: string;
  email: string;
  joinDate: string;
}

interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  ministry: string;
  date: string;
  present: boolean;
  eventType: 'rehearsal' | 'service' | 'meeting';
}

const WorshipCoordinator: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEventType, setSelectedEventType] = useState<'rehearsal' | 'service' | 'meeting'>('rehearsal');
  const [selectedMinistry, setSelectedMinistry] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'attendance' | 'members' | 'reports'>('attendance');

  const ministries = ['Praise and Worship', 'Choir', 'Wananzambe'];

  useEffect(() => {
    // Load mock data - replace with API calls
    const mockMembers: Member[] = [
      { id: '1', name: 'John Doe', ministry: 'Praise and Worship', phoneNumber: '+254712345678', email: 'john@example.com', joinDate: '2024-01-15' },
      { id: '2', name: 'Jane Smith', ministry: 'Choir', phoneNumber: '+254723456789', email: 'jane@example.com', joinDate: '2024-02-20' },
      { id: '3', name: 'Mike Johnson', ministry: 'Wananzambe', phoneNumber: '+254734567890', email: 'mike@example.com', joinDate: '2024-01-10' },
      { id: '4', name: 'Sarah Wilson', ministry: 'Praise and Worship', phoneNumber: '+254745678901', email: 'sarah@example.com', joinDate: '2024-03-05' },
    ];
    
    setMembers(mockMembers);
    
    // Initialize attendance records for today
    const todayAttendance: AttendanceRecord[] = mockMembers.map(member => ({
      id: `${member.id}-${selectedDate}-${selectedEventType}`,
      memberId: member.id,
      memberName: member.name,
      ministry: member.ministry,
      date: selectedDate,
      present: false,
      eventType: selectedEventType
    }));
    
    setAttendanceRecords(todayAttendance);
  }, []);

  const filteredMembers = selectedMinistry === 'all' 
    ? members 
    : members.filter(member => member.ministry === selectedMinistry);

  const todayAttendance = attendanceRecords.filter(record => 
    record.date === selectedDate && 
    record.eventType === selectedEventType &&
    (selectedMinistry === 'all' || record.ministry === selectedMinistry)
  );

  const toggleAttendance = (memberId: string) => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.memberId === memberId && record.date === selectedDate && record.eventType === selectedEventType
          ? { ...record, present: !record.present }
          : record
      )
    );
  };

  const saveAttendance = () => {
    // In a real app, save to backend
    alert('Attendance saved successfully!');
  };

  const getAttendanceStats = () => {
    const total = todayAttendance.length;
    const present = todayAttendance.filter(record => record.present).length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { total, present, absent, percentage };
  };

  const stats = getAttendanceStats();

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Worship Coordinator Dashboard</h1>
        
        <nav className={styles.tabNav}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'attendance' ? styles.active : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance Tracking
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'members' ? styles.active : ''}`}
            onClick={() => setActiveTab('members')}
          >
            Member Management
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'reports' ? styles.active : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </nav>

        {activeTab === 'attendance' && (
          <div className={styles.attendanceSection}>
            <div className={styles.controlsPanel}>
              <div className={styles.dateControl}>
                <label>Date:</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              
              <div className={styles.eventControl}>
                <label>Event Type:</label>
                <select 
                  value={selectedEventType}
                  onChange={(e) => setSelectedEventType(e.target.value as 'rehearsal' | 'service' | 'meeting')}
                >
                  <option value="rehearsal">Rehearsal</option>
                  <option value="service">Service</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>
              
              <div className={styles.ministryControl}>
                <label>Ministry:</label>
                <select 
                  value={selectedMinistry}
                  onChange={(e) => setSelectedMinistry(e.target.value)}
                >
                  <option value="all">All Ministries</option>
                  {ministries.map(ministry => (
                    <option key={ministry} value={ministry}>{ministry}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.statsPanel}>
              <div className={styles.statCard}>
                <h3>Total Members</h3>
                <p className={styles.statNumber}>{stats.total}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Present</h3>
                <p className={styles.statNumber}>{stats.present}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Absent</h3>
                <p className={styles.statNumber}>{stats.absent}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Attendance Rate</h3>
                <p className={styles.statNumber}>{stats.percentage}%</p>
              </div>
            </div>

            <div className={styles.attendanceList}>
              <h3>Mark Attendance</h3>
              {todayAttendance.length === 0 ? (
                <p className={styles.noData}>No members found for the selected criteria.</p>
              ) : (
                <>
                  {todayAttendance.map(record => (
                    <div key={record.id} className={styles.attendanceItem}>
                      <div className={styles.memberInfo}>
                        <h4>{record.memberName}</h4>
                        <p>{record.ministry}</p>
                      </div>
                      <label className={styles.attendanceToggle}>
                        <input 
                          type="checkbox"
                          checked={record.present}
                          onChange={() => toggleAttendance(record.memberId)}
                        />
                        <span className={styles.toggleSlider}></span>
                        {record.present ? 'Present' : 'Absent'}
                      </label>
                    </div>
                  ))}
                  <button className={styles.saveButton} onClick={saveAttendance}>
                    Save Attendance
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className={styles.membersSection}>
            <div className={styles.membersHeader}>
              <h3>Ministry Members</h3>
              <button className={styles.addButton}>Add New Member</button>
            </div>
            
            <div className={styles.membersList}>
              {filteredMembers.map(member => (
                <div key={member.id} className={styles.memberCard}>
                  <h4>{member.name}</h4>
                  <p><strong>Ministry:</strong> {member.ministry}</p>
                  <p><strong>Phone:</strong> {member.phoneNumber}</p>
                  <p><strong>Email:</strong> {member.email}</p>
                  <p><strong>Joined:</strong> {new Date(member.joinDate).toLocaleDateString()}</p>
                  <div className={styles.memberActions}>
                    <button className={styles.editButton}>Edit</button>
                    <button className={styles.removeButton}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className={styles.reportsSection}>
            <h3>Attendance Reports</h3>
            <p className={styles.comingSoon}>Advanced reporting features coming soon...</p>
            <div className={styles.reportOptions}>
              <button className={styles.reportButton}>Weekly Report</button>
              <button className={styles.reportButton}>Monthly Report</button>
              <button className={styles.reportButton}>Member History</button>
              <button className={styles.reportButton}>Export to Excel</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default WorshipCoordinator;