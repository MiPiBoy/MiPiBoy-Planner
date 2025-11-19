import { createContext, useContext, useState } from 'react';

export const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [chartCompletedTasks, setChartCompletedTasks] = useState([]);
  const [chartTotalTasks, setChartTotalTasks] = useState([]);
  const [reloadFlag, setReloadFlag] = useState(false);

  const triggerReload = () => setReloadFlag(prev => !prev);

  return (
    <TaskContext.Provider value={{
      chartCompletedTasks,
      chartTotalTasks,
      setChartCompletedTasks,
      setChartTotalTasks,
      reloadFlag,
      triggerReload
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTaskContext = () => useContext(TaskContext);