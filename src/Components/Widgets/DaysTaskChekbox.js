
import jalaali from 'jalaali-js';





const DaystasksChekbox = ({ tasks = [] }) => {




const generateJalaliDays = (startOffset = 0, count = 10) => {
  const days = [];
  const today = new Date();

  for (let i = startOffset; i < startOffset + count; i++) {
    const future = new Date(today);
    future.setDate(today.getDate() + i);

    const { jy, jm, jd } = jalaali.toJalaali(future);
    const formatted = `${jd}/${jm}/${jy}`;
    days.push(formatted);
  }

  return days;
};

const days = generateJalaliDays();




const shouldShowtasksForDate = (tasks, day) => {
  const tasksData = tasks.data;
  const tasksTaData = tasks.taData;

  // اگر هر دو خالی باشن → نمایش بده
  if (!tasksData && !tasksTaData) return true;

  // اگر data برابر با روز باشه → نمایش بده
  if (tasksData === day) return true;

  // اگر taData بزرگ‌تر از روز باشه → نمایش بده
  if (tasksTaData >= day) return true;

  // در غیر این صورت → نمایش نده
  return false;
};




  return (
    <div>
      {days.map((day, index) => (
        <div key={index} className="day-box">
          <h3>روز {index + 1} - {day}</h3>
          {tasks.filter(tasks => shouldShowtasksForDate(tasks, day)).map((tasks, i) => (
            <div key={i} className="tasks-card">
              <p>{tasks.name}</p>
              <p>{tasks.description}</p>
              <p>data: {tasks.data}</p>
              <p>taData: {tasks.taData}</p>
              <p>ساعت: {tasks.time}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DaystasksChekbox;