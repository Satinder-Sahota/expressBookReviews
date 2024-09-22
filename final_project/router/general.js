const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    console.log("Username: " + req.body.username)
 // Check if the users array is empty or if the username already exists
 if (users.length === 0 || !users.some(user => user.username === req.body.username)) {
    // Push a new user object into the users array
    users.push({
        "username": req.body.username,
        "password": req.body.password // Ensure you're passing 'password' in the query
    });
    // Send a success message as the response
    return res.send("The user " + req.body.username + " has been registered successfully. Now you can login.");
} else {
    // Send a message if the username already exists
    return res.send("The username: " + req.body.username + " already exists");
}
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(books)
  return res.status(200).json({message: "Task 1: Retrieve all books"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
   
   const isbn = req.params.isbn;
   // Filter the users array to find users whose email matches the extracted email parameter
   let filtered_books = books[isbn];
   // Send the filtered_users array as the response to the client
   res.send(filtered_books);
  return res.status(300).json({message: "Task 2: Retrieve book details by ISBN"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let authorToMatch = req.params.author;
    // Collect all books by the author
    let booksByAuthor = Object.values(books).filter(book => book.author === authorToMatch);
    
    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);  // Return all matching books
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let titleToMatch = req.params.title;
    // Collect all books that match the title
    let booksByTitle = Object.values(books).filter(book => book.title === titleToMatch);
    if (booksByTitle.length > 0) {
        console.log(`Found ${booksByTitle.length} book(s) with the title: ${titleToMatch}`);
        return res.status(200).json(booksByTitle);  // Return all matching books
    } else {
        console.log(`No books found with the title: ${titleToMatch}`);
        return res.status(404).json({ message: "No books found with this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let filtered_books = (books[isbn]).reviews;
    console.log(filtered_books);
    if (filtered_books) {
       return res.status(200).json(filtered_books);
    }
    return res.status(404).json({message: "Book by this author not found"});
});

module.exports.general = public_users;
