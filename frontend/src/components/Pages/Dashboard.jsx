import React, { useContext, useState } from "react";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Project from "../minicomponents/project";
import Client from "../minicomponents/Client";
import CreateProject from "../minicomponents/CreateProject";
const Dashboard = () => {
  const [component, setComponent] = useState("Project");
  const { isAuthenticated, user } = useContext(Context);

  if (!isAuthenticated || user.role === "Client") {
    return <Navigate to={"/"} />;
  }
  return (
    <section>
      <Sidebar setComponent={setComponent} component={component} />
      {component === "Project" ? (
        <Project />
      ) : component === "Client" ? (
        <Client />
      ) : component === "Create Project" ? (
        <CreateProject />
      ) : (
        component === <Project />
      )}
    </section>
  );
};

export default Dashboard;
