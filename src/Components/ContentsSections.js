
import DataTime from './Widgets/DataTime';

const ContentsSections = () => {
    return (
        <div className="parent">
            <div className="contents contents-300">
                <div className='box'><DataTime/></div>
            </div>
            <div className="contents contents-100-1">
                <div className='box'>100</div>
            </div>
            <div className="contents contents-100-2">
                <div className='box'>100</div>
            </div>
            <div className="contents contents-400">
                <div className='box'>400</div>
            </div>
        </div>
        );
}

export default ContentsSections;