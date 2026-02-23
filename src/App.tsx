import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import CommunityChat from "./components/CommunityChat";
import Header from "./components/landing/Header";
import { Footer } from "./components/landing";

function App() {
  return (
    <>
      <Header />
      {/* Spacer for persistent mobile icon sidebar */}
      <div className="md:hidden w-[52px] fixed top-0 left-0 bottom-0 z-0" />
      <div className="min-h-screen">
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
      </div>
      <Footer />
      <CommunityChat />
    </>
  )
}

export default App
