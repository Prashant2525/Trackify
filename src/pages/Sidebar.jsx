import React from "react";

const Sidebar = () => (
  <aside className="sidebar">
    <div className="profile-avatar"></div>
    <div className="profile-info">
      <div className="profile-name">Prashant Dhimal</div>
      <div className="profile-id">AP22110011492</div>
      <button className="edit-profile-btn">Edit Profile</button>
    </div>
    <button className="logout-btn">Log out</button>
  </aside>
);

export default Sidebar;
