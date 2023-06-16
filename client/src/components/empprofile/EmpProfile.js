import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { taskContext } from "../../context/TasksContextProvider";
import { useForm } from "react-hook-form";
import { loginContext } from "../../context/loginContext";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import "./EmpProfile.css";

const EmpProfile = () => {
    let [tasks,setTasks]=useContext(taskContext)
  let [error, setError] = useState("");
  let token = sessionStorage.getItem("token");
  let [currentUser, err, userLoginStatus, loginUser, logoutUser, role,setCurrentUser] =
  useContext(loginContext);
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
      .get(`http://localhost:5000/user-api/get-emp/${currentUser.email}`, {
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
    // reset();
  };

  // edit user
  const editUser = (userObj) => {
    handleShow();
    setUserToEdit(userObj);
    setValue("username", userObj?.username);
    setValue("jod", userObj?.jod);
    setValue("department", userObj?.department)
    setValue("email", userObj?.email);
    setValue("phone",userObj?.phone)
  };
  //   saveModifiedUser
  const saveModifiedUser = () => {
    handleClose();
    let modifieduser = getValues();

    axios
      .put( `http://localhost:5000/user-api/update-user`,
      modifieduser,
      {
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
    <div>
      User
      <div className="m-auto d-block">
        {error?.length !== 0 && (
          <p className="text-danger display-1"> {error}</p>
        )}

        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>{tasks?.username}</Card.Title>
            <Card.Text>
              <div>{tasks?.jod}</div>
              <div>{tasks?.department}</div>
              <div> {tasks?.email}</div>
              <div> {tasks?.phone}</div>
            </Card.Text>
            <Button variant="secondary" onClick={() => editUser(tasks)}>
              Edit<i className="fas fa-edit"></i>
            </Button>
          </Card.Body>
        </Card>

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
              <div className="row justify-content-center">
                <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                  <div className="inputbox1 form-floating">
                    <i className="fa-regular fa-user"></i>
                    <input
                      type="text"
                      id="username"
                      className="form-control "
                      placeholder="xyz"
                      {...register("username", {
                        required: true,
                        minLength: 4,
                        maxLength: 10,
                      })}
                    ></input>
                    <label htmlFor="username" className="text-dark">
                      User Name
                    </label>

                    {errors.username?.type === "required" && (
                      <p className=" text-danger">*enter your first name</p>
                    )}
                    {errors.username?.type === "minLength" && (
                      <p className=" text-danger">
                        *minimum 4 letter word is required
                      </p>
                    )}
                    {errors.username?.type === "maxLength" && (
                      <p className=" text-danger">
                        *maximum 6 letter word is required
                      </p>
                    )}
                  </div>
                 

                  {/* second row   */}

                  <div className="inputbox1 form-floating">
                    <i className="fa-solid fa-calendar-days"></i>
                    <input
                      type="date"
                      id="jod"
                      className="form-control "
                      placeholder="xyz"
                      {...register("jod", { required: true })}
                    ></input>
                    <label htmlFor="jod" className="text-dark">
                      joining date
                    </label>

                    {errors.jod?.type === "required" && (
                      <span className="text-sm text-danger">
                        *joining date is required
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                  <div className="inputbox1 form-floating">
                    <i className="fa-solid fa-user-magnifying-glass"></i>
                    <input
                      type="text"
                      id="department"
                      className="form-control "
                      placeholder="xyz"
                      {...register("department", { required: true })}
                    ></input>
                    <label htmlFor="department" className="text-dark">
                      Department
                    </label>

                    {errors.department?.type === "required" && (
                      <p className=" text-danger">*enter your department</p>
                    )}
                  </div>

                  {/* third row  contains Email and Phone Number*/}

                  <div className="inputbox1 form-floating">
                    <i className="fa-solid fa-envelope"></i>
                    <input
                      type="email"
                      id="email"
                      className="form-control "
                      placeholder="xyz"
                      {...register("email", { required: true })}
                      disabled
                    ></input>
                    <label htmlFor="email" className="text-dark">
                      Email
                    </label>

                    {errors.email?.type === "required" && (
                      <p className=" text-danger">*enter your valid email id</p>
                    )}
                  </div>
                  <div className="inputbox1 form-floating">
                    <i className="fa-solid fa-phone"></i>
                    <input
                      type="number"
                      id="phone"
                      className="form-control "
                      placeholder="xyz"
                      {...register("phone", { required: true, maxLength: 11 })}
                    ></input>
                    <label htmlFor="phone" className="text-dark">
                      Phone Number
                    </label>

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
    </div>
  );
};

export default EmpProfile;
