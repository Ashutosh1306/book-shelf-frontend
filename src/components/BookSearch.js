import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Input,
  Button,
  SuccessPopup,
  BookCard,
  BookTitle,
  BookGrid,
  BookAuthor,
  BookCover,
  BookInfo,
  AddButton,
  AddButtonContainer,
  SearchContainer,
  Header,
  PageWrapper,
} from "./BookSearchStyles";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

function BookSearch({ loggedIn }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookToAdd, setBookToAdd] = useState(null); // State to manage the selected book for the modal
  const navigate = useNavigate();

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSearch = async () => {
    if (!searchTerm) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`
      );
      setSearchResults(response.data.items);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log("Received 429 error. Retrying in 5 seconds...");
        await delay(5000); // Wait for 5 seconds before retrying
        setIsLoading(true);
        handleSearch(); // Retry the search
      } else {
        console.error("Error searching for books:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBook = async (book) => {
    if (!loggedIn) { // Check if the user is logged in
      navigate("/login"); // Redirect to the login page if not logged in
      return;
    }
    const MyJwtToken = localStorage.getItem("token");
    // Decode the JWT token to get the user's ID
    const decodedToken = jwt_decode(MyJwtToken);
    const loggedInUserId = decodedToken.id;
    setIsLoading(true);
    try {
      const response = await axios.post("https://rohan-mybookshelf.onrender.com/api/books", { book,loggedInUserId });
  
      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else if (response.status === 400) {
        navigate("/signup");
        alert("Book already exists");
      } else {
        alert(response.status);
      }
    } catch (error) {
      console.error("Error adding book:", error);
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  return (
    <PageWrapper>
      <Container>
        <h1>Google Books Search</h1>
        <SearchContainer>
          <Input
            type="text"
            placeholder="Search for a book"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <Button onClick={handleSearch}>Search</Button>
        </SearchContainer>
        {isLoading ? <p>Loading...</p> : null}
        {success && <SuccessPopup>Book added successfully!</SuccessPopup>}
        <ul>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <BookGrid>
              {searchResults.map((book) => (
                <li key={book.id} style={{ listStyle: "none" }}>
                  <BookCard>
                    {book.volumeInfo.imageLinks && (
                      <BookCover
                        src={book.volumeInfo.imageLinks.thumbnail}
                        alt="Book Cover"
                      />
                    )}
                    <BookInfo>
                      <BookTitle>{book.volumeInfo.title}</BookTitle>
                      <BookAuthor>
                        Author: {book.volumeInfo.authors}
                      </BookAuthor>
                    </BookInfo>
                    <AddButtonContainer>
                      <AddButton onClick={() => handleAddBook(book)}>
                        Add Book
                      </AddButton>
                    </AddButtonContainer>
                    {/* Open modal when book card is clicked */}
                    <div onClick={() => openModal(book)}>View Details</div>
                  </BookCard>
                </li>
              ))}
            </BookGrid>
          </div>
        </ul>
        {selectedBook && (
  // Modal for displaying book details
  <div className="modal" id="bookModal">
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <div className="modal-body">
          <div className="row">
            <div className="col-md-4">
              {selectedBook.volumeInfo.imageLinks ? (
                <BookCover
                  src={selectedBook.volumeInfo.imageLinks.thumbnail}
                  alt="Book Cover"
                />
              ) : (
                "" // You can replace this with your own placeholder image or text
              )}
            </div>
            <div className="col-md-8">
              <h2>{selectedBook.volumeInfo.title}</h2>
              <p>Author: {selectedBook.volumeInfo.authors}</p>
              <p>Description: {selectedBook.volumeInfo.description}</p>
              {/* Add other book details as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      </Container>
    </PageWrapper>
  );
}

export default BookSearch;
