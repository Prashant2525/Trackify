import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/img/white_logo.png";
import "./css/Global.css";

const GlobalLogin = () => {
  return (
    <div className="global-login">
      <p>WELCOMING YOU TO</p>

      <div className="logo">
        <img src={Logo} alt="Trackifi Logo" />
      </div>

      <div className="login">
        <p>Login or Sign-up as</p>
        <div className="main_log">
          <div className="student">
            <Link to="/student_login">Student</Link>
          </div>
          <div className="ver_line">
            <span>|</span>
          </div>
          <div className="admin">
            <Link to="/admin_login">Admin</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLogin;
