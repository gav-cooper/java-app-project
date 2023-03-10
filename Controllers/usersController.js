"use strict";

const usersModel = require("../Models/usersModel");
const argon2 = require("argon2");

/*
 * Adds a new user to the site, the first user will have an admin account
*/
async function createNewUser(req, res){
    const {username, email, password} = req.body;

    // User Model returns a promise that needs to be resolved
    if (!(await usersModel.addUser(username,email,password))) {
        return res.sendStatus(409);
    }
    res.sendStatus(201);
} 

/*
 * Login function allows the user to login with their username or email
*/
async function login(req, res){
    if (req.session.isLoggedIn) {
        return res.redirect("/")
    }

    // Login using username or email
    const {value, password} = req.body;

    if (!value.includes("@")){ // Login with username
        const user = usersModel.getUserByUsername(value);
        if (!user) {
            return res.sendStatus(404);
        }

        const {passwordHash, admin} = user;
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
                req.session.isAdmin = admin;
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
        
        const {passwordHash, admin} = user;
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
                req.session.isAdmin = admin;
                res.sendStatus(200);
            });
        } else {
            // User login failure
            res.sendStatus(404);
        }
    }
}

function logout (req,res) {
    req.session.destroy((error) =>
        res.redirect("/"));
}

function testSession (req, res) {
    console.log(req.session),
    res.sendStatus(200)
}

function uploadFiles (req, res) {
    if (!req.session.isLoggedIn){
        return res.redirect("/");
    }
    if (req.params.username !== req.session.user.username){
        return res.redirect("/");
    }

    const user = usersModel.getUserByUsername(req.params.username);
    return res.render("fileUploadTest.ejs", {user})
}

function setPfp (req, res) {
    if (!req.session.isLoggedIn) {
        return res.sendStatus(403);
    }
    if (req.params.userID !== req.session.user.userID) {
        return res.sendStatus(403);
    }
    const {userID, pfpPath} = usersModel.getUserByUsername(req.session.user.username);
    usersModel.updatePfp(userID, pfpPath, `/pfp/${req.file.filename}`);
    res.redirect(`/users/${req.session.user.username}/uploads`)
}

module.exports = {
    createNewUser,
    login,
    logout,
    testSession,
    uploadFiles,
    setPfp
}