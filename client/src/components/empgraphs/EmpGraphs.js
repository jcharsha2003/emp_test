import React,{useContext, useEffect} from 'react'
import { taskContext } from "../../context/TasksContextProvider";
import "./EmpGraphs.css"
import { useNavigate } from "react-router-dom";
import "./EmpGraphs.css"
import Graphs from '../graphs/Graphs';

const EmpGraphs = () => {

  let [tasks,setTasks]=useContext(taskContext)
  
  let navigate = useNavigate();
  let employees=()=>{
    navigate("/users")
  }
  return (
    <div> <button className='bt border rounded m-2 ' onClick={employees}><span className='fs-2'><i className="fa-solid fa-arrow-left-long"></i></span></button>
     <div className='container'>
           <Graphs/>
           </div>
    </div>
   
  )
}

export default EmpGraphs