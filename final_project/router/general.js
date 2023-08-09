const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios")

public_users.post("/register", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    //checking if username and password exists
    if (username && password) {
        if (isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: `User already exists` })
        }
    } else {
        return res.status(404).json({ message: `Unable to register user. Username or Password not provided` })
    }

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    return res.send(books)
});

// Get the book list available in the shop using async
public_users.get('/async/books', function (req, res) {
    const booksPromise = new Promise((resolve, reject) => {
        resolve({ books })
    })
    booksPromise
        .then((books) => {
            res.send(JSON.stringify(books, null, 3));
            console.log(`Promise completed`);
        })
        .catch((error) => {
            res.status(500).json({ message: `An Error accourd. ${error}` });
            console.log(`Error: ${error}`)
        })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.params.isbn
    if (isbn < 1 || isbn > 10) {
        return res.send(404).json({ message: ' send isbn in between 1 to 10' })
    } else {
        return res.send(books[isbn])
    }
});
// Get book details based on ISBN with async
public_users.get('/async/isbn/:isbn', function (req, res) {
    const isbnPromise = new Promise((resolve, reject) => {
        let isbn = req.params.isbn;
        let book = books[isbn];

        if (book) {
            resolve(book);
        } else {
            reject(new Error('Book not found'));
        }
    });

    isbnPromise
        .then((book) => {
            res.send(JSON.stringify(book, null, 3));
            console.log('Promise completed');
        })
        .catch((error) => {
            res.status(400).json({ message: error.message }); // Send an error response to the client
            console.log(`Error: ${error}`);
        });
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    let authorName = req.params.author;

    const filteredBooks = Object.values(books).filter((item) => {
        return item.author === authorName;
    })
    console.log(filteredBooks)
    return res.send(filteredBooks)
});

// Get book details based on author with async
public_users.get('/async/author/:author', function (req, res) {
    const authorPromise = new Promise((resolve, reject) => {
        let author = req.params.author
        if (author) {
            const filteredBooks = Object.values(books).filter((item) => {
                return item.author === author;
            })
            if (filteredBooks.length > 0) {
                resolve(filteredBooks)
            } else {
                reject(new Error('No books found by the author'));
            }
        } else {
            reject(new Error('enter valid author'));
        }
    })
    authorPromise
        .then((filteredBooks) => {
            res.send(JSON.stringify(filteredBooks, null, 4));
            console.log(`Promise completed`);
        })
        .catch((error) => {
            res.status(400).json({ message: error.message }); // Send an error response to the client
            console.log(`Error: ${error}`);
        })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    let title = req.params.title;
    const filteredBooksTitle = Object.values(books).filter((item) => { return item.title == title });
    return res.send(filteredBooksTitle);
});

// Get all books based on title with async
public_users.get('/async/title/:title', function (req, res) {
    const titlePromise = new Promise((resolve, reject) => {
        let title = req.params.title
        if (title) {
            const filteredBooks = Object.values(books).filter((item) => {
                return item.title === title;
            })
            if (filteredBooks.length > 0) {
                resolve(filteredBooks)
            } else {
                reject(new Error('No books found by the title'));
            }
        } else {
            reject(new Error('enter valid title'));
        }
    })
    titlePromise
        .then((filteredBooks) => {
            res.send(JSON.stringify(filteredBooks, null, 4));
            console.log(`Promise completed`);
        })
        .catch((error) => {
            res.status(400).json({ message: error.message }); // Send an error response to the client
            console.log(`Error: ${error}`);
        })
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.params.isbn
    if (isbn < 1 || isbn > 10) {
        return res.send(404).json({ message: ' send isbn in between 1 to 10' })
    } else {
        return (res.send(books[isbn].reviews))
    }
});

module.exports.general = public_users;
