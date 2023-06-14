import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { taskContext } from "../../context/TasksContextProvider";
import { useContext } from "react";
import "./Graphs.css";

const Graphs = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split("T")[0]);
  const [previousDate, setPreviousDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [previousFilteredTasks, setPreviousFilteredTasks] = useState([]);
  const [working, setWorking] = useState([]);
  const [notWorking, setNotWorking] = useState([]);
  const [meeting, setMeeting] = useState([]);
  
  let [tasks, setTasks] = useContext(taskContext);
  
  useEffect(() => {
    // Extract available dates from tasks and update state
    const dates = tasks?.tasks?.map((task) => task.date);
    setAvailableDates(dates);
  }, [tasks]);

  useEffect(() => {
    // Filter tasks based on selected date
    const filtered = tasks?.tasks?.filter((task) => task.date === selectedDate);
    setFilteredTasks(filtered);
    if (filtered?.length !== 0) {
      const notWorkingTasks = filtered?.filter((element) => element.taskType === "break");
      setNotWorking(notWorkingTasks);
      const workingTasks = filtered?.filter((element) => element.taskType === "work");
      setWorking(workingTasks);
      const meetingTasks = filtered?.filter((element) => element.taskType === "meeting");
      setMeeting(meetingTasks);
    }
  }, [selectedDate, tasks]);

  useEffect(() => {
    // Filter tasks based on previous date
    const filtered = tasks?.tasks?.filter((task) => task.date === previousDate);
    setPreviousFilteredTasks(filtered);
  }, [previousDate, tasks]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handlePreviousDateChange = (event) => {
    setPreviousDate(event.target.value);
  };

  const isDateAvailable = (date) => {
    return availableDates && availableDates.includes(date);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="text-white">
            <div className="d-block m-auto">
              <label htmlFor="date" className="text-white fs-5 px-3">
                Choose your current date:
              </label>
              <input
                type="date"
                id="date"
                min={tasks?.jod}
                max={today.toISOString().split("T")[0]}
                value={selectedDate}
                onChange={handleDateChange}
                style={{
                  backgroundColor: isDateAvailable(selectedDate) ? "#4CAF50" : "#F44336",
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
            </div>

            {selectedDate && (
              <div>
                <h2 className="d-block m-auto">PieChart for {formatDate(selectedDate)}</h2>
                {filteredTasks?.length > 0 ? (
                  <React.Fragment>
                    <div className="container-fluid mb-3 text-white">
                     
                      <Chart
                        type="pie"
                        width={359}
                        height={359}
                        series={[working.length, notWorking.length, meeting.length]}
                        options={{
                          
                          noData: { text: "Empty Data" },
                          labels: ["Working", "Not Working", "Meeting"],
                        }}
                     
                      />
                    </div>
                  </React.Fragment>
                ) : (
                  <p>No tasks available for this date.</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="text-white">
            <div className="d-block m-auto">
              <label htmlFor="previousDate" className="text-white fs-5 px-3">
                Choose previous date:
              </label>
              <input
                type="date"
                id="previousDate"
                min={tasks?.jod}
                max={today.toISOString().split("T")[0]}
                value={previousDate}
                onChange={handlePreviousDateChange}
                style={{
                  backgroundColor: isDateAvailable(previousDate) ? "#4CAF50" : "#F44336",
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
            </div>

            {previousDate && (
              <div>
                <h2 className="d-block m-auto">PieChart for {formatDate(previousDate)}</h2>
                {previousFilteredTasks?.length > 0 ? (
                  <React.Fragment>
                    <div className="container-fluid mb-3">
                      
                      <Chart
                        type="pie"
                        width={359}
                        height={359}
                        series={[
                          previousFilteredTasks.filter((task) => task.taskType === "work").length,
                          previousFilteredTasks.filter((task) => task.taskType === "break").length,
                          previousFilteredTasks.filter((task) => task.taskType === "meeting").length,
                        ]}
                        options={{
                          title: { text: "Tasks PieChart" },
                          noData: { text: "Empty Data" },
                          labels: ["Working", "Not Working", "Meeting"],
                        }}
                      />
                    </div>
                  </React.Fragment>
                ) : (
                  <p>No tasks available for this date.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graphs;
