import MagicBento, { GlobalSpotlight } from '../Components/ReadyToUse/MagicBento'
import '../Components/ReadyToUse/MagicBento.css';
import AddTaskForm from '../Components/Widgets/AddTaskForm';
import AppsShortcut from '../Components/Widgets/AppsShortcut.js';
import DataTime from '../Components/Widgets/DataTime';
import { useRef, useState } from 'react';
import TasksChekbox from '../Components/Widgets/TasksChekbox.js';
import LifeViewerWidget from '../Components/Widgets/LifeViewerWidget.js';
import NotesWidget from "../Components/Widgets/NotesWidget.js";

export const Dashboard = ({showNav}) => {

  const [addTaskForm, setaddTaskForm] = useState("none");
  const [tasksChekbox, settasksChekbox] = useState("flex");

  const mainGridRef = useRef(null);
  
  return (
    <div className={`mainGridpar ${showNav ? 'nav-active' : ''}`}>
      <GlobalSpotlight
        gridRef={mainGridRef}
        enabled={true}
      />
      <div className={`mainGrid ${showNav ? 'nav-active' : ''}`} ref={mainGridRef}>

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
            <MagicBento className='lifeViewerWidget' enableSpotlight={false}>
              <div className='widgetBox'>
                <LifeViewerWidget/>
              </div>
            </MagicBento>
            <MagicBento className='notesWidget' enableSpotlight={false}>
              <div className='widgetBox' style={{height: '100%'}}>
                <NotesWidget/>
              </div>
            </MagicBento>
            {/* <div className='shortcutWidget'>
              <div className='widgetBox'>
                <AppsShortcut/>
              </div>
            </div> */}
          </div>

          <div className='column column3'>
            <MagicBento className='tasksWidget' enableSpotlight={false}>
              <div class="titleDiv">
              <p class="title">لیست وظایف</p>
              <div style={{display: addTaskForm, padding:'2px'}} title='تایید' class="editButton" onClick={() =>{setaddTaskForm(addTaskForm === "flex" ? "none" : "flex");settasksChekbox(tasksChekbox === "none" ? "flex" : "none")}}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.66634 5.50016C2.52051 7.031 1.83301 8.93766 1.83301 11.0002C1.83301 16.0602 5.93967 20.1668 10.9997 20.1668C16.0597 20.1668 20.1663 16.0602 20.1663 11.0002C20.1663 5.94016 16.0597 1.8335 10.9997 1.8335C9.68884 1.8335 8.43301 2.1085 7.30551 2.61266" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13.75 9.51484L14.7767 8.479" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.22363 11L9.7353 13.5208L12.0728 11.1925" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              </div>
              <div style={{display: tasksChekbox, padding:'2px'}} title='افزودن' class="editButton" onClick={() =>{setaddTaskForm(addTaskForm === "flex" ? "none" : "flex");settasksChekbox(tasksChekbox === "none" ? "flex" : "none")}}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 16.5V5.5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14.667 11H16.5003" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5.5 11H10.6883" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M11 16.5V5.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              </div>
              </div>
              <div style={{display: addTaskForm, padding: '14px', height: 'calc(100% - 27px)'}} className='widgetBox'>
                <AddTaskForm/>
              </div>
              <div style={{display: tasksChekbox, padding: '14px', height: 'calc(100% - 27px)'}} className='widgetBox'>
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