import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
const Footer = () => {
  const isDashboard = useLocation("http://localhost:5173/dashboard");

  return (
    <footer
      className={
        isDashboard.pathname === "/dashboard" ? "hideFooter" : "showFooter"
      }
    >
      <div>&copy; All Rights Reserved By Tanvi.</div>
      <div>
        <Link to={"/"} target="_blank">
          <FaFacebookF />
        </Link>
        <Link to={"/"} target="_blank">
          <FaYoutube />
        </Link>
        <Link to={"/"} target="_blank">
          <FaLinkedin />
        </Link>
        <Link to={"/"} target="_blank">
          <RiInstagramFill />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
