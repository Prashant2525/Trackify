import React, { use, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./css/AdminLogin.css";
import black_logo from "../assets/img/black_logo.png";
import profile_icon from "../assets/img/profile-user.png";
import email_icon from "../assets/img/email.png";
import padlock_icon from "../assets/img/padlock.png";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
// import TextField from "@mui/material/TextField";

const AdminRegister = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsAdminLoggedIn,  getAdminData} = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmithandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        const { data } = await axios.post(
          backendUrl + "/api/user/admin/register",
          {
            name,
            email,
            password,
          }
        );
        console.log(data)

        if (data.success) {
          toast.success("Successfully registered");
          setIsAdminLoggedIn(true);
          getAdminData();
          navigate("/admin_main");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(
          backendUrl + "/api/user/admin/login",
          {
            email,
            password,
          }
        );

        if (data.success) {
          toast.success("Logged in successfully");
          setIsAdminLoggedIn(true);
          getAdminData();
          navigate("/admin_main");
        }else{
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
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

        <form onSubmit={onSubmithandler} className="admin-sign-up">
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
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
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
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              required
            />
          </div>

          <div className="inside_form">
            <img src={padlock_icon} alt="user profile" />
            <input
              type="password"
              name="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
          </div>

          <p
            onClick={() => navigate("/reset_password")}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forget password?
          </p>

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
              <span onClick={() => setState("Login")} className="login_adm">
                Login
              </span>
            </p>
          ) : (
            <p className="p3">
              Don't have an account?{" "}
              <span onClick={() => setState("Sign Up")} className="login_adm">
                Sign Up
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
