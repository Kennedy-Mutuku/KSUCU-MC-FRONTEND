import { Outlet } from "react-router-dom"
import BackToTopButton from './components/BackToTopButton'
import CommunityChat from './components/CommunityChat'

function App() {
 return(
  <>
    <Outlet />
    <BackToTopButton />
    <CommunityChat />
  </>
 )
}

export default App


