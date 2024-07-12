import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Modal from "./Model";
import Sidebar from "../Layout/Sidebar";

const Client = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
  });
  const [showForm, setShowForm] = useState(false); // State to manage form visibility
  const { user, isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/user/getClients",
          { withCredentials: true }
        );
        setClients(response.data.clients); // Set the fetched clients into state
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    if (isAuthenticated && user.role === "Admin") {
      fetchClients();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || (user && user.role === "Client")) {
    return <Navigate to={"/"} />;
  }

  const handleInputChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/addClient",
        newClient,
        { withCredentials: true }
      );
      setClients([...clients, response.data.client]);
      setNewClient({ name: "", email: "", password: "", company: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding client:", error);
    }
  };

  return (
    <div className="clients-page">
      <h2>Clients List</h2>
      <ul>
        {clients.length > 0 ? (
          clients.map((client) => (
            <li key={client._id}>
              <strong>Name:</strong> {client.name} | <strong>Company:</strong>{" "}
              {client.company}
            </li>
          ))
        ) : (
          <li>No clients found.</li>
        )}
      </ul>
      <button onClick={() => setShowForm(true)}>Add New Client</button>
      <Modal show={showForm} onClose={() => setShowForm(false)}>
        <h2>Add Client</h2>
        <form onSubmit={handleAddClient}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newClient.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={newClient.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={newClient.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Company:</label>
            <input
              type="text"
              name="company"
              value={newClient.company}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Add Client</button>
        </form>
      </Modal>
    </div>
  );
};

export default Client;
