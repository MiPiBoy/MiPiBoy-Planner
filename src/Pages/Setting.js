import '../Style/Setting.css';
import { useEffect, useRef, useState } from "react";
import MagicBento, { GlobalSpotlight } from "../Components/ReadyToUse/MagicBento"
import { SettingProvider, useSettingContext } from '../Components/SettingContext';

export const Setting = () => {

// const usePersistentEffectStatus = () => {
//     const [effectStatus, setEffectStatus] = useState(() => {
//         const saved = localStorage.getItem('effectStatus');
//         return saved === 'false' ? false : true;
//     });
    
//     useEffect(() => {
//         localStorage.setItem('effectStatus', effectStatus);
//     }, [effectStatus]);
    
//     return [effectStatus, setEffectStatus];
//     };
    
// const [effectStatus, setEffectStatus] = usePersistentEffectStatus();

const { effectStatus, setEffectStatus } = useSettingContext();

const handleEffectStatus = () => {
    setEffectStatus(prev => !prev);
};


const mainEffectRef = useRef(null);

return (
    <div className="setting">
        {effectStatus ?
            <div className={`mainEffect`} ref={mainEffectRef}>
                <GlobalSpotlight gridRef={mainEffectRef} enabled={true} />
                <MagicBento enableSpotlight={false}>
                    <div style={{padding: '14px', width: '272px'}} className='widgetBox'>

                    </div>
                </MagicBento>
            </div>
            :
            <div>
                <div className='notEffect' style={{width: '300px'}}>
                    <div style={{padding: '14px'}} className='widgetBox'>

                    </div>
                </div>
            </div>
        }
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
                </div>
            </div>
        </div>
    </div>
)}