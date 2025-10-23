import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LandingPage from "./landing";
import FinancialsPage from "./Financials";
import MinistriesPage from "./Ministries";
import Etpage from "./Et";
import NoPage from "./NoPage";
import SignIn from "../components/signin";
import Bs from "../components/bibleStudy";
import SavedSouls from "./savedSouls";
import Forgotpassword from "../components/forgotPassword";
import ClassesSection from "./classes";
import BoardsPage from "./boards";
import ChangeDetails from "../components/changeDetails";
import NewsPage from "./NewsPage";
import PhotoUploadPage from "./newsadminText";
import PasswordReset from "../components/newPaaswwordInput";
import SavedSoulsList from "./adminMission";
import BsMembersList from "./adminBs";
import Library from "./library";
import Media from "./media"
import MediaAdmin from "./MediaAdmin"
import Elders from "./eldersPage"
import FeedbackForm from "../components/feedBackForm";
import SuperAdmin from "./superAdmin";
import PraiseandWorshipCommitment from "../commitmentForms/praiseandWorship";
import ChoirCommitment from "../commitmentForms/Choir";
import InstrumentalistsCommitment from "../commitmentForms/instrumentalists";
import AdmissionAdmin from "./admissionAdmin";
import UserProfilePage from "./userProfile";
import UserManagement from "./userManagement";
import WorshipDocketAdmin from "./WorshipDocketAdmin";
import UsheringPage from "./ministries/ushering";
import CreativityPage from "./ministries/creativity";
import CompassionPage from "./ministries/compassion";
import IntercessoryPage from "./ministries/intercessory";
import HighSchoolPage from "./ministries/highSchool";
import WananzambePage from "./ministries/wananzambe";
import ChurchSchoolPage from "./ministries/churchSchool";
import PraiseAndWorshipPage from "./ministries/praiseAndWorship";
import ChoirPage from "./ministries/choir";
import ContactUs from "./ContactUs";
import MessagesAdmin from "./MessagesAdmin";
import AttendanceSessionManagement from "./AttendanceSessionManagement";
import NewsAdmin from "./NewsAdmin";
import Requisitions from "./Requisitions";
import RequisitionsAdmin from "./RequisitionsAdmin";
import CompassionCounselingPage from "./CompassionCounseling";
import CompassionCounselingAdmin from "./CompassionCounselingAdmin";
import PollingOfficerDashboard from "./PollingOfficerDashboard";
import PollingOfficerManagement from "./PollingOfficerManagement";
import MyDocs from "./MyDocs";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children:[
            {path: "", element: <LandingPage />},
            {path: "/Home", element: <LandingPage />},
            {path: "/financial", element: <FinancialsPage />},
            {path: "/ministries", element: <MinistriesPage />},
            {path: "/ets", element: <Etpage />},
            {path: "/signIn", element: <SignIn />},
            {path: "/Bs", element: <Bs />},
            {path: "/save", element: <SavedSouls />},
            {path: "/forgotPassword", element: <Forgotpassword />},
            {path: "/fellowshipsandclasses", element: <ClassesSection />},
            {path: "/boards", element: <BoardsPage />},
            {path: "/changeDetails", element: <ChangeDetails />},
            {path: "/news", element: <NewsPage />},
            {path: "/adminnews", element: <PhotoUploadPage />},
            {path: "/reset", element: <PasswordReset />},
            {path: "/adminmission", element: <SavedSoulsList />},
            {path: "/adminBs", element: <BsMembersList />},
            {path: "/library", element: <Library />},
            {path: "/media", element: <Media />},
            {path: "/elders", element: <Elders />},
            {path: "/recomendations", element: <FeedbackForm />},
            {path: "/admin", element: <SuperAdmin />},
            {path: "/p&w", element: <PraiseandWorshipCommitment />},
            {path: "/choir", element: <ChoirCommitment />},
            {path: "/wananzambe", element: <InstrumentalistsCommitment />},
            {path: "/admission", element: <AdmissionAdmin />},
            {path: "/user-management", element: <UserManagement />},
            {path: "/profile", element: <UserProfilePage />},
            {path: "/worship-docket-admin", element: <WorshipDocketAdmin />},
            {path: "/media-admin", element: <MediaAdmin />},
            {path: "/ministries/ushering", element: <UsheringPage />},
            {path: "/ministries/creativity", element: <CreativityPage />},
            {path: "/ministries/compassion", element: <CompassionPage />},
            {path: "/ministries/intercessory", element: <IntercessoryPage />},
            {path: "/ministries/highSchool", element: <HighSchoolPage />},
            {path: "/ministries/wananzambe", element: <WananzambePage />},
            {path: "/ministries/churchSchool", element: <ChurchSchoolPage />},
            {path: "/ministries/praiseAndWorship", element: <PraiseAndWorshipPage />},
            {path: "/ministries/choir", element: <ChoirPage />},
            {path: "/contact-us", element: <ContactUs />},
            {path: "/messages-admin", element: <MessagesAdmin />},
            {path: "/attendance-session-management", element: <AttendanceSessionManagement />},
            {path: "/news-admin", element: <NewsAdmin />},
            {path: "/requisitions", element: <Requisitions />},
            {path: "/requisitions-admin", element: <RequisitionsAdmin />},
            {path: "/compassion-counseling", element: <CompassionCounselingPage />},
            {path: "/compassion-counseling-admin", element: <CompassionCounselingAdmin />},
            {path: "/polling-officer-dashboard", element: <PollingOfficerDashboard />},
            {path: "/polling-officer-management", element: <PollingOfficerManagement />},
            {path: "/my-docs", element: <MyDocs />},
            {path: "*", element: <NoPage />}
        ]
    }
]);
