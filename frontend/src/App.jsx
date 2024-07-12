import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./components/Home/Home";
import Dashboard from "./components/Pages/Dashboard";
import NotFound from "./components/Notfound/NotFound";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Project from "./components/minicomponents/project";
import ProjectDetail from "./components/minicomponents/ProjectDetail";
import TaskList from "./components/minicomponents/TaskList";
import CreateProject from "./components/minicomponents/CreateProject";
import Client from "./components/minicomponents/Client";
import "./App.css";
import axios from "axios";
import { Context } from "./main";
import { Toaster } from "react-hot-toast";

const App = () => {
  const {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    projects,
    setProjects,
  } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/user/getUser",
          {
            withCredentials: true,
          }
        );
        console.log("User data fetched:", data);
        setUser(data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error(
          "Error fetching user:",
          error.response ? error.response.data.message : error.message
        );
        setIsAuthenticated(false);
        setUser({});
      }
    };

    const fetchProjects = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/project/getAllProjects",
          {
            withCredentials: true,
          }
        );
        console.log("Projects data fetched:", data);
        setProjects(data.projects);
      } catch (error) {
        console.error(
          "Error fetching projects:",
          error.response ? error.response.data.message : error.message
        );
        setProjects([]);
      }
    };

    fetchUser();
    fetchProjects();
  }, [setIsAuthenticated, setUser, setProjects, user]);

  return (
    <Router>
      <MainContent />
      <Toaster />
    </Router>
  );
};

const MainContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <div>
      {!isDashboard && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Project />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/:id/tasks/:moduleId" element={<TaskList />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/clients" element={<Client />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isDashboard && <Footer />}
    </div>
  );
};

export default App;
