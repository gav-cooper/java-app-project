"use strict";

const commentModel = require("../Models/commentModel");
const usersModel = require("../Models/usersModel");
const Filter = require("bad-words");

const filter = new Filter();

function addComment(req, res){
    if (!req.session.isLoggedIn) {
        return res.redirect("/")
    }
    const {userID} = usersModel.getUserByUsername(req.session.user.username);
    const {username} = usersModel.getUserByID(userID);
    const {musicID} = req.params;
    let {message} = req.body;

    message = filter.clean(message);
    
    if (commentModel.addComment(musicID, message, userID, username))
        return res.redirect(`/post/${musicID}`);
    else
        return res.sendStatus(400);
}

module.exports = {
    addComment,
}