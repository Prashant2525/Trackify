import React, { useContext, useEffect, useState } from "react";
import "./css/StudentMain.css";
import white_logo from "../assets/img/white_logo.png";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Apply from "../components/Apply";
import Join from "../components/Join";
import TaskDetailsModal from "../components/TaskDetailsModal";
import axios from "axios";
import { toast } from "react-toastify";

const StudentMain = () => {
  const { backendUrl, userData, logout } = useContext(AppContext);
  const [list, setList] = useState([]);
  const [userProject, setUserProject] = useState(null);
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [submittedTasks, setSubmittedTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const navigate = useNavigate();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchStudentProgress = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/weekly-tasks/progress`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success && response.data.studentDetails) {
        const currentUserProgress = response.data.studentDetails.find(
          (student) => student.studentId === userData._id
        );

        if (currentUserProgress && currentUserProgress.submittedTasks) {
          setSubmittedTasks(currentUserProgress.submittedTasks);
        }
      }
    } catch (error) {
      console.error("Error fetching student progress:", error);
    }
  };

  const fetchTeamMembers = async (projectId) => {
    try {
      setLoadingMembers(true);

      // First, fetch the project to get the students array
      const projectResponse = await axios.get(
        `${backendUrl}/api/projects/list`,
        {
          withCredentials: true,
        }
      );

      // Find the specific project
      const project = projectResponse.data.projects.find(
        (p) => p._id === projectId
      );

      if (
        !project ||
        !Array.isArray(project.students) ||
        project.students.length === 0
      ) {
        setTeamMembers([]);
        setLoadingMembers(false);
        return;
      }

      // Now we have the array of student IDs
      const studentIds = project.students;

      // Create an array of promises for each student ID
      const promises = studentIds.map((studentId) =>
        axios.get(`${backendUrl}/api/user/by-id`, {
          withCredentials: true,
          params: { userId: studentId }, // Pass the complete ID
        })
      );

      const responses = await Promise.all(promises);
      const members = responses
        .filter((res) => res.data.success && res.data.userData)
        .map((res) => ({
          id: res.data.userData._id,
          name: res.data.userData.name,
          email: res.data.userData.email,
        }));

      setTeamMembers(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to fetch team members");
      setTeamMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  // Check if user has already joined a project
  const checkUserProject = async () => {
    try {
      setLoading(true);
      const response = await axios.get(backendUrl + "/api/projects/list", {
        withCredentials: true,
      });

      if (response.data.projects) {
        setList(response.data.projects);

        const userProjects = response.data.projects.filter(
          (project) =>
            project.students.includes(userData._id) ||
            project.leader === userData._id
        );

        if (userProjects.length > 0) {
          setUserProject(userProjects[0]);
          await fetchTeamMembers(userProjects[0]._id);
          fetchWeeklyTasks();
          fetchStudentProgress();
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error checking user project:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to check user project"
      );
      setLoading(false);
    }
  };

  // Fetch weekly tasks
  const fetchWeeklyTasks = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/list/weekly-tasks", {
        withCredentials: true,
      });

      if (response.data.success && response.data.tasks) {
        setWeeklyTasks(response.data.tasks);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weekly tasks:", error);
      toast.error("Failed to fetch weekly tasks");
      setLoading(false);
    }
  };

  // Fetch projects list
  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/projects/list", {
        withCredentials: true,
      });

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
    if (userData) {
      checkUserProject();
    }
  }, [userData]);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
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

  const handleProjectSuccess = () => {
    checkUserProject();
  };

  const isTaskSubmitted = (weekNumber) => {
    return submittedTasks.some((task) => task.weekNumber === weekNumber);
  };

  const handleViewMore = (task) => {
    if (isTaskSubmitted(task.weekNumber)) {
      return;
    }

    setSelectedTask(task);
    setShowTaskModal(true);
  };

  // Handle task submission success
  const handleTaskSubmissionSuccess = () => {
    fetchWeeklyTasks();
    fetchStudentProgress();
    setShowTaskModal(false);
  };

  if (!userData) return <div>Loading...</div>;

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
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : userProject ? (
          // Weekly Task UI
          <div className="weekly-task-container">
            <h2 className="weekly-task-title">Weekly Task</h2>

            {weeklyTasks.length > 0 ? (
              <div className="weekly-task-list">
                {weeklyTasks.map((task, index) => {
                  const taskSubmitted = isTaskSubmitted(task.weekNumber);
                  return (
                    <div key={task._id} className="weekly-task-item">
                      <div className="weekly-task-week">
                        Weekly {task.weekNumber}
                      </div>
                      <div className="weekly-task-name">{task.taskName}</div>
                      {taskSubmitted ? (
                        <div className="weekly-task-completed">Completed</div>
                      ) : (
                        <button
                          className="weekly-task-view-more"
                          onClick={() => handleViewMore(task)}
                        >
                          View More
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-tasks-message">
                No weekly tasks assigned yet. Please check back later.
              </div>
            )}
          </div>
        ) : (
          // Project Listing UI
          <>
            <h2 className="projects_title">Projects</h2>
            <div className="main_projects-table-wrapper">
              <table className="main_projects-table">
                <thead>
                  <tr>
                    <th>Project name</th>
                    <th>Project Description</th>
                    <th>Number of Slots</th>
                    <th>Apply/Join</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((project, index) => (
                    <tr key={project._id}>
                      <td>{`${project.name}`}</td>
                      <td>{`${project.description}`}</td>
                      <td>{`${project.slotsFilled}/${project.slotsAvailable}`}</td>
                      <td>
                        {project.slotsFilled === 0 ? (
                          <button
                            className="main_apply-btn apply"
                            onClick={() => handleApplyClick(project, index)}
                            disabled={
                              project.slotsFilled >= project.slotsAvailable
                            }
                          >
                            Apply
                          </button>
                        ) : project.slotsFilled < project.slotsAvailable ? (
                          <button
                            className="main_apply-btn join"
                            onClick={() => handleJoinClick(project, index)}
                            disabled={
                              project.slotsFilled >= project.slotsAvailable
                            }
                          >
                            Join
                          </button>
                        ) : (
                          <span className="project-full">Full</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="stdmain_right_sidebar">
        {/* Right Calendar Section */}
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

        <div className="progress_container">
          {userProject ? (
            <div className="progress-info">
              <h3>Project: {userProject.name}</h3>
              <p>
                Team Members: {userProject.slotsFilled}/
                {userProject.slotsAvailable}
              </p>
              {userProject.leader === userData._id && (
                <p className="leader-badge">You are the team leader</p>
              )}
              <p
                style={{
                  marginTop: "10px",
                  fontSize: "1rem",
                  backgroundColor: "#333",
                  color: "white",
                  padding: "5px",
                  borderRadius: "0.5rem",
                }}
              >
                Join Code: {userProject.joinCode}
              </p>

              {/* Team Members List */}
              <div className="team-members-container">
                <h4 style={{ marginTop: "15px", marginBottom: "10px" }}>
                  Team Members:
                </h4>
                {loadingMembers ? (
                  <p>Loading team members...</p>
                ) : teamMembers.length > 0 ? (
                  <ul className="team-members-list">
                    {teamMembers.map((member) => (
                      <li key={member.id} className="team-member-item">
                        <div className="member-info">
                          <span className="member-name">{member.name}</span>
                          <span className="member-email">{member.email}</span>
                        </div>
                        {userProject.leader === member.id && (
                          <span className="member-leader-badge">Leader</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No team members found</p>
                )}
              </div>
            </div>
          ) : (
            <p>
              Details will be shown here only after you join any project and
              only when professor assigns you a weekly task
            </p>
          )}
        </div>
      </div>

      {/* Modals */}
      <Apply
        isOpen={showApplyModal}
        onClose={handleCloseApplyModal}
        projectName={selectedProject?.name}
        projectId={selectedProject?._id}
        onSuccess={handleProjectSuccess}
      />
      <Join
        isOpen={showJoinModal}
        onClose={handleCloseJoinModal}
        onSuccess={handleProjectSuccess}
      />
      <TaskDetailsModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        task={selectedTask}
        onSuccess={handleTaskSubmissionSuccess}
      />
    </div>
  );
};

export default StudentMain;
