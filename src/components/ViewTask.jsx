import React, { useContext, useEffect, useState } from "react";
import "../pages/css/StudentMain.css";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ViewTask = ({ token }) => {
  const { backendUrl } = useContext(AppContext);
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/list/weekly-tasks", {
        withCredentials: true,
      });
      console.log("🛠 GET /api/list/weekly-tasks →", response.status, response.data);

      if (response.data.tasks) {
        setList(response.data.tasks);
      } else {
        toast.error("Malformed response from server");
        console.warn("Expected `tasks` array, got:", response.data);
      }
    } catch (error) {
      console.error("fetchList error:", error);
      toast.error(
        error.response?.data?.message || error.message || "Network error"
      );
    }
  };

  const removeTask = async (id) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/tasks/remove",
        { id },
        { headers: { token } },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchList();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="stdmain_projects">
      <h2 className="projects_title">Projects</h2>
      <div className="main_projects-table-wrapper">
        <table className="main_projects-table">
          <thead>
            <tr>
              <th>Task name</th>
              <th>Task Details</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {list.map((tasks, index) => (
              <tr key={tasks._id}>
                <td>{`${index + 1}. ${tasks.taskName}`}</td>
                <td>{tasks.taskDescription}</td>
                <td>
                  <button
                    className="main_apply-btn apply"
                    onClick={() => removeTask(tasks._id)}
                    style={{ backgroundColor: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewTask;
