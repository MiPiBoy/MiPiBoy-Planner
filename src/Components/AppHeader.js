import logo from '../assets/logo.svg';
import navClose from '../assets/navClose.svg';
import { useMediaQuery } from '@mui/material';
import Quixie from './MIniWidgets/Quixie';
import { useSettingContext } from '../Components/SettingContext.js';


const AppHeader = ({ handleClick, hideMenuSection }) => {

    const { mobileOptimizedMode } = useSettingContext();
    const ifW1180 = useMediaQuery('(min-width:1180px)');
    const ifW685 = useMediaQuery('(min-width:685px)'); 

    return (
        <div className="headerSection">
        {ifW685 && (
        !hideMenuSection ?
            <div className="headeritem navOpenIcon">
            <div 
                onClick={handleClick} 
                style={{ height: '35px', width: '35px', cursor: 'pointer' }}
            >
                <img 
                src={navClose} 
                style={{ height: '35px', width: '35px' }} 
                alt="close navigation"
                />
            </div>
            </div>
        :
            <div className="headeritem navOpenIcon">
            <div style={{ height: '35px', width: '35px' }}>
            </div>
            </div>
        )}


        {ifW1180 &&(
        <Quixie style={{width: '350px', background: !mobileOptimizedMode ? "var(--B2)" : "" }}/>
        )}

        <div className="headeritem logoSection" >
            <img src={logo} style={{ height: '35px', width:'35' }}/>
            <span className="logotype">MIPIBOY</span>
        </div>
        </div>
)}

export default AppHeader;