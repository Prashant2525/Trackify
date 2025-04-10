import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import GlobalLogin from './components/GlobalLogin';
import StudentMain from './pages/StudentMain';
import AdminMain from './pages/AdminMain';
import StudentRegister from './pages/StudentRegister';
import AdminRegister from './pages/AdminRegister';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<GlobalLogin />} />
      <Route path="/student_register" element={<StudentRegister />} />
      <Route path="/admin_register" element={<AdminRegister />} />
      <Route path="/student_main" element={<StudentMain />} />
      <Route path="/admin_main" element={<AdminMain />} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/email_verify" element={<EmailVerify/>} />
      <Route path="/reset_password" element={<ResetPassword/>} />
    </Routes>
  );
};

export default App;