export interface Member {
  id: string;
  name: string;
  ministry: string;
  phoneNumber: string;
  email: string;
  joinDate: string;
  isActive: boolean;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  ministry: string;
  date: string;
  present: boolean;
  eventType: 'rehearsal' | 'service' | 'meeting' | 'special-event';
  notes?: string;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  percentage: number;
}

export interface MinistryData {
  id: string;
  name: string;
  description: string;
  coordinator: string;
  memberCount: number;
  isActive: boolean;
}

export interface AttendanceEvent {
  id: string;
  title: string;
  date: string;
  eventType: 'rehearsal' | 'service' | 'meeting' | 'special-event';
  ministry: string;
  startTime: string;
  endTime: string;
  venue: string;
  description?: string;
  isCompleted: boolean;
}

export interface AttendanceReport {
  period: string;
  ministry: string;
  totalMembers: number;
  averageAttendance: number;
  attendanceByEvent: {
    eventType: string;
    averageAttendance: number;
    totalEvents: number;
  }[];
  memberAttendance: {
    memberId: string;
    memberName: string;
    attendanceRate: number;
    totalEvents: number;
    attendedEvents: number;
  }[];
}

export type TabType = 'attendance' | 'members' | 'events' | 'reports';
export type EventType = 'rehearsal' | 'service' | 'meeting' | 'special-event';
export type MinistryType = 'Praise and Worship' | 'Choir' | 'Wananzambe' | 'Instrumentalists';