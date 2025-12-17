import { useSettingContext } from '../Components/SettingContext.js';
import UniversityClass from '../Components/Widgets/UniversityClass.js';

export const University = () => {

  const { mobileOptimizedMode } = useSettingContext();

  return (
    <div className='mainCenter'>
      <div className='columnCenter'>
        <div className={`${!mobileOptimizedMode ? 'notEffectMOM' : 'notEffect'}`}>
          <div className="titleDiv" style={{ background: !mobileOptimizedMode ? "none" : "#19191969" }}>
            <p className="title">کلاس ها</p>
          </div>
          <div className='widgetBox taskaria'>
            <UniversityClass />
          </div>
        </div>
      </div>
    </div>

  )
};