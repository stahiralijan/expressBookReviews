const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {

  return ! (users.length > 0 && users.filter(user => user.username === username));
}

const authenticatedUser = (username,password) => {

  const user = users.filter(user => user.username === username && user.password === password);

  return (user.length >= 1);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  
  const username = req.body?.username;
  const password = req.body?.password;

  if(!username) {
    return res.status(403).json({message: "Username is required!"});
  }

  if(!password) {
    return res.status(403).json({message: "Password is required!"});
  }

  if(authenticatedUser(username, password)) {
    let token = jwt.sign({username}, 'fingerprint_customer', { expiresIn: "1h"});
    
    req.session.token = token;
    res.header.authorization = token;
    return res.status(200).json({message: "Login successful"});
  }

  return res.status(403).json({message: "Incorrect username or password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const review = req.body.review;

  if(!isbn) {
    return res.status(400).json({message: "ISBN is required"});
  }

  if(!review) {
    return res.status(400).json({message: "Reviews are required"});
  }

  let book = books[isbn];

  if(!book) {
    return res.status(400).json({message: "Book not found"});
  }

  book.reviews[req.user.username] = review;

  books[isbn] = book;

  return res.status(200).json({message: "Book review updated"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;

  if(!isbn) {
    return res.status(400).json({message: "ISBN is required"});
  }

  let book = books[isbn];

  if(!book) {
    return res.status(400).json({message: "Book not found"});
  }

  delete books[isbn].reviews[req.user.username];

  return res.status(200).json({message: "Book review deleted"});
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
