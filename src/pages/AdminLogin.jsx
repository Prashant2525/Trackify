import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // TODO: Add authentication logic
    navigate('/admin_main');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
      <button onClick={handleLogin} className="px-6 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition">
        Login
      </button>
    </div>
  );
};

export default AdminLogin;
