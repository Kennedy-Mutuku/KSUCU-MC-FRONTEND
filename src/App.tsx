import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import CommunityChat from "./components/CommunityChat";

function App() {
  return (
    <>
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
      <CommunityChat />
    </>
  )
}

export default App
