import { createContext, useContext, useState } from 'react';

export const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [chartCompletedTasks, setChartCompletedTasks] = useState([]);
  const [chartTotalTasks, setChartTotalTasks] = useState([]);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [reloadFlag2, setReloadFlag2] = useState(false);
  const [reloadFlag3, setReloadFlag3] = useState(false);

  const triggerReload = () => setReloadFlag(prev => !prev);
  const triggerReload2 = () => setReloadFlag2(prev => !prev);
  const triggerReload3 = () => setReloadFlag3(prev => !prev);


  return (
    <TaskContext.Provider value={{
      chartCompletedTasks,
      chartTotalTasks,
      setChartCompletedTasks,
      setChartTotalTasks,
      reloadFlag,
      reloadFlag2,
      reloadFlag3,
      triggerReload,
      triggerReload2,
      triggerReload3
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTaskContext = () => useContext(TaskContext);