import GlassSurface from "./ReadyToUse/GlassSurface";
import logo from '../assets/logo.svg';
import navClose from '../assets/navClose.svg';

const AppHeader = ({ handleClick, hideMenuSection }) => {

    return (
        <div className="headerSection">
        {!hideMenuSection && (
        <GlassSurface className="headeritem logoSection" backgroundOpacity={0.1} saturation={1} borderWidth={0.07} brightness={50} opacity={0.93} blur={11} borderRadius={50} displace={0.5} distortionScale={-180} redOffset={0} greenOffset={10} blueOffset={20} mixBlendMode="screen" >
            <div onClick={handleClick}style={{ height: '35px', width: '35px', cursor: 'pointer' }}>
                <img src={navClose} style={{ height: '35px', width:'35' }}/>
            </div>
        </GlassSurface>
        )}
        {!hideMenuSection && (
        <GlassSurface className="headeritem logoSection" backgroundOpacity={0.1} saturation={1} borderWidth={0.07} brightness={50} opacity={0.93} blur={11} borderRadius={50} displace={0.5} distortionScale={-180} redOffset={0} greenOffset={10} blueOffset={20} mixBlendMode="screen" >
            <img src={logo} style={{ height: '35px', width:'35' }}/>
            <span className="logotype">M---------------------------------------------------Y</span>
        </GlassSurface>
        )}
        {!hideMenuSection && (
        <GlassSurface className="headeritem logoSection" backgroundOpacity={0.1} saturation={1} borderWidth={0.07} brightness={50} opacity={0.93} blur={11} borderRadius={50} displace={0.5} distortionScale={-180} redOffset={0} greenOffset={10} blueOffset={20} mixBlendMode="screen" >
            <img src={logo} style={{ height: '35px', width:'35' }}/>
            <span className="logotype">MIPIBOY</span>
        </GlassSurface>
        )}
        </div>
)}

export default AppHeader;