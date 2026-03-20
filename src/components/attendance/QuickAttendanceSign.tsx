import { useState } from 'react';
import { CheckCircle, AlertCircle, X, Search, ArrowLeft, User } from 'lucide-react';
import axios from 'axios';
import { getApiUrl } from '../../config/environment';
import SignaturePad from './SignaturePad';

interface Session {
    _id: string;
    title: string;
    ministry: string;
    leadershipRole?: string;
}

interface AttendanceData {
    fullName: string;
    registrationNumber: string;
    course: string;
    yearOfStudy: string;
    phoneNumber: string;
    signature: string;
    userType: string;
}

const initialAttendanceData: AttendanceData = {
    fullName: '',
    registrationNumber: '',
    course: '',
    yearOfStudy: '',
    phoneNumber: '',
    signature: '',
    userType: 'student',
};

// Flow: search → found (confirm) / notFound (manual) → sign
type Step = 'search' | 'found' | 'manual' | 'sign';

interface QuickAttendanceSignProps {
    session: Session;
    onClose: () => void;
}

const QuickAttendanceSign = ({ session, onClose }: QuickAttendanceSignProps) => {
    const [currentStep, setCurrentStep] = useState<Step>('search');
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [attendanceData, setAttendanceData] = useState<AttendanceData>(initialAttendanceData);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearching(true);
        setError('');
        try {
            const query = searchQuery.trim();

            // Try searching by regNo first
            let response = await axios.post(getApiUrl('usersCheckExists'), {
                regNo: query
            }, { withCredentials: true });

            // If not found by regNo, try by phone number
            if (!response.data.exists) {
                response = await axios.post(getApiUrl('usersCheckExists'), {
                    phone: query
                }, { withCredentials: true });
            }

            if (response.data.exists && response.data.user) {
                const u = response.data.user;
                setAttendanceData({
                    ...initialAttendanceData,
                    fullName: u.username,
                    registrationNumber: u.regNo || '',
                    course: u.course || '',
                    yearOfStudy: u.year?.toString() || '',
                    phoneNumber: u.phone || '',
                    userType: 'student'
                });
                setCurrentStep('found');
            } else {
                // Not found by either — go to manual entry
                const looksLikePhone = /^\d{10,}$/.test(query);
                setAttendanceData({
                    ...initialAttendanceData,
                    registrationNumber: looksLikePhone ? '' : query.toUpperCase(),
                    phoneNumber: looksLikePhone ? query : '',
                    userType: 'student'
                });
                setError('No profile found. Please fill in your details.');
                setCurrentStep('manual');
            }
        } catch {
            setError('Search failed. Please fill in your details.');
            const looksLikePhone = /^\d{10,}$/.test(searchQuery.trim());
            setAttendanceData({
                ...initialAttendanceData,
                registrationNumber: looksLikePhone ? '' : searchQuery.trim().toUpperCase(),
                phoneNumber: looksLikePhone ? searchQuery.trim() : '',
                userType: 'student'
            });
            setCurrentStep('manual');
        } finally {
            setSearching(false);
        }
    };

    const handleNotMe = () => {
        // User said "Not me" — go to manual with blank data but keep reg no
        setAttendanceData({
            ...initialAttendanceData,
            registrationNumber: searchQuery.trim().toUpperCase(),
            userType: 'student'
        });
        setError('');
        setCurrentStep('manual');
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!attendanceData.fullName || !attendanceData.phoneNumber) {
            setError('Name and Phone are required.');
            return;
        }
        if (attendanceData.userType === 'student' && (!attendanceData.registrationNumber || !attendanceData.course || !attendanceData.yearOfStudy)) {
            setError('All student details are required.');
            return;
        }
        setCurrentStep('sign');
    };

    const handleSubmitFinal = async () => {
        if (!attendanceData.signature) {
            setError('Please provide your signature.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const payload = {
                name: attendanceData.fullName.trim(),
                regNo: attendanceData.registrationNumber.trim().toUpperCase(),
                year: attendanceData.userType === 'student' ? parseInt(attendanceData.yearOfStudy) : 0,
                course: attendanceData.userType === 'student' ? attendanceData.course.trim() : 'Guest/Visitor',
                phoneNumber: attendanceData.phoneNumber.trim(),
                signature: attendanceData.signature.trim(),
                userType: attendanceData.userType,
                ministry: session.ministry || 'General',
                sessionId: session._id,
            };

            await axios.post(getApiUrl('attendanceSignAnonymous'), payload, { withCredentials: true });

            setSuccessMessage(`${attendanceData.fullName}, attendance recorded!`);
            setShowSuccess(true);

            setTimeout(() => {
                onClose();
                setShowSuccess(false);
            }, 2500);

        } catch (err: any) {
            if (err.response?.status === 400 && err.response.data?.message?.includes('already')) {
                setError('You have already signed for this session.');
            } else {
                setError('Submission failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getBackStep = (): Step => {
        if (currentStep === 'found') return 'search';
        if (currentStep === 'manual') return 'search';
        if (currentStep === 'sign') return 'found';
        return 'search';
    };

    const getTitle = () => {
        switch (currentStep) {
            case 'search': return 'Enter Reg No.';
            case 'found': return 'Confirm Identity';
            case 'manual': return 'Fill Your Details';
            case 'sign': return 'Your Signature';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pl-[56px] pr-3 py-3 md:px-3">
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                {/* Success overlay */}
                {showSuccess && (
                    <div className="absolute inset-0 z-[110] bg-white/80 backdrop-blur-lg flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-300">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mb-3 shadow-lg shadow-green-500/30">
                            <CheckCircle size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Done!</h3>
                        <p className="text-sm text-gray-600 font-medium">{successMessage}</p>
                    </div>
                )}

                {/* Header */}
                <div className="px-4 py-3 bg-gradient-to-r from-[#730051] to-[#9d176e] flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        {currentStep !== 'search' && (
                            <button
                                onClick={() => { setError(''); setCurrentStep(getBackStep()); }}
                                className="p-1 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white flex-shrink-0"
                            >
                                <ArrowLeft size={16} />
                            </button>
                        )}
                        <div className="flex-1 text-center">
                            <h3 className="text-sm font-bold text-white leading-tight">{getTitle()}</h3>
                            <p className="text-[9px] font-semibold text-white/60 uppercase tracking-wider">{session.title}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg text-white/60 hover:text-white transition-colors flex-shrink-0">
                        <X size={14} />
                    </button>
                </div>

                <div className="p-4">
                    {/* Error */}
                    {error && (
                        <div className="mb-3 p-2.5 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                            <AlertCircle size={13} className="text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-[11px] font-semibold text-red-700">{error}</p>
                        </div>
                    )}

                    {/* STEP 1: Search by Reg No */}
                    {currentStep === 'search' && (
                        <form onSubmit={handleSearch} className="space-y-3">
                            <p className="text-xs text-gray-500 font-medium text-center">Enter your registration number or phone number</p>
                            <div className="relative">
                                <input
                                    autoFocus
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Reg No. or Phone (07...)"
                                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#730051]/40 focus:ring-2 focus:ring-[#730051]/10 outline-none transition-all text-sm font-bold uppercase text-center"
                                    required
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            </div>
                            <button
                                type="submit"
                                disabled={searching}
                                className="w-full py-2.5 bg-[#730051] text-white text-sm font-bold rounded-lg hover:bg-[#5a0040] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60"
                            >
                                {searching ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Look Up'}
                            </button>
                        </form>
                    )}

                    {/* STEP 2a: Found — "Continue as ...?" */}
                    {currentStep === 'found' && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-[#730051]/10 flex items-center justify-center flex-shrink-0">
                                    <User size={18} className="text-[#730051]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-gray-900 truncate">{attendanceData.fullName}</p>
                                    <p className="text-[11px] font-semibold text-[#730051] tracking-wide">{attendanceData.registrationNumber}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">{attendanceData.course}{attendanceData.yearOfStudy ? ` · Year ${attendanceData.yearOfStudy}` : ''}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setError(''); setCurrentStep('sign'); }}
                                className="w-full py-2.5 bg-[#730051] text-white text-sm font-bold rounded-lg hover:bg-[#5a0040] transition-all active:scale-[0.98]"
                            >
                                Continue as {attendanceData.fullName.split(' ')[0]}
                            </button>
                            <button
                                onClick={handleNotMe}
                                className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-[#730051] transition-colors"
                            >
                                Not me — enter details manually
                            </button>
                        </div>
                    )}

                    {/* STEP 2b: Manual entry (not found or "Not me") */}
                    {currentStep === 'manual' && (
                        <form onSubmit={handleManualSubmit} className="space-y-2.5">
                            <div className="flex p-0.5 bg-gray-100 rounded-md mb-1">
                                <button type="button" onClick={() => setAttendanceData(p => ({ ...p, userType: 'student' }))} className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${attendanceData.userType === 'student' ? 'bg-white shadow-sm text-[#730051]' : 'text-gray-500'}`}>STUDENT</button>
                                <button type="button" onClick={() => setAttendanceData(p => ({ ...p, userType: 'visitor' }))} className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${attendanceData.userType === 'visitor' ? 'bg-white shadow-sm text-[#730051]' : 'text-gray-500'}`}>VISITOR</button>
                            </div>
                            <input type="text" placeholder="Full Name" value={attendanceData.fullName} onChange={e => setAttendanceData(p => ({ ...p, fullName: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#730051]/30 outline-none transition-all text-sm font-medium" required />
                            {attendanceData.userType === 'student' && (
                                <>
                                    <input type="text" placeholder="Reg No" value={attendanceData.registrationNumber} onChange={e => setAttendanceData(p => ({ ...p, registrationNumber: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#730051]/30 outline-none transition-all text-sm font-medium uppercase" required />
                                    <input type="text" placeholder="Course" value={attendanceData.course} onChange={e => setAttendanceData(p => ({ ...p, course: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#730051]/30 outline-none transition-all text-sm font-medium" required />
                                    <div className="grid grid-cols-2 gap-2">
                                        <select value={attendanceData.yearOfStudy} onChange={e => setAttendanceData(p => ({ ...p, yearOfStudy: e.target.value }))} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#730051]/30 outline-none transition-all text-sm font-medium" required>
                                            <option value="">Year</option>
                                            {[1, 2, 3, 4, 5, 6].map(y => <option key={y} value={y}>Year {y}</option>)}
                                        </select>
                                        <input type="tel" placeholder="Phone" value={attendanceData.phoneNumber} onChange={e => setAttendanceData(p => ({ ...p, phoneNumber: e.target.value }))} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#730051]/30 outline-none transition-all text-sm font-medium" required />
                                    </div>
                                </>
                            )}
                            {attendanceData.userType === 'visitor' && (
                                <input type="tel" placeholder="Phone Number" value={attendanceData.phoneNumber} onChange={e => setAttendanceData(p => ({ ...p, phoneNumber: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#730051]/30 outline-none transition-all text-sm font-medium" required />
                            )}
                            <button type="submit" className="w-full py-2.5 bg-[#730051] text-white text-sm font-bold rounded-lg hover:bg-[#5a0040] transition-all mt-1 active:scale-[0.98]">
                                Continue to Signature
                            </button>
                        </form>
                    )}

                    {/* STEP 3: Signature */}
                    {currentStep === 'sign' && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                <div className="w-7 h-7 rounded-full bg-[#730051]/10 flex items-center justify-center flex-shrink-0">
                                    <User size={12} className="text-[#730051]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-gray-900 truncate">{attendanceData.fullName}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">{attendanceData.registrationNumber}</p>
                                </div>
                            </div>
                            <SignaturePad
                                onSignatureChange={(sig) => setAttendanceData(p => ({ ...p, signature: sig }))}
                                loading={loading}
                            />
                            <button
                                onClick={handleSubmitFinal}
                                disabled={loading || !attendanceData.signature}
                                className="w-full py-2.5 bg-[#730051] text-white text-sm font-bold rounded-lg hover:bg-[#5a0040] transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Submit Attendance'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuickAttendanceSign;
