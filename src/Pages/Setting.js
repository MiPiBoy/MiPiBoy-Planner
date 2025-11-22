import '../Style/Setting.css';
import { SettingProvider, useSettingContext } from '../Components/SettingContext';

export const Setting = () => {

const { effectStatus, setEffectStatus } = useSettingContext();
const handleEffectStatus = () => {
    setEffectStatus(prev => !prev);
};

const { mobileOptimizedMode, setMobileOptimizedMode } = useSettingContext();
const handleMobileOptimizedMode = () => {
    setMobileOptimizedMode(prev => !prev);
};


return (
    <div className="setting">
        <div>
            <div className='notEffect' style={{width: '300px'}}>
                <div style={{padding: '14px'}} className='widgetBox'>
                    <div className="taskType">
                        <span style={{fontSize: "14px"}} >افکت ها</span>
                        <label className="switch">
                            <input type="checkbox"
                            checked={effectStatus}
                            onChange={handleEffectStatus}/>
                            <span className="slider"/>
                        </label>
                    </div>
                    <div className="taskType">
                        <span style={{fontSize: "14px"}} >حالت بهینه برای موبایل</span>
                        <label className="switch">
                            <input type="checkbox"
                            checked={mobileOptimizedMode}
                            onChange={handleMobileOptimizedMode}/>
                            <span className="slider"/>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
)}