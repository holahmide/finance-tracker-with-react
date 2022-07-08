import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import reportWebVitals from './reportWebVitals';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <ThemeProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
        />
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </>
);

reportWebVitals();
