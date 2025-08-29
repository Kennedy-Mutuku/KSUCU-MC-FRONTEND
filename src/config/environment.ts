interface ApiConfig {
  baseUrl: string;
  endpoints: {
    news: string;
    users: string;
    usersSignup: string;
    usersLogin: string;
    usersLogout: string;
    usersResetPassword: string;
    usersForgetPassword: string;
    usersRecommendations: string;
    usersUpdate: string;
    usersBibleStudy: string;
    usersCountSaved: string;
    newsAdmin: string;
    newsAdminUpload: string;
    newsAdminLogout: string;
    missionAdmin: string;
    bsAdmin: string;
    superAdmin: string;
    admissionAdmin: string;
    admissionAdminAdmitUser: string;
    admissionAdminGetUsers: string;
    admissionAdminResetPassword: string;
    authGoogle: string;
    attendanceSession: string;
    attendanceSessionStatus: string;
    attendanceSessionOpen: string;
    attendanceSessionClose: string;
    attendanceSessionForceClose: string;
    attendanceSign: string;
    attendanceSignAnonymous: string;
    attendanceSessions: string;
    attendanceStartSession: string;
    attendanceEndSession: string;
    attendanceRecords: string;
    messages: string;
  };
}

const isDevelopment = import.meta.env.MODE === 'development' || window.location.hostname === 'localhost';

const developmentConfig: ApiConfig = {
  baseUrl: 'http://localhost:3000',
  endpoints: {
    news: '/adminnews/news',
    users: '/users/data',
    usersSignup: '/users/signup',
    usersLogin: '/users/login',
    usersLogout: '/users/logout',
    usersResetPassword: '/users/reset-password',
    usersForgetPassword: '/users/forget-password',
    usersRecommendations: '/users/recomendations',
    usersUpdate: '/users/update',
    usersBibleStudy: '/users/bibleStudy',
    usersCountSaved: '/users/countSaved',
    newsAdmin: '/adminnews/login',
    newsAdminUpload: '/adminnews/upload',
    newsAdminLogout: '/adminnews/logout',
    missionAdmin: '/adminmission/login',
    bsAdmin: '/adminBs/login',
    superAdmin: '/sadmin/login',
    admissionAdmin: '/admissionadmin/login',
    admissionAdminAdmitUser: '/admissionadmin/admit-user',
    admissionAdminGetUsers: '/admissionadmin/users',
    admissionAdminResetPassword: '/admissionadmin/reset-password',
    authGoogle: '/auth/google',
    attendanceSession: '/attendance/session',
    attendanceSessionStatus: '/attendance/session/status',
    attendanceSessionOpen: '/attendance/session/open',
    attendanceSessionClose: '/attendance/session/close',
    attendanceSessionForceClose: '/attendance/session/force-close',
    attendanceSign: '/attendance/sign',
    attendanceSignAnonymous: '/attendance/sign-anonymous',
    attendanceSessions: '/attendance/sessions',
    attendanceStartSession: '/attendance/start-session',
    attendanceEndSession: '/attendance/end-session',
    attendanceRecords: '/attendance/records',
    messages: '/messages'
  }
};

const productionConfig: ApiConfig = {
  baseUrl: 'https://ksucu-mc.co.ke',
  endpoints: {
    news: '/adminnews/news',
    users: '/users/data',
    usersSignup: '/users/signup',
    usersLogin: '/users/login',
    usersLogout: '/users/logout',
    usersResetPassword: '/users/reset-password',
    usersForgetPassword: '/users/forget-password',
    usersRecommendations: '/users/recomendations',
    usersUpdate: '/users/update',
    usersBibleStudy: '/users/bibleStudy',
    usersCountSaved: '/users/countSaved',
    newsAdmin: '/adminnews/login',
    newsAdminUpload: '/adminnews/upload',
    newsAdminLogout: '/adminnews/logout',
    missionAdmin: '/adminmission/login',
    bsAdmin: '/adminBs/login',
    superAdmin: '/sadmin/login',
    admissionAdmin: '/admissionadmin/login',
    admissionAdminAdmitUser: '/admissionadmin/admit-user',
    admissionAdminGetUsers: '/admissionadmin/users',
    admissionAdminResetPassword: '/admissionadmin/reset-password',
    authGoogle: '/auth/google',
    attendanceSession: '/attendance/session',
    attendanceSessionStatus: '/attendance/session/status',
    attendanceSessionOpen: '/attendance/session/open',
    attendanceSessionClose: '/attendance/session/close',
    attendanceSessionForceClose: '/attendance/session/force-close',
    attendanceSign: '/attendance/sign',
    attendanceSignAnonymous: '/attendance/sign-anonymous',
    attendanceSessions: '/attendance/sessions',
    attendanceStartSession: '/attendance/start-session',
    attendanceEndSession: '/attendance/end-session',
    attendanceRecords: '/attendance/records',
    messages: '/messages'
  }
};

export const config = isDevelopment ? developmentConfig : productionConfig;

export const getApiUrl = (endpoint: keyof ApiConfig['endpoints'], queryParams?: string): string => {
  const url = `${config.baseUrl}${config.endpoints[endpoint]}`;
  return queryParams ? `${url}?${queryParams}` : url;
};

export const isDevMode = (): boolean => isDevelopment;