"use strict";

const usersModel = require("../Models/usersModel");
const musicModel = require("../Models/musicModel");
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

/*
    User can logout
*/
function logout (req,res) {
    req.session.destroy((error) =>
        res.redirect("/"));
}

function testSession (req, res) {
    console.log(req.session),
    res.sendStatus(200)
}

/*

*/
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

/*
    Allows users to change their profile picture
*/
function setPfp (req, res) {
    if (!req.session.isLoggedIn) {
        return res.sendStatus(403);
    }
    if (req.params.username !== req.session.user.username) {
        return res.sendStatus(403);
    }
    if (!req.file) {
        return res.sendStatus(404);
    }
    const {userID, pfpPath} = usersModel.getUserByUsername(req.session.user.username);
    usersModel.updatePfp(userID, pfpPath, `/pfp/${req.file.filename}`);
    return res.sendStatus(200);
}

/*
    Allow user to delete their account
*/
function removeAccount (req, res) {
    if (!req.session.isLoggedIn) {
        return res.sendStatus(403)
    }
    const {admin} = usersModel.getUserByUsername(req.session.user.username)
    if (!admin) {
        return res.sendStatus(403)
    }
    const {username} = usersModel.getUserByID(req.params.user)
    let songList = musicModel.getMusicByUser(username);
    songList = songList.map(row => row.musicID);
    for (const song of songList)
        musicModel.deleteSong(username, song);

    let likedSongs = musicModel.getLikedSongs(req.params.user);
    likedSongs = likedSongs.map(row => row.musicID);
    for (const song of likedSongs)
        musicModel.decLikes(song, req.params.user);
    usersModel.deleteUser(req.params.user);
    res.sendStatus(200);
}

/*
    Need database info in order to properly render the page
*/
function accountPage (req, res) {
    if (!req.session.isLoggedIn) {
        return res.sendStatus(403);
    }
    if (req.session.user.username !== req.params.username) {
        return res.render("error", {status:403, message:`You can't access their account!`});
    }
    const user = usersModel.getUserByUsername(req.session.user.username);
    if (!!user == false)
        return res.redirect("/login")
  return res.render('Account',{user})
}

/*
    /account relies on having the user's username. Redirect if possible
*/
function accountRedirect (req, res) {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login")
    } else {
        res.redirect(`/account/${req.session.user.username}`)
    }
}

function displayAllUsers (req, res) {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login")
    }
    const users = usersModel.getAllUsers();
    const {admin, username} = usersModel.getUserByUsername(req.session.user.username);
    
    res.render('allUsers', {users, admin, username})
}

function displaySingleUser (req, res) {
    if (!req.session.isLoggedIn)
        return res.redirect("/login")
    let userCheck = usersModel.getUserByUsername(req.params.username);
    if (!userCheck)
        return res.render("error", {status:404, message:`Couldn't find /users/${req.params.username}`});

    let user = musicModel.getMusicByUser(req.params.username);
    let flag = true;
    if (user.length <= 0) {
        user = usersModel.getUserByUsername(req.params.username);
        user.account = false;
        flag = false;
    }
    if (flag){
        for (const post of user) {
            if (musicModel.checkLikes(post.musicID, req.session.user.userID))
                post.liked = true;
            else
                post.liked = false;
        }
    }
    const {admin, username} = usersModel.getUserByUsername(req.session.user.username);
    res.render('singleUser', {user, admin, username})
}

module.exports = {
    createNewUser,
    login,
    logout,
    testSession,
    uploadFiles,
    setPfp,
    removeAccount,
    accountPage,
    accountRedirect,
    displayAllUsers,
    displaySingleUser
}