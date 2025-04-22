import React, { useContext, useEffect, useState } from "react";
import "../pages/css/StudentMain.css";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ViewProjects = ({ token }) => {
  const { backendUrl } = useContext(AppContext);
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/projects/list", {
        withCredentials: true,
      });
      console.log("🛠 GET /api/projects/list →", response.status, response.data);

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

  const removeProject = async (id) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/projects/remove",
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
              <th>Project name</th>
              <th>Number of Slots</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {list.map((project, index) => (
              <tr key={project._id}>
                <td>{`${index + 1}. ${project.name}`}</td>
                <td>{project.slotsAvailable}</td>
                <td>
                  <button
                    className="main_apply-btn apply"
                    onClick={() => removeProject(project._id)}
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

export default ViewProjects;
