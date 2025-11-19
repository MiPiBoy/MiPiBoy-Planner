import logo from '../assets/logo.svg';
import navClose from '../assets/navClose.svg';
import { useMediaQuery } from '@mui/material';
import Quixie from './MIniWidgets/Quixie';

const AppHeader = ({ handleClick, hideMenuSection }) => {

    const ifW1180 = useMediaQuery('(min-width:1180px)');

    return (
        <div className="headerSection">
        {!hideMenuSection && (
        <div className="headeritem navOpenIcon">
            <div onClick={handleClick}style={{ height: '35px', width: '35px', cursor: 'pointer' }}>
                <img src={navClose} style={{ height: '35px', width:'35' }}/>
            </div>
        </div>
        )}
        {hideMenuSection && (
        <div className="headeritem navOpenIcon">
        </div>
        )}

        {ifW1180 &&(
        <Quixie/>
        )}

        <div className="headeritem logoSection" >
            <img src={logo} style={{ height: '35px', width:'35' }}/>
            <span className="logotype">MIPIBOY</span>
        </div>
        </div>
)}

export default AppHeader;