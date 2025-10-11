import TehranTime from '../MIniWidgets/TehranTime';
// import Clock from '../MIniWidgets/Clock';
import Data from '../MIniWidgets/Data';

const DataTime = () => {

  return (
    <div className='clock'>
    {/* <Clock/> ساعت */}
    <TehranTime/>
    <Data/>
    </div>
  );
}

export default DataTime;