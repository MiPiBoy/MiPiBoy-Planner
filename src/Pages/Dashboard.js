import MagicBento, { GlobalSpotlight } from '../Components/ReadyToUse/MagicBento'
import '../Components/ReadyToUse/MagicBento.css';
import '../Style/Dashboard.css';
import logo from '../assets/logo.svg';
import AddTaskForm from '../Components/Widgets/AddTaskForm';
import AddBoxForm from '../Components/Widgets/AddBoxForm';
import AppsShortcut from '../Components/Widgets/AppsShortcut.js';
import DayChartWidget from '../Components/Widgets/DayChartWidget.js';
import DataTime from '../Components/Widgets/DataTime';
import {useRef, useState } from 'react';
import TasksChekbox from '../Components/Widgets/TasksChekbox.js';
import BoxList from '../Components/Widgets/BoxList.js';
import LifeViewerWidget from '../Components/Widgets/LifeViewerWidget.js';
import NotesWidget from "../Components/Widgets/NotesWidget.js";
import { TaskProvider  } from '../Components/TaskContext.js';
import { useMediaQuery } from '@mui/material';
import Quixie from '../Components/MIniWidgets/Quixie.js';
import { useSettingContext } from '../Components/SettingContext.js';



export const Dashboard = ({showNav}) => {

  const ifW1180 = useMediaQuery('(min-width:1180px)');
  const ifW1024 = useMediaQuery('(min-width:1024px)');
  const ifW685 = useMediaQuery('(min-width:685px)');
  const ifW414 = useMediaQuery('(min-width:414px)');

  const quixieWidth = ifW685 ? 'calc(100% - 48px)' : 'calc(100% - 28px)';

  const [addTaskForm, setaddTaskForm] = useState("none");
  const [tasksChekbox, settasksChekbox] = useState("flex");

  const [addBoxForm, setAddBoxForm] = useState("none");
  const [boxList, setBoxList] = useState("flex");

  const mainEffectRef = useRef(null);

  const { effectStatus, mobileOptimizedMode } = useSettingContext();


  return (
    <TaskProvider>
  {effectStatus ?
    <div className={`mainEffect mainGridpar ${showNav ? 'nav-active' : ''}`} ref={mainEffectRef}>
      <GlobalSpotlight
        gridRef={mainEffectRef}
        enabled={true}
      />
      {!ifW1180 && (<div style={{display: "flex", gap: "14px", width: quixieWidth}}>
                    {!ifW685 ?
                    <div className="headeritem" >
                        <img src={logo} style={{ height: '35px', width:'35' }}/>
                        {/* <span className="logotype">MIPIBOY</span> */}
                    </div>
                    : null}
                    <Quixie style={{width: '100%'}}/>
                    </div>)}
      <div className={ `mainGrid ${showNav ? 'nav-active' : ''}`} >
          <div className='column column1'>
            <MagicBento className='clockWidget' enableSpotlight={false}>
              <div style={{padding: '14px'}} className='widgetBox'>
                <DataTime/>
              </div>
            </MagicBento>
            <MagicBento className='boxesWidget' enableSpotlight={false}>
                <div class="titleDiv">
                <p class="title">لیست باکس ها</p>
                <div style={{display: addBoxForm, padding:'2px'}} title='تایید' class="editButton" onClick={() =>{setAddBoxForm(addBoxForm === "flex" ? "none" : "flex");setBoxList(boxList === "none" ? "flex" : "none")}}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M3.66634 5.50016C2.52051 7.031 1.83301 8.93766 1.83301 11.0002C1.83301 16.0602 5.93967 20.1668 10.9997 20.1668C16.0597 20.1668 20.1663 16.0602 20.1663 11.0002C20.1663 5.94016 16.0597 1.8335 10.9997 1.8335C9.68884 1.8335 8.43301 2.1085 7.30551 2.61266" stroke="white" stroke-linecap="round" stroke-linejoin="round"/> <path d="M13.75 9.51484L14.7767 8.479" stroke="white" stroke-linecap="round" stroke-linejoin="round"/> <path d="M7.22363 11L9.7353 13.5208L12.0728 11.1925" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>
                </div>
                <div style={{display: boxList, padding:'2px'}} title='افزودن' class="editButton" onClick={() =>{setAddBoxForm(addBoxForm === "flex" ? "none" : "flex");setBoxList(boxList === "none" ? "flex" : "none")}}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M11 16.5V5.5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/> <path d="M14.667 11H16.5003" stroke="white" stroke-linecap="round" stroke-linejoin="round"/> <path d="M5.5 11H10.6883" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M11 16.5V5.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>
                </div>
                </div>
                <div style={{display: addBoxForm}} className='widgetBox taskaria'>
                  <AddBoxForm/>
                </div>
                <div style={{display: boxList}} className='widgetBox taskaria'>
                  <BoxList/>
                </div>
            </MagicBento>
          </div>
        
          {ifW1180 ? 
          <div className='column column2'>
            <MagicBento className='lifeViewerWidget' enableSpotlight={false}>
              <div className='widgetBox'>
                <LifeViewerWidget daysCount='343'/>
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
          : null}

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
              <div style={{display: addTaskForm}} className='widgetBox taskaria'>
                <AddTaskForm/>
              </div>
              <div style={{display: tasksChekbox}} className='widgetBox taskaria'>
                <TasksChekbox/>
              </div>
            </MagicBento>
            <MagicBento className='dayChartWidget' enableSpotlight={false}>
                <DayChartWidget/>
            </MagicBento>
          </div>
      </div>
  {ifW1180 ? null: 
      <div className='column column2' >
        <MagicBento className='lifeViewerWidget' enableSpotlight={false}>
          <div className='widgetBox'>
          <LifeViewerWidget daysCount={ifW685 ? '364' : '203'}/>
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
      </div>}
    </div>
    :
    <div className={`mainGridpar ${showNav ? 'nav-active' : ''}`} >
    {!ifW1180 && (<div style={{display: "flex", gap: "14px", width: quixieWidth}}>
              {!ifW685 ?
              <div className="headeritem" >
                  <img src={logo} style={{ height: '35px', width:'35' }}/>
                  {/* <span className="logotype">MIPIBOY</span> */}
              </div>
              : null}
              <Quixie style={{width: '100%'}}/>
              </div>)}
    <div className={ `mainGrid ${showNav ? 'nav-active' : ''}`} >
        <div className='column column1'>
          <div className={`${mobileOptimizedMode ? 'notEffectMOM' : 'notEffect'} clockWidget`}>
            <div style={{padding: '14px'}} className='widgetBox'>
              <DataTime/>
            </div>
          </div>
          <div className={`${mobileOptimizedMode ? 'notEffectMOM' : 'notEffect'} boxesWidget`}>
            <div class="titleDiv">
            <p class="title">لیست باکس ها</p>
            <div style={{display: addBoxForm, padding:'2px'}} title='تایید' class="editButton" onClick={() =>{setAddBoxForm(addBoxForm === "flex" ? "none" : "flex");setBoxList(boxList === "none" ? "flex" : "none")}}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M3.66634 5.50016C2.52051 7.031 1.83301 8.93766 1.83301 11.0002C1.83301 16.0602 5.93967 20.1668 10.9997 20.1668C16.0597 20.1668 20.1663 16.0602 20.1663 11.0002C20.1663 5.94016 16.0597 1.8335 10.9997 1.8335C9.68884 1.8335 8.43301 2.1085 7.30551 2.61266" stroke="white" stroke-linecap="round" stroke-linejoin="round"/> <path d="M13.75 9.51484L14.7767 8.479" stroke="white" stroke-linecap="round" stroke-linejoin="round"/> <path d="M7.22363 11L9.7353 13.5208L12.0728 11.1925" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>
            </div>
            <div style={{display: boxList, padding:'2px'}} title='افزودن' class="editButton" onClick={() =>{setAddBoxForm(addBoxForm === "flex" ? "none" : "flex");setBoxList(boxList === "none" ? "flex" : "none")}}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M11 16.5V5.5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/> <path d="M14.667 11H16.5003" stroke="white" stroke-linecap="round" stroke-linejoin="round"/> <path d="M5.5 11H10.6883" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M11 16.5V5.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>
            </div>
            </div>
            <div style={{display: addBoxForm}} className='widgetBox taskaria'>
              <AddBoxForm/>
            </div>
            <div style={{display: boxList}} className='widgetBox taskaria'>
              <BoxList/>
            </div>
          </div>
        </div>
      
        {ifW1180 ? 
        <div className='column column2'>
          <div className={`${mobileOptimizedMode ? 'notEffectMOM' : 'notEffect'} lifeViewerWidget`}>
            <div className='widgetBox'>
              <LifeViewerWidget daysCount='343'/>
            </div>
          </div>
          <div className={`${mobileOptimizedMode ? 'notEffectMOM' : 'notEffect'} notesWidget`}>
            <div className='widgetBox' style={{height: '100%'}}>
              <NotesWidget/>
            </div>
          </div>
          {/* <div className='shortcutWidget'>
            <div className='widgetBox'>
              <AppsShortcut/>
            </div>
          </div> */}
        </div> 
        : null}

        <div className='column column3'>
          <div className={`${mobileOptimizedMode ? 'notEffectMOM' : 'notEffect'} tasksWidget`}>
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
            <div style={{display: addTaskForm}} className='widgetBox taskaria'>
              <AddTaskForm/>
            </div>
            <div style={{display: tasksChekbox}} className='widgetBox taskaria'>
              <TasksChekbox/>
            </div>
          </div>
          <div className={`${mobileOptimizedMode ? 'notEffectMOM' : 'notEffect'} dayChartWidget`}>
              <DayChartWidget/>
          </div>
        </div>
    </div>
{ifW1180 ? null: 
    <div className='column column2' >
      <div className={`${mobileOptimizedMode ? 'notEffectMOM' : 'notEffect'} lifeViewerWidget`}>
        <div className='widgetBox'>
        <LifeViewerWidget daysCount={ifW685 ? '364' : '203'}/>
        </div>
      </div>
      <div className={`${mobileOptimizedMode ? 'notEffectMOM' : 'notEffect'} notesWidget`}>
        <div className='widgetBox' style={{height: '100%'}}>
          <NotesWidget/>
        </div>
      </div>
      {/* <div className='shortcutWidget'>
        <div className='widgetBox'>
          <AppsShortcut/>
        </div>
      </div> */}
    </div>}
  </div>}
  </TaskProvider>
)};