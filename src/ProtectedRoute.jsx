// src/ProtectedRoute.jsx
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppContext } from "./context/AppContext";

const ProtectedRoute = ({ children, role = "admin" }) => {
  const {
    isAdminLoggedIn,
    isUserLoggedIn,
    getAdminData,
    getUserData,
    loading,
    adminData,
    userData,
  } = useContext(AppContext);

  const [checked, setChecked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Always check authentication on mount
    const checkAuth = async () => {
      if (role === "admin") {
        await getAdminData();
      } else {
        await getUserData();
      }
      setChecked(true);
    };
    checkAuth();
    // eslint-disable-next-line
  }, []);

  if (loading || !checked) return <div>Loading...</div>;

  if (role === "admin" && !isAdminLoggedIn) {
    return <Navigate to="/admin_register" state={{ from: location }} replace />;
  }
  if (role === "user" && !isUserLoggedIn) {
    return <Navigate to="/student_register" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
