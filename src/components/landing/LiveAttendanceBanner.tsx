import { useState, useEffect } from 'react';
import { Radio, Clock } from 'lucide-react';
import { getApiUrl } from '../../config/environment';
import QuickAttendanceSign from '../attendance/QuickAttendanceSign';

interface Session {
  _id: string;
  title: string;
  ministry: string;
  leadershipRole: string;
  isActive: boolean;
  startTime: string;
  durationMinutes: number;
}

const LiveAttendanceBanner = () => {
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [signingSession, setSigningSession] = useState<Session | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const fetchSessions = async () => {
    try {
      const timestamp = Date.now();
      const response = await fetch(
        `${getApiUrl('attendanceSessionStatus')}?t=${timestamp}`,
        {
          credentials: 'include',
          headers: { 'Cache-Control': 'no-cache' },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const sessions: Session[] = data.sessions || [];
        setActiveSessions(sessions);
        // Animate in when sessions first appear
        if (sessions.length > 0 && !isVisible) {
          setTimeout(() => setIsVisible(true), 100);
        } else if (sessions.length === 0) {
          setIsVisible(false);
        }
      }
    } catch (err) {
      console.error('LiveAttendanceBanner: Error fetching sessions', err);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Nothing to show
  if (activeSessions.length === 0) return null;

  const formatTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <>
      <section
        id="live-attendance"
        className="scroll-mt-20"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)',
          overflow: 'hidden',
        }}
      >
        {/* Background */}
        <div
          style={{
            background: 'linear-gradient(135deg, #730051 0%, #4a0033 45%, #1a0012 100%)',
            position: 'relative',
          }}
        >
          {/* Subtle pattern overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.03) 0%, transparent 40%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '28px 16px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              {/* LIVE badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '100px',
                  padding: '6px 14px 6px 10px',
                }}
              >
                <span
                  style={{
                    position: 'relative',
                    display: 'flex',
                    width: '8px',
                    height: '8px',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      background: '#ef4444',
                      animation: 'livePing 1.5s cubic-bezier(0,0,0.2,1) infinite',
                      opacity: 0.75,
                    }}
                  />
                  <span
                    style={{
                      position: 'relative',
                      display: 'block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#ef4444',
                      boxShadow: '0 0 8px rgba(239,68,68,0.6)',
                    }}
                  />
                </span>
                <span
                  style={{
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  Live
                </span>
              </div>

              <h2
                style={{
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 700,
                  letterSpacing: '-0.3px',
                  margin: 0,
                }}
              >
                Attendance Open
              </h2>
            </div>

            {/* Session cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  activeSessions.length === 1
                    ? '1fr'
                    : 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '12px',
                maxWidth: activeSessions.length === 1 ? '420px' : '100%',
                margin: '0 auto',
              }}
            >
              {activeSessions.map((session) => (
                <div
                  id={`attendance-session-${session._id}`}
                  key={session._id}
                  style={{
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: '14px',
                    padding: '12px 16px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(0,0,0,0.18)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
                  }}
                >
                  {/* Card row: title + time + status + button */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* Title */}
                    <h3
                      style={{
                        fontSize: '15px',
                        fontWeight: 800,
                        color: '#1a1a2e',
                        margin: 0,
                        lineHeight: 1.3,
                        flex: '1 1 auto',
                        minWidth: '100px',
                      }}
                    >
                      {session.title}
                    </h3>

                    {/* Time pill */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        background: '#f8f5f7',
                        borderRadius: '8px',
                        flexShrink: 0,
                      }}
                    >
                      <Clock size={11} style={{ color: '#730051' }} />
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#5a5a6a' }}>
                        {formatTime(session.startTime)}
                      </span>
                    </div>

                    {/* Status dot */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                      <Radio size={12} style={{ color: '#22c55e' }} />
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => setSigningSession(session)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      marginTop: '10px',
                      background: 'linear-gradient(135deg, #730051 0%, #9d176e 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 800,
                      letterSpacing: '0.3px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 16px rgba(115, 0, 81, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(115, 0, 81, 0.45)';
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(115, 0, 81, 0.3)';
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                    }}
                    onMouseDown={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)';
                    }}
                    onMouseUp={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
                    }}
                  >
                    Sign Attendance
                  </button>
                </div>
              ))}
            </div>

            {/* Subtle helper text */}
            <p
              style={{
                textAlign: 'center',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.5)',
                marginTop: '14px',
                fontWeight: 500,
              }}
            >
              Tap a session above to record your attendance
            </p>
          </div>
        </div>
      </section>

      {/* QuickAttendanceSign modal */}
      {signingSession && (
        <QuickAttendanceSign
          session={signingSession}
          onClose={() => setSigningSession(null)}
        />
      )}

      <style>{`
        @keyframes livePing {
          0% { transform: scale(1); opacity: 0.75; }
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default LiveAttendanceBanner;
