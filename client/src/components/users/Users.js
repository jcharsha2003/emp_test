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

  let {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const [show, setShow] = useState(false);
  const [userToEdit, setUserToEdit] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  // edit user
  const editUser = (userObj) => {
    handleShow();
    setUserToEdit(userObj);
    setValue("username", userObj.username);
    setValue("dob", userObj.dob);
    setValue("email", userObj.email);
    setValue("phone", userObj.phone);
  };
  const saveModifiedUser = () => {
    handleClose();
    let modifieduser = getValues();

    axios
      .put("http://localhost:5000/user-api/update-user", modifieduser)
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

      <main className="table">
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
                      <a href="#" className="al">
                        <span className="spanl">Edit</span>
                      </a>
                    </div>
                  </td>
                  <td>
                    <div className="wrapper">
                      <a href="#" className="alr">
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

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        centered
        className="modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(saveModifiedUser)}>
            <div className="row row-cols-1 row-cols-sm-2">
              <div className="col">
                <label htmlFor="username" className="form-label">
                  User Name
                </label>
                <input
                  type="text"
                  id="username"
                  className="form-control bg-light"
                  {...register("username", {
                    required: true,
                    minLength: 6,
                    maxLength: 10,
                  })}
                  disabled
                ></input>
                {errors.username?.type === "required" && (
                  <p className=" text-danger">*enter your first name</p>
                )}
                {errors.username?.type === "minLength" && (
                  <p className=" text-danger">
                    *minimum 6 letter word is required
                  </p>
                )}
                {errors.username?.type === "maxLength" && (
                  <p className=" text-danger">
                    *maximum 10 letter word is enough
                  </p>
                )}
              </div>
            </div>

            <div className="col">
              <label htmlFor="jod" className="form-label">
                joining date
              </label>
              <input
                type="date"
                id="jod"
                className="form-control bg-light"
                {...register("jod", { required: true })}
              ></input>
              {errors.jod?.type === "required" && (
                <span className="text-sm text-danger">
                  *joining date is required
                </span>
              )}
            </div>
            <div className="col">
              <label htmlFor="department" className="form-label">
                Department
              </label>
              <input
                type="text"
                id="department"
                className="form-control bg-light"
                {...register("department", { required: true })}
              ></input>
              {errors.department?.type === "required" && (
                <p className=" text-danger">*enter your department</p>
              )}
            </div>

            {/* third row  contains Email and Phone Number*/}
            <div className="row row-cols-1 ">
              <div className="col">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control bg-light"
                  {...register("email", { required: true })}
                ></input>
                {errors.email?.type === "required" && (
                  <p className=" text-danger">*enter your valid email id</p>
                )}
              </div>
              <div className="col">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  type="number"
                  id="phone"
                  className="form-control bg-light"
                  {...register("phone", { required: true, maxLength: 11 })}
                ></input>
                {errors.phone?.type === "required" && (
                  <p className=" text-danger">*enter your Phone number</p>
                )}
                {errors.phone?.type === "maxLength" && (
                  <p className=" text-danger">
                    *maximum number length should be 10
                  </p>
                )}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={saveModifiedUser}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
