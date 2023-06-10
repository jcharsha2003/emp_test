import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";

import "./Users.css";

const Users = () => {
  let [error, setError] = useState("");
  let [users, setUsers] = useState([]);
  let token = sessionStorage.getItem("token");




  const getUsers = () => {
    axios
      .get("http://localhost:5000/user-api/get-users", {
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
      .delete(`http://localhost:5000/user-api/delete-user/${user.username}`,{
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
    <div className="users ">
      {error?.length !== 0 && <p className="text-danger display-1"> {error}</p>}

      <main className="table d-block m-auto mt-5">
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
                    <div className="wrapper">
                      <a href="#" className="alr" onClick={()=>deleteUser(user)}>
                        <span className="spanl">Remove</span>
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
  );
};

export default Users;
