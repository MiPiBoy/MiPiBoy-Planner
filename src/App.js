import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import DarkVeil from './Components/ReadyToUse/DarkVeil';
import { Dashboard } from './Pages/Dashboard';
import Nav from './Components/Nav';
import MobileNav from './Components/MobileNav';
import { useState } from 'react';
import AppHeader from './Components/AppHeader';
import { NotFound } from './Pages/NotFound';
import { University } from './Pages/University';
import { Setting } from './Pages/Setting';
import { useSettingContext } from './Components/SettingContext';
import { useMediaQuery } from '@mui/material';
import { TaskProvider, useTaskContext } from './Components/TaskContext';
import DebugToast from './Components/MIniWidgets/DebugToast';

// ✅ کامپوننت داخلی که داخل TaskProvider هست
function AppContent() {
  const [showNav, setShowNav] = useState(false);
  const [hideMenuSection, setHideMenuSection] = useState(false);
  const { countdown, success, error, status } = useTaskContext();

  const toggleNav = () => setShowNav(prev => !prev);

  const openNav = () => {
    setHideMenuSection(true);
    toggleNav();
  };

  const closeNav = () => {
    setShowNav(false);
    setHideMenuSection(false);
  };

  const ifW685 = useMediaQuery('(min-width:685px)');
  const { mobileOptimizedMode } = useSettingContext();

  return (
    <div className='mainSection'>
      {mobileOptimizedMode ?
        <div className='backgrond'>
          <DarkVeil />
        </div>
        : null}
      {ifW685 ?
        <header className='appHeader'>
          <AppHeader handleClick={openNav} hideMenuSection={hideMenuSection} />
        </header>
        : null}
      {!ifW685 ? <MobileNav /> : null}
      {showNav && <Nav onClose={closeNav} />}
      <div className={`inliner ${showNav ? 'nav-active' : ''}`}>
        <Routes>
          <Route path="/" element={<Dashboard showNav={showNav} />} />
          <Route path="/university" element={<University />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <DebugToast
        status={status}
        error={error}
        success={success}
        countdown={countdown}
      />
    </div>
  );
}

// ✅ App فقط Provider ها رو wrap میکنه
function App() {
  return (
    <div className="App">
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <TaskProvider>
          <AppContent />
        </TaskProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
