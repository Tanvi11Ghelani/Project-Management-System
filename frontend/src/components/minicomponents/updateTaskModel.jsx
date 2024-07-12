import React, { useState } from "react";
import Modal from "react-model"; // Install react-modal package if not installed
import axios from "axios";
import toast from "react-hot-toast";

Modal.setAppElement("#root"); // Set app root element for accessibility

const UpdateTaskModal = ({
  isOpen,
  closeModal,
  taskId,
  currentTaskName,
  updateTask,
}) => {
  const [updatedTaskName, setUpdatedTaskName] = useState(currentTaskName);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/task/updateTask/${taskId}`,
        { name: updatedTaskName },
        { withCredentials: true }
      );
      if (response.status === 200) {
        updateTask(taskId, updatedTaskName); // Update task in parent component state
        toast.success("Task Updated Successfully");
        closeModal(); // Close the modal after updating
      } else {
        console.error("Failed to update Task");
        toast.error("Failed to update Task");
      }
    } catch (error) {
      console.error("Error updating Task:", error);
      toast.error("Error updating Task");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Update Task Modal"
    >
      <h2>Update Task</h2>
      <label>
        Task Name:
        <input
          type="text"
          value={updatedTaskName}
          onChange={(e) => setUpdatedTaskName(e.target.value)}
        />
      </label>
      <button onClick={handleUpdate}>Update</button>
      <button onClick={closeModal}>Cancel</button>
    </Modal>
  );
};

export default UpdateTaskModal;
