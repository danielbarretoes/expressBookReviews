const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  if (users.find(user => user.username === username)) {
    return res.status(400).json({message: "Username already exists"});
  }
  
  users.push({username: username, password: password});
  return res.status(200).json({message: "User registered successfully"});
});

// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(JSON.stringify(books, null, 2));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});
  
// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];
  
  for (let isbn in books) {
    if (books[isbn].author.toLowerCase().includes(author.toLowerCase())) {
      booksByAuthor.push({
        isbn: isbn,
        ...books[isbn]
      });
    }
  }
  
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({message: "No books found for this author"});
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = [];
  
  for (let isbn in books) {
    if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
      booksByTitle.push({
        isbn: isbn,
        ...books[isbn]
      });
    }
  }
  
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Task 10: Get the book list available in the shop using Promise callbacks
public_users.get('/async', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    resolve(books);
  });
  get_books.then((success) => {
    return res.status(200).json(JSON.stringify(success, null, 2));
  },
  (error) => {
    return res.status(500).json({message: "Error getting books"});
  });
});

// Task 11: Get book details based on ISBN using Promise callbacks
public_users.get('/async/isbn/:isbn', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });
  get_books.then((success) => {
    return res.status(200).json(success);
  },
  (error) => {
    return res.status(404).json({message: error});
  });
});

// Task 12: Get book details based on author using Promise callbacks
public_users.get('/async/author/:author', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    const author = req.params.author;
    const booksByAuthor = [];
    
    for (let isbn in books) {
      if (books[isbn].author.toLowerCase().includes(author.toLowerCase())) {
        booksByAuthor.push({
          isbn: isbn,
          ...books[isbn]
        });
      }
    }
    
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject("No books found for this author");
    }
  });
  get_books.then((success) => {
    return res.status(200).json(success);
  },
  (error) => {
    return res.status(404).json({message: error});
  });
});

// Task 13: Get book details based on title using Promise callbacks
public_users.get('/async/title/:title', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    const title = req.params.title;
    const booksByTitle = [];
    
    for (let isbn in books) {
      if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
        booksByTitle.push({
          isbn: isbn,
          ...books[isbn]
        });
      }
    }
    
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject("No books found with this title");
    }
  });
  get_books.then((success) => {
    return res.status(200).json(success);
  },
  (error) => {
    return res.status(404).json({message: error});
  });
});

// Alternative implementation using async/await with axios (for demonstration)
public_users.get('/async-await', async function (req, res) {
  try {
    // Simulate async operation with setTimeout wrapped in Promise
    const booksAsync = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(books);
      }, 100);
    });
    return res.status(200).json(JSON.stringify(booksAsync, null, 2));
  } catch (error) {
    return res.status(500).json({message: "Error getting books"});
  }
});

public_users.get('/async-await/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject("Book not found");
        }
      }, 100);
    });
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({message: error});
  }
});

public_users.get('/async-await/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const booksByAuthor = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const results = [];
        for (let isbn in books) {
          if (books[isbn].author.toLowerCase().includes(author.toLowerCase())) {
            results.push({
              isbn: isbn,
              ...books[isbn]
            });
          }
        }
        if (results.length > 0) {
          resolve(results);
        } else {
          reject("No books found for this author");
        }
      }, 100);
    });
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({message: error});
  }
});

public_users.get('/async-await/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const booksByTitle = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const results = [];
        for (let isbn in books) {
          if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
            results.push({
              isbn: isbn,
              ...books[isbn]
            });
          }
        }
        if (results.length > 0) {
          resolve(results);
        } else {
          reject("No books found with this title");
        }
      }, 100);
    });
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(404).json({message: error});
  }
});

module.exports.general = public_users;
