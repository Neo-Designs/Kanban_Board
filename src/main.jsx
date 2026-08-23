/**
 * ==============================================================================
 * Author: James Rajawasam
 * Description: Application entry point (main.jsx / index.jsx) that initializes
 *              the React DOM tree. It mounts the root App component into the
 *              HTML root container, applies global style sheets, and enables
 *              React's StrictMode for runtime checks and warnings.
 * ==============================================================================
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/theme.css';
import './styles/layout.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
