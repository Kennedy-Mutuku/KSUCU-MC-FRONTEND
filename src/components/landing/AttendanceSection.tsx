import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Search, UserPlus, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { getApiUrl } from '../../config/environment';
import SignaturePad from '../attendance/SignaturePad';

interface Session {
  _id: string;
  title: string;
  ministry: string;
  leadershipRole: string;
  isActive: boolean;
  startTime: string;
  durationMinutes: number;
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

type Step = 'initial' | 'search' | 'confirm' | 'manual' | 'sign';

const AttendanceSection = () => {
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('initial');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessBlur, setShowSuccessBlur] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [attendanceData, setAttendanceData] = useState<AttendanceData>(initialAttendanceData);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchActiveSessions = async () => {
    try {
      const timestamp = Date.now();
      const response = await fetch(`${getApiUrl('attendanceSessionStatus')}?t=${timestamp}`, {
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (response.ok) {
        const data = await response.json();
        setActiveSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Error loading active sessions:', error);
    }
  };

  useEffect(() => {
    fetchActiveSessions();
    const interval = setInterval(fetchActiveSessions, 5000);
    return () => clearInterval(interval);
  }, []);

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
      setTimeout(() => setError(''), 3000);
    } finally {
      setSearching(false);
    }
  };

  const handleManualEntry = () => {
    setAttendanceData(initialAttendanceData);
    setCurrentStep('manual');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        ministry: selectedSession?.ministry || 'General',
        sessionId: selectedSession?._id,
      };

      await axios.post(getApiUrl('attendanceSignAnonymous'), payload, { withCredentials: true });

      setSuccessMessage(`${attendanceData.fullName}, your attendance for "${selectedSession?.title}" has been recorded.`);
      setShowSuccessBlur(true);

      // Auto-reset after 3 seconds
      setTimeout(() => {
        handleClose();
        setShowSuccessBlur(false);
      }, 3000);

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

  const handleClose = () => {
    setShowForm(false);
    setCurrentStep('initial');
    setAttendanceData(initialAttendanceData);
    setSearchQuery('');
    setError('');
    setSelectedSession(null);
  };

  return (
    <section className="py-4 bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Center: Session Status & Actions */}
        <div className="lg:col-span-3 max-w-2xl mx-auto w-full space-y-3">
          <div className="text-center">
            <h2 className="text-2xl font-black text-[#730051] mb-1 tracking-tight">Attendance Center</h2>
            <p className="text-sm text-gray-600 font-medium">Please sign in if you are attending any active session.</p>
          </div>

          <div className={`${activeSessions.length === 0 ? 'p-4' : 'p-6'} bg-white rounded-2xl border border-gray-100 shadow-lg shadow-purple-900/5`}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${activeSessions.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="font-bold text-xs uppercase tracking-wider text-gray-500">
                {activeSessions.length} {activeSessions.length === 1 ? 'Session' : 'Sessions'} Active
              </span>
            </div>

            {activeSessions.length === 0 ? (
              <div className="py-4 text-center">
                <AlertCircle className="mx-auto text-gray-200 mb-2" size={28} />
                <p className="text-sm font-semibold text-gray-400">No sessions currently open</p>
                <p className="text-xs text-gray-400 mt-0.5">Wait for a leader to start a session</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeSessions.map((s, idx) => (
                  <div key={s._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-[#730051]/10 hover:bg-white transition-all group">
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sm font-black text-[#730051] shadow-sm group-hover:bg-[#730051] group-hover:text-white transition-colors">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-lg font-black text-gray-900 group-hover:text-[#730051] transition-colors">{s.title}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{s.leadershipRole}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setSelectedSession(s); setShowForm(true); setCurrentStep('search'); }}
                      className="px-6 py-2 bg-white border border-gray-100 text-[#730051] text-xs font-black rounded-xl shadow-sm hover:bg-[#730051] hover:text-white transition-all transform active:scale-95"
                    >
                      Sign
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Form Flow */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={handleClose} />

          <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Success Blur Layer */}
            {showSuccessBlur && (
              <div className="absolute inset-0 z-[110] bg-white/40 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 animate-bounce shadow-2xl shadow-green-500/30">
                  <CheckCircle size={48} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-2">Recorded!</h3>
                <p className="text-gray-600 font-bold max-w-xs">{successMessage}</p>
                <p className="mt-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Next person can sign in 3 seconds...</p>
              </div>
            )}

            {/* Header */}
            <div className="px-10 py-8 bg-white border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {currentStep !== 'search' && (
                  <button onClick={() => setCurrentStep(currentStep === 'confirm' || currentStep === 'manual' ? 'search' : 'manual')} className="p-2 hover:bg-gray-100 rounded-2xl transition-colors">
                    <ArrowLeft size={20} />
                  </button>
                )}
                <div>
                  <h3 className="text-2xl font-black text-gray-900 leading-none mb-1">
                    {currentStep === 'search' && 'Identify Yourself'}
                    {currentStep === 'confirm' && 'Is this you?'}
                    {currentStep === 'manual' && 'Your Details'}
                    {currentStep === 'sign' && 'Sign to Finish'}
                  </h3>
                  <p className="text-xs font-bold text-[#730051] uppercase tracking-wider">Signing for: {selectedSession?.title}</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-3 hover:bg-red-50 rounded-2xl text-gray-400 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-10">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-pulse">
                  <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-bold text-red-800">{error}</p>
                </div>
              )}

              {/* Step: Search */}
              {currentStep === 'search' && (
                <div className="space-y-8">
                  <form onSubmit={handleSearch} className="space-y-4">
                    <div className="relative group">
                      <input
                        autoFocus
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Registration Number"
                        className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-[2rem] focus:bg-white focus:border-[#730051]/30 focus:ring-8 focus:ring-[#730051]/5 outline-none transition-all text-xl font-bold uppercase"
                        required
                      />
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#730051] transition-colors" size={28} />
                    </div>
                    <button
                      type="submit"
                      disabled={searching}
                      className="w-full py-5 bg-gray-900 text-white font-black rounded-[2rem] hover:bg-black transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 active:scale-95"
                    >
                      {searching ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Find My Profile'}
                    </button>
                  </form>
                  <div className="flex items-center gap-4 text-gray-300">
                    <div className="h-px flex-1 bg-gray-100" />
                    <span className="text-xs font-black uppercase tracking-widest">OR</span>
                    <div className="h-px flex-1 bg-gray-100" />
                  </div>
                  <button onClick={handleManualEntry} className="w-full py-5 border-2 border-dashed border-gray-200 text-gray-600 font-bold rounded-[2rem] hover:border-[#730051]/30 hover:bg-[#730051]/5 hover:text-[#730051] transition-all flex items-center justify-center gap-3">
                    <UserPlus size={20} /> Enter Details Manually
                  </button>
                </div>
              )}

              {/* Step: Confirm */}
              {currentStep === 'confirm' && (
                <div className="space-y-8">
                  <div className="p-8 bg-gradient-to-br from-[#730051]/5 to-transparent rounded-[2.5rem] border border-gray-100">
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
                </div>
              )}

              {/* Step: Manual Form */}
              {currentStep === 'manual' && (
                <form onSubmit={handleManualSubmit} className="space-y-4">
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

              {/* Step: Sign */}
              {currentStep === 'sign' && (
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-2xl text-center">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Verify Identity</p>
                    <p className="text-lg font-black text-gray-900">{attendanceData.fullName}</p>
                  </div>
                  <SignaturePad
                    onSignatureChange={(sig) => setAttendanceData(p => ({ ...p, signature: sig }))}
                    loading={loading}
                  />
                  <button
                    onClick={handleSubmitFinal}
                    disabled={loading || !attendanceData.signature}
                    className="w-full py-5 bg-gradient-to-r from-[#730051] to-[#9d176e] text-white font-black rounded-[2rem] shadow-2xl shadow-purple-900/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Record My Attendance'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <style>{`
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
.animate-shake {
  animation: shake 0.4s ease-in-out 2;
}
`}</style>
    </section>
  );
};

export default AttendanceSection;
