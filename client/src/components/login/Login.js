import React, { useEffect, useContext } from "react";
import { loginContext } from "../../context/loginContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Tilt from "react-vanilla-tilt"
import "./Login.css";
function Login() {
  let navigate = useNavigate();
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let [currentUser, error, userLoginStatus, loginUser, logoutUser, role] =
    useContext(loginContext);
  // let [err,setErr]=useState("")
  let handleUserLogin = (userobj) => {
    loginUser(userobj);
  };
  useEffect(() => {
    if (userLoginStatus === true && role === "admin") {
      navigate("/add-user");
    } else if (userLoginStatus === true) {
      navigate("/emp-dashboard");
    }
  }, [userLoginStatus]);
  return (
  <div className="Login">
 
      {error?.length !== 0 && <p className="text-danger"> `*{error}`</p>}
     
      <Tilt className="bg-transparent p-0 text-white border-0 rounded-0 lh-0 shadow-none d-block m-auto mt-5">
    <div className="cat" >
    <h2 className="title">Login</h2>
    <form onSubmit={handleSubmit(handleUserLogin)} action="">
    
    <div className="inputbox form-floating">
      <i className="fa-regular fa-user"></i>
      <input
        type="text"
        id="username"
        className="form-control "
        {...register("username", {
          required: true,
          minLength: 4,
          maxLength: 22,
        })}
        placeholder="xyz"
      ></input>
        <label htmlFor="username" className="text-dark" >
        UserName
      </label>
      {errors.username?.type === "required" && (
        <p className=" text-danger">*enter your first name</p>
      )}
      {errors.username?.type === "minLength" && (
        <p className=" text-danger">*minimum 4 letter word is required</p>
      )}
      {errors.username?.type === "maxLength" && (
        <p className=" text-danger">
          *maximum 22 letter word is required
        </p>
      )}
    </div>

    <div className="inputbox form-floating">
      <i className="fa-solid fa-lock"></i>
     
      <input
        type="password"
        id="password"
        className="form-control "
        {...register("password", { required: true, minLength: 4 })}
        placeholder="xyz"
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
    
  <button type="submit" className="button d-block m-auto mt-5">Login</button>


  </form>
    </div>
    </Tilt>
      
    

   
   
      

    </div>
    
 
      
      
  )
}

export default Login;
