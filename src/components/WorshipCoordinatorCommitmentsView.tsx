import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../config/environment';
import styles from '../styles/overseerDashboard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faClock, faInfoCircle, faSearch, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'react-router-dom';

interface Commitment {
    _id: string;
    fullName: string;
    phoneNumber: string;
    regNo: string;
    yearOfStudy: string;
    ministry: string;
    reasonForJoining: string;
    date: string;
    status: 'pending' | 'approved' | 'revoked';
    submittedAt: string;
}

const statusConfig: Record<string, { icon: any; color: string; label: string; class: string }> = {
    pending: { icon: faClock, color: '#856404', label: 'Pending', class: 'bg-yellow-100 text-yellow-700' },
    approved: { icon: faCheckCircle, color: '#155724', label: 'Approved', class: 'bg-green-100 text-green-700' },
    revoked: { icon: faTimesCircle, color: '#721c24', label: 'Revoked', class: 'bg-red-100 text-red-700' },
};

interface CommitmentsViewProps {
    role?: string;
}

const WorshipCoordinatorCommitmentsView: React.FC<CommitmentsViewProps> = ({ role }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [commitments, setCommitments] = useState<Commitment[]>([]);
    const [loading, setLoading] = useState(true);
    const [_error, setError] = useState('');
    const filter = (searchParams.get('status') as any) || 'all';
    const ministryFilter = searchParams.get('ministry') || 'all';
    const [selectedCommitment, setSelectedCommitment] = useState<Commitment | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const searchTerm = searchParams.get('search') || '';

    const setFilter = (newFilter: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('status', newFilter);
        setSearchParams(params);
    };

    const setMinistryFilter = (newMinistry: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('ministry', newMinistry);
        setSearchParams(params);
    };

    const setSearchTerm = (newSearch: string) => {
        const params = new URLSearchParams(searchParams);
        if (newSearch) params.set('search', newSearch);
        else params.delete('search');
        setSearchParams(params);
    };


    const fetchCommitments = async () => {
        try {
            setLoading(true);
            const endpoint = role
                ? `${getApiUrl('commitmentFormByRole')}/${encodeURIComponent(role)}`
                : getApiUrl('worshipCoordinatorCommitments');

            const res = await fetch(endpoint, {
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setCommitments(data.commitments || []);
        } catch (err) {
            setError('Could not load commitment forms. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommitments();
    }, [role]);

    const handleAction = async (commitmentId: string, action: 'approve' | 'revoke') => {
        setActionLoading(commitmentId + action);
        try {
            const endpoint = action === 'approve'
                ? `${getApiUrl('commitmentFormApprove')}/${commitmentId}`
                : `${getApiUrl('commitmentFormRevoke')}/${commitmentId}`;

            const res = await fetch(endpoint, {
                method: 'PUT',
                credentials: 'include',
            });

            if (res.ok) {
                setMessage(`✅ Commitment ${action === 'approve' ? 'approved' : 'revoked'} successfully.`);
                fetchCommitments();
                if (selectedCommitment?._id === commitmentId) {
                    setSelectedCommitment(prev => prev ? { ...prev, status: action === 'approve' ? 'approved' : 'revoked' } : null);
                }
            } else {
                const data = await res.json();
                setMessage(`❌ ${data.message || 'Action failed.'}`);
            }
        } catch {
            setMessage('❌ Network error. Please try again.');
        } finally {
            setActionLoading(null);
            setTimeout(() => setMessage(''), 4000);
        }
    };

    const filtered = commitments.filter(c => {
        const statusMatch = filter === 'all' || c.status === filter;
        const ministryMatch = ministryFilter === 'all' || c.ministry === ministryFilter;
        const searchMatch = c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.regNo.toLowerCase().includes(searchTerm.toLowerCase());
        return statusMatch && ministryMatch && searchMatch;
    });

    const ministries = [...new Set(commitments.map(c => c.ministry))];

    const counts = {
        all: commitments.length,
        pending: commitments.filter(c => c.status === 'pending').length,
        approved: commitments.filter(c => c.status === 'approved').length,
        revoked: commitments.filter(c => c.status === 'revoked').length,
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
                    <h3 className="text-2xl font-bold text-gray-800">Commitment Forms</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Review and manage ministry commitment submissions
                    </p>
                </div>
                <div className="flex gap-2">
                    {ministries.length > 1 && (
                        <select
                            value={ministryFilter}
                            onChange={e => setMinistryFilter(e.target.value)}
                            className="text-sm border-gray-200 rounded-lg focus:ring-primary focus:border-primary"
                        >
                            <option value="all">All Ministries</option>
                            {ministries.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    )}
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg mb-6 border animate-in slide-in-from-top-2 ${message.startsWith('✅') ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex gap-2 flex-wrap">
                    {(['all', 'pending', 'approved', 'revoked'] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === s
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filter === s ? 'bg-white/20' : 'bg-gray-100'}`}>
                                {counts[s]}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or reg..."
                        className="w-full pl-10 pr-4 py-2 border-gray-200 rounded-lg text-sm focus:ring-primary focus:border-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.modernTable}>
                    <thead>
                        <tr>
                            <th>Student Information</th>
                            <th>Ministry</th>
                            <th>Submission Date</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((c) => {
                            const config = statusConfig[c.status] || statusConfig.pending;
                            return (
                                <tr key={c._id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-primary font-bold">
                                                {c.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 m-0">{c.fullName}</p>
                                                <p className="text-xs text-gray-500 m-0">{c.regNo} • Year {c.yearOfStudy}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold border border-purple-100">
                                            {c.ministry}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="text-sm text-gray-600">
                                            <p className="m-0 font-medium">{new Date(c.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                                            <p className="m-0 text-xs opacity-60">{new Date(c.submittedAt).getFullYear()}</p>
                                        </div>
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
                                                onClick={() => setSelectedCommitment(c)}
                                                className="p-2 text-gray-400 hover:text-primary transition-colors"
                                                title="View Details"
                                            >
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                            </button>
                                            {c.status !== 'approved' && (
                                                <button
                                                    onClick={() => handleAction(c._id, 'approve')}
                                                    disabled={!!actionLoading}
                                                    className="px-3 py-1 bg-green-600 text-white rounded-md text-xs font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            {c.status !== 'revoked' && (
                                                <button
                                                    onClick={() => handleAction(c._id, 'revoke')}
                                                    disabled={!!actionLoading}
                                                    className="px-3 py-1 bg-red-600 text-white rounded-md text-xs font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                                                >
                                                    Reject
                                                </button>
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
                                        <FontAwesomeIcon icon={faClipboardList} size="3x" className="opacity-20" />
                                    </div>
                                    <p className="text-gray-500 font-medium">No commitment forms found</p>
                                    <p className="text-xs text-gray-400">Try adjusting your filters or search term</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modern Detail Modal */}
            {selectedCommitment && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedCommitment(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                        <div className="bg-primary p-6 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold m-0">Commitment Details</h3>
                                <p className="text-xs opacity-70 m-0">Submitted on {new Date(selectedCommitment.submittedAt).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => setSelectedCommitment(null)} className="hover:rotate-90 transition-transform duration-300">
                                <FontAwesomeIcon icon={faTimesCircle} size="lg" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Full Name</label>
                                    <p className="font-semibold text-gray-800">{selectedCommitment.fullName}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Ministry</label>
                                    <p className="font-semibold text-primary">{selectedCommitment.ministry}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Reg Number</label>
                                    <p className="font-semibold text-gray-800">{selectedCommitment.regNo}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Year of Study</label>
                                    <p className="font-semibold text-gray-800">{selectedCommitment.yearOfStudy}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Reason for Joining</label>
                                <p className="text-sm text-gray-700 italic leading-relaxed">"{selectedCommitment.reasonForJoining}"</p>
                            </div>

                            <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 block">Contact Information</label>
                                    <p className="text-sm font-semibold">{selectedCommitment.phoneNumber}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-top flex gap-3">
                            <button onClick={() => setSelectedCommitment(null)} className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors">Close</button>
                            {selectedCommitment.status === 'pending' && (
                                <button
                                    onClick={() => handleAction(selectedCommitment._id, 'approve')}
                                    disabled={!!actionLoading}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
                                >
                                    Approve Now
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorshipCoordinatorCommitmentsView;
