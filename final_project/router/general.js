const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username) {
    return res.status(403).json({message: "Username is required!"});
  }

  if(!password) {
    return res.status(403).json({message: "Password is required!"});
  }

  if(isValid(username)) {
    users.push({
      username,
      password
    });
    return res.status(200).json({message: "User registered! Proceed to login."});
  }
  return res.status(403).json({message: "User already registered!"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  const isbn = req.params.isbn;

  if(isbn) {
      return res.status(200).json(books[isbn]);
  }
  
  return res.status(404).json({message: "Book not found!"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  if(author) {
    let keys = Object.keys(books);
    for(let key of keys) {
      
      if(books[key].author == author) {
        return res.status(200).json(books[key]);
      }
    }
  }
  return res.status(404).json({message: "Book not found!"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  const title = req.params.title;
  if(title) {
    let keys = Object.keys(books);
    for(let key of keys) {
      
      if(books[key].title == title) {
        return res.status(200).json(books[key]);
      }
    }
  }
  
  return res.status(404).json({message: "Book not found!"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  const isbn = req.params.isbn;
  if(isbn) {
    let book = books[isbn];

    return res.status(200).json(book.reviews);
  }
  
  return res.status(404).json({message: "Book not found!"});
});

module.exports.general = public_users;
