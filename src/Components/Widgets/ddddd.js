import "../../Style/Task.css"
import jalaali from 'jalaali-js';
import { useEffect, useState } from 'react';
import { fetchTasks } from '../../API/fetchTasks';


const DaysTaskChekbox = () => {

const [dateInfo, setDateInfo] = useState({});

  useEffect(() => {
    const now = new Date();

    const { jy, jm, jd } = jalaali.toJalaali(now);
    const persianNow = `${jd}/${jm}/${jy}`;
    const persianWeekday = now.toLocaleString('fa-IR', { weekday: 'long' });
    const persianDay = `${jd}`;
    const persianMonth = `${jm}`;
    const persianYear = `/${jy}`;

    setDateInfo({
      persianWeekday,
      persianNow,
      persianDay,
      persianMonth,
      persianYear,
    });
  }, []);

const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      const result = await fetchTasks();
      setTasks(result);
    };

    loadTasks();
  }, []);

  return (
    <div className="checkList" style={{width: "100%"}}>
      <p className='title'>لیست وظایف</p>
      {tasks.map((task, index) => (
        <div className="tasksList">
          <div className='showTask' key={index}>
            <div className="taskName">
              <p for={task.code}>{task.name}</p>
              <input value={task.code} type="checkbox" id={task.code}/>
            </div>
            <div className="taskInfo">
              <p className="taskInfoTitle">ساعت:</p>
              <p className="taskInfoValue">{task.time}</p>
            </div>
            <div className="taskInfo">
              <p className="taskInfoTitle">یاداشت:</p>
              <p className="taskInfoValue">{task.description}</p>
            </div>
          </div>
          <span className="daynum"><p>{dateInfo.persianDay}</p></span>
        </div>
      ))}
    </div>
  );
};

export default DaysTaskChekbox;