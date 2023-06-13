import React, { createContext, useState } from 'react'
export const taskContext=createContext();
const TasksContextProvider = ({children}) => {
     let [tasks,setTasks]=useState([])
  return (
    <taskContext.Provider value={[tasks,setTasks]}>
        {children}
    </taskContext.Provider>
  )
}

export default TasksContextProvider