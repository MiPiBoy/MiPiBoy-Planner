import DaysTaskChekbox from './Widgets/DaysTaskChekbox';
import AddTaskForm from './Widgets/AddTaskForm';
import DataTime from './Widgets/DataTime';
import DayChart from './Widgets/DayChart';
import SiteShortcut from './Widgets/SiteShortcut';


const ContentsSections = ({showNav}) => {
    return (
        <div className={`parent ${showNav ? 'nav-active' : ''}`}>
            <div className={`contents contents-300 ${showNav ? 'nav-active' : ''}`}>
                <div className='box'><DataTime/></div>
            </div>
            <div className={`contents contents-100-1 ${showNav ? 'nav-active' : ''}`}>
                <div style={{paddingInline:0}} className='box'><SiteShortcut/></div>
            </div>
            <div className={`contents contents-100-2 ${showNav ? 'nav-active' : ''}`}>
                <div className='box'>
                    <DayChart/>
                </div>
            </div>
            <div className={`contents contents-400 ${showNav ? 'nav-active' : ''}`}>
                <div className='box'>
                    <DaysTaskChekbox/>
                </div>
                <div className='box'>
                    <AddTaskForm/>
                </div>
            </div>
        </div>
        );
}

export default ContentsSections;