import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Search, UserPlus, X } from 'lucide-react';
import axios from 'axios';
import { getApiUrl } from '../config/environment';
import SignaturePad from '../components/attendance/SignaturePad';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/footer';

interface Session {
    _id: string;
    title: string;
    ministry: string;
    leadershipRole: string;
    isActive: boolean;
    startTime: string;
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

const DirectSignPage = () => {
    const { shortId } = useParams<{ shortId: string }>();
    const navigate = useNavigate();
    const [session, setSession] = useState<Session | null>(null);
    const [currentStep, setCurrentStep] = useState<'loading' | 'search' | 'confirm' | 'manual' | 'sign' | 'error'>('loading');
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState('');
    const [showSuccessBlur, setShowSuccessBlur] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [attendanceData, setAttendanceData] = useState<AttendanceData>(initialAttendanceData);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await fetch(`${getApiUrl('attendanceSessionStatus')}?shortId=${shortId}`, {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    // Find the specific session by shortId in the list returned by getSessionStatus
                    const found = data.sessions?.find((s: any) => s.shortId === shortId);
                    if (found && found.isActive) {
                        setSession(found);
                        setCurrentStep('search');
                    } else {
                        setError('This attendance session is no longer active or could not be found.');
                        setCurrentStep('error');
                    }
                } else {
                    setError('Failed to load session details.');
                    setCurrentStep('error');
                }
            } catch (err) {
                setError('Network error loading session.');
                setCurrentStep('error');
            }
        };
        if (shortId) fetchSession();
    }, [shortId]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearching(true);
        setError('');
        try {
            const response = await axios.post(getApiUrl('usersCheckExists'), {
                regNo: searchQuery.trim()
            }, { withCredentials: true });

            if (response.data.exists && response.data.user) {
                const u = response.data.user;
                setAttendanceData({
                    ...initialAttendanceData,
                    fullName: u.username,
                    registrationNumber: u.regNo,
                    course: u.course || '',
                    yearOfStudy: u.year?.toString() || '',
                    phoneNumber: u.phone || '',
                    userType: 'student'
                });
                setCurrentStep('confirm');
            } else {
                setAttendanceData({
                    ...initialAttendanceData,
                    registrationNumber: searchQuery.trim().toUpperCase(),
                    userType: 'student'
                });
                setCurrentStep('manual');
            }
        } catch (err) {
            setError('Search failed. Please try manual entry.');
        } finally {
            setSearching(false);
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!attendanceData.fullName || !attendanceData.phoneNumber) {
            setError('Name and Phone are required.');
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
                ministry: session?.ministry || 'General',
                sessionId: session?._id,
            };

            await axios.post(getApiUrl('attendanceSignAnonymous'), payload, { withCredentials: true });

            setSuccessMessage(`${attendanceData.fullName}, your attendance for "${session?.title}" has been recorded.`);
            setShowSuccessBlur(true);

            setTimeout(() => {
                navigate('/');
            }, 4000);

        } catch (err: any) {
            setError(err.response?.data?.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <UniversalHeader />

            <main className="max-w-xl mx-auto px-4 py-12">
                <div className="relative bg-white rounded-[3rem] shadow-2xl overflow-hidden min-h-[500px] flex flex-col">

                    {showSuccessBlur && (
                        <div className="absolute inset-0 z-[110] bg-white/40 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
                            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 animate-bounce shadow-2xl shadow-green-500/30">
                                <CheckCircle size={48} />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-2">Recorded!</h3>
                            <p className="text-gray-600 font-bold max-w-xs">{successMessage}</p>
                            <p className="mt-8 text-xs font-bold text-green-600 uppercase tracking-widest">Redirecting to Homepage...</p>
                        </div>
                    )}

                    <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 leading-none mb-1">Attendance Sign-in</h1>
                            {session && <p className="text-xs font-bold text-[#730051] uppercase tracking-wider">{session.title}</p>}
                        </div>
                        <button onClick={() => navigate('/')} className="p-3 hover:bg-red-50 rounded-2xl text-gray-400 hover:text-red-500 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-10 flex-1">
                        {error && (
                            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                                <AlertCircle size={20} className="text-red-500 mt-0.5" />
                                <p className="text-sm font-bold text-red-800">{error}</p>
                            </div>
                        )}

                        {currentStep === 'loading' && (
                            <div className="flex flex-col items-center justify-center h-full py-20">
                                <div className="w-12 h-12 border-4 border-purple-100 border-t-[#730051] rounded-full animate-spin mb-4" />
                                <p className="text-gray-500 font-bold">Checking session details...</p>
                            </div>
                        )}

                        {currentStep === 'search' && (
                            <div className="space-y-8">
                                <form onSubmit={handleSearch} className="space-y-4">
                                    <div className="relative group">
                                        <input
                                            autoFocus
                                            type="text"
                                            className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-[2rem] focus:bg-white focus:border-[#730051]/30 focus:ring-8 focus:ring-[#730051]/5 outline-none transition-all text-xl font-bold uppercase"
                                            placeholder="Registration Number"
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            required
                                        />
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#730051]" size={28} />
                                    </div>
                                    <button type="submit" disabled={searching} className="w-full py-5 bg-gray-900 text-white font-black rounded-[2rem] hover:bg-black transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 active:scale-95">
                                        {searching ? 'Finding you...' : 'Find My Profile'}
                                    </button>
                                </form>
                                <div className="flex items-center gap-4 text-gray-300">
                                    <div className="h-px flex-1 bg-gray-100" />
                                    <span className="text-xs font-black uppercase tracking-widest">OR</span>
                                    <div className="h-px flex-1 bg-gray-100" />
                                </div>
                                <button onClick={() => setCurrentStep('manual')} className="w-full py-5 border-2 border-dashed border-gray-200 text-gray-600 font-bold rounded-[2rem] hover:border-[#730051]/30 hover:bg-[#730051]/5 hover:text-[#730051] transition-all flex items-center justify-center gap-3">
                                    <UserPlus size={20} /> Enter Details Manually
                                </button>
                            </div>
                        )}

                        {currentStep === 'confirm' && (
                            <div className="space-y-8 animate-in slide-in-from-bottom-5">
                                <div className="p-8 bg-gradient-to-br from-[#730051]/5 to-transparent rounded-[2.5rem] border border-gray-100 text-center">
                                    <h4 className="text-3xl font-black text-gray-900 mb-1">{attendanceData.fullName}</h4>
                                    <p className="text-[#730051] font-bold mb-6 tracking-wide">{attendanceData.registrationNumber}</p>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">{attendanceData.course}</p>
                                        <p className="text-sm font-medium text-gray-500">Year {attendanceData.yearOfStudy}</p>
                                    </div>
                                </div>
                                <button onClick={() => setCurrentStep('sign')} className="w-full py-5 bg-gradient-to-r from-[#730051] to-[#9d176e] text-white font-black rounded-[2rem] shadow-2xl shadow-purple-900/20 hover:scale-[1.02] active:scale-95 transition-all">
                                    Yes, Continue to Signature
                                </button>
                                <button onClick={() => setCurrentStep('search')} className="w-full text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors">
                                    Not you? Try a different Reg No.
                                </button>
                            </div>
                        )}

                        {currentStep === 'manual' && (
                            <form onSubmit={handleManualSubmit} className="space-y-4 animate-in slide-in-from-bottom-5">
                                <div className="flex p-1.5 bg-gray-100 rounded-2xl mb-2">
                                    <button type="button" onClick={() => setAttendanceData(p => ({ ...p, userType: 'student' }))} className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${attendanceData.userType === 'student' ? 'bg-white shadow-sm text-[#730051]' : 'text-gray-500'}`}>STUDENT</button>
                                    <button type="button" onClick={() => setAttendanceData(p => ({ ...p, userType: 'visitor' }))} className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all ${attendanceData.userType === 'visitor' ? 'bg-white shadow-sm text-[#730051]' : 'text-gray-500'}`}>VISITOR</button>
                                </div>
                                <input type="text" placeholder="Full Name" value={attendanceData.fullName} onChange={e => setAttendanceData(p => ({ ...p, fullName: e.target.value }))} className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-[#730051]/30 outline-none transition-all font-bold placeholder:font-medium" required />
                                {attendanceData.userType === 'student' && (
                                    <>
                                        <input type="text" placeholder="Reg No (e.g. IN16/00014/22)" value={attendanceData.registrationNumber} onChange={e => setAttendanceData(p => ({ ...p, registrationNumber: e.target.value }))} className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-[#730051]/30 outline-none transition-all font-bold uppercase" required />
                                        <input type="text" placeholder="Course Name" value={attendanceData.course} onChange={e => setAttendanceData(p => ({ ...p, course: e.target.value }))} className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-[#730051]/30 outline-none transition-all font-bold" required />
                                        <div className="grid grid-cols-2 gap-4">
                                            <select value={attendanceData.yearOfStudy} onChange={e => setAttendanceData(p => ({ ...p, yearOfStudy: e.target.value }))} className="px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-[#730051]/30 outline-none transition-all font-bold" required>
                                                <option value="">Year</option>
                                                {[1, 2, 3, 4, 5, 6].map(y => <option key={y} value={y}>Year {y}</option>)}
                                            </select>
                                            <input type="tel" placeholder="Phone No." value={attendanceData.phoneNumber} onChange={e => setAttendanceData(p => ({ ...p, phoneNumber: e.target.value }))} className="px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-[#730051]/30 outline-none transition-all font-bold" required />
                                        </div>
                                    </>
                                )}
                                {attendanceData.userType === 'visitor' && (
                                    <input type="tel" placeholder="Phone No." value={attendanceData.phoneNumber} onChange={e => setAttendanceData(p => ({ ...p, phoneNumber: e.target.value }))} className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-[#730051]/30 outline-none transition-all font-bold" required />
                                )}
                                <button type="submit" className="w-full py-5 bg-gray-900 text-white font-black rounded-[2rem] hover:bg-black transition-all shadow-lg mt-4 active:scale-95">
                                    Continue to Signature
                                </button>
                            </form>
                        )}

                        {currentStep === 'sign' && (
                            <div className="space-y-6 animate-in slide-in-from-bottom-5">
                                <div className="p-4 bg-[#730051]/5 rounded-2xl text-center">
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Confirming for</p>
                                    <p className="text-lg font-black text-gray-900">{attendanceData.fullName}</p>
                                </div>
                                <SignaturePad onSignatureChange={sig => setAttendanceData(p => ({ ...p, signature: sig }))} loading={loading} />
                                <button onClick={handleSubmitFinal} disabled={loading || !attendanceData.signature} className="w-full py-5 bg-gradient-to-r from-[#730051] to-[#9d176e] text-white font-black rounded-[2rem] shadow-2xl shadow-purple-900/30 hover:scale-[1.02] active:scale-95 transition-all">
                                    {loading ? 'Recording...' : 'Record My Attendance'}
                                </button>
                            </div>
                        )}

                        {currentStep === 'error' && (
                            <div className="text-center py-10 space-y-6">
                                <AlertCircle className="mx-auto text-red-500" size={64} />
                                <p className="text-gray-600 font-bold">{error}</p>
                                <button onClick={() => navigate('/')} className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl">Go to Homepage</button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DirectSignPage;
