import React, { useContext, useEffect, useRef, useState } from "react";
import "./css/EmailVerify.css";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const EmailVerify = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const { backendUrl, userData, adminData } = useContext(AppContext);
  console.log(userData, adminData);

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleValidate = async (e) => {
    try {
      e.preventDefault();
      const email =  userData?.email || adminData?.email;
      const otp = inputRefs.current.map((e) => e.value).join("");
      const { data } = await axios.post(
        backendUrl + "/api/user/verify-account",
        {
          email,
          otp,
        }
      );
      if (data.success) {
        toast.success(data.success);
        navigate("/admin_main");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="em_container">
      <div className="em_center_box">
        <div className="em_card">
          <h6 className="em_heading">
            Please enter the one-time password to verify your account
          </h6>
          <div className="em_info">
            <span>A code has been sent to </span>
            <small className="em_masked_number">
              {userData?.email?.slice(0, 3)}******{userData?.email?.slice(-4)}
            </small>
          </div>
          <div className="em_inputs">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                type="number"
                maxLength="1"
                className="em_input_box"
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
          <div className="em_button_wrap">
            <button className="em_validate_btn" onClick={handleValidate}>
              Validate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
