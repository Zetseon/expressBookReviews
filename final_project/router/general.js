const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    //checking if username and password exists
    if(username && password){
        if(isValid(username)){
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else{
            return res.status(404).json({message:`User already exists`})
        }
    }else{
        return res.status(404).json({message: `Unable to register user. Username or Password not provided`})
    }
 
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    return res.send(books)
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

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    let title = req.params.title;
    const filteredBooksTitle = Object.values(books).filter((item) => { return item.title == title });
    return res.send(filteredBooksTitle);
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
