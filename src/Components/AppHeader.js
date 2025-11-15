import logo from '../assets/logo.svg';
import navClose from '../assets/navClose.svg';
import { useMediaQuery } from '@mui/material';
import Quixie from './MIniWidgets/Quixie';

const AppHeader = ({ handleClick, hideMenuSection }) => {

    const ifW1180 = useMediaQuery('(min-width:1180px)');

    return (
        <div className="headerSection">
        {!hideMenuSection && (
        <div className="headeritem navOpenIcon" backgroundOpacity={0.1} saturation={1} borderWidth={0.07} brightness={50} opacity={0.93} blur={11} borderRadius={50} displace={0.5} distortionScale={-180} redOffset={0} greenOffset={10} blueOffset={20} mixBlendMode="screen" >
            <div onClick={handleClick}style={{ height: '35px', width: '35px', cursor: 'pointer' }}>
                <img src={navClose} style={{ height: '35px', width:'35' }}/>
            </div>
        </div>
        )}

        {ifW1180 && !hideMenuSection && (
        <Quixie/>
        )}

        {!hideMenuSection && (
        <div className="headeritem logoSection" >
            <img src={logo} style={{ height: '35px', width:'35' }}/>
            <span className="logotype">MIPIBOY</span>
        </div>
        )}
        </div>
)}

export default AppHeader;