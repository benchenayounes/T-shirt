import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { DesignProvider } from './contexts/DesignContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <DesignProvider>
      <App />
    </DesignProvider>
  </React.StrictMode>
);