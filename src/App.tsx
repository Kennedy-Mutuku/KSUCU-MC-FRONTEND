import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import CommunityChat from "./components/CommunityChat";
import Header from "./components/landing/Header";
import { Footer } from "./components/landing";
import NotificationBubble from "./components/NotificationBubble";

function App() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-16 md:pt-20 ml-[52px] md:ml-0">
        <Suspense fallback={
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: '#fff',
            color: '#730051',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            Loading...
          </div>
        }>
          <Outlet />
        </Suspense>
        <Footer />
      </div>
      <CommunityChat />
      <NotificationBubble />
    </>
  )
}

export default App
