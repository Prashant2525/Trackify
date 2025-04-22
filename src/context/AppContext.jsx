// src/context/AppContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { set } from "mongoose";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentDetails, setStudentDetails] = useState(null);

  const getAdminData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data", {
        withCredentials: true,
      });
      if (data.success && data.adminData) {
        setAdminData(data.adminData);
        setIsAdminLoggedIn(true);
      } else {
        setAdminData(null);
        setIsAdminLoggedIn(false);
      }
    } catch (error) {
      setAdminData(null);
      setIsAdminLoggedIn(false);
    }
    setLoading(false);
  };

  const getUserData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data", {
        withCredentials: true,
      });
      if (data.success && data.userData) {
        setUserData(data.userData);
        setIsUserLoggedIn(true);
      } else {
        setUserData(null);
        setIsUserLoggedIn(false);
      }
    } catch (error) {
      setUserData(null);
      setIsUserLoggedIn(false);
    }
    setLoading(false);
  };

  const getStudentDetails = async () => {
    setLoading(true);
    try {
      
      const {data} = await axios.get(backendUrl + "/api/weekly-tasks/progress", {withCredentials: true});
      if (data.success && data.studentDetails) {
        setStudentDetails(data.studentDetails);
        // setIsStudentLoggedIn(true);
      } else {
        setStudentDetails(null);
        // setIsStudentLoggedIn(false);
      }
    } catch (error) {
      setStudentDetails(null);
      // setIsStudentLoggedIn(false);
    }
    setLoading(false);
  };

  const logout = async () => {
    try {
      await axios.post(
        backendUrl + "/api/user/logout",
        {},
        { withCredentials: true }
      );
    } catch {}
    setAdminData(null);
    setIsAdminLoggedIn(false);
    setUserData(null);
    setIsUserLoggedIn(false);
  };

  const value = {
    backendUrl,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    isUserLoggedIn,
    setIsUserLoggedIn,
    adminData,
    setAdminData,
    userData,
    setUserData,
    getAdminData,
    getUserData,
    loading,
    logout,
    studentDetails,
    getStudentDetails,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
