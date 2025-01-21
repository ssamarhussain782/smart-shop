import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../services/api"; // Assuming you have a pre-configured axios instance

const Header = () => {
  const [username, setUsername] = useState(null); // State to store the username
  const token = localStorage.getItem("auth_token");

  // Fetch user details when the token is available
  useEffect(() => {
    if (token) {
      axios
        .get("/auth/users/", {
          headers: {
            Authorization: `Token ${token}`, // Pass the token in the Authorization header
          },
        })
        .then((response) => {
          const user = response.data[0]; // Assuming the user data is in the first index of the response
          setUsername(user.username); // Set the username
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, [token]); // Re-run the effect when the token changes

  const handleLogout = () => {
    localStorage.removeItem("auth_token"); // Remove the token on logout
    window.location.href = "/"; // Redirect to login
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/">Smart Shop</Link>
        </h1>
        <div className="flex items-center space-x-4">
          {token && (
            <>
              <Link to="/home" className="text-white">
                Home
              </Link>
              <Link to="/products" className="text-white">
                Products
              </Link>
              <Link to="/sales" className="text-white">
                Sales
              </Link>
            </>
          )}
          {token ? (
            <>
              <span>Welcome, {username || "User"}!</span>{" "}
              {/* Display the username if available */}
              <button
                onClick={handleLogout}
                className="ml-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="text-white">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
