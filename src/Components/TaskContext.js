import { createContext, useContext, useState } from 'react';

export const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [chartCompletedTasks, setChartCompletedTasks] = useState([]);
  const [chartTotalTasks, setChartTotalTasks] = useState([]);

  return (
    <TaskContext.Provider value={{
      chartCompletedTasks,
      chartTotalTasks,
      setChartCompletedTasks,
      setChartTotalTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTaskContext = () => useContext(TaskContext);