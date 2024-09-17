const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    console.log("Username: " + req.query.username)
 // Check if the users array is empty or if the username already exists
 if (users.length === 0 || !users.some(user => user.username === req.query.username)) {
    // Push a new user object into the users array
    users.push({
        "username": req.query.username,
        "password": req.query.password // Ensure you're passing 'password' in the query
    });
    // Send a success message as the response
    return res.send("The user " + req.query.username + " has been added!");
} else {
    // Send a message if the username already exists
    return res.send("The username: " + req.query.username + " already exists");
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
    console.log(authorToMatch)
    for (let book of Object.values(books)) {
        console.log(book)
        if (book.author === authorToMatch) {
            return res.status(200).json(book);
        }
    }

    return res.status(404).json({message: "Book by this author not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let titleToMatch = req.params.title;
    for (let book of Object.values(books)) {
        if (book.title === titleToMatch) {
            return res.status(200).json(book);
        }
    }
    return res.status(404).json({message: "Book by this author not found"});
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
