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
            {path: "/boards", element: <BoardsPage />},
            {path: "/changeDetails", element: <ChangeDetails />},
            {path: "/news", element: <NewsPage />},
            {path: "*", element: <NoPage />}
        ]
    }
])



