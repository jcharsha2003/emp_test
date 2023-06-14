import React from 'react'
import Graphs from '../graphs/Graphs'
import TaskList from '../taskslist/TaskList'
const EmpDashboard = () => {
  return (
    <div>
      <div>
      <Graphs/>
      </div>
      
    <div>
      <TaskList/>
    </div>
    </div>
  )
}

export default EmpDashboard