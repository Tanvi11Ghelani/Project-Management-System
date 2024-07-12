import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { Context } from "../../main";
import Sidebar from "../Layout/Sidebar";
import toast from "react-hot-toast";
import Modal from "./Model"; // Correct import for Modal

const ProjectDetail = () => {
  const { id } = useParams(); // Assuming id is the projectId
  const { isAuthenticated, projects, user } = useContext(Context);
  const [component, setComponent] = useState("Project");
  const [project, setProject] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModuleModal, setShowAddModuleModal] = useState(false); // State for add module modal
  const [selectedModule, setSelectedModule] = useState(null);
  const [newModule, setNewModule] = useState({
    modulename: "",
    description: "",
    start_date: "",
    end_date: "",
    amount: "",
    actual_end_date: "",
    days: "",
    project_id: id, // Initialize with project id
  });
  const [showForm, setShowForm] = useState(false); // State to manage form visibility

  useEffect(() => {
    const fetchProject = () => {
      const foundProject = projects.find((proj) => proj._id === id);
      if (foundProject) {
        setProject(foundProject);
      }
      setLoading(false);
    };

    const fetchModules = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/project/projects/${id}/modules`
        );
        const formattedModules = response.data.modules.map((module) => ({
          ...module,
          start_date: formatDate(module.start_date),
          end_date: formatDate(module.end_date),
          actual_end_date: formatDate(module.actual_end_date),
        }));
        setModules(formattedModules);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching modules:", error);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProject();
      fetchModules();
    } else {
      setLoading(false);
    }
  }, [id, isAuthenticated, projects]);

  const handleDeleteModule = async (moduleId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/v1/module/deleteModule/${moduleId}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        const updatedModules = modules.filter((mod) => mod._id !== moduleId);
        setModules(updatedModules);
        toast.success("Module Deleted Successfully");
      } else {
        console.error("Failed to delete module");
      }
    } catch (error) {
      console.error("Error deleting module:", error);
      toast.error("Error deleting module");
    }
  };

  const handleUpdateModule = async (updatedModuleData) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/module/updateModule/${selectedModule._id}`,
        updatedModuleData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        const updatedModules = modules.map((mod) =>
          mod._id === selectedModule._id ? response.data.data : mod
        );
        setModules(updatedModules);
        toast.success("Module Updated Successfully");
        setShowForm(false);
      } else {
        console.error("Failed to update module");
      }
    } catch (error) {
      console.error("Error updating module:", error);
      toast.error("Error updating module");
    }
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/module/addModules",
        newModule,
        { withCredentials: true }
      );
      setModules([...modules, response.data.newModule]);
      setNewModule({
        modulename: "",
        description: "",
        start_date: "",
        end_date: "",
        amount: "",
        actual_end_date: "",
        days: "",
        project_id: id,
      });
      setShowForm(false);
      toast.success("Module added successfully!");
    } catch (error) {
      console.error(
        "Error adding module:",
        error.response ? error.response.data.message : error.message
      );
      toast.error("Failed to add module.");
    }
  };

  const handleUpdateProject = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/project/updateProject/${project._id}`,
        project,
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("Project Updated Response:", response.data.updatedProject);
        setProject(response.data.updatedProject);
        toast.success("Project Updated Successfully");
        setShowUpdateModal(false); // Close the modal on successful update
      } else {
        console.error("Failed to update project");
        toast.error("Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Error updating project");
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewModule({ ...newModule, [name]: value });
  };

  if (loading) {
    return <BeatLoader size={30} color="gray" />;
  }

  if (!project) {
    return <p>Project not found</p>;
  }

  return (
    <div className="project-detail-container">
      <Sidebar component={component} setComponent={setComponent} />
      <div className="project-card">
        <h1>{project.projectname}</h1>
        <p>Project Description: {project.description}</p>
        <p>Start Date: {formatDate(project.start_date)}</p>
        <p
          className={project.complete ? "status-complete" : "status-incomplete"}
        >
          Status: {project.complete ? "Complete" : "Incomplete"}
        </p>
        <button onClick={() => setShowForm(true)}>Add New Module</button>
        <button onClick={() => setShowUpdateModal(true)}>Update Project</button>
      </div>

      <h2>Modules</h2>
      <div className="modules-table">
        {modules && modules.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Module Name</th>
                <th>Amount</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Actual End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((module) => (
                <tr key={module._id}>
                  <td>{module.modulename}</td>
                  <td>{module.amount}</td>
                  <td>{module.start_date}</td>
                  <td>{module.end_date}</td>
                  <td>{module.days}</td>
                  <td>{module.actual_end_date}</td>
                  <td>
                    <button onClick={() => handleDeleteModule(module._id)}>
                      Delete
                    </button>
                    <button onClick={() => setSelectedModule(module)}>
                      Update
                    </button>
                    <Link
                      to={`/projects/${id}/tasks/${module._id}`}
                      className="task-button"
                    >
                      Tasks
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No modules available.</p>
        )}
      </div>

      {/* Add Module Modal */}
      <Modal show={showForm} onClose={() => setShowForm(false)}>
        <h2 className="modal-title">Add Module</h2>
        <form onSubmit={handleAddModule} className="modal-form">
          <div className="form-group">
            <label>Module Name:</label>
            <input
              type="text"
              name="modulename"
              value={newModule.modulename}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Amount:</label>
            <input
              type="number"
              name="amount"
              value={newModule.amount}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Start Date:</label>
            <input
              type="date"
              name="start_date"
              value={newModule.start_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date:</label>
            <input
              type="date"
              name="end_date"
              value={newModule.end_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Days:</label>
            <input
              type="number"
              name="days"
              value={newModule.days}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Actual End Date:</label>
            <input
              type="date"
              name="actual_end_date"
              value={newModule.actual_end_date}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="modal-submit-button">
            Add Module
          </button>
        </form>
      </Modal>

      {/* Update Module Modal */}
      <Modal
        show={selectedModule !== null}
        onClose={() => setSelectedModule(null)}
      >
        <div className="modal-content">
          <h2>Update Module</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const updatedModuleData = {
                modulename: e.target.modulename.value,
                amount: e.target.amount.value,
                start_date: e.target.start_date.value,
                end_date: e.target.end_date.value,
                days: e.target.days.value,
                actual_end_date: e.target.actual_end_date.value || null,
              };
              handleUpdateModule(updatedModuleData);
            }}
          >
            <label>Module Name:</label>
            <input
              type="text"
              name="modulename"
              defaultValue={selectedModule ? selectedModule.modulename : ""}
              required
            />
            <label>Amount:</label>
            <input
              type="number"
              name="amount"
              defaultValue={selectedModule ? selectedModule.amount : ""}
              required
            />
            <label>Start Date:</label>
            <input
              type="date"
              name="start_date"
              defaultValue={
                selectedModule ? selectedModule.start_date.split("T")[0] : ""
              }
              required
            />
            <label>End Date:</label>
            <input
              type="date"
              name="end_date"
              defaultValue={
                selectedModule ? selectedModule.end_date.split("T")[0] : ""
              }
              required
            />
            <label>Days:</label>
            <input
              type="number"
              name="days"
              defaultValue={selectedModule ? selectedModule.days : ""}
              required
            />
            <label>Actual End Date:</label>
            <input
              type="date"
              name="actual_end_date"
              defaultValue={
                selectedModule
                  ? selectedModule.actual_end_date.split("T")[0]
                  : ""
              }
            />
            <button type="submit">Update</button>
          </form>
        </div>
      </Modal>

      {/* Update Project Modal */}
      {showUpdateModal && (
        <Modal show={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
          <h2 className="modal-title">Update Project</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateProject();
            }}
            className="modal-form"
          >
            <div className="form-group">
              <label>Status:</label>
              <select
                name="complete"
                value={project.complete ? "true" : "false"}
                onChange={(e) => {
                  console.log("Previous State:", project.complete);
                  const newComplete = e.target.value === "true";
                  setProject({
                    ...project,
                    complete: newComplete,
                  });
                  console.log("New State:", newComplete);
                }}
                required
              >
                <option value="true">Complete</option>
                <option value="false">Incomplete</option>
              </select>
            </div>
            <button type="submit">Update Project</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ProjectDetail;
