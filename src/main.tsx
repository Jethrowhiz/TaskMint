import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './context/AppContext.tsx'
import { Toaster } from './components/ui/toaster.tsx'
import { BrowserRouter, Routes, Route } from "react-router";
import BountiesPage from './bounties/page.tsx'
import CreateBountyPage from './create-bounty/page.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
            <Route path="/bounties" element={<BountiesPage />} />
            <Route path="/create-bounty" element={<CreateBountyPage />} />

        </Routes>
      </BrowserRouter>
      
      <Toaster />
    </AppProvider>
  </StrictMode>,
)
