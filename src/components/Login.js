import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Login({ setLoggedIn }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`https://rohan-mybookshelf.onrender.com/api/login`, formData);
     
     
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        alert("Login successful!");
        setLoggedIn(true); // Set loggedIn to true
        navigate('/mybookshelf');
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Error logging in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <label htmlFor="email">Email: *</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="password">Password: *</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit" disabled={isLoading} className="signup-button">
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}

export default Login;
