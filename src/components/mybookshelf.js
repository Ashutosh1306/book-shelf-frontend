import React, { useEffect, useState } from "react";
import axios from "axios";
import "./common.css";
import Rating from "react-rating-stars-component";
import jwt_decode from "jwt-decode";
function BookshelfDashboard() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [rating, setRating] = useState(0);
  const [currentlyReadingBook, setCurrentlyReadingBook] = useState(null);
  const [currentlyReadingStatus, setCurrentlyReadingStatus] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState(''); // State variable for search query
  const MyJwtToken = localStorage.getItem("token");
  // Decode the JWT token to get the user's ID
  const decodedToken = jwt_decode(MyJwtToken);
  const loggedInUserId = decodedToken.id;
  
  useEffect(() => {
    const newCurrentlyReadingBook = books.find((book) => book.currentlyReading === true);
    setCurrentlyReadingBook(newCurrentlyReadingBook);  
    console.log(currentlyReadingStatus);
  }, [books]);

  useEffect(() => {
    if (currentlyReadingBook) {
      const bookId = currentlyReadingBook._id;
      axios.get(`https://rohan-mybookshelf.onrender.com/api/mybookshelf/${bookId}/ratingProgress`)
        .then(response => {
          // Handle the response here, e.g., set the reading progress in state
          const ratingProgress = response.data.ratingProgress;
          const readingProgressV=response.data.readingProgressV;
          setRating(ratingProgress);
          setProgress(readingProgressV);
        })
        .catch(error => console.error(error));
    } else {
      console.log("No book is currently marked as 'Currently Reading'");
    }
  }, [currentlyReadingBook]);

  const handleRatingChange = (bookId, newRating) => {
    // Update the rating in the database first
    axios
      .put(`https://rohan-mybookshelf.onrender.com/api/mybookshelf/${bookId}/ratingProgress`, {
        ratingProgress: newRating,
      })
      .then((response) => {
        alert("Rating Succussfully Submitted");
        axios
          .get(`https://rohan-mybookshelf.onrender.com/api/mybookshelf/${bookId}/ratingProgress`)
          .then((response) => {
            const ratingProgress = response.data.ratingProgress;
            setRating(ratingProgress);
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  };  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://rohan-mybookshelf.onrender.com/api/mybookshelf/${loggedInUserId}`);
        const updatedBooks = response.data.map((book) => ({
          ...book,
          currentlyReading: book.currentbook, // Ensure that the server response includes currentlyReading
        }));
        setBooks(updatedBooks);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredBooks = books.filter((book) => {
    const titleMatches = book.title.toLowerCase().includes(searchQuery.toLowerCase());
    const authorMatches = book.authors.some((author) =>
      author.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return titleMatches || authorMatches;
  });
  const handleBookDelete = (bookId, loggedInUserId) => {
    console.log("Deleting book with ID:", bookId);
  console.log("Logged-in user ID:", loggedInUserId);
    axios
      .delete(`https://rohan-mybookshelf.onrender.com/api/mybookshelf/${bookId}/${loggedInUserId}/delete`)
      .then((response) => {
        // Handle the success response, e.g., remove the book from the state
        setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
        alert("Book deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting book:", error);
        // Handle the error if needed
      });
  };
  
  const handleProgressSubmit = (bookId, progressValue) => {
    const currentlyReading = progressValue == 100 ? false : true;
    const progressValueUpdate= progressValue == 100 ? 0 : progressValue;
    axios
      .put(`https://rohan-mybookshelf.onrender.com/api/books/${bookId}/progress`, {
        readingProgress: progressValueUpdate,
        currentbook: currentlyReading, // Set currentlyReading based on progress
      })
      .then((response) => {
        console.log("progress status is "+progressValue)
        console.log("if block:"+(progressValue == 100));
        if (progressValue == 100) {
          console.log("currentlyReading set to false");
          setBooks((prevBooks) =>
            prevBooks.map((book) =>
           book._id === bookId ? { ...book, currentlyReading: false } : book
          )
         );   
          alert("Progress updated successfully, and currentlyReading set to false.");
        } else {
          
          alert("Progress updated successfully.");
        }
      })
      .catch((error) => console.error(error));
  }; 
  
  const openModal = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  }; 


  const toggleCurrentlyReading = async (bookId, newStatus) => {
    try {
      if (newStatus === true && books.some((book) => book.currentlyReading === true)) {
        alert("Sorry, you cannot mark another book as 'Currently Reading' when there are books already marked as 'Currently Reading'.");
      } else {
        const response = await axios.put(
          `https://rohan-mybookshelf.onrender.com/api/mybookshelf/${bookId}/currentbook`,
          { currentbook: newStatus }
        );

        if (response.status === 200) {
          setBooks((prevBooks) => {
            return prevBooks.map((book) => {
              if (book._id === bookId) {
                return {
                  ...book,
                  currentlyReading: newStatus,
                };
              }
              return book;
            });
          });
        } else {
          console.error("Failed to update book status");
        }
      }
    } catch (error) {
      console.error("Error updating book status:", error);
    }
  };
  return (
    <div>

  <h1 className="text-center">My Bookshelf</h1>
    <input
    type="text"
    placeholder="Search for books..."
    value={searchQuery}
    onChange={handleSearchInputChange}
    className="form-control mb-3"
  />
  <div className="bookshelf-wrap">
   <div className="mybookshelf-container">
    {isLoading ? (
      <p>Loading...</p>
    ) : (
      filteredBooks.map((book) => (
        <div className="mybookshelf-card" key={book._id} onClick={() => openModal(book)}>
          <img src={book.images} className="card-image" alt="Book Cover" />
          <div className="mybookshelf-card-body">
            <h5 className="mybookshelf-card-title">{book.title}</h5>
            <p className="card-text">Author: {book.authors.join(", ")}</p>
            <p className="mybookshelf-card-button">Currently Reading: {book.currentlyReading ? "Yes" : "No"}</p>
            <button
              className={`btn ${book.currentlyReading ? "btn-danger" : "btn-success"}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleCurrentlyReading(book._id, !book.currentlyReading);
              }}
            >
              {book.currentlyReading
                ? "Remove Currently Reading"
                : "Currently Reading"}
            </button>
            <button
              className="btn btn-danger"
              onClick={(e) => {
                e.stopPropagation();
                handleBookDelete(book._id, loggedInUserId);
              }}
            >
              Delete From My Bookshelf
            </button>
          </div>
        </div>
      
      ))
    )}
  </div>
  </div>
{/* This is Currently Reading Code starts */}
<h1 className="text-center">Currently Reading Book</h1>
<div className="books-list">
  {isLoading ? (
    <p>Loading...</p>
  ) : currentlyReadingBook ? ( // Check if currentlyReadingBook is not null
    <div className="book-card-container">
      <div className="book-card-current" key={currentlyReadingBook._id}>
        <div className="book-details-current" onClick={() => openModal(currentlyReadingBook)}>
          <img src={currentlyReadingBook.images} className="card-image" alt="Book Cover" />
          <h5 className="card-title">{currentlyReadingBook.title}</h5>
          <p className="card-text">Author: {currentlyReadingBook.authors.join(", ")}</p>
          <p className="card-text">Currently Reading: {currentlyReadingBook.currentlyReading ? "Yes" : "No"}</p>
          <button
            className={`btn ${currentlyReadingBook.currentlyReading ? "btn-danger" : "btn-success"}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleCurrentlyReading(currentlyReadingBook._id, !currentlyReadingBook.currentlyReading);
            }}
          >
            {currentlyReadingBook.currentlyReading
              ? "Remove Currently Reading"
              : "Currently Reading"}
          </button>
        </div>
      </div>

      {/* Additional elements displayed to the side */}
      <div className="currentstatus">
        <div className="rating-update">
          <h4>Rating:</h4>
          <Rating
            key={rating}
            value={rating} // Pass the rating value
            onChange={(newRating) => handleRatingChange(currentlyReadingBook._id, newRating)} // Handle rating change
            size={25}
          />
        </div>
        <div className="progress-bar-update">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            key={currentlyReadingBook._id}
          />
          <div className="progress-label" key={currentlyReadingBook._id}>
            {progress}%
          </div>
        </div>
        <div className="button-update">
          <button onClick={() => handleProgressSubmit(currentlyReadingBook._id, progress)}>Submit</button>
        </div>
      </div>
    </div>
  ) : null /* If currentlyReadingBook is null, don't render anything */}
</div>

{/* This is Currently Reading Code ends */}


      {selectedBook && (
        <div className="modal" id="bookModal">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4">
                    <img src={selectedBook.images} alt="Book Cover" className="img-fluid" />
                  </div>
                  <div className="col-md-8">
                    <h2>{selectedBook.title}</h2>
                    <p>Author: {selectedBook.authors.join(", ")}</p>
                    <p>Description: {selectedBook.description}</p>
                    {/* Add other book details as needed */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default BookshelfDashboard;