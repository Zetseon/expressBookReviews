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
    console.log(`Entered Information: ${username} ${password}`)

    let user_auth = users.filter((user) => {
        console.log(`Database Information: ${user.username} ${user.password}`)
        console.log(`Entered Information: ${username} ${password}`)
        return ((user.username === username) && (user.password === password))
    })
    if (user_auth.length = 0) {
        return false;
    } else {
        return true;
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
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
