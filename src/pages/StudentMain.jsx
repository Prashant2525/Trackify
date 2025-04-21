import React, { useContext, useEffect, useState } from "react";
import "./css/StudentMain.css";
import white_logo from "../assets/img/white_logo.png";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Apply from "./Apply";
import Join from "./Join";
import axios from "axios";
import { toast } from "react-toastify";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const StudentMain = () => {
  const { backendUrl, userData, logout } = useContext(AppContext);
  const [list, setList] = useState([]);
  console.log(userData)

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      console.log(userData);
      const { data } = await axios.post(
        backendUrl + "/api/user/send-verify-otp",
        { email: userData.email }
      );

      if (data.success) {
        navigate("/email_verify");
        toast.success(data.success);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/projects/list", {
        withCredentials: true,
      });
      console.log("🛠 GET /api/projects/list →", response.status, response.data);

      // set the list directly from the returned projects array
      if (response.data.projects) {
        setList(response.data.projects);
      } else {
        toast.error("Malformed response from server");
        console.warn("Expected `projects` array, got:", response.data);
      }
    } catch (error) {
      console.error("fetchList error:", error);
      toast.error(
        error.response?.data?.message || error.message || "Network error"
      );
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const navigate = useNavigate();
  const [currentMonth] = useState("February 2025");

  // Modal states
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleLogout = async () => {
    await logout();
  };

  const handleApplyClick = (project, index) => {
    setSelectedProject({ ...project, index });
    setShowApplyModal(true);
    setShowJoinModal(false);
  };

  const handleJoinClick = (project, index) => {
    setSelectedProject({ ...project, index });
    setShowJoinModal(true);
    setShowApplyModal(false);
  };

  const handleCloseApplyModal = () => setShowApplyModal(false);
  const handleCloseJoinModal = () => setShowJoinModal(false);

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="stdmain_content">
      {/* Left Profile Sidebar */}
      <div className="stdmain_left_sidebar">
        <div className="stdmain_logo">
          <Link to="/">
            <img src={white_logo} alt="Trackify" />
          </Link>
        </div>

        <div className="stdmain_profile">
          <div className="main_avatar" />
          <div className="stdmain_profile-info">
            <div className="stdmain_profile-name">
              {userData.name || "Prashant Dhimal"}
            </div>
            <div className="stdmain_profile-id">
              {userData.reg_num || "AP22110011492"}
            </div>
          </div>

          <div className="stdmain_btn">
            <button className="stdmain_edit-profile-btn">Edit Profile</button>
            <div className="stdmain_editpro">
              <ul>
                {!userData?.isAccountVerified ? (
                  <li
                    onClick={sendVerificationOtp}
                    className="stdmain_verifyem"
                  >
                    Verify Email
                  </li>
                ) : (
                  <li className="stdmain_verifyem">Verified</li>
                )}
              </ul>
            </div>
          </div>
          <button className="stdmain_logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="stdmain_projects">
        <h2 className="projects_title">Projects</h2>
        <div className="main_projects-table-wrapper">
          <table className="main_projects-table">
            <thead>
              <tr>
                <th>Project name</th>
                <th>Number of Slots</th>
                <th>Apply/Join</th>
              </tr>
            </thead>
            <tbody>
              {list.map((project, index) => (
                <tr key={project._id}>
                  <td>{`${index + 1}. ${project.name}`}</td>
                  <td>{project.slotsAvailable}</td>
                  <td>
                    {index % 2 === 0 ? (
                      <button
                        className="main_apply-btn apply"
                        onClick={() => handleApplyClick(project, index)}
                      >
                        Apply
                      </button>
                    ) : (
                      <button
                        className="main_apply-btn join"
                        onClick={() => handleJoinClick(project, index)}
                      >
                        Join
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="stdmain_right_sidebar">
        <div className="calendar_container">
          <div className="calendar_header">
            <div className="month_year">
              <span className="month">{currentMonth}</span>
              <div className="subtext">Student Dashboard of next day</div>
            </div>
            <button className="today_btn">Today</button>
          </div>
          <div className="calendar_weekdays">
            {weekdays.map((day, idx) => (
              <div key={idx} className="weekday">
                {day}
              </div>
            ))}
          </div>
          <div className="calendar_days">
            {[...Array(31)].map((_, idx) => {
              const day = idx + 1;
              const isToday = day === 21;
              return (
                <div key={idx} className={`day ${isToday ? "today" : ""}`}>
                  {day}
                </div>
              );
            })}
          </div>
        </div>
        <div className="progress_container">
          <p>
            Progress will be shown here only after you join any project and only
            when professor assign you a weekly task
          </p>
        </div>
      </div>

      {/* Modals */}
      <Apply
        isOpen={showApplyModal}
        onClose={handleCloseApplyModal}
        projectName={selectedProject?.name}
      />
      <Join isOpen={showJoinModal} onClose={handleCloseJoinModal} />
    </div>
  );
};

export default StudentMain;
