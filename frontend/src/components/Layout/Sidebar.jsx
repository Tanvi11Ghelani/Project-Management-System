import React, { useContext, useState } from "react";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaArrowLeft } from "react-icons/fa";

const Sidebar = ({ component, setComponent }) => {
  const [show, setShow] = useState(false);

  const { setIsAuthenticated, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      setIsAuthenticated(false);
      toast.success(data.message);
      navigateTo("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const gotoHome = () => {
    navigateTo("/");
  };

  const handleComponent = (value) => {
    setComponent(value);
  };

  return (
    <>
      <div className="icon-wrapper" onClick={() => setShow(!show)}>
        <RxHamburgerMenu />
      </div>
      <section className={show ? "show-sidebar sidebar" : "sidebar"}>
        <div className="icon-wrapper-arrow" onClick={() => setShow(!show)}>
          <FaArrowLeft />
        </div>
        <div className="user-detail">
          <p>{user.name}</p>
        </div>
        <ul>
          <button onClick={() => handleComponent("Project")}>PROJECT</button>
          <button onClick={() => handleComponent("Create Project")}>
            CREATE PROJECT
          </button>
          <button onClick={() => handleComponent("Client")}>CLIENT</button>
          <button onClick={gotoHome}>HOME</button>
          <button onClick={handleLogout}>LOGOUT</button>
        </ul>
      </section>
    </>
  );
};

export default Sidebar;
