import { Outlet } from "react-router-dom"
import CommunityChat from "./components/CommunityChat"

function App() {
  return(
    <>
      <Outlet />
      <CommunityChat />
    </>
  )
}

export default App


