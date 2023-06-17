import axios from "axios";
import { loginContext } from "../../context/loginContext";
import { taskContext } from "../../context/TasksContextProvider";
import React from "react";
import { useState, useEffect, useContext } from "react";

import "./AddTask.css";
import { useForm } from "react-hook-form";
import TaskList from "../taskslist/TaskList";
const AddTask = () => {
  let [alert, setAlert] = useState("");
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (dd < 10) {
    dd = "0" + dd;
  }
  let maxdate = yyyy + "-" + mm + "-" + dd;
  let [error, setError] = useState("");
  let token = sessionStorage.getItem("token");
  let [currentUser, err, userLoginStatus, loginUser, logoutUser, role] =
    useContext(loginContext);
  let [tasks, setTasks] = useContext(taskContext);
  let {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm();

  const putTask = (newTask) => {
    axios
      .put(
        `http://localhost:5000/user-api/update-task/${currentUser.email}`,
        newTask,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data.message);
          getUsers();
          setAlert("");
        }
        if (response.status !== 200) {
          setError(response.data.message);
        }
      })
      .catch((err) => {
        if (err.response) {
          setError(err.message);
        } else if (err.request) {
          setError(err.message);
        } else {
          setError(err.message);
        }
      });
      reset()
  };
  const getUsers = () => {
    axios
      .get(`http://localhost:5000/user-api/get-user/${currentUser.email}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        if (response.status === 200) {
          setTasks(response.data.payload);
          
        }
        if (response.status !== 200) {
          setError(response.data.message);
        }
      })
      .catch((err) => {
        if (err.response) {
          setError(err.message);
          console.log(err.response);
        } else if (err.request) {
          setError(err.message);
        } else {
          setError(err.message);
        }
      });
    reset();
  };
  useEffect(() => {
    getUsers();
  }, []);

  let formSubmit = (newTask) => {
    try {
      const startTimeParts = newTask.startTime?.split(":"); //? Split time string into hours and minutes

      const startDateTime = new Date(newTask.date);
      startDateTime.setHours(startTimeParts[0]);
      startDateTime.setMinutes(startTimeParts[1]);

      const durationInMinutes = parseInt(newTask.timeTaken);

      const endDateTime = new Date(
        startDateTime.getTime() + durationInMinutes * 60000
      );

      if (isNaN(startDateTime) || isNaN(endDateTime)) {
        setError("Invalid time or duration");
      }

      const formattedStartTime = startDateTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const formattedEndTime = endDateTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      
      const Task = {
        description: newTask.description,
        taskType: newTask.taskType,
        date: newTask.date,
        startTime: formattedStartTime,
        timeTaken: newTask.timeTaken,
        endTime: formattedEndTime,
      };
    
    

      if (tasks?.tasks?.length > 0) {
       
        const convertTo24HourFormat = (timeString) => {
          const [time, period] = timeString.split(" ");
          let [hours, minutes] = time.split(":");
          hours = parseInt(hours);
        
          if (period === "PM" && hours !== 12) {
            hours += 12;
          } else if (period === "AM" && hours === 12) {
            hours = 0;
          }
        
          return { hours, minutes: parseInt(minutes) };
        };
        
        const startDateTime = convertTo24HourFormat(Task.startTime);
        const endDateTime = {
          hours: startDateTime.hours + Math.floor(Task.timeTaken / 60),
          minutes: startDateTime.minutes + (Task.timeTaken % 60)
        };
        
        const isOverlap = tasks?.tasks?.some((task) => {
          const taskStartTime = convertTo24HourFormat(task.startTime);
          const taskEndTime = convertTo24HourFormat(task.endTime);
          const isSameDate = task.date === newTask.date;

          const isOverlap =
          (startDateTime.hours < taskEndTime.hours && endDateTime.hours > taskStartTime.hours) ||
          (startDateTime.hours === taskEndTime.hours &&
            (startDateTime.hours < taskEndTime.hours ||
              (startDateTime.hours === taskEndTime.hours && startDateTime.minutes < taskEndTime.minutes))) ||
          (startDateTime.hours === taskStartTime.hours &&
            startDateTime.minutes < taskStartTime.minutes &&
            endDateTime.hours === taskEndTime.hours) ||
          (startDateTime.hours < taskStartTime.hours && endDateTime.hours === taskEndTime.hours) ||
          (startDateTime.hours === taskStartTime.hours &&
            startDateTime.minutes === taskStartTime.minutes &&
            endDateTime.hours === taskEndTime.hours &&
            endDateTime.minutes === taskEndTime.minutes);

  return isSameDate && isOverlap;
        });
        
        console.log("isOverlap:", isOverlap);
        
        if (isOverlap) {
          throw new Error("Task overlaps with existing tasks or there is no time gap. Please select a different start time or duration.");
        } 
        
        

        // Check if there are any tasks with the same date and time already present
        const isTaskPresent = tasks?.tasks.some((task) => {
          return (
            task.date === newTask.date &&
            task.startTime === formattedStartTime &&
            task.endTime === formattedEndTime
          );
        });

        if (isTaskPresent) {
          throw new Error("Task already exists at the specified time.");
        }
        putTask(Task);
      } else {
        putTask(Task);
      }
    } catch (error) {
      setAlert("Error: " + error.message);
    }
  };



  return (
    <div className="AddTask container ">
      <link
        rel="stylesheet"
        href="https://site-assets.fontawesome.com/releases/v6.4.0/css/all.css"
      ></link>
      {/* first row for username */}
      {error?.length !== 0 && <p className="text-danger display-2"> {error}</p>}
      <div className="pt-4 ">
        <div className="card bg-transparent p-0 text-white border-0 rounded-0 lh-0 shadow-none d-block m-auto">
          <div className="card-body task mb-5">
            <h3 className="title">Add new task</h3>

            <form onSubmit={handleSubmit(formSubmit)}>
              <div className="row justify-content-center">
                <div className="col">
                  <div className="inputbox2 form-floating">
                    <i className="fa-solid fa-pencil"></i>
                    <textarea
                      className="form-control"
                      placeholder="Leave a comment here"
                      id="floatingTextarea"
                      {...register("description", {
                        required: true,
                        minLength: 5,
                      })}
                    ></textarea>
                    <label htmlFor="floatingTextarea" className="text-dark">
                      Task Description
                    </label>
                    {errors.description?.type === "required" && (
                      <p className=" text-danger">
                        *please give description of your task
                      </p>
                    )}
                  </div>
                  <div className="inputbox2 form-floating py-0">
                    <i className="fa-solid fa-square-caret-down"></i>
                    <select
                      className="form-select py-0 "
                      defaultValue=""
                      {...register("taskType", { required: true })}
                    >
                      <option value="" disabled>
                        Choose Task Type
                      </option>
                      <option value="break">Break</option>
                      <option value="meeting">Meeting</option>
                      <option value="work">Work</option>
                    </select>

                    {errors.taskType?.type === "required" && (
                      <p className=" text-danger">*Select your Task Type</p>
                    )}
                  </div>

                  <div className="inputbox2 form-floating">
                    <i className="fa-solid fa-calendar-days"></i>
                    <input
                      type="date"
                      id="date"
                      className="form-control "
                      placeholder="xyz"
                      max={maxdate}
                      min={tasks?.jod}
                      {...register("date", { required: true })}
                    ></input>
                    <label htmlFor="date" className="text-dark">
                      Date
                    </label>

                    {errors.date?.type === "required" && (
                      <span className="text-sm text-danger">
                        * date is required
                      </span>
                    )}
                  </div>

                  <div className="inputbox2 form-floating">
                    <i className="fa-solid fa-clock"></i>
                    <input
                      type="time"
                      id="startTime"
                      className="form-control "
                      placeholder="xyz"
                      {...register("startTime", { required: true })}
                    ></input>
                    <label htmlFor="startTime" className="text-dark">
                      Start Time
                    </label>

                    {errors.startTime?.type === "required" && (
                      <span className="text-sm text-danger">
                        * Start Time is required
                      </span>
                    )}
                    {alert?.length !== 0 && (
                      <span className="text-sm text-danger">{alert}</span>
                    )}
                  </div>
                  <div className="inputbox2 form-floating">
                    <i className="fa-solid fa-hourglass-end"></i>
                    <input
                      type="number"
                      id="timeTaken"
                      className="form-control "
                      placeholder="xyz"
                      {...register("timeTaken", {
                        required: true,
                        maxLength: 4,
                      })}
                    ></input>
                    <label htmlFor="timeTaken" className="text-dark">
                      Time Taken in minutes
                    </label>

                    {errors.timeTaken?.type === "required" && (
                      <p className=" text-danger">*enter your Phone number</p>
                    )}
                    {errors.timeTaken?.type === "maxLength" && (
                      <p className=" text-danger">
                        *maximum number length should be 10
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="b">
                <button type="submit" className="btn btn-ad d-block m-auto">
                  <li>Submit</li>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* second row of date filtering and tasks lists displaying */}
      <TaskList/>
    </div>
  );
};

export default AddTask;