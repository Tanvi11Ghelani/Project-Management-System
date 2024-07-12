import React from "react";
import { Link } from "react-router-dom";
import photo from "./404-error.jpg";

const NotFound = () => {
  return (
    <section className="page notfound">
      <div className="content">
        <img src={photo} style={{ height: 750 }} alt="not found" />
        <Link to={"/"}>RETURN TO HOME</Link>
      </div>
    </section>
  );
};

export default NotFound;
