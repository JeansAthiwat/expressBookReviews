const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { "username": "asdf", "password": "1234" },
];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  const validUser = users.filter((user) => user.username === username);
  if (validUser.length > 0) {
    return true
  } else {
    return false
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  const filtered_users = users.filter(user => (user.username === username && user.password === password));
  if (filtered_users.length > 0) {
    return true
  } else {
    return false
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(401).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {

    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 10 }); // 10 minutes.

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");

  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  const reviewMessage = req.body.review;
  const username = req.session.authorization["username"];
  const book = books[ISBN];

  if (!reviewMessage) {
    return res.status(401).json({ message: "Review message cannot be blank!" });
  }
  if (!book) {
    return res.status(401).json({ message: "Non-existance ISBN number" });
  }

  book["reviews"][username] = reviewMessage;
  res.send(`review from the user '${username}' updated`);
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  const username = req.session.authorization["username"];
  const book = books[ISBN];

  if (book) {
    delete book["reviews"][username]
  }
  res.send(`review from ${username} on the book ISBN ${ISBN} deleted.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
