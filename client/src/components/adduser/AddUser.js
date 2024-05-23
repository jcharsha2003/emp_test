import axios from "axios";
import Tilt from "react-vanilla-tilt";
import React from "react";
import { useState ,useContext} from "react";
import { useNavigate } from "react-router-dom";
import "./AddUser.css";
import { useForm } from "react-hook-form";
import { domainContext } from "../../context/DomainContextProvider";
const AddUser = () => {
  let [error, setError] = useState("");
  let {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  let [domain,setDomain]=useContext(domainContext)

  let formSubmit = (newUser) => {
    newUser = { ...newUser, role: "employee", tasks: [] };

    axios
      .post(`/user-api/add-user`, newUser)
      .then((response) => {
        if (response.status === 201) {
          navigate("/users");
        }
        if (response.status !== 201) {
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
    reset();
  };

  return (
    <div className="register container ">
      <link
        rel="stylesheet"
        href="https://site-assets.fontawesome.com/releases/v6.4.0/css/all.css"
      ></link>
      {/* first row for username */}
      {error?.length !== 0 && <p className="text-danger display-1"> {error}</p>}
      <div className="pt-4">
        <Tilt className="card bg-transparent p-0 text-white border-0 rounded-0 lh-0 shadow-none  w-auto">
          <div className="card-body dog mb-5">
            <h3 className="title">Add new employee</h3>

            <form onSubmit={handleSubmit(formSubmit)}>
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
                  <div className="inputbox1 form-floating">
                    <i className="fa-solid fa-lock"></i>
                    <input
                      type="password"
                      id="password"
                      className="form-control "
                      placeholder="xyz"
                      {...register("password", {
                        required: true,
                        minLength: 4,
                      })}
                    ></input>
                    <label htmlFor="password" className="text-dark">
                      password
                    </label>

                    {errors.password?.type === "required" && (
                      <p className=" text-danger">*enter your password</p>
                    )}
                    {errors.password?.type === "minLength" && (
                      <p className=" text-danger">
                        *minimum 4 password word is required
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

              <button type="submit" className="button d-block m-auto mt-5">
                Submit
              </button>
            </form>
          </div>
        </Tilt>
      </div>
    </div>
  );
};

export default AddUser;
