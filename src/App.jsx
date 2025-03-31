import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import GlobalLogin from './components/GlobalLogin';
import StudentLogin from './pages/StudentRegister';
import AdminLogin from './pages/AdminRegister';
import StudentMain from './pages/StudentMain';
import AdminMain from './pages/AdminMain';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<GlobalLogin />} />
      <Route path="/student_login" element={<StudentLogin />} />
      <Route path="/admin_login" element={<AdminLogin />} />
      <Route path="/student_main" element={<StudentMain />} />
      <Route path="/admin_main" element={<AdminMain />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;