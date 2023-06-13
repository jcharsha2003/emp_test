import axios from "axios";
import { loginContext } from "../../context/loginContext";
import { taskContext } from "../../context/TasksContextProvider";
import React from "react";
import { useState, useEffect, useContext } from "react";

import "./AddTask.css";
import { useForm } from "react-hook-form";

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
        `http://localhost:5000/user-api/update-task/${currentUser.username}`,
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
  };
  const getUsers = () => {
    axios
      .get(`http://localhost:5000/user-api/get-user/${currentUser.username}`, {
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
      const startTimeParts = newTask.startTime.split(":"); // Split time string into hours and minutes

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
      if (tasks.tasks.length !== 0) {
        const isOverlap = tasks.tasks.some((task) => {
          const taskStartTimeParts = task.startTime.split(":");

          const taskStartTime = {
            hours: parseInt(taskStartTimeParts[0]),
            minutes: parseInt(taskStartTimeParts[1]),
          };

          const taskEndTimeParts = task.endTime.split(":");
          const taskEndTime = {
            hours: parseInt(taskEndTimeParts[0]),
            minutes: parseInt(taskEndTimeParts[1]),
          };

          const startDateTimeParts = Task.startTime.split(":");
          const startDateTime = {
            hours: parseInt(startDateTimeParts[0]),
            minutes: parseInt(startDateTimeParts[1]),
          };

          const endDateTimeParts = Task.endTime.split(":");
          const endDateTime = {
            hours: parseInt(endDateTimeParts[0]),
            minutes: parseInt(endDateTimeParts[1]),
          };

          const isSameDate = task.date === Task.date;

          const isOverlap =
            (startDateTime.hours < taskEndTime.hours &&
              endDateTime.hours > taskStartTime.hours) ||
            (startDateTime.hours === taskEndTime.hours &&
              startDateTime.minutes < taskEndTime.minutes) ||
            (startDateTime.hours === taskStartTime.hours &&
              startDateTime.minutes < taskStartTime.minutes &&
              endDateTime.hours === taskEndTime.hours) ||
            (startDateTime.hours < taskStartTime.hours &&
              endDateTime.hours === taskEndTime.hours) ||
            (startDateTime.hours === taskStartTime.hours &&
              startDateTime.minutes === taskStartTime.minutes &&
              endDateTime.hours === taskEndTime.hours &&
              endDateTime.minutes === taskEndTime.minutes);

          
          return isSameDate && isOverlap;
        });

        if (isOverlap) {
          throw new Error(
            "Task overlaps with existing tasks. Please select a different start time or duration."
          );
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

  // table related states
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    // Extract available dates from tasks and update state
    const dates = tasks?.tasks?.map((task) => task.date);
    setAvailableDates(dates);
  }, [tasks]);

  useEffect(() => {
    // Filter tasks based on selected date
    const filtered = tasks?.tasks?.filter((task) => task.date === selectedDate);
    setFilteredTasks(filtered);
  }, [selectedDate, tasks]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const isDateAvailable = (date) => {
    return availableDates && availableDates.includes(date);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
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
            <h3 className="title">Add new employee</h3>

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
                <button type="submit" className="btn d-block m-auto">
                  <li>Submit</li>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* second row of date filtering and tasks lists displaying */}
      <div className="mt-5">
        <div className="inputbox3 d-flex p-2  ">
          <div className="d-block m-auto">
            <label htmlFor="date" className="text-white fs-5 px-3">
              Choose your date:
            </label>
            <input
              type="date"
              id="date"
              className=""
              max={maxdate}
              min={tasks?.tasks?.jod}
              value={selectedDate}
              onChange={handleDateChange}
              style={{
                backgroundColor: isDateAvailable(selectedDate)
                  ? "#4CAF50"
                  : "#F44336",
                color: "#fff",
                padding: "10px",
                borderRadius: "5px",
                border: "none",
                outline: "none",
                fontWeight: "bold",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                transition: "background-color 0.3s ease",
              }}
            />

            {errors.date?.type === "required" && (
              <span className="text-sm text-danger">* date is required</span>
            )}
          </div>
        </div>

        {selectedDate && (
          <main className="table d-block m-auto">
            <h2 className="table__header d-block m-auto">
              Tasks for {formatDate(selectedDate)}
            </h2>
            {filteredTasks?.length > 0 ? (
              <section className="table__body">
                <table>
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Task Type</th>
                      <th>Start Time</th>
                      <th>Time Taken</th>
                      <th>End Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task) => (
                      <tr key={task.description}>
                        <td>{task.description}</td>
                        <td>{task.taskType}</td>
                        <td>{task.startTime}</td>
                        <td>{task.timeTaken}</td>
                        <td>{task.endTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ) : (
              <p>No tasks available for this date.</p>
            )}
          </main>
        )}
      </div>
    </div>
  );
};

export default AddTask;
