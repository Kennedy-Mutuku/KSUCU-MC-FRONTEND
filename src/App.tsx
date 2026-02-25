import { Outlet } from "react-router-dom"
import NotificationBubble from "./components/NotificationBubble"

function App() {
  return (
    <>
      <Outlet />
      <NotificationBubble />
    </>
  )
}

export default App


