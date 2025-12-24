import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io, { Socket } from 'socket.io-client';
import styles from '../styles/pollingOfficer.module.css';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';
import ConfirmDialog from '../components/ConfirmDialog';
import ToastContainer from '../components/ToastContainer';
import { getApiUrl, getBaseUrl } from '../config/environment';

interface User {
    _id: string;
    username: string;
    reg: string;
    phone: string;
    course: string;
    yos: string;
    ministry: string;
    et: string;
    email: string;
    hasVoted?: boolean;
}

interface Stats {
    totalUsers: number;
    totalVoted: number;
    totalNotVoted: number;
    percentageVoted: string;
}

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

interface ConfirmDialogState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'info' | 'warning' | 'danger' | 'success';
}

const PollingOfficerDashboard: React.FC = () => {
    const [unvotedUsers, setUnvotedUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalVoted: 0,
        totalNotVoted: 0,
        percentageVoted: '0'
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showRegisterForm, setShowRegisterForm] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [, setSocket] = useState<Socket | null>(null);
    const [yearFilter, setYearFilter] = useState<string>('all');
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        type: 'info'
    });
    const [officerName, setOfficerName] = useState<string>('');

    // Registration form state
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        reg: '',
        course: '',
        yos: '',
        ministry: '',
        et: ''
    });

    const backEndURL = getApiUrl('users').replace('/users/data', '/polling-officer');

    // Toast helper functions
    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // Dialog helper function
    const showConfirmDialog = (
        title: string,
        message: string,
        onConfirm: () => void,
        type: 'info' | 'warning' | 'danger' | 'success' = 'info'
    ) => {
        setConfirmDialog({
            isOpen: true,
            title,
            message,
            onConfirm,
            type
        });
    };

    const closeConfirmDialog = () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
    };

    const fetchOfficerProfile = async () => {
        try {
            const response = await axios.get(`${backEndURL}/profile`, { withCredentials: true });
            setOfficerName(response.data.fullName);
        } catch (err) {
            console.error('Error fetching officer profile:', err);
        }
    };

    useEffect(() => {
        fetchOfficerProfile();
        fetchUnvotedUsers();
        fetchStats();

        // Setup Socket.IO connection
        const newSocket = io(getBaseUrl(), {
            withCredentials: true
        });

        newSocket.on('connect', () => {
            console.log('Socket connected');
        });

        newSocket.on('userVoted', (data: { userId: string }) => {
            console.log('User voted event received:', data);
            setUnvotedUsers(prev => prev.filter(user => user._id !== data.userId));
        });

        newSocket.on('statsUpdate', (data: Stats) => {
            console.log('Stats update received:', data);
            setStats(data);
        });

        newSocket.on('newUserRegistered', (data: { user: User }) => {
            console.log('New user registered:', data);
            // User is already voted, so no need to add to unvoted list
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const fetchUnvotedUsers = async () => {
        try {
            const response = await axios.get(`${backEndURL}/unvoted-users`, { withCredentials: true });
            setUnvotedUsers(response.data);
        } catch (err: any) {
            console.error('Error fetching unvoted users:', err);
            setError(err.response?.data?.message || 'Failed to fetch unvoted users');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${backEndURL}/stats`, { withCredentials: true });
            setStats(response.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const handleMarkAsVoted = (userId: string, username?: string) => {
        const userName = username || unvotedUsers.find(u => u._id === userId)?.username || 'this user';

        showConfirmDialog(
            'Confirm Vote',
            `Are you sure you want to mark ${userName} as voted?`,
            async () => {
                closeConfirmDialog();
                try {
                    await axios.post(`${backEndURL}/mark-voted/${userId}`, {}, { withCredentials: true });

                    // Remove user from list immediately
                    setUnvotedUsers(prev => prev.filter(user => user._id !== userId));

                    // Update stats immediately
                    await fetchStats();

                    // Show success toast
                    showToast(`${userName} has been marked as voted successfully!`, 'success');
                } catch (err: any) {
                    const errorMessage = err.response?.data?.message || 'Failed to mark user as voted';
                    showToast(errorMessage, 'error');

                    // If user has already voted, refresh the unvoted users list
                    if (errorMessage.toLowerCase().includes('already voted')) {
                        await fetchUnvotedUsers();
                        await fetchStats();
                    }
                }
            },
            'success'
        );
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            const response = await axios.get(`${backEndURL}/search-user?query=${encodeURIComponent(searchQuery)}`, {
                withCredentials: true
            });
            setSearchResults(response.data);
        } catch (err) {
            console.error('Error searching users:', err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegisterAndVote = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username || !formData.email) {
            showToast('Name and email are required', 'warning');
            return;
        }

        const confirmMessage = `Register ${formData.username} and mark as voted?\n\nEmail: ${formData.email}\nPhone: ${formData.phone || 'N/A'}\nReg: ${formData.reg || 'N/A'}`;

        showConfirmDialog(
            'Register & Vote',
            confirmMessage,
            async () => {
                closeConfirmDialog();
                try {
                    await axios.post(`${backEndURL}/register-and-vote`, formData, { withCredentials: true });

                    // Update stats immediately
                    await fetchStats();

                    showToast(`${formData.username} has been registered and marked as voted successfully!`, 'success');

                    // Reset form
                    setFormData({
                        username: '',
                        email: '',
                        phone: '',
                        reg: '',
                        course: '',
                        yos: '',
                        ministry: '',
                        et: ''
                    });
                    setShowRegisterForm(false);
                } catch (err: any) {
                    showToast(err.response?.data?.message || 'Failed to register user', 'error');
                }
            },
            'info'
        );
    };

    // Filter users by year
    const filteredUsers = yearFilter === 'all'
        ? unvotedUsers
        : unvotedUsers.filter(user => user.yos === yearFilter);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className={styles.error}>{error}</p>;
    }

    return (
        <>
            <UniversalHeader />
            <ToastContainer toasts={toasts} onClose={removeToast} />
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={closeConfirmDialog}
                type={confirmDialog.type}
            />
            <div className={styles.container}>
                <div className={styles.welcomeSection}>
                    <h2>Polling Officer Dashboard</h2>
                    {officerName && <p className={styles.welcomeText}>Welcome, Officer {officerName}!</p>}
                </div>

                {/* Statistics Section */}
                <div className={styles.statsSection}>
                    <div className={styles.statCard}>
                        <h3>{stats.totalUsers}</h3>
                        <p>Total Users</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>{stats.totalVoted}</h3>
                        <p>Voted</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>{stats.totalNotVoted}</h3>
                        <p>Not Voted</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>{stats.percentageVoted}%</h3>
                        <p>Completion</p>
                    </div>
                </div>

                {/* Search Section */}
                <div className={styles.searchSection}>
                    <h4>Search Existing User</h4>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            placeholder="Search by name, reg, phone, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button onClick={handleSearch} className={styles.searchBtn}>Search</button>
                    </div>
                    {searchResults.length > 0 && (
                        <div className={styles.searchResults}>
                            <h5>Search Results:</h5>
                            {searchResults.map(user => (
                                <div key={user._id} className={styles.searchResultItem}>
                                    <span>{user.username} - {user.reg}</span>
                                    {!user.hasVoted && (
                                        <button
                                            onClick={() => handleMarkAsVoted(user._id, user.username)}
                                            className={styles.voteBtn}
                                        >
                                            Mark as Voted
                                        </button>
                                    )}
                                    {user.hasVoted && <span className={styles.votedBadge}>Already Voted</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Register New User Button */}
                <div className={styles.registerSection}>
                    <button
                        onClick={() => setShowRegisterForm(!showRegisterForm)}
                        className={styles.registerToggleBtn}
                    >
                        {showRegisterForm ? 'Hide Registration Form' : 'Register New User'}
                    </button>

                    {showRegisterForm && (
                        <form onSubmit={handleRegisterAndVote} className={styles.registerForm}>
                            <h4>Register New User & Mark as Voted</h4>
                            <div className={styles.formGrid}>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Full Name *"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email *"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="reg"
                                    placeholder="Registration Number"
                                    value={formData.reg}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="course"
                                    placeholder="Course"
                                    value={formData.course}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="yos"
                                    placeholder="Year of Study"
                                    value={formData.yos}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="ministry"
                                    placeholder="Ministry"
                                    value={formData.ministry}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="et"
                                    placeholder="ET"
                                    value={formData.et}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <button type="submit" className={styles.submitBtn}>
                                Register & Mark as Voted
                            </button>
                        </form>
                    )}
                </div>

                {/* Unvoted Users Table */}
                <div className={styles.tableSection}>
                    <div className={styles.tableHeader}>
                        <h4>Unvoted Users ({filteredUsers.length})</h4>
                        <div className={styles.filterSection}>
                            <label htmlFor="yearFilter">Filter by Year:</label>
                            <select
                                id="yearFilter"
                                value={yearFilter}
                                onChange={(e) => setYearFilter(e.target.value)}
                                className={styles.yearFilter}
                            >
                                <option value="all">All Years</option>
                                <option value="1">Year 1</option>
                                <option value="2">Year 2</option>
                                <option value="3">Year 3</option>
                                <option value="4">Year 4</option>
                                <option value="5">Year 5</option>
                            </select>
                        </div>
                    </div>
                    {filteredUsers.length === 0 ? (
                        <p className={styles.noUsers}>
                            {yearFilter === 'all' ? 'All users have voted!' : `No unvoted users in Year ${yearFilter}`}
                        </p>
                    ) : (
                        <table className={styles.userTable}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Reg</th>
                                    <th>Phone</th>
                                    <th>Course</th>
                                    <th>YOS</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.username}</td>
                                        <td>{user.reg}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.course}</td>
                                        <td>{user.yos}</td>
                                        <td>
                                            <button
                                                onClick={() => handleMarkAsVoted(user._id)}
                                                className={styles.voteBtn}
                                            >
                                                Vote
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PollingOfficerDashboard;
