import React, { useState } from "react";
import axios from "../services/api";
import { useNavigate } from "react-router-dom"; // Use useNavigate

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Using useNavigate here

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // API request for login
      const response = await axios.post("auth/token/login", {
        username,
        password,
      });

      // Save the token to localStorage or sessionStorage for subsequent requests
      localStorage.setItem("auth_token", response.data.auth_token);
      console.log("Login Successful! Token:", response.data.auth_token);

      // Redirect to the home or dashboard page
      window.location = "/home";
      navigate("/home");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-semibold">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full p-3 mt-1 border rounded-lg"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-semibold">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-3 mt-1 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
