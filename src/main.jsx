import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import './Index.css'
import CoupleCardGenerator from './CoupleCardGenerator.jsx'
import CoupleDashboard from './CoupleDashboard.jsx'
import FastTalkInterface from './FastTalkInterface.jsx' // Import the new component

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <>
      {currentView === 'dashboard' && (
        <CoupleDashboard onNavigate={handleViewChange} />
      )}
      {currentView === 'cards' && (
        <CoupleCardGenerator onBackToDashboard={() => handleViewChange('dashboard')} />
      )}
      {currentView === 'fastTalk' && (
          <FastTalkInterface onBackToDashboard={() => handleViewChange('dashboard')} />
      )}
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);