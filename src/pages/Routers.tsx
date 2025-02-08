import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LandingPage from "./landing";
import FinancialsPage from "./Financials";
import MinistriesPage from "./Ministries";
import Etpage from "./Et";
import NoPage from "./NoPage";
import SignUp from "../components/signup";
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
import Elders from "./eldersPage"
import FeedbackForm from "../components/feedBackForm";
import SuperAdmin from "./superAdmin";

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
            {path: "/signUp", element: <SignUp />},
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
            {path: "*", element: <NoPage />}
        ]
    }
]);
