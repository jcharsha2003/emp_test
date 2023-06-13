import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from "./reportWebVitals";
import UserLoginContextStore from "./context/UserLoginContextStore";
import TasksContextProvider from "./context/TasksContextProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  
    <UserLoginContextStore>
    <TasksContextProvider>
      
      <App />
     
   
    </TasksContextProvider>
   
    </UserLoginContextStore>
    
 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
