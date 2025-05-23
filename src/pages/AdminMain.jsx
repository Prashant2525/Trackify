import React, { useState, useRef, useEffect, useContext } from "react";
import "./css/AdminMain.css";
import AddProject from "../components/AddProject";
import StudentDetails from "../components/StudentDetails";
import WeeklyTask from "../components/WeeklyTask";
import ViewWeeklyTask from "../components/ViewWeeklyTask";
import { useNavigate } from "react-router";
import { AppContext } from "../context/AppContext";
import white_logo from "../assets/img/white_logo.png";
import { toast } from "react-toastify";
import axios from "axios";

const AdminMain = () => {
  const [showAddProject, setShowAddProject] = useState(false);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [showAddWeeklyTask, setShowAddWeeklyTask] = useState(false);
  const [showViewWeeklyTask, setShowViewWeeklyTask] = useState(false);

  // Refs for popup containers
  const addProjectRef = useRef(null);
  const studentDetailsRef = useRef(null);
  const addWeeklyTaskRef = useRef(null);
  const viewWeeklyTaskRef = useRef(null);

  // Handle clicks outside of pop-ups
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showAddProject &&
        addProjectRef.current &&
        !addProjectRef.current.contains(event.target)
      ) {
        setShowAddProject(false);
      }
      if (
        showStudentDetails &&
        studentDetailsRef.current &&
        !studentDetailsRef.current.contains(event.target)
      ) {
        setShowStudentDetails(false);
      }
      if (
        showAddWeeklyTask &&
        addWeeklyTaskRef.current &&
        !addWeeklyTaskRef.current.contains(event.target)
      ) {
        setShowAddWeeklyTask(false);
      }
      if (
        showViewWeeklyTask &&
        viewWeeklyTaskRef.current &&
        !viewWeeklyTaskRef.current.contains(event.target)
      ) {
        setShowViewWeeklyTask(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    showAddProject,
    showStudentDetails,
    showAddWeeklyTask,
    showViewWeeklyTask,
  ]);

  const { backendUrl, adminData, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  console.log(adminData);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      console.log(adminData);
      const { data } = await axios.post(
        backendUrl + "/api/user/send-verify-otp",
        { email: adminData.email }
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

  const handleExportData = async () => {
    try {
      // Fetch student progress data from the API
      const response = await axios.get(
        backendUrl + "/api/weekly-tasks/progress",
        {
          withCredentials: true,
        }
      );

      if (
        response.data &&
        response.data.success &&
        response.data.studentDetails
      ) {
        // Convert the data to CSV format
        exportToCSV(response.data.studentDetails);
        toast.success("Student data exported successfully");
      } else {
        toast.error("No student data available to export");
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to export student data"
      );
    }
  };

  // Function to convert data to CSV and trigger download
  const exportToCSV = (studentDetails) => {
    // Define CSV headers
    const headers = [
      "Student Name,Student ID,Email,Project Name,Overall Progress,Submitted Tasks",
    ];

    // Convert student data to CSV rows
    const studentRows = studentDetails.map((student) => {
      const {
        studentName,
        studentId,
        projectName,
        overallProgress,
        submittedTasks,
      } = student;

      // Format submitted tasks as a string
      const tasksInfo =
        submittedTasks.length > 0
          ? submittedTasks
              .map(
                (task) =>
                  `Week ${task.weekNumber}: ${task.taskName} (${task.status}, ${task.progressPercentage}%)`
              )
              .join("; ")
          : "No tasks submitted";

      // Return CSV row (note: we don't have email in the data, so leaving it blank)
      return `"${studentName}","${studentId}","","${projectName}","${overallProgress}","${tasksInfo}"`;
    });

    // Combine headers and rows
    const csvContent = [...headers, ...studentRows].join("\n");

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a download link and trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    // Set download attributes with current date in the filename
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD format

    link.setAttribute("href", url);
    link.setAttribute("download", `student_progress_${formattedDate}.csv`);

    // Append to document, trigger click, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Release the object URL
    URL.revokeObjectURL(url);
  };

  //! Get current date for calendar

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();

  // Calculate the day of the month for the first day of the current month
  const firstDayOfMonth = new Date(
    currentYear,
    currentDate.getMonth(),
    1
  ).getDay();

  // Get the number of days in the current month
  const lastDay = new Date(
    currentYear,
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Generate calendar days array
  const generateCalendarDays = () => {
    const days = [];

    // Previous month days
    const prevMonthLastDay = new Date(
      currentYear,
      currentDate.getMonth(),
      0
    ).getDate();
    const startingDayOfWeek = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for Monday as first day

    for (let i = startingDayOfWeek; i > 0; i--) {
      days.push({
        day: prevMonthLastDay - i + 1,
        currentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= lastDay; i++) {
      days.push({
        day: i,
        currentMonth: true,
        today: i === currentDay,
      });
    }

    // Next month days
    const totalDaysDisplayed = Math.ceil((startingDayOfWeek + lastDay) / 7) * 7;
    const nextMonthDays = totalDaysDisplayed - startingDayOfWeek - lastDay;

    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        day: i,
        currentMonth: false,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  //! Calendar logic end

  return (
    <div className="ad_mainContainer">
      {/* Left Sidebar */}
      <div className="ad_sidebar">
        <div className="ad_logo">
          <img src={white_logo} alt="Trackify" />
        </div>
        <div className="ad_verline"></div>
        <div className="ad_profileSection">
          <div className="ad_profilePicture">
            <img src="/default-avatar.png" alt="Profile" />
          </div>
          <div className="ad_profile_info">
            <div className="ad_profile_name">
              {adminData.name || "Prashant Dhimal"}
            </div>
            <div className="ad_profile_id">
              {adminData.email || "AP22110011492"}
            </div>
          </div>

          <div className="stdmain_btn">
            <button className="stdmain_edit-profile-btn">Edit Profile</button>
            <div className="stdmain_editpro">
              <ul>
                {!adminData?.isAccountVerified ? (
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
        </div>

        <div className="ad_logoutSection">
          <button className="ad_logoutButton" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ad_mainContent">
        <div className="ad_topButtonsRow">
          <button
            className="ad_actionButton"
            onClick={() => setShowAddProject(true)}
          >
            Add/Edit Project
          </button>

          <button
            className="ad_actionButton"
            onClick={() => setShowStudentDetails(true)}
          >
            View Students Details
          </button>
        </div>

        <div className="ad_middleButtonsRow">
          <button
            className="ad_actionButton"
            onClick={() => setShowAddWeeklyTask(true)}
          >
            Add Weekly Task
          </button>

          <button
            className="ad_actionButton"
            onClick={() => setShowViewWeeklyTask(true)}
          >
            View Weekly Task
          </button>
        </div>

        <div className="ad_bottomButtonRow">
          <button className="ad_exportButton" onClick={handleExportData}>
            Export Data
          </button>
        </div>
      </div>

      {/* Right Calendar Section */}
      <div className="ad_calendarSection">
        <div className="ad_calendar">
          <div className="ad_calendarHeader">
            <div className="ad_dateNumber">{currentDay}</div>
            <div className="ad_calendarInfo">
              <div className="ad_monthYear">
                {currentMonth} {currentYear}
              </div>
              <div className="ad_calendarSubInfo">Trackify...</div>
              <div className="ad_calendarNote">
                Explore the wonders of every day
              </div>
            </div>
          </div>

          <div className="ad_calendarControls">
            <div className="ad_monthSelector">
              <span>{currentMonth}</span>
              <span className="ad_yearSelector">{currentYear}</span>
            </div>
            <div className="ad_todayButton">Today</div>
          </div>

          <div className="ad_weekdaysHeader">
            <div className="ad_weekday">MON</div>
            <div className="ad_weekday">TUE</div>
            <div className="ad_weekday">WED</div>
            <div className="ad_weekday">THU</div>
            <div className="ad_weekday">FRI</div>
            <div className="ad_weekday">SAT</div>
            <div className="ad_weekday">SUN</div>
          </div>

          <div className="ad_calendarGrid">
            {calendarDays.map((dayObj, index) => (
              <div
                key={index}
                className={`ad_calendarDay ${
                  !dayObj.currentMonth ? "ad_otherMonth" : ""
                } ${dayObj.today ? "ad_currentDay" : ""} ${
                  index % 7 > 4 ? "ad_weekend" : ""
                }`}
              >
                {dayObj.day}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pop-up components */}
      {showAddProject && (
        <div className="ad_popupOverlay">
          <div ref={addProjectRef}>
            <AddProject onClose={() => setShowAddProject(false)} />
          </div>
        </div>
      )}

      {showStudentDetails && (
        <div className="ad_popupOverlay">
          <div ref={studentDetailsRef}>
            <StudentDetails onClose={() => setShowStudentDetails(false)} />
          </div>
        </div>
      )}

      {showAddWeeklyTask && (
        <div className="ad_popupOverlay">
          <div ref={addWeeklyTaskRef}>
            <WeeklyTask onClose={() => setShowAddWeeklyTask(false)} />
          </div>
        </div>
      )}

      {showViewWeeklyTask && (
        <div className="ad_popupOverlay">
          <div ref={viewWeeklyTaskRef}>
            <ViewWeeklyTask onClose={() => setShowViewWeeklyTask(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMain;
