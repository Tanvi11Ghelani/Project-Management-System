import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../main";
import { BeatLoader } from "react-spinners";
import toast from "react-hot-toast";
import axios from "axios";

const Project = () => {
  const { projects, setProjects } = useContext(Context);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/v1/project/deleteProject/${id}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const updatedProjects = projects.filter(
          (project) => project._id !== id
        );
        setProjects(updatedProjects);
        toast.success("Deleted Project Successfully");
      } else {
        console.error("Failed to delete the project");
        toast.error("Cannot delete the project");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while deleting the project");
    }
  };

  return (
    <article>
      <h1 style={{ textAlign: "center", fontSize: 40 }}>Projects</h1>
      <section className="hero" style={{ paddingLeft: 400 }}>
        {projects && projects.length > 0 ? (
          projects.map((element) => (
            <div className="card" key={element._id}>
              <p>Project Name: {element.projectname}</p>
              <div className="button-container">
                <Link to={`/projects/${element._id}`} className="view-button">
                  View
                </Link>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(element._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <BeatLoader size={30} color="gray" />
        )}
      </section>
    </article>
  );
};

export default Project;
