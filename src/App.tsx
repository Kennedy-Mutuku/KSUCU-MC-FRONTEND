<<<<<<< HEAD
import { Outlet } from "react-router-dom"
import NotificationBubble from "./components/NotificationBubble"
=======
import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import CommunityChat from "./components/CommunityChat";
import Header from "./components/landing/Header";
import { Footer } from "./components/landing";
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79

function App() {
  return (
    <>
<<<<<<< HEAD
      <Outlet />
      <NotificationBubble />
=======
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
>>>>>>> 48cfd2009546c7f66d045eb78952fc0474a4ee79
    </>
  )
}

export default App
