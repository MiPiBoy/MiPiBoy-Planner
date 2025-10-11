import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';
import navClose from '../assets/navClose.svg';


const Nav = ({ onClose }) => {
    const location = useLocation();

    const isDashboard = location.pathname.includes('/dashboard');
    const isDayTask = location.pathname.includes('/daytask');
    const isAddTask = location.pathname.includes('/addtask');
    const isAddBox = location.pathname.includes('/addbox');
    const isSetting = location.pathname.includes('/setting');
    


    return (
            <div className='navItemSection'>
                <div className='navHeade'>
                    <div className='navHeaderItem'>
                        <div onClick={onClose}style={{ height: '35px', width: '35px', cursor: 'pointer' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"><path d="M22 12c0-3.75 0-5.625-.955-6.939a5 5 0 0 0-1.106-1.106C18.625 3 16.749 3 13 3h-2c-3.75 0-5.625 0-6.939.955A5 5 0 0 0 2.955 5.06C2 6.375 2 8.251 2 12s0 5.625.955 6.939a5 5 0 0 0 1.106 1.106C5.375 21 7.251 21 11 21h2c3.75 0 5.625 0 6.939-.955a5 5 0 0 0 1.106-1.106C22 17.625 22 15.749 22 12Zm-7.5-8.5v17"/><path stroke-linecap="round" d="M19 7h-1.5m1.5 4h-1.5M8 10l1.227 1.057c.515.445.773.667.773.943s-.258.498-.773.943L8 14"/></g></svg>
                        </div>  
                        <span className="logotype">MIPIBOY</span>
                        <img src={logo} style={{ height: '35px', width:'35' }}/>
                    </div>
                    <Link to="/dashboard" className={`navItem ${isDashboard ? 'enableItem' : ''}`}>
                        <p>داشبورد</p>
                        <img src={navClose} style={{ height: '28px', width:'28' }}/>
                    </Link>
                    <Link to="/daytask" className={`navItem ${isDayTask ? 'enableItem' : ''}`}>
                        <p>وظایف روز</p>
                        <img src={navClose} style={{ height: '28px', width:'28' }}/>
                    </Link>
                    <Link to="/addtask" className={`navItem ${isAddTask ? 'enableItem' : ''}`}>
                        <p>افزودن وظیفه</p>
                        <img src={navClose} style={{ height: '28px', width:'28' }}/>
                    </Link>
                    <Link to="/addbox" className={`navItem ${isAddBox ? 'enableItem' : ''}`}>
                        <p>افرودن باکس</p>
                        <img src={navClose} style={{ height: '28px', width:'28' }}/>
                    </Link>
                </div>
                <div>
                    <Link to="/setting" className={`navItem ${isSetting ? 'enableItem' : ''}`}>
                        <p>تنظیمات</p>
                        <img src={navClose} style={{ height: '28px', width:'28' }}/>
                    </Link>
                    <Link className='navItem'>
                        <p>خروج</p>
                        <img src={navClose} style={{ height: '28px', width:'28' }}/>
                    </Link>
                </div>
            </div>
)}

export default Nav;