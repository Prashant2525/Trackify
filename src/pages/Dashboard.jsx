import React from "react";
import Sidebar from "./Sidebar";
import ProjectsTable from "./ProjectsTable";
import CalendarWidget from "./CalendarWidget";
import ProgressPanel from "./ProgressPanel";
import "./css/StudentMain.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="top-section">
          <CalendarWidget />
          <ProjectsTable />
        </div>
        <ProgressPanel />
      </div>
    </div>
  );
};

export default Dashboard;
