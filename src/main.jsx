import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

// This is the main entry point for the React application.
// We tell React which DOM element to use and which component to render.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
