import { taskContext } from "../../context/TasksContextProvider";
import React from "react";
import { useState, useEffect, useContext } from "react";
import { loginContext } from "../../context/loginContext";
import axios from "axios";
import "./TaskList.css"
const TaskList = () => {
    let [error, setError] = useState("");
    let token = sessionStorage.getItem("token");
    let [currentUser, err, userLoginStatus, loginUser, logoutUser, role] =
    useContext(loginContext);
   
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
    let [tasks, setTasks] = useContext(taskContext);
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
    
  };
  useEffect(() => {
    getUsers();
   
  }, []);
  return (
    <div className="mt-5 tasklist">
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
              min={tasks?.jod}
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

            {/* {errors.date?.type === "required" && (
              <span className="text-sm text-danger">* date is required</span>
            )} */}
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
  )
}

export default TaskList