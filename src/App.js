import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import DarkVeil from './Components/DarkVeil';
import { Dashboard } from './Pages/Dashboard';
import TextPressure from './Components/TextPressure';
import { Tube } from 'ogl';
import Nav from './Components/Nav';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <div className='mainSection'>
          <div className='inliner'>
            <div className='backgrond'>
              <DarkVeil />
            </div>
            <Nav />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<div>Not Fuond</div>} />
          </Routes>
          </div>
        </div>
          <div className='fotter'>
            <TextPressure
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
          </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
