import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../main";
import { BeatLoader } from "react-spinners";
import "../../App.css";

const Home = () => {
  const { projects } = useContext(Context);
  return (
    <section className="hero">
      {projects && projects.length > 0 ? (
        projects.slice(0, projects.length).map((element) => (
          <Link className="card" key={element._id}>
            <p>Project Name: {element.projectname}</p>
          </Link>
        ))
      ) : (
        <BeatLoader size={30} color="gray" />
      )}
    </section>
  );
};

export default Home;
