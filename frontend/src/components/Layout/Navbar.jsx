import React, { useContext, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { RxHamburgerMenu } from "react-icons/rx";

const Navbar = () => {
  const [show, setShow] = useState(false);

  const { isAuthenticated, setIsisAuthenticated, user, setUser } =
    useContext(Context);

  const navigateTo = useNavigate();

  const isDashboard = useLocation();

  const handleNavbar = () => {
    setShow(!show);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/user/logout",
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setIsisAuthenticated(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response.data.message);
      setIsisAuthenticated(true);
    }
  };
  return (
    <section
      className={
        isDashboard.pathname === "/dashboard" ? "hideNavbar" : "showNavbar"
      }
    >
      <nav>
        <div className="logo">
          <Link
            style={{ color: "inherit", textDecoration: "none" }}
            to={"/"}
            className="logo-link"
          >
            <span>Project Management </span>System
          </Link>
        </div>
        <div className={show ? "links show" : "links"}>
          <ul>
            <li>
              <Link to={"/"} onClick={handleNavbar}>
                HOME
              </Link>
            </li>
          </ul>
          {isAuthenticated && user && user.role === "Admin" ? (
            <Link
              to={"/dashboard"}
              onClick={handleNavbar}
              className="dashboard-btn"
            >
              DASHBOARD
            </Link>
          ) : null}
          {!isAuthenticated ? (
            <Link to={"/login"} onClick={handleNavbar} className="login-btn">
              LOGIN
            </Link>
          ) : (
            <button onClick={handleLogout} className="logout-btn">
              LOGOUT
            </button>
          )}
        </div>
        <RxHamburgerMenu className="hamburger" onClick={handleNavbar} />
      </nav>
    </section>
  );
};

export default Navbar;
