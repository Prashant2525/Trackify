import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";

const AdminMain = () => {
  const { adminData, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    
  };

  if (!adminData) return <div>Loading...</div>;

  return (
    <div className="h-screen flex items-center justify-center bg-gray-200">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome {adminData.name} to the Admin Dashboard
        </h1>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminMain;
