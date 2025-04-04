import React, { useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminRegister from "./AdminRegister";
import Button from "@mui/material/Button";


const AdminMain = () => {
  const [token, setToken] = useState("123");

  return (
    <div className="h-screen flex items-center justify-center bg-gray-200">
      {token === "" ? (
        <AdminRegister />
      ) : (
        <div>
          <h1 className="text-3xl font-bold">Welcome to Admin Dashboard</h1>
          <Button
            variant="contained"
            color="error"
            onClick={() => setToken("")}
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminMain;
