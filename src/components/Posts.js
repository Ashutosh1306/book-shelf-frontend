import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import styles from './posts.module.css'; 
import Rating from "react-rating-stars-component";
import CommentsComponent from './CommentsComponent'; // Import the CommentsComponent

function BooksComponent({ userId }) {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null); // To store the selected book
  const [isCommentsOpen, setIsCommentsOpen] = useState(false); // To track if comments popup is open
  const MyJwtToken = localStorage.getItem("token");
  const decodedToken = jwt_decode(MyJwtToken);
  const loggedInUserId = decodedToken.id;
  const [rating, setRating] = useState(0);
  useEffect(() => {
    axios.get(`https://rohan-mybookshelf.onrender.com/api/booksposts/${loggedInUserId}`)
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  });
  // Function to open the comments popup
  const handleCommentsOpen = (book) => {
    setSelectedBook(book);
    setIsCommentsOpen(true);
  };

  // Function to close the comments popup
  const handleCommentsClose = () => {
    setSelectedBook(null);
    setIsCommentsOpen(false);
  };

  return (
    <div className={styles['books-container']}>
      <h1>Books</h1>
      <div className={styles['books-list']}>
        {books.map(book => (
          <div key={book._id} className={styles['book-card']}>
            <img src={book.images} alt={book.title} className={styles['book-image']} />
            <div className={styles['book-details']}>
              <h3>Owned By: {book.userName}</h3>
              <div className={styles['rating-container']}>
                <h4>Rating:</h4>
                <Rating
                  key={book._id} // Use book._id as the key to differentiate between books
                  value={book.ratingProgress} // Use book.ratingProgress to display the rating
                  size={25}
                />
              </div>
              <h2>{book.title}</h2>
              <p>Author(s): {book.authors.join(', ')}</p>
              <button onClick={() => handleCommentsOpen(book)}>Comments</button> {/* Button to open comments */}
            </div>
          </div>
        ))}
      </div>
      {/* Modal to display comments */}
      {isCommentsOpen && selectedBook && (
        <div className={styles['modal']}>
          <div className={styles['modal-content']}>
            <span className={styles['close']} onClick={handleCommentsClose}>&times;</span>
            <CommentsComponent bookId={selectedBook._id} userId={loggedInUserId} />
          </div>
        </div>
      )}
    </div>
  );
}

export default BooksComponent;
