import React, { useContext, useState } from "react";
import { Context } from "../../main";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { isAuthenticated } = useContext(Context);

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await axios
      .post(
        "http://localhost:5000/api/v1/user/login",
        { email, password, role },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        toast.success("Login SuccessFull", res.data.message);
        setEmail("");
        setPassword("");
        setRole("");
        navigateTo("/");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }
  return (
    <article>
      <section className="auth-form">
        <form onSubmit={handleLogin}>
          <h1>LOGIN</h1>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">SELECT ROLE</option>
            <option value="Admin">Admin</option>
            <option value="Client">Client</option>
          </select>

          <div>
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <p>
            Don't Have Any Account? <Link to={"/register"}>Register Now</Link>
          </p>
          <button className="submit-btn" type="submit">
            LOGIN
          </button>
        </form>
      </section>
    </article>
  );
};

export default Login;
