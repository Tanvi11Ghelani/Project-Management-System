import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom"; // Import Navigate
import toast from "react-hot-toast";
import { Context } from "../../main";
import { BeatLoader } from "react-spinners";
import Modal from "./Model";

const CreateProject = ({ setProjects }) => {
  const [project, setProject] = useState([]);
  const [newProject, setNewProject] = useState({
    projectname: "",
    description: "",
    start_date: "",
    complete: "",
  });

  const [showForm, setShowForm] = useState(false); // State to manage form visibility
  const { user, isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/project/getAllProjects",
          {
            withCredentials: true,
          }
        );
        console.log("Projects data fetched:", data);
        setProject(data.projects); // Correct the response handling
      } catch (error) {
        console.error(
          "Error fetching projects:",
          error.response ? error.response.data.message : error.message
        );
        setProject([]);
      }
    };
    if (isAuthenticated && user.role === "Admin") {
      fetchProjects();
    }
  }, [isAuthenticated, user, setProject]);

  if (!isAuthenticated || (user && user.role === "Client")) {
    return <Navigate to={"/"} />;
  }

  const handleInputChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/project/addProject",
        newProject,
        { withCredentials: true }
      );
      setProject([...project, response.data.project]);
      setNewProject({
        projectname: "",
        description: "",
        start_date: "",
        complete: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  return (
    <section className="hero" style={{ marginLeft: 400 }}>
      {project && project.length > 0 ? (
        project.map((element) => (
          <Link className="card" key={element._id}>
            <p>Project Name: {element.projectname}</p>
          </Link>
        ))
      ) : (
        <BeatLoader size={30} color="gray" />
      )}
      <div>
        <button style={{ margin: 60 }} onClick={() => setShowForm(true)}>
          Add New Project
        </button>
      </div>
      <Modal show={showForm} onClose={() => setShowForm(false)}>
        <div className="modal-content">
          <h2>Add Project</h2>
          <form onSubmit={handleAddProject}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="projectname"
                value={newProject.projectname}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={newProject.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Start_date:</label>
              <input
                type="date"
                name="start_date"
                value={newProject.start_date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Complete:</label>
              <input
                type="text"
                name="complete"
                value={newProject.complete}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">Add Project</button>
          </form>
        </div>
      </Modal>
    </section>
  );
};

export default CreateProject;
