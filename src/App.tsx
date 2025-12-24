import { Outlet, useLocation } from "react-router-dom"
import BackToTopButton from './components/BackToTopButton'
import CommunityChat from './components/CommunityChat'

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return(
    <>
      <Outlet />
      {!isAdminPage && <BackToTopButton />}
      {!isAdminPage && <CommunityChat />}
    </>
  )
}

export default App


