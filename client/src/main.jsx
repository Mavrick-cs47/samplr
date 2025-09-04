import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { CreditsProvider } from './state/CreditsContext.jsx'


const root = document.getElementById('root');

createRoot(root).render(
  <BrowserRouter>
    <CreditsProvider>
      <App />
    </CreditsProvider>
  </BrowserRouter>
);
