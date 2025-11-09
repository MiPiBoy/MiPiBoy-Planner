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
import LifeViewerWidget from '../Components/Widgets/LifeViewerWidget.js';

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
                <LifeViewerWidget/>
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
              <div class="titleDiv">
              <p class="title">لیست وظایف</p>
              <div class="editButton">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.25 1.646H10.083C10.1827 1.646 10.2705 1.73381 10.2705 1.8335C10.2705 1.93319 10.1827 2.021 10.083 2.021H8.25C6.10181 2.021 4.4967 2.39832 3.44727 3.44775C2.39783 4.49719 2.02051 6.10229 2.02051 8.25049V13.7505C2.02055 15.8985 2.39788 17.5038 3.44727 18.5532C4.49671 19.6024 6.10203 19.979 8.25 19.979H13.75C15.898 19.979 17.5033 19.6026 18.5527 18.5532C19.6021 17.5038 19.9785 15.8985 19.9785 13.7505V11.9165C19.9787 11.8171 20.0666 11.7292 20.166 11.729C20.2656 11.729 20.3533 11.8169 20.3535 11.9165V13.7505C20.3535 16.1817 19.8321 17.7973 18.8145 18.8149C17.7968 19.8326 16.1812 20.354 13.75 20.354H8.25C5.81865 20.354 4.20229 19.8327 3.18457 18.8149C2.167 17.7973 1.64555 16.1815 1.64551 13.7505V8.25049C1.64551 5.81913 2.16685 4.20278 3.18457 3.18506C4.20229 2.16733 5.81865 1.646 8.25 1.646Z" fill="white" stroke="white">
              </path>
              <path d="M16.9678 1.41455C17.7086 1.41462 18.5081 1.78007 19.3643 2.63623C20.2985 3.57054 20.6502 4.45053 20.5762 5.27197C20.5078 5.94215 20.1473 6.64597 19.3662 7.41846L19.3643 7.42041L12.1406 14.6431C11.8399 14.9438 11.2519 15.2412 10.8311 15.2993H10.8281L8.06934 15.6938L8.04785 15.6968L8.02734 15.7017C7.97231 15.7143 7.90917 15.7163 7.79199 15.7163C7.35511 15.7163 6.97032 15.5598 6.69434 15.2915C6.37299 14.9684 6.21625 14.4836 6.29688 13.9331L6.29785 13.9312L6.69141 11.1714L6.69238 11.1694C6.75042 10.7486 7.04697 10.1607 7.34766 9.85986L14.5713 2.63623C15.4275 1.78005 16.2269 1.41455 16.9678 1.41455ZM16.7695 1.80322C16.0164 1.87293 15.3882 2.35236 14.8369 2.89893L14.8359 2.90088L7.6123 10.1245C7.47158 10.2653 7.34928 10.4625 7.26172 10.6362C7.17409 10.8102 7.0893 11.0243 7.05957 11.2173L7.05859 11.2231L6.66406 13.9819V13.9839C6.6147 14.3418 6.67541 14.7433 6.96191 15.0298C7.2484 15.316 7.64906 15.377 8.00684 15.3276L8.00879 15.3267L10.7686 14.9331L10.7734 14.9321C10.9651 14.9026 11.1806 14.8179 11.3564 14.73C11.5258 14.6453 11.7249 14.5228 11.8662 14.3774L11.8672 14.3784L19.0898 7.15576C19.7162 6.52941 20.1257 5.89292 20.1875 5.2251C20.2627 4.40916 19.8266 3.63759 19.0928 2.89404L19.0898 2.89209L18.7979 2.6167C18.1181 2.02126 17.453 1.74012 16.7695 1.80322Z" fill="white" stroke="white"></path><path d="M18.1959 9.01076C18.1318 9.01076 18.0676 9.00159 18.0126 8.98326C15.6018 8.30492 13.6859 6.38909 13.0076 3.97826C12.9068 3.61159 13.1176 3.23576 13.4843 3.12576C13.8509 3.02492 14.2268 3.23576 14.3276 3.60242C14.8776 5.55492 16.4268 7.10409 18.3793 7.65409C18.7459 7.75492 18.9568 8.13992 18.8559 8.50659C18.7734 8.81826 18.4984 9.01076 18.1959 9.01076Z" fill="white">
              </path>
              </svg>
              </div>
              </div>
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