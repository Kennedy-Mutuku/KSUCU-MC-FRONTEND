import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import styles from '../styles/superAdmin.module.css';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import { getApiUrl } from '../config/environment';
import letterhead from '../assets/letterhead.png';
import DocumentUploader from '../components/DocumentUploader';

interface Message {
    _id: string;
    subject: string;
    message: string;
    category: string;
    isAnonymous: boolean;
    senderInfo?: {
        username?: string;
        email?: string;
        ministry?: string;
        yos?: number;
    };
    timestamp: string;
    isRead: boolean;
    status: string;
}

interface PollingStats {
    totalUsers: number;
    totalVoted: number;
    totalNotVoted: number;
    percentageVoted: string;
}

interface PollingOfficer {
    _id: string;
    fullName: string;
    email: string;
    status: string;
    votedCount?: number;
    registeredCount?: number;
}

const SuperAdmin: React.FC = () => {
    const [userCount, setUserCount] = useState<number>(0);
    const [usersByYos, setUsersByYos] = useState<{ [key: string]: number }>({});
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [usersByMinistry, setUsersByMinistry] = useState<{ [key: string]: number }>({});
    const [usersByEt, setUsersByEt] = useState<{ [key: string]: number }>({});
    const [users, setUsers] = useState<{ username: string; reg: string; course: string; yos: string }[]>([]);
    const [pollingStats, setPollingStats] = useState<PollingStats | null>(null);
    const [pollingOfficers, setPollingOfficers] = useState<PollingOfficer[]>([]);
    const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
    const [isResetting, setIsResetting] = useState<boolean>(false);
    const [selectedUserForDocUpload, setSelectedUserForDocUpload] = useState<{ _id: string; username: string } | null>(null);
    const [showDocUploadModal, setShowDocUploadModal] = useState<boolean>(false);


    // Use dynamic API URL based on environment
    const backEndURL = getApiUrl('superAdmin').replace('/login', '');

    useEffect(() => {
        fetchUserData();
        fetchMessages();
        fetchPollingStats();
        fetchPollingOfficers();
    }, []);

    // const fetchUserData = async () => {
    //     try {
    //         const response = await axios.get(`${backEndURL}/users`, { withCredentials: true });
    //         const users = response.data;
    //         console.log(response.data);
            
    //         setUserCount(users.length);
            
    //         const groupedUsers: { [key: string]: number } = {};

    //         users.forEach((user: { yos: string }) => {
    //             groupedUsers[user.yos] = (groupedUsers[user.yos] || 0) + 1;
    //         });
    //         setUsersByYos(groupedUsers);
    //     } catch (err) {
    //         console.error('Error fetching user data:', err);
    //         setError('Failed to fetch user data');
    //     }
    // };

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${backEndURL}/users`, { withCredentials: true });
            const users = response.data;
            console.log(response.data);
            
            setUserCount(users.length);
            setUsers(users); // Store users for the table
    
            // Categorizing users by yos, ministry, and et
            const groupedByYos: { [key: string]: number } = {};
            const groupedByMinistry: { [key: string]: number } = {};
            const groupedByEt: { [key: string]: number } = {};
    
            users.forEach((user: { yos: string, ministry: string, et: string }) => {
                groupedByYos[user.yos] = (groupedByYos[user.yos] || 0) + 1;
                groupedByMinistry[user.ministry] = (groupedByMinistry[user.ministry] || 0) + 1;
                groupedByEt[user.et] = (groupedByEt[user.et] || 0) + 1;
            });
    
            setUsersByYos(groupedByYos);
            setUsersByMinistry(groupedByMinistry);
            setUsersByEt(groupedByEt);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError('Failed to fetch user data');
        }
    };
    
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${backEndURL}/messages`, { withCredentials: true });
            const messages = response.data;
            console.log('Messages fetched:', messages);

            setMessages(messages);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError('Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    const fetchPollingStats = async () => {
        try {
            const pollingURL = backEndURL.replace('/sadmin', '/polling-officer');
            const response = await axios.get(`${pollingURL}/stats`, { withCredentials: true });
            setPollingStats(response.data);
        } catch (err) {
            console.error('Error fetching polling stats:', err);
        }
    };

    const fetchPollingOfficers = async () => {
        try {
            const pollingURL = backEndURL.replace('/sadmin', '/polling-officer');
            const response = await axios.get(`${pollingURL}/list`, { withCredentials: true });
            setPollingOfficers(response.data);
        } catch (err) {
            console.error('Error fetching polling officers:', err);
        }
    };

    const handleResetPolling = async () => {
        setIsResetting(true);
        try {
            const response = await axios.post(`${backEndURL}/reset-polling`, {}, { withCredentials: true });
            alert(`Success! ${response.data.message}\n${response.data.usersAffected} users' voting status has been reset.`);

            // Refresh polling stats
            await fetchPollingStats();
            setShowResetConfirm(false);
        } catch (err: any) {
            console.error('Error resetting polling data:', err);
            alert(`Error resetting polling data: ${err.response?.data?.message || 'Unknown error'}`);
        } finally {
            setIsResetting(false);
        }
    };

    const handleExportPdfByYos = () => {
        try {
            // Group students by Year of Study
            const studentsByYos: { [key: string]: any[] } = {};

            users.forEach(user => {
                const yos = user.yos || 'Unknown';
                if (!studentsByYos[yos]) {
                    studentsByYos[yos] = [];
                }
                studentsByYos[yos].push(user);
            });

            // Sort YOS keys
            const sortedYosKeys = Object.keys(studentsByYos).sort((a, b) => {
                if (a === 'Unknown') return 1;
                if (b === 'Unknown') return -1;
                return parseInt(a) - parseInt(b);
            });

            // Generate a separate PDF for each Year of Study
            sortedYosKeys.forEach(yos => {
                const studentsInYos = studentsByYos[yos];

                // Sort students alphabetically by name
                const sortedStudents = [...studentsInYos].sort((a, b) =>
                    (a.username || '').localeCompare(b.username || '')
                );

                const doc = new jsPDF('landscape');
                const pageHeight = doc.internal.pageSize.height;
                let yOffset = 45;

                // Add letterhead to first page (adjusted for landscape)
                doc.addImage(letterhead, 'PNG', 10, 10, 270, 35);
                yOffset += 5;

                // Document title
                const title = `KSUCU Student List - Year ${yos}`;
                const dateText = `Generated: ${new Date().toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}`;
                const timeText = `Time: ${new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                })}`;

                // Title formatting
                doc.setTextColor(128, 0, 128); // Purple color
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text(title, doc.internal.pageSize.width / 2, yOffset, { align: "center" });

                // Stats
                yOffset += 10;
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.setFont('helvetica', 'normal');
                const stats = `Total Students: ${sortedStudents.length}`;
                doc.text(stats, doc.internal.pageSize.width / 2, yOffset, { align: "center" });

                // Date and time
                yOffset += 8;
                doc.setFontSize(10);
                doc.text(dateText, 15, yOffset);
                doc.text(timeText, doc.internal.pageSize.width - 15, yOffset, { align: "right" });
                yOffset += 15;

                // Prepare table data
                const tableData = sortedStudents.map((student, index) => [
                    (index + 1).toString(),
                    student.username || 'N/A',
                    student.reg || 'N/A',
                    student.course || 'N/A',
                    student.yos || 'N/A',
                    student.email || 'N/A',
                    student.phone || 'N/A'
                ]);

                // Table options with compact design for 20+ students per page
                const tableOptions = {
                    head: [['#', 'Name', 'Registration No.', 'Course', 'Year of Study', 'Email', 'Phone']],
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
                        fontSize: 8,
                        cellPadding: 1.5,
                        lineWidth: 0.1,
                        lineColor: [200, 200, 200]
                    },
                    alternateRowStyles: {
                        fillColor: [248, 249, 250]
                    },
                    columnStyles: {
                        0: { cellWidth: 12, halign: 'center' }, // #
                        1: { cellWidth: 45 }, // Name
                        2: { cellWidth: 35 }, // Reg
                        3: { cellWidth: 75 }, // Course
                        4: { cellWidth: 18, halign: 'center' }, // YOS
                        5: { cellWidth: 55 }, // Email
                        6: { cellWidth: 30 } // Phone
                    },
                    margin: { left: 10, right: 10 },
                    didDrawPage: function(data: any) {
                        // Add letterhead to new pages (adjusted for landscape)
                        if (data.pageNumber > 1) {
                            doc.addImage(letterhead, 'PNG', 10, 10, 270, 35);
                        }
                    }
                };

                // Add table to PDF
                doc.autoTable(tableOptions);

                // Add footer with page numbers
                const pageCount = doc.getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    doc.setFontSize(8);
                    doc.setTextColor(100, 100, 100);
                    doc.text('Generated by KSUCU-MC Administration System', 15, pageHeight - 10);
                    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 15, pageHeight - 10, { align: 'right' });
                }

                // Save PDF
                const fileName = `KSUCU_Students_Year_${yos}_${new Date().toISOString().split('T')[0]}.pdf`;
                doc.save(fileName);
            });

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    if (loading) {
        return <p>Loading ......</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
                  <UniversalHeader />
            <div className={styles.container}>
                <h4>Total Students: {userCount}</h4>

                {/* Polling Statistics Section */}
                {pollingStats && (
                    <>
                        <div className={styles.pollingHeader}>
                            <h5>Polling/Voting Statistics</h5>
                            <button
                                className={styles.resetButton}
                                onClick={() => setShowResetConfirm(true)}
                                title="Reset all polling data for a new election"
                            >
                                Reset Polling Data
                            </button>
                        </div>
                        <div className={styles.pollingStatsContainer}>
                            <div className={styles.statCard}>
                                <h3>{pollingStats.totalVoted}</h3>
                                <p>Voted</p>
                            </div>
                            <div className={styles.statCard}>
                                <h3>{pollingStats.totalNotVoted}</h3>
                                <p>Not Voted</p>
                            </div>
                            <div className={styles.statCard}>
                                <h3>{pollingStats.percentageVoted}%</h3>
                                <p>Completion</p>
                            </div>
                        </div>

                        <h5>Polling Officers</h5>
                        <div className={styles.pollingOfficersSection}>
                            <a href="/polling-officer-management" className={styles.manageLink}>
                                Manage Polling Officers
                            </a>
                            {pollingOfficers.length > 0 ? (
                                <table className={styles.officersTable}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Status</th>
                                            <th>Registered</th>
                                            <th>Voted</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pollingOfficers.map(officer => (
                                            <tr key={officer._id}>
                                                <td>{officer.fullName}</td>
                                                <td>{officer.email}</td>
                                                <td>
                                                    <span className={`${styles.statusBadge} ${styles[officer.status]}`}>
                                                        {officer.status}
                                                    </span>
                                                </td>
                                                <td>{officer.registeredCount || 0}</td>
                                                <td>{officer.votedCount || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No polling officers yet. <a href="/polling-officer-management">Create one</a></p>
                            )}
                        </div>
                    </>
                )}

                <h5>Category by Year of Study:</h5>
                <ul>
                    {Object.entries(usersByYos).map(([yos, count]) => (
                        <li key={yos}>YOS {yos} - {count} students</li>
                    ))}
                </ul>

                <h5>Category by Ministry:</h5>
                <ul>
                    {Object.entries(usersByMinistry).map(([ministry, count]) => (
                        <li key={ministry}>{ministry} - {count} students</li>
                    ))}
                </ul>

                <h5>Category by ET:</h5>
                <ul>
                    {Object.entries(usersByEt).map(([et, count]) => (
                        <li key={et}>{et} - {count} students</li>
                    ))}
                </ul>


                <h5>Messages & Feedback</h5>

                <div className={styles.categoryFilter}>
                    <label htmlFor="categorySelect">Filter by Category: </label>
                    <select
                        id="categorySelect"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={styles.categoryDropdown}
                    >
                        <option value="all">All Categories</option>
                        <option value="feedback">Feedback</option>
                        <option value="suggestion">Suggestion</option>
                        <option value="complaint">Complaint</option>
                        <option value="praise">Praise</option>
                        <option value="prayer">Prayer</option>
                        <option value="technical">Technical</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className={styles.feedbackSection}>
                    {messages.length === 0 ? (
                        <p>No messages yet.</p>
                    ) : (
                        <div className={styles.messagesContainer}>
                            {messages
                                .filter(msg => selectedCategory === 'all' || msg.category === selectedCategory)
                                .map((msg) => (
                                <div key={msg._id} className={styles.messageCard}>
                                    <div className={styles.messageHeader}>
                                        <span className={styles.category}>{msg.category}</span>
                                        <span className={styles.timestamp}>
                                            {new Date(msg.timestamp).toLocaleDateString()} {new Date(msg.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <h6 className={styles.subject}>{msg.subject}</h6>
                                    <p className={styles.messageContent}>{msg.message}</p>
                                    <div className={styles.messageFooter}>
                                        {msg.isAnonymous ? (
                                            <span className={styles.anonymous}>Anonymous</span>
                                        ) : (
                                            <span className={styles.sender}>
                                                From: {msg.senderInfo?.username || 'Unknown'}
                                                {msg.senderInfo?.email && ` (${msg.senderInfo.email})`}
                                                {msg.senderInfo?.ministry && ` - ${msg.senderInfo.ministry}`}
                                                {msg.senderInfo?.yos && ` - YOS ${msg.senderInfo.yos}`}
                                            </span>
                                        )}
                                        <span className={styles.status}>{msg.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.studentListHeader}>
                    <h5>List of all Students</h5>
                    <button
                        className={styles.downloadPdfButton}
                        onClick={handleExportPdfByYos}
                        title="Download student data as PDF (separated by Year of Study)"
                    >
                        Download as PDF
                    </button>
                </div>
                <table className={styles.studentTable}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Reg</th>
                            <th>Course</th>
                            <th>Year of Study (YOS)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.username}</td>
                                <td>{user.reg}</td>
                                <td>{user.course}</td>
                                <td>{user.yos}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            setSelectedUserForDocUpload({
                                                _id: user.reg,
                                                username: user.username
                                            });
                                            setShowDocUploadModal(true);
                                        }}
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#00c6ff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0099cc';
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#00c6ff';
                                        }}
                                    >
                                        Upload Document
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Confirmation Dialog */}
                {showResetConfirm && (
                    <div className={styles.confirmOverlay}>
                        <div className={styles.confirmDialog}>
                            <h3>Reset Polling Data?</h3>
                            <p>
                                This will reset all voting records back to zero. All users will be marked as "not voted".
                                This action is meant for starting a new election period.
                            </p>
                            <p className={styles.warningText}>
                                <strong>Warning:</strong> This action cannot be undone!
                            </p>
                            <div className={styles.confirmButtons}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setShowResetConfirm(false)}
                                    disabled={isResetting}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.confirmButton}
                                    onClick={handleResetPolling}
                                    disabled={isResetting}
                                >
                                    {isResetting ? 'Resetting...' : 'Yes, Reset Polling Data'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Document Upload Modal */}
                {showDocUploadModal && selectedUserForDocUpload && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                        <DocumentUploader
                            userId={selectedUserForDocUpload._id}
                            userName={selectedUserForDocUpload.username}
                            onClose={() => {
                                setShowDocUploadModal(false);
                                setSelectedUserForDocUpload(null);
                            }}
                            onUploadSuccess={() => {
                                setShowDocUploadModal(false);
                                setSelectedUserForDocUpload(null);
                            }}
                        />
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default SuperAdmin;

