import React from "react";

const projects = Array(10).fill({
  name: "E-Commerce Website using mern",
  slots: 4,
});

const ProjectsTable = () => (
  <section className="projects-section">
    <h2 className="projects-title">Projects</h2>
    <div className="projects-table-wrapper">
      <table className="projects-table">
        <thead>
          <tr>
            <th>Project name</th>
            <th>Number of Slots</th>
            <th>Apply/Join</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((proj, idx) => (
            <tr key={idx}>
              <td>{`${idx + 1}. ${proj.name}`}</td>
              <td>{proj.slots}</td>
              <td>
                <button className="apply-btn">
                  {idx < 2 ? "Apply" : "Join"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default ProjectsTable;
