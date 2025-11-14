import { PieChart } from '@mui/x-charts/PieChart';
import '../../Style/DayChartWidget.css'
import { useTaskContext } from '../../Components/TaskContext';


const DayChartWidget = () => {

const { chartCompletedTasks, chartTotalTasks } = useTaskContext();
const totalTasks = chartTotalTasks;
const completedTasks = chartCompletedTasks;
// const percent = Math.round((completedTasks / totalTasks) * 100);

const percent = chartTotalTasks > 0
  ? Math.round((completedTasks / totalTasks) * 100)
  : 0;

const data = [
    { id: 0, value: completedTasks, color: '#FFFFFF' },
];
const angle = percent * 3.6; // خروجی: 180 درجه

    return (
        <div style={{height: '100%'}}>
            <div style={{height: '40px', zIndex: '1'}}>    
            <div className='titleDiv'>
                <p className='title'>وضعیت روز</p>
                <div className="editButton" title='بعدی'>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.9639 6.21631C13.1865 5.51361 14.1842 5.5123 14.8438 5.89307C15.503 6.27366 15.9999 7.13782 16 8.55225V13.4478C16 14.8622 15.503 15.7263 14.8438 16.1069C14.1841 16.4878 13.1867 16.4857 11.9639 15.7827H11.9648L10.792 15.105C10.6625 15.0296 10.583 14.8918 10.583 14.7397V7.26025C10.583 7.14607 10.6279 7.04001 10.7051 6.9624L10.792 6.89502L11.9648 6.21729L11.9639 6.21631Z" fill="white" stroke="white"/>
                <path d="M8.66699 13.8765L7.72266 13.3267L7.7207 13.3257L7.5 13.1919C6.43817 12.5156 5.99805 11.7133 5.99805 10.9995C5.99823 10.2383 6.4991 9.37663 7.7207 8.67432L7.72266 8.67334L8.66699 8.12256V13.8765Z" fill="white" stroke="white"/>
                </svg>
                </div>
            </div>
            </div>
            <div className='dayChartWidget2'>
                <div style={{ position: 'relative', width: 120, height: 120 }}>
                    <PieChart series={[ { type: 'pie', data, innerRadius: 40, outerRadius: 50, paddingAngle: 2, endAngle: angle, }, ]} slotProps={{ legend: { hidden: true }, tooltip: { hidden: true }, }} width={120} height={120} />
                    <div className='percent'>
                        {percent}%
                    </div>
                </div>
            </div>
        </div>
)};

export default DayChartWidget;