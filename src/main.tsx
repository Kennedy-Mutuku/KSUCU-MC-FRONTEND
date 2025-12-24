import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './pages/Routers.tsx'
import { OfflineWrapper } from './components/OfflineWrapper.tsx'

// Force service worker update on page load
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    registration.update();
    console.log('Service worker update checked');
  });
  
  // Also unregister old service workers if needed
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      if (registration.active) {
        registration.update();
      }
    });
  });
}

// Disable browser cache for development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Cache-Control';
  meta.content = 'no-cache, no-store, must-revalidate';
  document.getElementsByTagName('head')[0].appendChild(meta);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <OfflineWrapper>
      <RouterProvider router={router} />
    </OfflineWrapper>
  </React.StrictMode>,
)


