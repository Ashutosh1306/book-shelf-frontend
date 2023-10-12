// App.js
import React, { useState,useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import BookSearch from "./components/BookSearch";
import BookshelfDashboard from "./components/mybookshelf";
import Signup from "./components/signup";
import Login from "./components/Login";
import UserList from "./components/UserList";
import PostPage from "./components/Posts"

import "./components/common.css";
import { Header, NavList, NavItem, CustomLink } from "./components/BookSearchStyles";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  useEffect(() => {
    // Listen for changes to localStorage in other tabs
    window.addEventListener("storage", handleStorageChange);
    return () => {
      // Remove the event listener when the component unmounts
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleStorageChange = (event) => {
    if (event.key === "token") {
      // Update the loggedIn state when localStorage changes
      setLoggedIn(!!localStorage.getItem("token"));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    window.dispatchEvent(new Event("storage"));
  };


  return (
    <Router>
      <Header>
        <nav>
          <NavList>
            <NavItem>
              <CustomLink to="/">Home</CustomLink>
            </NavItem>
            {loggedIn ? (
              <>
                <NavItem>
                  <CustomLink onClick={handleLogout}>Logout</CustomLink>
                </NavItem>
                <NavItem>
                  <CustomLink to="/mybookshelf">My Bookshelf</CustomLink>
                </NavItem>
                <NavItem>
                  <CustomLink to="/users">Add Friend</CustomLink>
                </NavItem>
                <NavItem>
                  <CustomLink to="/posts">Posts</CustomLink>
                </NavItem>
              </>
            ) : (
              <>
                <NavItem>
                  <CustomLink to="/signup">Signup</CustomLink>
                </NavItem>
                <NavItem>
                  <CustomLink to="/login">Login</CustomLink>
                </NavItem>
              </>
            )}
          </NavList>
        </nav>
      </Header>
      <div>
        <Routes>
          <Route path="/" element={<BookSearch loggedIn={loggedIn} />} />
          <Route
            path="/mybookshelf"
            element={loggedIn ? <BookshelfDashboard /> : <Navigate to="/login" />}
          />
           <Route
            path="/users"
            element={loggedIn ? <UserList /> : <Navigate to="/login" />}
          />
          <Route
            path="/posts"
            element={loggedIn ? <PostPage /> : <Navigate to="/login" />}
          />
          <Route path="/signup" element={<Signup setLoggedIn={setLoggedIn} />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
