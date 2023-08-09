const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
    "username":'admin',
    "password":'abc123'
}];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    let username_exists = users.filter((user) => {
        return user.username === username
    })
    if (username_exists.length > 0) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    let user_auth = users.filter((user) => {
        return ((user.username === username) && (user.password === password))
    })
    if (user_auth.length > 0){
        return true;
    } else {
        return false;
    }
    //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    let password = req.body.password;
    let username = req.body.username;
    if (!username || !password) {
        return res.status(404).json({ message: 'Login error.' })
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = { accessToken, username }
        return res.status(200).send('User successfully logged in');
    } else {
        return res.status(208).json({ message: 'Invalid Login, check username or password.' })
    }


});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn
    let addReview = req.body.reviews;
    let book = books[isbn]
    const user = req.session.authorization['username']
    if(book){
        book.reviews[user] = addReview;
        res.send(book)
    } else{
        return res.status(404).json({ message: "Book not found." });
    } 
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    let book = books[isbn]
    const user = req.session.authorization['username']
    if(book){
        delete book.reviews[user];
        res.send(book)
    } else{
        return res.status(404).json({ message: "Book not found." });
    } 
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
