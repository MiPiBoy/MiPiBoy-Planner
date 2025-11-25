import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import DarkVeil from './Components/ReadyToUse/DarkVeil';
import { Dashboard } from './Pages/Dashboard';
import TextPressure from './Components/ReadyToUse/TextPressure';
import Nav from './Components/Nav';
import MobileNav from './Components/MobileNav';
import { useState } from 'react';
import AppHeader from './Components/AppHeader';
import { NotFound } from './Pages/NotFound';
import { Tasks } from './Pages/Tasks';
import { Setting } from './Pages/Setting';
import { useSettingContext } from './Components/SettingContext';
import { useMediaQuery } from '@mui/material';

function App() {
  const [showNav, setShowNav] = useState(false);
  const [hideMenuSection, setHideMenuSection] = useState(false);

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
    <div className="App">
      <BrowserRouter>
        <div className='mainSection'>
          {!mobileOptimizedMode ?
            <div className='backgrond'>
              <DarkVeil/>
            </div>
            : null}
            {ifW685 ?
            <header className='appHeader'>
              <AppHeader handleClick={openNav} hideMenuSection={hideMenuSection}/>
            </header>
            : null}
            {!ifW685 ? <MobileNav/>: null}
            {showNav && <Nav onClose={closeNav}/>}
          <div className={`inliner ${showNav ? 'nav-active' : ''}`}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard showNav={showNav} />} />
            <Route path="/tasks" element={<Tasks/>} />
            <Route path="/setting" element={<Setting/>} />
            <Route path="*" element={<NotFound/>} />
          </Routes>
          </div>
        </div>
          {/* {ifW685 ?
            <TextPressure
              showNav={showNav}
              text="MIPIBOY"
              flex={true}
              alpha={false}
              stroke={true}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              strokeColor="#6528F7"
              minFontSize={28}
            />
            : null} */}
      </BrowserRouter>
    </div>
  );
}

export default App;
