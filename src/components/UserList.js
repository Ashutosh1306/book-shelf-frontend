import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserList.css"; // Add your CSS file for styling
import jwt_decode from "jwt-decode";
function UserList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userFriendStatus, setUserFriendStatus] = useState([]);
  const MyJwtToken = localStorage.getItem("token");
  // Decode the JWT token to get the user's ID
  const decodedToken = jwt_decode(MyJwtToken);
  const loggedInUserId = decodedToken.id;

  useEffect(() => {
    // Fetch user data from your server
    axios
      .get(`https://rohan-mybookshelf.onrender.com/api/users/${loggedInUserId}`)
      .then((response) => {
        const updatedUsers = response.data.map((user) => ({
          ...user,
        }));
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        axios
        .get(`https://rohan-mybookshelf.onrender.com/api/userFriendStatus/${loggedInUserId}`)
        .then((friendStatusResponse) => {
          setUserFriendStatus(friendStatusResponse.data);
        })
        .catch((friendStatusError) => {
          console.error("Error fetching user friend status:", friendStatusError);
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [loggedInUserId,users]);

  useEffect(() => {
    // Filter users based on the search query
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddFriend = (userId) => {
    axios
      .post(`https://rohan-mybookshelf.onrender.com/api/addFriend`, { userId,loggedInUserId },
      )
      .then((response) => {
        alert("Friend is Added succussfully");
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isFriend: true } : user
          )
        );
      })
      .catch((error) => {
        alert(error);
        console.error("Error adding friend:", error);
      });
  };

  const handleRemoveFriend = (userId) => {
  
    axios
      .post(`https://rohan-mybookshelf.onrender.com/api/removeFriend`, { userId,loggedInUserId })
      .then((response) => {
        alert("Friend is Removed succussfully");
        // Update the user's friend status in the UI
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isFriend: false } : user
          )
        );
      })
      .catch((error) => {
        alert(error);
        console.error("Error removing friend:", error);
      });
  };

  return (
    <div>
      <h1 className="text-center">User List</h1>
      <input
        type="text"
        placeholder="Search for users..."
        value={searchQuery}
        onChange={handleSearchInputChange}
        className="form-control mb-3"
      />
      <div className="user-container">
        {filteredUsers.map((user) => (
          <div className="user-card" key={user._id}>
            <img
              src={`https://rohan-mybookshelf.onrender.com/${user.profilePic}`}
              alt="User Profile"
              className="user-profile-pic"
            />
            <p className="user-username">{user.username}</p>
            {userFriendStatus.includes(user._id) ? (
                <button
                    onClick={() => handleRemoveFriend(user._id)}
                    className="btn btn-danger"
                >
                     Remove Friend
               </button>
                ) : (
               <button
                onClick={() => handleAddFriend(user._id)}
                className="btn btn-primary"
                >
             Add Friend
            </button>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
