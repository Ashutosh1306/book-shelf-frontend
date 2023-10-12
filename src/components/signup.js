import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './SignupStyle.css'; // Import your CSS file

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    profilePic: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("username", formData.username);
      formDataToSubmit.append("email", formData.email);
      formDataToSubmit.append("password", formData.password);
      formDataToSubmit.append("profilePic", formData.profilePic);
      // Send a POST request to your server for user signup
      const response = await axios.post(`https://rohan-mybookshelf.onrender.com/api/signup`, formDataToSubmit,{
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data for file upload
        },
      });

      if (response.status === 200) {
        alert("Signup successful!");
        navigate('/login'); // Redirect to the login page
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Error signing up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} className="signup-form">
      <label htmlFor="profilePic">Profile Picture:</label>
        <input
          type="file"
          name="profilePic"
          accept="image/*" // Allow only image files
          onChange={handleInputChange}
        />
       <label htmlFor="uname">Name: *</label>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="username">UserName: *</label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
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
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default Signup;
