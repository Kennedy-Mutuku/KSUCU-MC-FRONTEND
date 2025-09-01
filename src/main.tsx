import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './pages/Routers.tsx'
import { OfflineWrapper } from './components/OfflineWrapper.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <OfflineWrapper>
      <RouterProvider router={router} />
    </OfflineWrapper>
  </React.StrictMode>,
)


