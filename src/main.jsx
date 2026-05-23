import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.scss';
import App from './app/App.jsx';
import { HeadProvider } from 'react-head';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <HeadProvider>
        <App />
      </HeadProvider>
    </BrowserRouter>
  // </StrictMode>
);
