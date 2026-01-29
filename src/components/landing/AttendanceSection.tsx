import { useState, useEffect, useRef } from 'react';
import { getApiUrl } from '../../config/environment';
import axios from 'axios';
import { CheckCircle, AlertCircle, X, Pencil, Search, UserPlus, ArrowLeft, Send } from 'lucide-react';

interface Session {
  leadershipRole: string;
  isActive: boolean;
  startTime: string;
  sessionId: string;
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
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('initial');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [attendanceData, setAttendanceData] = useState<AttendanceData>(initialAttendanceData);
  const [searchQuery, setSearchQuery] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const checkActiveSession = async (retryCount = 0) => {
    try {
      const timestamp = Date.now();
      const response = await fetch(
        `${getApiUrl('attendanceSessionStatus')}?t=${timestamp}&r=${Math.random()}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // console.log('Session Polling Data:', data);
        if (data.session && data.session.isActive) {
          setActiveSession({
            leadershipRole: data.session.leadershipRole || 'Leader',
            isActive: true,
            startTime: data.session.startTime,
            sessionId: data.session._id || data.session.sessionId,
          });
        } else {
          setActiveSession(null);
        }
      } else {
        setActiveSession(null);
      }
    } catch (err) {
      if (retryCount < 2) {
        setTimeout(() => checkActiveSession(retryCount + 1), 2000);
        return;
      }
      setActiveSession(null);
    }
  };

  useEffect(() => {
    checkActiveSession();
    const interval = setInterval(checkActiveSession, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showForm && (!activeSession || !activeSession.isActive)) {
      handleClose();
      alert('Attendance session has been closed.');
    }
  }, [activeSession, showForm]);

  useEffect(() => {
    if (currentStep === 'sign') {
      const timer = setTimeout(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        const startDrawing = (e: MouseEvent | TouchEvent) => {
          isDrawing = true;
          const rect = canvas.getBoundingClientRect();
          const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
          const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
          lastX = clientX - rect.left;
          lastY = clientY - rect.top;
        };

        const draw = (e: MouseEvent | TouchEvent) => {
          if (!isDrawing) return;
          e.preventDefault();
          const rect = canvas.getBoundingClientRect();
          const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
          const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
          const currentX = clientX - rect.left;
          const currentY = clientY - rect.top;

          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.strokeStyle = '#730051';
          ctx.beginPath();
          ctx.moveTo(lastX, lastY);
          ctx.lineTo(currentX, currentY);
          ctx.stroke();

          lastX = currentX;
          lastY = currentY;
          setAttendanceData((prev) => ({ ...prev, signature: canvas.toDataURL() }));
        };

        const stopDrawing = () => {
          isDrawing = false;
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);
        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDrawing);

        return () => {
          canvas.removeEventListener('mousedown', startDrawing);
          canvas.removeEventListener('mousemove', draw);
          canvas.removeEventListener('mouseup', stopDrawing);
          canvas.removeEventListener('mouseleave', stopDrawing);
          canvas.removeEventListener('touchstart', startDrawing);
          canvas.removeEventListener('touchmove', draw);
          canvas.removeEventListener('touchend', stopDrawing);
        };
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setAttendanceData((prev) => ({ ...prev, signature: '' }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setError('');
    try {
      const response = await axios.post(getApiUrl('checkUserExists'), {
        regNo: searchQuery.trim()
      }, { withCredentials: true });

      if (response.data.exists && response.data.user) {
        const u = response.data.user;
        setAttendanceData({
          ...initialAttendanceData,
          fullName: u.username,
          registrationNumber: u.regNo,
          course: u.course,
          yearOfStudy: u.year?.toString() || '',
          phoneNumber: u.phone || '',
          userType: 'student'
        });
        setCurrentStep('confirm');
      } else {
        // Not found - go to manual entry with the reg number pre-filled
        setAttendanceData({
          ...initialAttendanceData,
          registrationNumber: searchQuery.trim().toUpperCase(),
          userType: 'student'
        });
        setCurrentStep('manual');
      }
    } catch (err) {
      setError('Search failed. Please try again or enter details manually.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSearching(false);
    }
  };

  const handleManualEntry = () => {
    setAttendanceData(initialAttendanceData);
    setCurrentStep('manual');
  };

  const handleConfirmProfile = () => {
    setCurrentStep('sign');
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
      const generateVisitorId = () => {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `VISITOR-${timestamp}-${random}`.toUpperCase();
      };

      const payload = {
        name: attendanceData.fullName.trim(),
        regNo: attendanceData.userType === 'student'
          ? attendanceData.registrationNumber.trim().toUpperCase()
          : (attendanceData.registrationNumber || generateVisitorId()),
        year: attendanceData.userType === 'student' ? parseInt(attendanceData.yearOfStudy) : 0,
        course: attendanceData.userType === 'student' ? attendanceData.course.trim() : 'Guest/Visitor',
        phoneNumber: attendanceData.phoneNumber.trim(),
        signature: attendanceData.signature.trim(),
        userType: attendanceData.userType,
        ministry: 'General',
        sessionId: activeSession?.sessionId,
      };

      await axios.post(getApiUrl('attendanceSignAnonymous'), payload, { withCredentials: true });

      setSuccess(`Thank you ${attendanceData.fullName}! Attendance recorded successfully.`);
      setTimeout(() => {
        handleClose();
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
    setSuccess('');
    setError('');
  };

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="relative z-10 text-center mb-12">
          <div className="inline-block p-3 bg-purple-100 rounded-2xl mb-4 text-[#730051]">
            <Pencil size={32} />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Attendance Center
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Record your participation in our spiritual gatherings quickly and easily.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {activeSession?.isActive ? (
            <div className="relative group p-6 bg-white border border-gray-100 rounded-[1.5rem] shadow-xl shadow-purple-900/5 hover:shadow-purple-900/10 transition-all duration-500">
              <div className="absolute top-0 right-0 -mt-2 -mr-2 w-12 h-12 bg-[#00c6ff]/10 rounded-full blur-xl group-hover:bg-[#00c6ff]/20 transition-all" />
              <div className="absolute bottom-0 left-0 -mb-2 -ml-2 w-16 h-16 bg-[#730051]/5 rounded-full blur-3xl group-hover:bg-[#730051]/10 transition-all" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-6 p-3 bg-green-50/50 border border-green-100 rounded-xl">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                      <CheckCircle size={24} />
                    </div>
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">Live Session Active</h4>
                    <p className="text-xs text-gray-600">
                      {activeSession.leadershipRole} • Started {new Date(activeSession.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {!showForm && (
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setCurrentStep('search');
                    }}
                    className="group relative w-full py-4 bg-gradient-to-r from-[#730051] to-[#9d176e] text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 hover:scale-[1.01] active:scale-[0.99] transition-all overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative flex items-center justify-center gap-2 text-base">
                      Sign Attendance Now
                      <ArrowLeft size={18} className="rotate-180" />
                    </span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-center border-dashed">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No Active Session</h3>
              <p className="text-sm text-gray-500">Wait for a leader to open an attendance session</p>
            </div>
          )}
        </div>

        {/* Modal-like Form Flow */}
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={handleClose} />

            <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-3xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
              {/* Header */}
              <div className="px-8 py-6 bg-white border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentStep !== 'search' && !success && (
                    <button
                      onClick={() => setCurrentStep(currentStep === 'confirm' || currentStep === 'manual' ? 'search' : 'manual')}
                      className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                  )}
                  <h3 className="text-xl font-bold text-gray-900">
                    {currentStep === 'search' && 'Who are you?'}
                    {currentStep === 'confirm' && 'Is this you?'}
                    {currentStep === 'manual' && 'Your Details'}
                    {currentStep === 'sign' && 'Sign & Finish'}
                    {success && 'All Done!'}
                  </h3>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-8 py-10">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in shake duration-500">
                    <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                )}

                {success ? (
                  <div className="text-center py-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-bounce">
                      <CheckCircle size={40} />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">Success!</h4>
                    <p className="text-gray-600">{success}</p>
                    <button
                      onClick={handleClose}
                      className="mt-8 px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Step: Search */}
                    {currentStep === 'search' && (
                      <div className="space-y-8">
                        <form onSubmit={handleSearch} className="space-y-4">
                          <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Quick Sign with Reg No</label>
                          <div className="relative group">
                            <input
                              autoFocus
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="e.g., IN16/00014/22"
                              className="w-full pl-14 pr-4 py-4.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-[#00c6ff] focus:ring-4 focus:ring-[#00c6ff]/10 outline-none transition-all text-lg font-medium"
                              required
                            />
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00c6ff] transition-colors" size={24} />
                          </div>
                          <button
                            type="submit"
                            disabled={searching}
                            className="w-full py-4.5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all disabled:opacity-50"
                          >
                            {searching ? 'Checking database...' : 'Check Registration Number'}
                          </button>
                        </form>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                          <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-400 font-medium">OR</span></div>
                        </div>

                        <button
                          onClick={handleManualEntry}
                          className="w-full py-4.5 border-2 border-dashed border-gray-200 text-gray-600 font-bold rounded-2xl hover:border-purple-200 hover:bg-purple-50/30 hover:text-[#730051] transition-all flex items-center justify-center gap-3"
                        >
                          <UserPlus size={20} />
                          Manual Entry / Visitor
                        </button>
                      </div>
                    )}

                    {/* Step: Confirm Profile */}
                    {currentStep === 'confirm' && (
                      <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                        <div className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl border border-white shadow-inner">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6">
                            <span className="text-3xl font-bold bg-gradient-to-br from-[#730051] to-[#00c6ff] bg-clip-text text-transparent">
                              {attendanceData.fullName.charAt(0)}
                            </span>
                          </div>
                          <h4 className="text-2xl font-black text-gray-900 mb-1">{attendanceData.fullName}</h4>
                          <p className="text-gray-600 font-medium mb-4">{attendanceData.registrationNumber}</p>
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-purple-100/50">
                            <div>
                              <span className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Course</span>
                              <span className="text-sm font-bold text-gray-700">{attendanceData.course}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Year</span>
                              <span className="text-sm font-bold text-gray-700">Year {attendanceData.yearOfStudy}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <button
                            onClick={handleConfirmProfile}
                            className="w-full py-5 bg-gradient-to-r from-[#730051] to-[#9d176e] text-white font-black rounded-2xl shadow-xl shadow-purple-900/20 hover:scale-[1.02] flex items-center justify-center gap-3"
                          >
                            <Send size={18} />
                            Yes, This is Me!
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step: Manual Form */}
                    {currentStep === 'manual' && (
                      <form onSubmit={handleManualSubmit} className="space-y-5 animate-in slide-in-from-right-10 duration-500">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Member Category</label>
                            <div className="flex p-1 bg-gray-100 rounded-xl">
                              <button
                                type="button"
                                onClick={() => setAttendanceData(p => ({ ...p, userType: 'student' }))}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${attendanceData.userType === 'student' ? 'bg-white shadow-sm text-[#730051]' : 'text-gray-500'}`}
                              >
                                Student
                              </button>
                              <button
                                type="button"
                                onClick={() => setAttendanceData(p => ({ ...p, userType: 'visitor' }))}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${attendanceData.userType === 'visitor' ? 'bg-white shadow-sm text-[#730051]' : 'text-gray-500'}`}
                              >
                                Visitor
                              </button>
                            </div>
                          </div>

                          <div className="col-span-2">
                            <input
                              type="text"
                              placeholder="Full Name"
                              value={attendanceData.fullName}
                              onChange={(e) => setAttendanceData(p => ({ ...p, fullName: e.target.value }))}
                              className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-[#730051]/30 focus:ring-0 outline-none transition-all placeholder:font-medium font-bold"
                            />
                          </div>

                          {attendanceData.userType === 'student' ? (
                            <>
                              <div className="col-span-2">
                                <input
                                  type="text"
                                  placeholder="Registration No."
                                  value={attendanceData.registrationNumber}
                                  onChange={(e) => setAttendanceData(p => ({ ...p, registrationNumber: e.target.value }))}
                                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-[#730051]/30 outline-none transition-all font-bold uppercase"
                                />
                              </div>
                              <div className="col-span-2">
                                <input
                                  type="text"
                                  placeholder="Course Name"
                                  value={attendanceData.course}
                                  onChange={(e) => setAttendanceData(p => ({ ...p, course: e.target.value }))}
                                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-[#730051]/30 outline-none transition-all font-bold"
                                />
                              </div>
                              <div className="col-span-1">
                                <select
                                  value={attendanceData.yearOfStudy}
                                  onChange={(e) => setAttendanceData(p => ({ ...p, yearOfStudy: e.target.value }))}
                                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-[#730051]/30 outline-none transition-all font-bold cursor-pointer"
                                >
                                  <option value="">Year of Study</option>
                                  {[1, 2, 3, 4, 5, 6].map(yr => <option key={yr} value={yr}>Year {yr}</option>)}
                                </select>
                              </div>
                              <div className="col-span-1">
                                <input
                                  type="tel"
                                  placeholder="Phone No."
                                  value={attendanceData.phoneNumber}
                                  onChange={(e) => setAttendanceData(p => ({ ...p, phoneNumber: e.target.value }))}
                                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-[#730051]/30 outline-none transition-all font-bold"
                                />
                              </div>
                            </>
                          ) : (
                            <div className="col-span-2">
                              <input
                                type="tel"
                                placeholder="Phone No."
                                value={attendanceData.phoneNumber}
                                onChange={(e) => setAttendanceData(p => ({ ...p, phoneNumber: e.target.value }))}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-[#730051]/30 outline-none transition-all font-bold"
                              />
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-lg"
                        >
                          Continue to Signature
                        </button>
                      </form>
                    )}

                    {/* Step: Signature */}
                    {currentStep === 'sign' && (
                      <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
                        <div className="text-center mb-4">
                          <p className="text-gray-500 font-medium">Hello <span className="text-black font-extrabold">{attendanceData.fullName}</span>,</p>
                          <p className="text-gray-500 text-sm">Please sign below to record your attendance.</p>
                        </div>

                        <div className="relative group p-1 bg-gradient-to-br from-[#730051] to-[#00c6ff] rounded-3xl">
                          <div className="bg-white rounded-[1.4rem] overflow-hidden">
                            <canvas
                              ref={canvasRef}
                              width={400}
                              height={180}
                              className="w-full h-48 cursor-crosshair touch-none"
                            />
                            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Digital Signature Pad</span>
                              <button
                                type="button"
                                onClick={clearCanvas}
                                className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors bg-red-50 px-3 py-1.5 rounded-lg"
                              >
                                Clear Pad
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleSubmitFinal}
                          disabled={loading || !attendanceData.signature}
                          className="w-full py-5 bg-gradient-to-r from-[#730051] to-[#9d176e] text-white font-black rounded-2xl shadow-2xl shadow-purple-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center gap-3">
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Submitting...
                            </div>
                          ) : (
                            'Confirm & Sign Attendance'
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out 2;
        }
        canvas {
          image-rendering: -moz-crisp-edges;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          -ms-interpolation-mode: nearest-neighbor;
        }
      `}</style>
    </section>
  );
};

export default AttendanceSection;
