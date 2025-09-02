import { Outlet } from "react-router-dom"
import BackToTopButton from './components/BackToTopButton'

function App() {
 return(
  <>
    <Outlet />
    <BackToTopButton />
  </>
 )
}

export default App


