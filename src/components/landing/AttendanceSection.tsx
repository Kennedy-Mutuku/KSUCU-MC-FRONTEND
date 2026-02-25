import { useState, useEffect, useRef } from 'react';
import { getApiUrl } from '../../config/environment';
import axios from 'axios';
import { CheckCircle, AlertCircle } from 'lucide-react';

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

const AttendanceSection = () => {
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [attendanceData, setAttendanceData] = useState<AttendanceData>(initialAttendanceData);
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
        if (data.session && data.session.isActive) {
          setActiveSession({
            leadershipRole: data.session.leadershipRole || 'Leader',
            isActive: true,
            startTime: data.session.startTime,
            sessionId: data.session._id || data.session.sessionId,
          });
        } else {
          // Session ended — reset form state so stale sessionId is not reused
          setActiveSession(null);
          setShowForm(false);
          setAttendanceData(initialAttendanceData);
          setError('');
          setSuccess('');
        }
      } else {
        setActiveSession(null);
        setShowForm(false);
        setAttendanceData(initialAttendanceData);
      }
    } catch (err) {
      if (retryCount < 2) {
        setTimeout(() => checkActiveSession(retryCount + 1), 2000);
        return;
      }
      setActiveSession(null);
      setShowForm(false);
    }
  };

  useEffect(() => {
    checkActiveSession();
    const interval = setInterval(checkActiveSession, 5000);
    return () => clearInterval(interval);
  }, []);

  // Initialize canvas drawing logic
  useEffect(() => {
    if (showForm && !success) {
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

        const stopDrawing = () => { isDrawing = false; };

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
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showForm, success]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setAttendanceData((prev) => ({ ...prev, signature: '' }));
  };

  const handleSubmitFinal = async () => {
    if (!attendanceData.fullName || !attendanceData.phoneNumber) {
      setError('Please fill in your name and phone number.');
      return;
    }
    if (attendanceData.userType === 'student' && (!attendanceData.registrationNumber || !attendanceData.course || !attendanceData.yearOfStudy)) {
      setError('Please fill in all student details.');
      return;
    }
    if (!attendanceData.signature) {
      setError('Please provide your signature.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const generateVisitorId = () => `VISITOR-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase();

      const payload = {
        name: attendanceData.fullName.trim(),
        regNo: attendanceData.userType === 'student'
          ? attendanceData.registrationNumber.trim().toUpperCase()
          : generateVisitorId(),
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
    } catch (err: any) {
      const msg = err.response?.data?.message || '';
      if (msg.toLowerCase().includes('already')) {
        setError('You have already signed for this session.');
      } else if (msg.toLowerCase().includes('closed') || msg.toLowerCase().includes('not found')) {
        // Session was closed while the form was open — refresh state
        setError('This session has ended. Please wait for the next session to open.');
        setShowForm(false);
        setAttendanceData(initialAttendanceData);
        checkActiveSession();
      } else {
        setError(msg || 'Submission failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setAttendanceData(initialAttendanceData);
    setSuccess('');
    setError('');
  };

  return (
    <section className="min-h-screen py-16 bg-[#f7f7f8] flex flex-col items-center justify-start">
      <div className="w-full max-w-md px-4">

        {/* Top Tag */}
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-[0.18em] mb-5">
          Join a non-denominational Christian Student Association
        </p>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-center text-[#7a0e2e] mb-2 tracking-tight">
          Attendance Center
        </h1>

        {/* Subtitle */}
        <p className="text-center text-sm text-gray-400 mb-10 font-medium">
          Please sign in if you are attending any active session.
        </p>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-8" />

        {!showForm ? (
          <div className="flex flex-col items-center gap-6">
            {activeSession?.isActive ? (
              <>
                {/* Active session status pill */}
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-700 text-xs font-bold uppercase tracking-widest">1 Session Active</span>
                </div>

                {/* Active Status Card */}
                <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
                  <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-base mb-1">
                    <CheckCircle size={18} />
                    Session is open
                  </div>
                  <div className="text-[#7a0e2e] italic text-sm font-medium mt-1">
                    {activeSession.leadershipRole || 'A leader'} has opened attendance
                  </div>
                  <div className="text-gray-400 text-xs mt-3">
                    Started: {new Date(activeSession.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>

                  <div className="border-t border-gray-100 mt-5 pt-5">
                    <button
                      onClick={() => {
                        setShowForm(true);
                        setError('');
                        setSuccess('');
                      }}
                      className="w-full py-3 bg-[#7a0e2e] hover:bg-[#650924] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all uppercase tracking-widest"
                    >
                      Sign Attendance
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 0 Sessions Active pill */}
                <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-4 py-2">
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">0 Sessions Active</span>
                </div>

                {/* Empty State Card */}
                <div className="w-full bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
                  {/* Minimal icon */}
                  <div className="flex items-center justify-center mb-5">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <AlertCircle size={32} className="text-gray-300" strokeWidth={1.5} />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-gray-400 mb-1">No sessions currently open</h3>
                  <p className="text-gray-400 text-xs mt-1">Wait for a leader to start a session.</p>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Form Card */
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-8 md:px-8">
              <h2 className="text-xl font-extrabold text-[#7a0e2e] text-center mb-6">
                Sign Your Attendance
              </h2>

              {success ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 text-green-600">
                    <CheckCircle size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">All Done!</h4>
                  <p className="text-gray-500 text-sm mb-8">{success}</p>
                  <button
                    onClick={handleClose}
                    className="px-10 py-3 bg-[#7a0e2e] text-white font-bold rounded-xl hover:bg-[#650924] transition-all shadow"
                  >
                    Return Home
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 font-medium text-sm">
                      <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                      {error}
                    </div>
                  )}

                  {/* Full Name */}
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={attendanceData.fullName}
                    onChange={(e) => setAttendanceData(p => ({ ...p, fullName: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#7a0e2e] outline-none transition-all font-semibold text-gray-700 text-sm placeholder:text-gray-400"
                    required
                  />

                  {/* I am a Dropdown */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">I am a</label>
                    <select
                      value={attendanceData.userType}
                      onChange={(e) => setAttendanceData(p => ({ ...p, userType: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#7a0e2e] outline-none transition-all font-semibold text-gray-700 text-sm cursor-pointer"
                    >
                      <option value="student">Student</option>
                      <option value="visitor">Visitor</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>

                  {/* Student Fields */}
                  {attendanceData.userType === 'student' && (
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Registration Number"
                        value={attendanceData.registrationNumber}
                        onChange={(e) => setAttendanceData(p => ({ ...p, registrationNumber: e.target.value.toUpperCase() }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#7a0e2e] outline-none transition-all font-bold uppercase text-gray-700 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Course"
                        value={attendanceData.course}
                        onChange={(e) => setAttendanceData(p => ({ ...p, course: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#7a0e2e] outline-none transition-all font-semibold text-gray-700 text-sm"
                      />
                      <select
                        value={attendanceData.yearOfStudy}
                        onChange={(e) => setAttendanceData(p => ({ ...p, yearOfStudy: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#7a0e2e] outline-none transition-all font-semibold text-gray-700 text-sm cursor-pointer"
                      >
                        <option value="">Year of Study</option>
                        {[1, 2, 3, 4, 5, 6].map(yr => <option key={yr} value={yr.toString()}>Year {yr}</option>)}
                      </select>
                    </div>
                  )}

                  {/* Phone Number */}
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={attendanceData.phoneNumber}
                    onChange={(e) => setAttendanceData(p => ({ ...p, phoneNumber: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#7a0e2e] outline-none transition-all font-semibold text-gray-700 text-sm"
                    required
                  />

                  {/* Digital Signature */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Signature</label>
                    <div className="relative bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#7a0e2e] transition-all">
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={160}
                        className="w-full h-36 cursor-crosshair touch-none"
                      />
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="absolute top-2 right-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-500 text-[10px] font-bold rounded-lg hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                      >
                        Clear
                      </button>
                    </div>
                    <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">Draw signature above</p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 pt-2" />

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleSubmitFinal}
                      disabled={loading}
                      className="flex-1 py-3 text-sm bg-[#7a0e2e] hover:bg-[#650924] text-white font-bold rounded-xl shadow transition-all disabled:opacity-50 text-center"
                    >
                      {loading ? 'Processing...' : 'Submit Attendance'}
                    </button>
                    <button
                      onClick={handleClose}
                      className="flex-1 py-3 text-sm bg-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-200 transition-all text-center"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
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
        .animate-shake { animation: shake 0.4s ease-in-out; }
        canvas {
          image-rendering: crisp-edges;
          -ms-interpolation-mode: nearest-neighbor;
        }
      `}</style>
    </section>
  );
};

export default AttendanceSection;
