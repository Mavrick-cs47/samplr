import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { CreditsProvider } from './state/CreditsContext.jsx'

const KEY = (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '').trim();
const DEMO = String(import.meta.env.VITE_CLERK_DEMO || '').toLowerCase() === 'true'
const ENABLE_CLERK = (DEMO && KEY.length > 0) || /^pk_(test|live)_[A-Za-z0-9]+$/.test(KEY);

const root = document.getElementById('root');

createRoot(root).render(
  <BrowserRouter>
    {ENABLE_CLERK ? (
      <ClerkProvider publishableKey={KEY}>
        <CreditsProvider>
          <App />
        </CreditsProvider>
      </ClerkProvider>
    ) : (
      <CreditsProvider>
        <App />
      </CreditsProvider>
    )}
  </BrowserRouter>
);
