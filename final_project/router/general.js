const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }

  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  res.send(book)
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let filtered_books = [];

  for (const key in books) {
    const book = books[key];
    if (book.author === author) {
      filtered_books.push({ key: book })
    }
  }

  res.send(filtered_books)
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let filtered_books = [];

  for (const key in books) {
    const book = books[key];
    if (book.title === title) {
      filtered_books.push({ key: book })
    }
  }

  res.send(filtered_books)
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  const bookReview = books[ISBN];
  if (!bookReview) {
    return res.status(400).json({ message: `No books with ISBN number ${ISBN} found.` });
  }

  res.send(bookReview)
});


// TASK 10 - Get the book list available in the shop using async/await
public_users.get('/task10', async function (req, res) {
  try {
    await new Promise((resolve) => {
      resolve(res.send(JSON.stringify({ books }, null, 4)));
    });
    console.log("Promise for Task 10 resolved");
  } catch (error) {
    console.error("An error occurred:", error);
  }
});

//TASK 11 - getting the book details based on ISBN
public_users.get('/task11/:isbn', async function (req, res) {
  try {
    await new Promise((resolve, reject) => {
      const isbn = req.params.isbn;
      const book = books[isbn];
      if (isbn) {
        console.log("Promise for Task 11 resolved");
        resolve(res.send(book));
      } else {
        console.log("Promise for Task 11 rejected");
        reject("Error no isbn found")
      }

    })
  } catch (error) {
    console.error("An error occurred:", error);
  }

});

//TASK 12 - getting the book details based on Author
public_users.get('/task12/:author', async function (req, res) {

  try {
    await new Promise((resolve, reject) => {
      const author = req.params.author;
      let filtered_books = [];

      for (const key in books) {
        const book = books[key];
        if (book.author === author) {
          filtered_books.push({ key: book })
        }
      }
      resolve(res.send(filtered_books))
    })

  } catch (error) {
    console.error("An error occurred:", error);
  }

});

// TASK 13 -  getting the book details based on Title using axios
public_users.get('/task13/:title', async function (req, res) {
  try {
    await new Promise((resolve, reject) => {
      const title = req.params.title;
      let filtered_books = [];

      for (const key in books) {
        const book = books[key];
        if (book.title === title) {
          filtered_books.push({ key: book })
        }
      }
      resolve(res.send(filtered_books))
    })
  } catch (error) {
    console.error("An error occurred:", error);
  }

});

module.exports.general = public_users;
