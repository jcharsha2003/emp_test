import React,{useState,useContext, useEffect} from 'react'
import {loginContext} from "./loginContext"
import axios from 'axios'

function UserLoginContextStore({children}){
    let [currentUser,setCurrentUser]=useState({})
    let[role,setRole]=useState("")
    let[error,setError]=useState("")
    let[userLoginStatus,setUserLoginStatus]=useState(false)
    
    let url=window.location.href;
    let baseURL = url.split("/").slice(0, 3).join("/")
    let subdomain=baseURL.replace("://","://server.")
    
    
    // userlogin 
    const loginUser=(userCredObj)=>{
        axios.post(`${subdomain}/user-api/user-login`,userCredObj)
        .then(response=>{
            if(response.data.message==="success"){
                setCurrentUser({...response.data.user})
                // update user login status
                setUserLoginStatus(true)
                setError("")
                sessionStorage.setItem("token",response.data.token)
                setRole(response.data.user.role)
            }
            else{
                setError(response.data.message)
            }
        }

        )
        .catch(err=>{setError(err.data.message)})

    }
    const logoutUser=()=>{
        sessionStorage.clear()
        setUserLoginStatus(false)
    }
    return (
        <loginContext.Provider value={[currentUser,error,userLoginStatus,loginUser,logoutUser,role,setCurrentUser]}>{children}</loginContext.Provider>
    )
    
}
export default UserLoginContextStore