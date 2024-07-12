import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import Sidebar from "../Layout/Sidebar";
import toast from "react-hot-toast";
import { Context } from "../../main";
import Modal from "./Model"; // Ensure Modal is correctly imported

const TaskList = () => {
  const { moduleId } = useParams();
  const [loading, setLoading] = useState(true);
  const { task, setTask } = useContext(Context);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    name: "",
    status: "",
    start_date: "",
    end_date: "",
    module: moduleId, // Ensure moduleId is correctly set
  });

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/module/modules/${moduleId}/tasks`
        );
        setTask(response.data.tasks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [moduleId, setTask]);

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/v1/task/deleteTask/${taskId}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        const updatedTasks = task.filter((task) => task._id !== taskId);
        setTask(updatedTasks);
        toast.success("Task Deleted Successfully");
      } else {
        console.error("Failed to delete Task");
        toast.error("Failed to delete Task");
      }
    } catch (error) {
      console.error("Error deleting Task:", error);
      toast.error("Error deleting Task");
    }
  };

  const handleUpdateTask = async (updatedTaskData) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/task/updateTask/${selectedTask._id}`,
        updatedTaskData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        const updatedTasks = task.map((task) =>
          task._id === selectedTask._id ? response.data.task : task
        );
        setTask(updatedTasks);
        setShowUpdateModal(false);
        toast.success("Task Updated Successfully");
      } else {
        console.error("Failed to update Task");
        toast.error("Failed to update Task");
      }
    } catch (error) {
      console.error("Error updating Task:", error);
      toast.error("Error updating Task");
    }
  };

  const handleOpenUpdateModal = (task) => {
    setSelectedTask(task);
    setShowUpdateModal(true);
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/task/addTasks",
        newTask,
        { withCredentials: true }
      );

      if (response.status === 201) {
        setTask([...task, response.data.newTask]);
        setNewTask({
          name: "",
          status: "",
          start_date: "",
          end_date: "",
          module: moduleId,
        });
        setShowForm(false);
        toast.success("Task Added Successfully");
      } else {
        console.error("Error adding task:", response.data.message);
        toast.error("Failed to add task");
      }
    } catch (error) {
      console.error(
        "Error adding Task:",
        error.response ? error.response.data.message : error.message
      );
      toast.error("Error adding Task");
    }
  };

  if (loading) {
    return <BeatLoader size={30} color="gray" />;
  }

  return (
    <div className="task-list-container">
      <Sidebar />
      <h1>Tasks for Module</h1>
      {task.length > 0 ? (
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {task.map((task) => (
              <tr key={task._id}>
                <td>{task.name}</td>
                <td>{task.status}</td>
                <td>{formatDate(task.start_date)}</td>
                <td>{formatDate(task.end_date)}</td>
                <td>
                  <button onClick={() => handleDeleteTask(task._id)}>
                    Delete
                  </button>
                  <button onClick={() => handleOpenUpdateModal(task)}>
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tasks available for Module {moduleId}</p>
      )}

      <button onClick={() => setShowForm(true)}>Add Task</button>

      {/* Modal for updating task */}
      <Modal show={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <div className="modal-content">
          <h2>Update Task</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const updatedTaskData = {
                name: e.target.name.value,
                status: e.target.status.value,
                start_date: e.target.start_date.value,
                end_date: e.target.end_date.value,
              };
              handleUpdateTask(updatedTaskData);
            }}
          >
            <label>Task Name:</label>
            <input
              type="text"
              name="name"
              defaultValue={selectedTask ? selectedTask.name : ""}
              required
            />
            <label>Status:</label>
            <input
              type="text"
              name="status"
              defaultValue={selectedTask ? selectedTask.status : ""}
              required
            />
            <label>Start Date:</label>
            <input
              type="date"
              name="start_date"
              defaultValue={
                selectedTask ? selectedTask.start_date.split("T")[0] : ""
              }
              required
            />
            <label>End Date:</label>
            <input
              type="date"
              name="end_date"
              defaultValue={
                selectedTask ? selectedTask.end_date.split("T")[0] : ""
              }
              required
            />
            <button type="submit">Update</button>
          </form>
        </div>
      </Modal>

      {/* Modal for adding task */}
      <Modal show={showForm} onClose={() => setShowForm(false)}>
        <div className="modal-content">
          <h2>Add Task</h2>
          <form onSubmit={handleAddTask}>
            <label>Task Name:</label>
            <input
              type="text"
              name="name"
              value={newTask.name}
              onChange={handleInputChange}
              required
            />
            <label>Status:</label>
            <input
              type="text"
              name="status"
              value={newTask.status}
              onChange={handleInputChange}
              required
            />
            <label>Start Date:</label>
            <input
              type="date"
              name="start_date"
              value={newTask.start_date}
              onChange={handleInputChange}
              required
            />
            <label>End Date:</label>
            <input
              type="date"
              name="end_date"
              value={newTask.end_date}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Add Task</button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default TaskList;
