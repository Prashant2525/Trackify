import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./css/StudentLogin.css";
import black_logo from "../assets/img/black_logo.png";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const StudentRegister = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsUserLoggedIn,  getUserData} = useContext(AppContext);


  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reg_num, setReg_num] = useState("");

  const onSubmithandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        const { data } = await axios.post(
          backendUrl + "/api/user/register",
          {
            name,
            email,
            reg_num,
            password,
          }
        );
        console.log(data);

        if (data.success) {
          toast.success("Successfully registered");
          setIsUserLoggedIn(true);
          getUserData();
          navigate("/student_main");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(
          backendUrl + "/api/user/login",
          {
            name,
            reg_num,
            password,
          }
        );

        if (data.success) {
          toast.success("Logged in successfully");
          setIsUserLoggedIn(true);
          getUserData();
          navigate("/student_main");
        } else {
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
          <p className="p2">Student Portal</p>
        </div>

        <form onSubmit={onSubmithandler} className="student-sign-up">
          <label htmlFor="fullName">Fullname</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter Full Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            required
          />
          {state === "Sign Up" && (
            <div className="inside_std_form">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
            </div>
          )}
          <label htmlFor="registrationNumber">Registration Number</label>
          <input
            type="text"
            name="registrationNumber"
            placeholder="Enter Your Registration Number"
            value={reg_num}
            onChange={(e) => {
              setReg_num(e.target.value);
            }}
            required
          />

          <label htmlFor="password">Password</label>
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

          <p
            onClick={() => navigate("/reset_password")}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forget password?
          </p>

          <button type="submit">Sign Up</button>

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

export default StudentRegister;
