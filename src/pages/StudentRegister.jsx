import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import "./css/StudentLogin.css";
import black_logo from "../assets/img/black_logo.png";


const StudentRegister = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // TODO: authentication logic
    navigate('/student_main');
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    registrationNumber: "",
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
          <Link to={"/"}><img src={black_logo} alt="Logo" /></Link>
        </div>

        <div className="create_acc">
          <p className="p1">Create Account</p>
          <span>|</span>
          <p className="p2">Student Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="student-sign-up">
          <label htmlFor="fullName">Fullname</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="registrationNumber">Registration Number</label>
          <input
            type="text"
            name="registrationNumber"
            placeholder="Enter Your Registration Number"
            value={formData.registrationNumber}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Your Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Sign Up</button>

          <p className="p2">- OR -</p>

          <div className="social-img">
            <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" alt="Facebook" />
            <img src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png" alt="Google" />
            <img src="https://cdn-icons-png.flaticon.com/512/0/747.png" alt="Apple" />
          </div>
          
          <p className="p3"> Already have an account? <Link to="/student_login" className="login_std">Login</Link></p>
        </form>
      </div>
    </div>
  );
};

export default StudentRegister;
