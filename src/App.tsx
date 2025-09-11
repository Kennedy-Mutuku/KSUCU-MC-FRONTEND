import { Outlet } from "react-router-dom"
import BackToTopButton from './components/BackToTopButton'
import CommunityChat from './components/CommunityChat'
import { AuthProvider } from './context/AuthContext'

function App() {
 return(
  <AuthProvider>
    <Outlet />
    <BackToTopButton />
    <CommunityChat />
  </AuthProvider>
 )
}

export default App


