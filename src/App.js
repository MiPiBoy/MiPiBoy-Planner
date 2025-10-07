import './App.css';
import DarkVeil from './Components/DarkVeil';
import GlassSurface from './Components/GlassSurface';

function App() {

  return (
    <div className="App">
      <div className='backgrond'>
        <DarkVeil />
      </div>
      <div className='glassBox'>
        <GlassSurface>
          <div className='inGlassBox'>
            <h1>Hi Flow Parser Mixin parse Maybe Conditional</h1>
            <h1>Hi Flow Parser Mixin parse Maybe Conditional</h1>
            <h1>Hi Flow Parser Mixin parse Maybe Conditional</h1>
          </div>
        </GlassSurface>
      </div>
      <div className="divv box">
        <h1>Hi Flow Parser Mixin parse Maybe Conditional</h1>
        <h1>Hi Flow Parser Mixin parse Maybe Conditional</h1>
        <h1>Hi Flow Parser Mixin parse Maybe Conditional</h1>
      </div>
    </div>
  );
}

export default App;
