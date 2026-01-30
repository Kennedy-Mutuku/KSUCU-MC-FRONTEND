import { useState, useEffect, useRef } from 'react';
import { getApiUrl } from '../../config/environment';
import axios from 'axios';
import { CheckCircle, AlertCircle, X, Pencil } from 'lucide-react';

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
            Pragma: 'no-cache',
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
      setShowForm(false);
      alert('Attendance session has been closed.');
    }
  }, [activeSession, showForm]);

  useEffect(() => {
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

      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#374151';
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
  }, [showForm]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!activeSession) {
      setError('No active attendance session found');
      return;
    }

    if (!attendanceData.fullName || !attendanceData.phoneNumber || !attendanceData.signature) {
      setError('Please fill in name, phone number, and signature');
      return;
    }

    if (attendanceData.userType === 'student') {
      if (!attendanceData.registrationNumber || !attendanceData.course || !attendanceData.yearOfStudy) {
        setError('Students must fill in registration number, course, and year');
        return;
      }
    }

    setLoading(true);
    try {
      const sessionResponse = await axios.get(getApiUrl('attendanceSessionStatus'), {
        withCredentials: true,
      });

      const latestSession = sessionResponse.data.session;
      if (!latestSession || !latestSession.isActive) {
        alert('No active attendance session found.');
        return;
      }

      const generateVisitorId = () => {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `VISITOR-${timestamp}-${random}`.toUpperCase();
      };

      const payload = {
        name: attendanceData.fullName.trim(),
        regNo: attendanceData.userType === 'student'
          ? attendanceData.registrationNumber.trim().toUpperCase()
          : generateVisitorId(),
        year: attendanceData.userType === 'student' ? parseInt(attendanceData.yearOfStudy) : 0,
        course: attendanceData.userType === 'student' ? attendanceData.course.trim() : 'N/A',
        phoneNumber: attendanceData.phoneNumber.trim(),
        signature: attendanceData.signature.trim(),
        userType: attendanceData.userType,
        ministry: 'General',
        sessionId: latestSession._id,
      };

      await axios.post(getApiUrl('attendanceSignAnonymous'), payload, { withCredentials: true });

      const timeString = new Date().toLocaleString();
      setSuccess(`Attendance submitted for ${attendanceData.fullName} at ${timeString}`);
      setTimeout(() => setSuccess(''), 5000);

      setAttendanceData(initialAttendanceData);
      clearCanvas();
    } catch (err: any) {
      let errorMessage = 'Error submitting attendance.';
      if (err.response?.status === 400) {
        const msg = err.response.data?.message || err.response.data?.error || '';
        if (msg.toLowerCase().includes('already')) {
          setError('This registration number has already been used in this session.');
          setAttendanceData((prev) => ({ ...prev, registrationNumber: '' }));
        } else {
          setError(errorMessage);
        }
      } else {
        setError(errorMessage);
      }
      setTimeout(() => setError(''), 6000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-6 md:py-16 bg-white">
      <div className="max-w-xl mx-auto px-4 md:px-6">
        <div className="text-center mb-3 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Sign Attendance
          </h2>
        </div>

        {activeSession?.isActive ? (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div>
                <p className="font-semibold text-green-800">Session Active</p>
                <p className="text-sm text-green-700">
                  {activeSession.leadershipRole} opened at{' '}
                  {new Date(activeSession.startTime).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <p className="text-gray-600 text-center">
              No attendance session is currently open.
            </p>
          </div>
        )}

        {!showForm && (
          <button
            onClick={() => {
              if (activeSession?.isActive) {
                setShowForm(true);
                setAttendanceData(initialAttendanceData);
              } else {
                alert('No active session. Please wait for a leader to open attendance.');
              }
            }}
            className="w-full py-3 bg-[#730051] text-white font-semibold rounded-xl shadow-md hover:bg-[#5a0040] transition-all duration-300 disabled:opacity-50"
            disabled={!activeSession?.isActive}
          >
            Sign Attendance
          </button>
        )}

        {/* Modal Popup */}
        {showForm && activeSession?.isActive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
              <div className="sticky top-0 bg-white px-3 py-4 border-b border-gray-100 flex items-center justify-between z-10">
                <h3 className="text-lg font-semibold text-gray-800">Sign Your Attendance</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              <div className="px-3 py-4">
                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                    <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800">{success}</p>
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={attendanceData.fullName}
                      onChange={(e) => setAttendanceData((prev) => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-[#730051] outline-none transition-all"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">I am a *</label>
                    <select
                      value={attendanceData.userType}
                      onChange={(e) => setAttendanceData((prev) => ({ ...prev, userType: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-[#730051] outline-none transition-all bg-white"
                      required
                    >
                      <option value="student">Student</option>
                      <option value="visitor">Visitor</option>
                    </select>
                  </div>

                  {attendanceData.userType === 'student' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number *</label>
                        <input
                          type="text"
                          value={attendanceData.registrationNumber}
                          onChange={(e) => setAttendanceData((prev) => ({ ...prev, registrationNumber: e.target.value }))}
                          placeholder="e.g., IN16/00014/22"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-[#730051] outline-none transition-all"
                          required
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                        <input
                          type="text"
                          value={attendanceData.course}
                          onChange={(e) => setAttendanceData((prev) => ({ ...prev, course: e.target.value }))}
                          placeholder="e.g., Computer Science"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-[#730051] outline-none transition-all"
                          required
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study *</label>
                        <select
                          value={attendanceData.yearOfStudy}
                          onChange={(e) => setAttendanceData((prev) => ({ ...prev, yearOfStudy: e.target.value }))}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-[#730051] outline-none transition-all bg-white"
                          required
                        >
                          <option value="">Select Year</option>
                          {[1, 2, 3, 4, 5, 6].map((yr) => (
                            <option key={yr} value={yr}>Year {yr}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={attendanceData.phoneNumber}
                      onChange={(e) => setAttendanceData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="e.g., +254712345678"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-[#730051] outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Digital Signature *</label>
                    <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                      <canvas
                        ref={canvasRef}
                        width={350}
                        height={80}
                        className="w-full h-20 bg-white border border-gray-200 rounded cursor-crosshair"
                        style={{ touchAction: 'none' }}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Pencil size={12} />
                          Draw signature above
                        </span>
                        <button
                          type="button"
                          onClick={clearCanvas}
                          className="text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-[#730051] text-white font-semibold rounded-lg hover:bg-[#5a0040] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting...' : 'Submit'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-3 bg-gray-100 text-gray-600 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AttendanceSection;
