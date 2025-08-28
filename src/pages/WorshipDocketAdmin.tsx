import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import styles from '../styles/worshipDocketAdmin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUsers, 
    faLock, 
    faUnlock,
    faCheckCircle,
    faDownload,
    faList,
    faCalendar,
    faFileAlt
} from '@fortawesome/free-solid-svg-icons';
import { AttendanceSubmission } from '../components/AttendanceForm';

const WorshipDocketAdmin: React.FC = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [message, setMessage] = useState('');
    
    // Ministry selection and attendance management
    const [selectedMinistry, setSelectedMinistry] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [localAttendance, setLocalAttendance] = useState<AttendanceSubmission[]>([]);

    useEffect(() => {
        if (authenticated) {
            loadLocalAttendance();
        }
    }, [authenticated]);

    // Load local attendance data from localStorage
    const loadLocalAttendance = () => {
        const storedAttendance = localStorage.getItem('ministryAttendance');
        if (storedAttendance) {
            setLocalAttendance(JSON.parse(storedAttendance));
        }
    };

    // Get filtered attendance records
    const getFilteredAttendance = () => {
        if (!selectedMinistry) return [];
        
        return localAttendance.filter(record => {
            const recordDate = new Date(record.timestamp).toISOString().split('T')[0];
            return record.ministry === selectedMinistry && recordDate === selectedDate;
        }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    };

    // Generate PDF for attendance records
    const generatePDF = () => {
        const records = getFilteredAttendance();

        if (records.length === 0) {
            setMessage('No attendance records found for this ministry on the selected date');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        // Create PDF content with proper letterhead and formatting
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>KSUCU - ${selectedMinistry} Attendance</title>
                <style>
                    @page {
                        size: A4;
                        margin: 20mm;
                    }
                    body { 
                        font-family: 'Times New Roman', serif; 
                        margin: 0;
                        padding: 0;
                    }
                    .letterhead {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 3px double #730051;
                        padding-bottom: 20px;
                    }
                    .logo-section {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 20px;
                        margin-bottom: 15px;
                    }
                    .ksu-title {
                        color: #730051;
                        font-size: 28px;
                        font-weight: bold;
                        letter-spacing: 1px;
                        margin: 0;
                    }
                    .subtitle {
                        color: #730051;
                        font-size: 20px;
                        margin: 5px 0;
                        font-weight: 600;
                    }
                    .ministry-title {
                        font-size: 22px;
                        color: #730051;
                        margin: 15px 0;
                        text-decoration: underline;
                        font-weight: bold;
                    }
                    .date {
                        color: #333;
                        font-size: 16px;
                        margin-top: 10px;
                        font-weight: 500;
                    }
                    .attendance-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .attendance-table th {
                        background-color: #730051;
                        color: white;
                        padding: 12px;
                        text-align: left;
                        font-weight: bold;
                        border: 1px solid #730051;
                    }
                    .attendance-table td {
                        padding: 10px 12px;
                        border: 1px solid #ddd;
                        text-align: left;
                    }
                    .attendance-table tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    .attendance-table .number-col {
                        width: 50px;
                        text-align: center;
                        font-weight: bold;
                    }
                    .attendance-table .name-col {
                        width: 30%;
                    }
                    .attendance-table .reg-col {
                        width: 20%;
                    }
                    .attendance-table .year-col {
                        width: 15%;
                    }
                    .attendance-table .time-col {
                        width: 20%;
                    }
                    .attendance-table .signature-col,
                    .attendance-table .remarks-col {
                        width: 15%;
                        border: 1px solid #ddd;
                    }
                    .total-section {
                        margin-top: 30px;
                        padding: 15px;
                        background: #f0f0f0;
                        border-radius: 5px;
                        font-weight: bold;
                        font-size: 18px;
                    }
                    .footer {
                        margin-top: 50px;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                        text-align: center;
                        color: #666;
                        font-size: 12px;
                    }
                    .officials-section {
                        margin-top: 40px;
                        display: flex;
                        justify-content: space-between;
                        padding: 20px 0;
                    }
                    .official-signature {
                        text-align: center;
                        width: 30%;
                    }
                    .signature-line {
                        border-bottom: 1px solid #333;
                        margin: 40px 0 5px 0;
                    }
                    @media print {
                        body { margin: 0; }
                        .attendance-table { page-break-inside: auto; }
                        .attendance-table tr { page-break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <div class="letterhead">
                    <h1 class="ksu-title">KISII UNIVERSITY CHRISTIAN UNION</h1>
                    <div class="subtitle">KSUCU-MC</div>
                    <div class="ministry-title">${selectedMinistry.toUpperCase()} MINISTRY</div>
                    <div class="date">Date: ${new Date(selectedDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</div>
                </div>
                
                <table class="attendance-table">
                    <thead>
                        <tr>
                            <th class="number-col">No.</th>
                            <th class="name-col">Name</th>
                            <th class="reg-col">Registration Number</th>
                            <th class="year-col">Year of Study</th>
                            <th class="time-col">Time Signed</th>
                            <th class="signature-col">Signature</th>
                            <th class="remarks-col">Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${records.map((record, index) => `
                            <tr>
                                <td class="number-col">${index + 1}</td>
                                <td class="name-col">${record.name}</td>
                                <td class="reg-col">${record.regNo}</td>
                                <td class="year-col">Year ${record.year}</td>
                                <td class="time-col">${new Date(record.timestamp).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</td>
                                <td class="signature-col"></td>
                                <td class="remarks-col"></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="total-section">
                    Total Attendance: ${records.length} members
                </div>
                
                <div class="officials-section">
                    <div class="official-signature">
                        <div class="signature-line"></div>
                        <div>Ministry Leader</div>
                    </div>
                    <div class="official-signature">
                        <div class="signature-line"></div>
                        <div>Secretary</div>
                    </div>
                    <div class="official-signature">
                        <div class="signature-line"></div>
                        <div>Chairperson</div>
                    </div>
                </div>
                
                <div class="footer">
                    Generated on ${new Date().toLocaleString()} | KSUCU-MC Ministries Administration System
                </div>
            </body>
            </html>
        `;

        // Create and download PDF
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `KSUCU_${selectedMinistry.replace(/\s+/g, '_')}_Attendance_${selectedDate}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setMessage(`Downloaded attendance list for ${selectedMinistry} ministry (${records.length} attendees)`);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleLogin = () => {
        if (password === 'Overseer') {
            setAuthenticated(true);
            setAuthError('');
            setMessage('Successfully logged in to Ministries Admin');
            setTimeout(() => setMessage(''), 3000);
        } else {
            setAuthError('Invalid password');
            setTimeout(() => setAuthError(''), 3000);
        }
        setPassword('');
    };

    const ministries = [
        'Praise and Worship', 
        'Choir', 
        'Wananzambe', 
        'Ushering', 
        'Creativity', 
        'Compassion', 
        'Intercessory', 
        'High School', 
        'Church School'
    ];

    if (!authenticated) {
        return (
            <>
                <Header />
                <div className={styles.container}>
                    <div className={styles.loginCard}>
                        <FontAwesomeIcon icon={faLock} className={styles.lockIcon} />
                        <h2>Ministries Admin</h2>
                        <p>Enter admin password to access ministries management</p>
                        
                        {authError && (
                            <div className={styles.error}>
                                {authError}
                            </div>
                        )}
                        
                        <div className={styles.loginForm}>
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                                className={styles.passwordInput}
                            />
                            <button onClick={handleLogin} className={styles.loginButton}>
                                <FontAwesomeIcon icon={faUnlock} />
                                Login
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const attendanceRecords = getFilteredAttendance();

    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.adminHeader}>
                    <h1>
                        <FontAwesomeIcon icon={faUsers} />
                        Ministries Administration
                    </h1>
                    <p>Manage ministries attendance records</p>
                </div>

                {message && (
                    <div className={styles.message}>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        {message}
                    </div>
                )}

                {/* Ministry Selection Section */}
                <div className={styles.ministrySelectionSection}>
                    <div className={styles.selectionCard}>
                        <h2>
                            <FontAwesomeIcon icon={faList} />
                            Select Ministry
                        </h2>
                        
                        <div className={styles.selectionControls}>
                            <div className={styles.controlGroup}>
                                <label htmlFor="ministrySelect">Choose Ministry:</label>
                                <select
                                    id="ministrySelect"
                                    value={selectedMinistry}
                                    onChange={(e) => setSelectedMinistry(e.target.value)}
                                    className={styles.ministrySelect}
                                >
                                    <option value="">-- Select a Ministry --</option>
                                    {ministries.map(ministry => (
                                        <option key={ministry} value={ministry}>
                                            {ministry}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.controlGroup}>
                                <label htmlFor="dateSelect">
                                    <FontAwesomeIcon icon={faCalendar} /> Date:
                                </label>
                                <input
                                    type="date"
                                    id="dateSelect"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className={styles.dateInput}
                                />
                            </div>

                            <button
                                onClick={loadLocalAttendance}
                                className={styles.refreshButton}
                            >
                                <FontAwesomeIcon icon={faCheckCircle} />
                                Refresh Data
                            </button>
                        </div>
                    </div>
                </div>

                {/* Attendance List Section */}
                {selectedMinistry && (
                    <div className={styles.attendanceSection}>
                        <div className={styles.attendanceHeader}>
                            <h2>
                                <FontAwesomeIcon icon={faFileAlt} />
                                {selectedMinistry} Ministry Attendance
                            </h2>
                            <div className={styles.attendanceInfo}>
                                <span className={styles.dateDisplay}>
                                    {new Date(selectedDate).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                                <span className={styles.countBadge}>
                                    {attendanceRecords.length} Members Present
                                </span>
                            </div>
                        </div>

                        {attendanceRecords.length > 0 ? (
                            <>
                                <div className={styles.downloadSection}>
                                    <button
                                        onClick={generatePDF}
                                        className={styles.downloadPdfButton}
                                    >
                                        <FontAwesomeIcon icon={faDownload} />
                                        Download PDF List
                                    </button>
                                </div>

                                <div className={styles.attendanceList}>
                                    <table className={styles.attendanceTable}>
                                        <thead>
                                            <tr>
                                                <th>No.</th>
                                                <th>Name</th>
                                                <th>Registration Number</th>
                                                <th>Year</th>
                                                <th>Time Signed</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attendanceRecords.map((record, index) => (
                                                <tr key={record.id}>
                                                    <td className={styles.numberCell}>{index + 1}</td>
                                                    <td className={styles.nameCell}>{record.name}</td>
                                                    <td className={styles.regCell}>{record.regNo}</td>
                                                    <td className={styles.yearCell}>Year {record.year}</td>
                                                    <td className={styles.timeCell}>
                                                        {new Date(record.timestamp).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div className={styles.noAttendance}>
                                <FontAwesomeIcon icon={faUsers} />
                                <p>No attendance records found</p>
                                <small>
                                    {selectedMinistry ? 
                                        `No members have signed attendance for ${selectedMinistry} ministry on ${new Date(selectedDate).toLocaleDateString()}` :
                                        'Please select a ministry to view attendance records'
                                    }
                                </small>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default WorshipDocketAdmin;