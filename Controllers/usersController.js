"use strict";

const usersModel = require("../Models/usersModel");
const argon2 = require("argon2");

async function createNewUser(req, res){
    const {username, email, password} = req.body;

    // User Model returns a promise that needs to be resolved
    if (!(await usersModel.addUser(username,email,password))) {
        return res.sendStatus(409);
    }
    res.sendStatus(201);
} 

async function login(req, res){
    // Login using username or email
    const {value, password} = req.body;

    if (!value.includes("@")){ // Login with username
        const user = usersModel.getUserByUsername(value);
        if (!user) {
            return res.sendStatus(404);
        }

        const {passwordHash} = user;
        if (await argon2.verify(passwordHash,password)) {
            req.session.regenerate((err) => {
                if (err){
                    console.error(err);
                    return res.sendStatus(500);  // internal server error
                }
    
                req.session.user = {};
                req.session.user.username = user.username;
                req.session.user.userID = user.userID;
                req.session.isLoggedIn = true;
                res.sendStatus(200);
            });
        } else {
            // User login failure
            res.sendStatus(404);
        }
    } else if (value.includes("@")) { // Login with email
        const user = usersModel.getUserByEmail(value);
        if (!user) {
            return res.sendStatus(404);
        }
        
        const {passwordHash} = user;
        if (await argon2.verify(passwordHash,password)) {
            req.session.regenerate((err) => {
                if (err){
                    console.error(err);
                    return res.sendStatus(500);  // internal server error
                }
    
                req.session.user = {};
                req.session.user.username = user.username;
                req.session.user.userID = user.userID;
                req.session.isLoggedIn = true;
                res.sendStatus(200);
            });
        } else {
            // User login failure
            res.sendStatus(404);
        }
    }
}

module.exports = {
    createNewUser,
    login
}