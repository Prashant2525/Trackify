import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./css/AdminLogin.css";
import black_logo from "../assets/img/black_logo.png";
import profile_icon from "../assets/img/profile-user.png";
import email_icon from "../assets/img/email.png";
import padlock_icon from "../assets/img/padlock.png";
// import TextField from "@mui/material/TextField";

const AdminRegister = () => {
  const [state, setState] = useState("Sign Up");

  const navigate = useNavigate();

  const handleLogin = () => {
    // TODO: Add authentication logic
    navigate("/admin_main");
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
    console.log("Form Submitted:", formData);
    // TODO: authentication logic
  };

  return (
    <div className="container">
      <div className="leaf hidden md:flex">
        <img src={black_logo} alt="Logo" />
      </div>

      <div className="vl hidden md:block"></div>

      <div className="form-container">
        <div className="form-logo">
          <Link to={"/"}>
            <img src={black_logo} alt="Logo" />
          </Link>
        </div>

        <div className="create_acc">
          <p className="p1">
            {state === "Sign Up" ? "Create Account" : "Login"}
          </p>
          <span>|</span>
          <p className="p2">Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-sign-up">
          {/* <TextField
            className="custom-textfield"
            type="text"
            name="fullName"
            id="outlined-textarea"
            label="Enter Full Name"
            placeholder="e.g John Doe"
            multiline
            required
          /> */}
          {state === "Sign Up" && (
            <div className="inside_form">
              <img src={profile_icon} alt="user profile" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="inside_form">
            <img src={email_icon} alt="user profile" />
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="inside_form">
            <img src={padlock_icon} alt="user profile" />
            <input
              type="password"
              name="password"
              placeholder="Enter Your Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">{state}</button>

          <p className="p2">- OR -</p>

          <div className="social-img">
            <img
              src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
              alt="Facebook"
            />
            <img
              src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png"
              alt="Google"
            />
            <img
              src="https://cdn-icons-png.flaticon.com/512/0/747.png"
              alt="Apple"
            />
          </div>

          {state === "Sign Up" ? (
            <p className="p3">
              Already have an account?{" "}
              <p onClick={() => setState("Login")} className="login_adm">
                Login
              </p>
            </p>
          ) : (
            <p className="p3">
              Don't have an account?{" "}
              <p onClick={() => setState("Sign Up")} className="login_adm">
                Sign Up
              </p>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
