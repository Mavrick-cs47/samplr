import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { CreditsProvider } from './state/CreditsContext.jsx'

const KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const ENABLE_CLERK = KEY && KEY !== 'pk_test_placeholder';

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
