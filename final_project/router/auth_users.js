const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean

}

const authenticatedUser = (username,password)=>{ //returns boolean
    console.log("authenticated user detals "+username,password)
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    console.log("Login username:"+username)
    if (authenticatedUser(username, password)) {
        // Generate JWT token
        let accessToken = jwt.sign({ data: { username } }, 'access', { expiresIn: 60 * 60 });
        
        // Set the access token in session
        req.session.authorization = {
            accessToken: accessToken  // Set the token correctly
        };

        console.log("Session after login:", req.session); // Debugging log
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(401).send("Invalid Credentials");
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.query;

    // Get the token from the session
    const token = req.session.authorization?.accessToken;

    if (!token) {
        return res.status(401).json({ message: "User not logged in" });
    }

    // Verify and decode the JWT token to extract the username
    jwt.verify(token, "access", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }

        // Extract the username from the decoded token
        const username = decoded.data.username;  // Move the declaration inside the JWT verification callback

        if (!books[isbn]) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Now use the username variable inside the same block where it's declared
        let bookReviews = books[isbn].reviews;

        // Add or update the review for the given user
        if (bookReviews[username]) {
            bookReviews[username] = review; // Modify existing review
            return res.status(200).json({ message: `Review updated for ISBN ${isbn} by user ${username}` });
        } else {
            bookReviews[username] = review; // Add new review
            return res.status(200).json({ message: `Review added for ISBN ${isbn} by user ${username}` });
        }
    });
});

regd_users.delete("/auth/review/:isbn",(req,res)=>
{
    let isbn = req.params.isbn;
    let username = req.session.username;  // Assuming session contains the username of the logged-in user

    // Find the book by ISBN
    if (books[isbn]) {
        let book = books[isbn];
        console.log("Book review: ", book.reviews[username]);
        // Check if the user has a review for this book
        if (book.reviews && book.reviews[username]) {
            // Delete the user's review
            delete book.reviews[username];
            return res.status(200).json({ message: "Review deleted successfully" });
        } else {
            return res.status(404).json({ message: "No review found for this user" });
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
