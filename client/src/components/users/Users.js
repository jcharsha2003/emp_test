import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { taskContext } from "../../context/TasksContextProvider";
import "./Users.css";
import {domainContext} from "../../context/DomainContextProvider"
import { useNavigate } from "react-router-dom";

const Users = () => {
  let [domain,setDomain]=useContext(domainContext)
  let [error, setError] = useState("");
  let [users, setUsers] = useState([]);
  let token = sessionStorage.getItem("token");
 let [tasks,setTasks]=useContext(taskContext)
 let navigate = useNavigate();
 let empGraphs=(user)=>{
 setTasks(user)
 navigate("/emp-graphs")
 }

  const getUsers = () => {
    axios
      .get(`${domain}/user-api/get-users`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        if (response.status === 200) {
          setUsers(response.data.payload);
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


  const deleteUser = (user) => {
  
    
    axios
      .delete(`${domain}/user-api/delete-user/${user.email}`,{
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        if (response.status === 200) {
          getUsers();
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
    <div className="users">
      {error?.length !== 0 && <p className="text-danger display-1"> {error}</p>}
    <div className="py-5">

    <main className="table d-block m-auto  ">
        <section className="table__header text-center">
          <h1 className="d-block m-auto">Employees</h1>
        </section>
        <section className="table__body">
          <table>
            <thead>
              <tr>
                <th>UserName</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>Department</th>
                <th>Joining date</th>
                <th colSpan="2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.department}</td>
                  <td>{user.jod}</td>
                  <td>
                  <div className="wrapper d-flex  justify-content-around">
                      <a href="#" className="alr m-2" onClick={()=>deleteUser(user)}>
                        <span className="spanl">Remove</span>
                      </a>
                      
                      <a href="#" className="alr m-2" onClick={()=>empGraphs(user)}>
                        <span className="spanl">Details</span>
                      </a>
                    </div>
                    
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
   

    
    </div>
  );
};

export default Users;
