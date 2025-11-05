import shortCutPhoto1 from '../assets/shortCutPhoto1.png';
import shortCutPhoto2 from '../assets/shortCutPhoto2.png';
import shortCutPhoto3 from '../assets/shortCutPhoto3.png';
import shortCutPhoto4 from '../assets/shortCutPhoto4.png';
import LiquidGlass from '../Components/MIniWidgets/LiquidGlass/index.tsx';
// import LiquidGlass from 'liquid-glass-react';
import MagicBento, { GlobalSpotlight } from '../Components/ReadyToUse/MagicBento'
import '../Components/ReadyToUse/MagicBento.css';
import AddTaskForm from '../Components/Widgets/AddTaskForm';
import AppsShortcut from '../Components/Widgets/AppsShortcut.js';
import DataTime from '../Components/Widgets/DataTime';
import { useRef } from 'react';
import TasksChekbox from '../Components/Widgets/TasksChekbox.js';

export const Tasks = () => {
  
  const mainGridRef = useRef(null);
  
  return (
    <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
      <GlobalSpotlight
        gridRef={mainGridRef}
        enabled={true}
      />
      <div className='mainGrid' ref={mainGridRef}>

          <div className='column column1'>
            <MagicBento className='clockWidget' enableSpotlight={false}>
              <div style={{padding: '14px'}} className='widgetBox'>
                <DataTime/>
              </div>
            </MagicBento>
            <MagicBento className='widget boxesWidget' enableSpotlight={false}>
              <div className='widgetBox'>
                boxesWidget
              </div>
            </MagicBento>
          </div>
        
          <div className='column column2'>
            <MagicBento className='widget lifeViewerWidget' enableSpotlight={false}>
              <div className='widgetBox'>
                lifeViewerWidget
              </div>
            </MagicBento>
            <MagicBento className='notesWidget' enableSpotlight={false}>
              <div className='widgetBox'>
                notesWidget
              </div>
            </MagicBento>
            <div className='shortcutWidget'>
              <div className='widgetBox'>
                <AppsShortcut/>
              </div>
            </div>
          </div>

          <div className='column column3'>
            <MagicBento className='tasksWidget' enableSpotlight={false}>
              <div style={{padding: '14px', height: 'calc(100% - 27px)'}} className='widgetBox'>
                <TasksChekbox/>
              </div>
            </MagicBento>
            <MagicBento className='dayChartWidget' enableSpotlight={false}>
              <div className='widgetBox'>
                dayChartWidget
              </div>
            </MagicBento>
          </div>

      </div>
    </div>
)};