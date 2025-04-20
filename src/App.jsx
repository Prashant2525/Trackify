// src/App.jsx
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import GlobalLogin from "./components/GlobalLogin";
import StudentMain from "./pages/StudentMain";
import AdminMain from "./pages/AdminMain";
import StudentRegister from "./pages/StudentRegister";
import AdminRegister from "./pages/AdminRegister";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "./context/AppContext";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<GlobalLogin />} />
        <Route path="/student_register" element={<StudentRegister />} />
        <Route path="/admin_register" element={<AdminRegister />} />
        <Route
          path="/student_main"
          element={
            <ProtectedRoute role="user">
              <StudentMain />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin_main"
          element={
            <ProtectedRoute role="admin">
              <AdminMain />
            </ProtectedRoute>
          }
        />
        <Route path="/email_verify" element={<EmailVerify />} />
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
