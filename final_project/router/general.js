const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
 // Push a new user object into the users array based on query parameters from the request
    users.push({
        "firstName": req.query.firstName,
        "lastName": req.query.lastName,
        "email": req.query.email,
        "DOB": req.query.DOB,
        "pwd":req.query.pwd
    });
    // Send a success message as the response, indicating the user has been added
    res.send("The user " + req.query.firstName + " has been added!");
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
