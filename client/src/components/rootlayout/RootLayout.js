import React from "react";
import NavbarMain from "../navbar/NavbarMain";
import Footer from "../footer/Footer";
import "./RootLayout.css";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function RootLayout() {

  let [path,setPath]=useState("home")
       let background=(childpath)=>{
          setPath(childpath)
        }

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      className={path}
    >
      <NavbarMain background={background} />

      {/* placeholder */}
      <div>
        <Outlet />
      </div>
      <div style={{ marginTop: "auto" }}>
        <Footer />
      </div>
    </div>
  );
}

export default RootLayout;
