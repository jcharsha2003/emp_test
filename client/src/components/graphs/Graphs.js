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
 const [stackDate,setStackDate]=useState(today.toISOString().split("T")[0])
 const [stackFilteredTasks, setStackFilteredTasks] = useState([]);
  
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
    
  }, [selectedDate, tasks]);

  useEffect(() => {
    // Filter tasks based on selected date
    const filtered = tasks?.tasks?.filter((task) => task.date === stackDate);
    setStackFilteredTasks(filtered);
    
  }, [stackDate, tasks]);
  const handleStackDateChange = (event) => {
    setStackDate(event.target.value);
  };

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


//   stacked bar chart conditons

const getTaskCountsByWeek = () => {
  const weekStartDate = new Date(stackDate);
  const weekEndDate = new Date(stackDate);
  weekStartDate.setDate(weekStartDate.getDate() - 6); // Subtract 6 days from the selected date

  // Adjust the week start date if it is earlier than the joining date
  if (weekStartDate < new Date(tasks?.jod)) {
    weekStartDate.setDate(new Date(tasks?.jod).getDate());
  }

  const taskCounts = [];

  for (let date = weekStartDate; date <= weekEndDate; date.setDate(date.getDate() + 1)) {
    const currentDateString = date.toISOString().split("T")[0];

    const tasksForDate = tasks?.tasks?.filter((task) => task.date === currentDateString);
    const notWorkingCount = tasksForDate?.filter((task) => task.taskType === "break").length || 0;
    const workingCount = tasksForDate?.filter((task) => task.taskType === "work").length || 0;
    const meetingCount = tasksForDate?.filter((task) => task.taskType === "meeting").length || 0;

    taskCounts.push({
      date: currentDateString,
      notWorkingCount: notWorkingCount,
      workingCount: workingCount,
      meetingCount: meetingCount,
    });
  }

  return taskCounts;
};


  
  

  const taskCountsByWeek = getTaskCountsByWeek();

  // Check if the selected date is the joining date and there are no tasks available
  const isJoiningDate = selectedDate === tasks?.jod;
  const noTasksAvailable = !taskCountsByWeek.some((task) => task.notWorkingCount || task.workingCount || task.meetingCount);


  return (
    <div className="container mt-5 graph">
      <div className="row">
        <div className="col-md-6">
          <div className="text-white">
            <div className="d-flex justify-content-center">
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
              <div className="pie my-3">
                <h2 className="text-center">PieChart for {formatDate(selectedDate)}</h2>
                {filteredTasks?.length > 0 ? (
                  <React.Fragment>
                    <div className="container-fluid mb-3 text-white d-flex justify-content-center">
                     
                      <Chart
                        type="pie"
                        width={359}
                        height={359}
                        series={[filteredTasks.filter((task) => task.taskType === "work").length,
                      filteredTasks.filter((task) => task.taskType === "break").length,
                        filteredTasks.filter((task) => task.taskType === "meeting").length,]}
                        options={{
                          
                          noData: { text: "Empty Data" },
                          labels: ["Working", "Not Working", "Meeting"],
                          legend:{
                            position:"bottom"
                          }
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
            <div className="d-flex justify-content-center">
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
              <div className="pie my-3">
                <h2 className="text-center">PieChart for {formatDate(previousDate)}</h2>
                {previousFilteredTasks?.length > 0 ? (
                  <React.Fragment>
                    <div className="container-fluid mb-3 d-flex justify-content-center">
                      
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
                           legend:{
                            position:"bottom"
                          },
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

                    {/* stacked bar chart */}
                    <div className="stacked-bar-chart-container mt-5">
      <div className="date-picker">
        <label htmlFor="date" className="text-white fs-5 px-3 ">
          Choose your current date:
        </label>
        <input
          type="date"
          id="date"
          min={tasks?.jod}
          max={today.toISOString().split("T")[0]}
          value={stackDate}
          onChange={handleStackDateChange}
          style={{
            backgroundColor: isDateAvailable(stackDate) ? "#4CAF50" : "#F44336",
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

      <div className="stacked-bar mt-5">
        <React.Fragment>
          <div className="container-fluid mb-3 text-white">
            <h2>Stacked bar chart tasks in a week</h2>
            {noTasksAvailable ? (
              <p className="text-danger">*No tasks available from current date to previous dates of one week</p>
            ) : (
              <Chart
                type="bar"
                className="chart1"
                height={600}
                series={[
                  {
                    name: "Not Working",
                    data: taskCountsByWeek.map((task) => task.notWorkingCount),
                  },
                  {
                    name: "Working",
                    data: taskCountsByWeek.map((task) => task.workingCount),
                  },
                  {
                    name: "Meeting",
                    data: taskCountsByWeek.map((task) => task.meetingCount),
                  },
                ]}
                options={{
                  chart: {
                    stacked: true,
                  },
                  plotOptions: {
                    bar: {
                      columnWidth: "100%",
                    },
                  },
                  stroke: {
                    width: 1,
                  },
                  xaxis: {
                    title: {
                      text: "Tasks done in a week",
                    },
                    categories: taskCountsByWeek.map((task) => task.date),
                  },
                  yaxis: {
                    title: {
                      text: "Count of taskType",
                    },
                  },
                  legend: {
                    position: "bottom",
                  },
                  dataLabels: {
                    enabled: true,
                  },
                  grid: {
                    show: true,
                    xaxis: {
                      lines: {
                        show: false,
                      },
                    },
                    yaxis: {
                      lines: {
                        show: false,
                      },
                    },
                  },
                }}
              />
            )}
          </div>
        </React.Fragment>
      </div>
    </div>

    </div>
  );
};

export default Graphs;
