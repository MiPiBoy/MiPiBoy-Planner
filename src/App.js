import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import DarkVeil from './Components/DarkVeil';
import { Dashboard } from './Pages/Dashboard';
import TextPressure from './Components/TextPressure';
import { Tube } from 'ogl';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <div className='mainSection'>
          <div className='backgrond'>
            <DarkVeil />
          </div>
          <div>
            <div></div>
          </div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<div>Not Fuond</div>} />
        </Routes>
        </div>
        <div>
          <div >
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
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
