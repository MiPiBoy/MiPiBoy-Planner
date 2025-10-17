import AddTaskForm from './AddTaskForm';
import SubmitForm from './SubmitForm';
import DataTime from './Widgets/DataTime';
import DayChart from './Widgets/DayChart';
import SiteShortcut from './Widgets/SiteShortcut';


const ContentsSections = () => {
    return (
        <div className="parent">
            <div className="contents contents-300">
                <div className='box'><DataTime/></div>
            </div>
            <div className="contents contents-100-1">
                <div style={{paddingInline:0}} className='box'><SiteShortcut/></div>
            </div>
            <div className="contents contents-100-2">
                <div className='box'>
                    <DayChart/>
                </div>
            </div>
            <div className="contents contents-400">
                <div className='box'>
                    <SubmitForm/>
                </div>
            </div>
        </div>
        );
}

export default ContentsSections;