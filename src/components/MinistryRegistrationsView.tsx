import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axios';
import styles from '../styles/overseerDashboard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faClock, faInfoCircle, faSearch, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'react-router-dom';

interface MinistryRegistration {
    _id: string;
    fullName: string;
    registrationNumber: string;
    phoneNumber: string;
    gender: string;
    yearOfStudy: string;
    course: string;
    ministry: string;
    reasonForJoining: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
}

const statusConfig: Record<string, { icon: any; class: string; label: string }> = {
    pending: { icon: faClock, class: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
    approved: { icon: faCheckCircle, class: 'bg-green-100 text-green-700', label: 'Approved' },
    rejected: { icon: faTimesCircle, class: 'bg-red-100 text-red-700', label: 'Rejected' }
};

interface MinistryRegistrationsViewProps {
    ministryName?: string;
    role?: string;
}

const MinistryRegistrationsView: React.FC<MinistryRegistrationsViewProps> = ({ ministryName, role }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [registrations, setRegistrations] = useState<MinistryRegistration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const filter = searchParams.get('filter') || 'all';
    const searchTerm = searchParams.get('search') || '';
    const [selectedRegistration, setSelectedRegistration] = useState<MinistryRegistration | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [actionMessage, setActionMessage] = useState('');

    const setFilter = (newFilter: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('filter', newFilter);
        setSearchParams(params);
    };

    const setSearchTerm = (newSearch: string) => {
        const params = new URLSearchParams(searchParams);
        if (newSearch) params.set('search', newSearch);
        else params.delete('search');
        setSearchParams(params);
    };


    useEffect(() => {
        fetchRegistrations();
    }, [ministryName, role]);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            let endpoint = '/api/ministry-registration/all';
            if (role) {
                endpoint = `/api/ministry-registration/by-role/${encodeURIComponent(role)}`;
            } else if (ministryName) {
                endpoint = `/api/ministry-registration/${encodeURIComponent(ministryName)}`;
            }
            const response = await axiosInstance.get(endpoint);
            setRegistrations(response.data || []);
            setError('');
        } catch (err: any) {
            console.error('Error fetching registrations:', err);
            setError(err.response?.data?.error || 'Failed to fetch registrations');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        const actionId = id + '_' + action;
        setActionLoading(actionId);
        try {
            await axiosInstance.patch(`/api/ministry-registration/${id}/${action}`);
            setRegistrations(prev => prev.map(r => r._id === id ? { ...r, status: action === 'approve' ? 'approved' : 'rejected' } : r));
            if (selectedRegistration?._id === id) {
                setSelectedRegistration(prev => prev ? { ...prev, status: action === 'approve' ? 'approved' : 'rejected' } : null);
            }
            setActionMessage(`Registration ${action}d successfully.`);
        } catch (err: any) {
            setActionMessage(err.response?.data?.error || `Failed to ${action} registration.`);
        } finally {
            setActionLoading(null);
            setTimeout(() => setActionMessage(''), 3000);
        }
    };

    const filtered = registrations.filter(reg => {
        const statusMatch = filter === 'all' || reg.status === filter;
        const searchMatch = reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.ministry.toLowerCase().includes(searchTerm.toLowerCase());
        return statusMatch && searchMatch;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short'
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={styles.sectionHeader}>
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">Ministry Join Requests</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {role ? `${role} Oversight` : 'Manage student applications to join ministries'}
                    </p>
                </div>
            </div>

            {actionMessage && (
                <div className={`p-4 rounded-lg mb-6 border animate-in slide-in-from-top-2 bg-blue-50 border-blue-100 text-blue-700`}>
                    {actionMessage}
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex gap-2 flex-wrap">
                    {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === f
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filter === f ? 'bg-white/20' : 'bg-gray-100'}`}>
                                {registrations.filter(r => f === 'all' || r.status === f).length}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search requests..."
                        className="w-full pl-10 pr-4 py-2 border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">{error}</div>}

            <div className={styles.tableWrapper}>
                <table className={styles.modernTable}>
                    <thead>
                        <tr>
                            <th>Student Information</th>
                            <th>Education</th>
                            <th>Target Ministry</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((reg) => {
                            const config = statusConfig[reg.status] || statusConfig.pending;
                            return (
                                <tr key={reg._id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                                                {reg.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 m-0">{reg.fullName}</p>
                                                <p className="text-xs text-gray-500 m-0">{reg.registrationNumber}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-sm">
                                            <p className="font-semibold text-gray-700 m-0">{reg.course}</p>
                                            <p className="text-xs text-gray-500 m-0">Year {reg.yearOfStudy}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold border border-gray-200">
                                            {reg.ministry}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-2 ${config.class}`}>
                                            <FontAwesomeIcon icon={config.icon} className="text-[10px]" />
                                            {config.label}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedRegistration(reg)}
                                                className="p-2 text-gray-400 hover:text-primary transition-colors"
                                                title="View Details"
                                            >
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                            </button>
                                            {reg.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(reg._id, 'approve')}
                                                        disabled={!!actionLoading}
                                                        className="px-3 py-1 bg-green-600 text-white rounded-md text-xs font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
                                                    >
                                                        {actionLoading === reg._id + '_approve' ? '...' : 'Approve'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(reg._id, 'reject')}
                                                        disabled={!!actionLoading}
                                                        className="px-3 py-1 bg-red-600 text-white rounded-md text-xs font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                                                    >
                                                        {actionLoading === reg._id + '_reject' ? '...' : 'Reject'}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-20 text-center">
                                    <div className="text-gray-400 mb-4">
                                        <FontAwesomeIcon icon={faUserPlus} size="3x" className="opacity-20" />
                                    </div>
                                    <p className="text-gray-500 font-medium">No join requests found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Registration Details Modal */}
            {selectedRegistration && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedRegistration(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                        <div className="bg-primary p-6 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold m-0">Join Request Detail</h3>
                                <p className="text-xs opacity-70 m-0">Submitted on {new Date(selectedRegistration.createdAt).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => setSelectedRegistration(null)} className="hover:rotate-90 transition-transform duration-300">
                                <FontAwesomeIcon icon={faTimesCircle} size="lg" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Full Name</label>
                                    <p className="font-semibold text-gray-800">{selectedRegistration.fullName}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Gender</label>
                                    <p className="font-semibold text-gray-800">{selectedRegistration.gender}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Reg Number</label>
                                    <p className="font-semibold text-gray-800">{selectedRegistration.registrationNumber}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Phone</label>
                                    <p className="font-semibold text-gray-800">{selectedRegistration.phoneNumber}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Course</label>
                                    <p className="font-semibold text-gray-800">{selectedRegistration.course}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Year of Study</label>
                                    <p className="font-semibold text-gray-800">{selectedRegistration.yearOfStudy}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Interest & Background</label>
                                <p className="text-sm text-gray-700 italic leading-relaxed">"{selectedRegistration.reasonForJoining || 'No additional information provided.'}"</p>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-top flex gap-3">
                            <button onClick={() => setSelectedRegistration(null)} className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors">Close</button>
                            {selectedRegistration.status === 'pending' && (
                                <button
                                    onClick={() => handleAction(selectedRegistration._id, 'approve')}
                                    disabled={!!actionLoading}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
                                >
                                    Approve Request
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MinistryRegistrationsView;
