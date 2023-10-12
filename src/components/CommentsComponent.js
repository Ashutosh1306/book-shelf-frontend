import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import styles from './posts.module.css'; 

function CommentsComponent({ bookId, userId }) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const MyJwtToken = localStorage.getItem('token');
  const decodedToken = jwt_decode(MyJwtToken);
  const loggedInUserId = decodedToken.id;

  // Function to fetch user information for a given user ID
  const fetchUserInfo = async (userId) => {
    try {
      const response = await axios.get(`https://rohan-mybookshelf.onrender.com/api/users/${userId._id}`);
      return response.data; // Assuming your API returns user data
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  // Function to fetch and display comments
  const fetchAndDisplayComments = async () => {
    try {
      const response = await axios.get(`https://rohan-mybookshelf.onrender.com/api/books/${bookId}/comments`);
      const commentsWithUsernames = await Promise.all(
        response.data.map(async (comment) => {
          const userInfo = await fetchUserInfo(comment.user);
          return { ...comment, username: userInfo ? userInfo.username : 'Unknown User' };
        })
      );
      setComments(commentsWithUsernames);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchAndDisplayComments();
  }, [bookId]);

  const handleCommentSubmit = () => {
    axios
      .post(`https://rohan-mybookshelf.onrender.com/api/books/${bookId}/comments`, {
        text: commentText,
        userId,
      })
      .then(() => {
        // After adding a comment, fetch and display updated comments
        fetchAndDisplayComments();
        setCommentText(''); // Clear the input field
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
  };

  return (
    <div className={styles['comments-container']}>
      <h2>Comments</h2>
      <div className={styles['comment-list']}>
        {comments.map((comment) => (
          <div key={comment._id} className={styles['comment']}>
            <strong>{comment.user.username}:</strong> {comment.text}
          </div>
        ))}
      </div>
      <div className={styles['comment-input']}>
        <textarea
          rows="3"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
        ></textarea>
        <button onClick={handleCommentSubmit} className={styles['add-comment-button']}>Submit</button>
      </div>
    </div>
  );
}

export default CommentsComponent;
