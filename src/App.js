import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import DarkVeil from './Components/ReadyToUse/DarkVeil';
import { Dashboard } from './Pages/Dashboard';
import TextPressure from './Components/ReadyToUse/TextPressure';
import Nav from './Components/Nav';
import { useState } from 'react';
import AppHeader from './Components/AppHeader';
import { NotFound } from './Pages/NotFound';

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

  return (
    <div className="App">
      <BrowserRouter>
        <div className='mainSection'>
            <div className='backgrond'>
              <DarkVeil />
            </div>
            <header className='appHeader'>
              <AppHeader handleClick={openNav} hideMenuSection={hideMenuSection}/>
            </header>
            {showNav && <Nav onClose={closeNav}/>}
          <div className={`inliner ${showNav ? 'nav-active' : ''}`}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard showNav={showNav} />} />
            <Route path="*" element={<NotFound/>} />
          </Routes>
          </div>
        </div>
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
      </BrowserRouter>
    </div>
  );
}

export default App;
