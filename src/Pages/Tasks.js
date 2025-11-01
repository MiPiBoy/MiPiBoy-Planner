import LiquidGlass from '../Components/MIniWidgets/LiquidGlass/index.tsx'
import DataTime from '../Components/Widgets/DataTime';

export const Tasks = () => {
  return (
    <div className='erert'>
        <LiquidGlass
          displacementScale={64}
          blurAmount={0.1}
          saturation={130}
          aberrationIntensity={2}
          elasticity={0.35}
          cornerRadius={30}
          padding="15px"
          style={{ display: 'block', position: 'absolute', height: '100%', width: '100%'}}
        >
          <DataTime/>
        </LiquidGlass>
      </div>
)};