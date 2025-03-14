import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentLogin = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // TODO: Add authentication logic
    navigate('/student_main');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4">Student Login</h1>
      <button onClick={handleLogin} className="px-6 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition">
        Login
      </button>
    </div>
  );
};

export default StudentLogin;
