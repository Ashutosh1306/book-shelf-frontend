// BookSearchStyles.js
import styled from "styled-components";
import { Link } from "react-router-dom";
export const Container = styled.div`
  /* Your container styles go here */
  max-width: 800px;
  padding: 20px;
  width: 100%;
`;
export const Input = styled.input`
  /* Your input styles go here */
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

export const Button = styled.button`
  /* Your button styles go here */
  padding: 10px 20px;
  background-color: #007acc;
  color: white;
  border: none;
  cursor: pointer;
`;

export const SuccessPopup = styled.div`
  /* Your success popup styles go here */
  background-color: #4caf50;
  color: white;
  text-align: center;
  padding: 10px;
  margin-top: 10px;
`;

export const BookGrid = styled.div`
  /* Your book grid styles go here */
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr); /* Initially, display 3 cards per row */

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr); /* On smaller screens, display 2 cards per row */
  }

  @media (max-width: 800px) {
    grid-template-columns: repeat(1, 1fr); /* On even smaller screens, display 1 card per row */
  }
`;
export const BookCard = styled.div`
  /* Your book card styles go here */
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 5px;
  flex: 1 0 calc(33.33% - 20px); /* Equal width for 3 cards per row */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%; /* Set a fixed height for the cards */
  overflow: hidden; /* Hide overflow content */
`;

export const BookTitle = styled.h2`
  /* Your book title styles go here */
  margin: 0;
  font-size: 20px;

  @media (max-width: 768px) {
    font-size: 16px; /* Adjust font size for smaller screens */
  }
`;

export const BookAuthor = styled.p`
  /* Your book author styles go here */
  margin: 5px 0;
  font-weight: bold;
`;

export const BookCover = styled.img`
  /* Your book cover image styles go here */
  max-width: 260px; /* Set a maximum width for the image */
  max-height: 200px; /* Set a maximum height for the image */
  width: auto;
  height: auto;
`;

export const BookInfo = styled.div`
  /* Your book info styles go here */
  box-sizing: border-box;
  padding: 10px;
`;

export const AddButtonContainer = styled.div`
  /* Container for the "Add" button */
  margin-top: auto; /* Push the button to the bottom of the card */
  text-align: center; /* Center-align the button within the container */
`;

export const AddButton = styled.button`
  /* Your "Add" button styles go here */
  padding: 10px 20px;
  background-color: #007acc;
  color: white;
  border: none;
  cursor: pointer;
  width: 100%;
`;
export const SearchContainer = styled.div`
  display: flex;
  align-items: center; /* Vertically align items in the container */
  gap: 10px; /* Add some space between the input and button */
`;
/*export const Header = styled.h1`
  /* Your header styles go here 
  position: fixed;
  text-align: center;
  font-size: 24px;
  margin-top:0px;
  margin-bottom: 20px;
  background-color: #007acc;
  color: white;
  padding: 10px 0;
  width: 100%; Make the header span the full width 
`;*/

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background-color: #f5f5f5;
`;
// Header styles
export const Header = styled.header`
  background-color: #333;
  color: #fff;
  padding: 10px;
  text-align: center;
`;

// Navigation list styles
export const NavList = styled.ul`
  list-style: none;
  padding: 0;
  text-align: center;
`;

// Navigation item styles
export const NavItem = styled.li`
  display: inline-block;
  margin-right: 20px;
`;

// Style for navigation links
export const NavLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  font-weight: bold;
`;

// Hover effect for navigation links
export const NavLinkHover = styled(NavLink)`
  &:hover {
    text-decoration: underline;
  }
`;
// Custom styled Link component
export const CustomLink = styled(Link)`
  text-decoration: none;
  color: #FF5733; /* Change this to your desired text color */
  font-weight: bold;
  padding: 5px 10px; /* Add padding for button-like styling */
  border: 2px solid #FF5733; /* Add a border for button-like styling */
  border-radius: 4px; /* Add border radius for button-like styling */

  /* Hover effect for the link */
  &:hover {
    background-color: #FF5733; /* Change this to your desired hover background color */
    color: #fff; /* Change this to your desired hover text color */
  }
`;