"use strict";

const commentModel = require("../Models/commentModel");
const usersModel = require("../Models/usersModel");
const Filter = require("bad-words");

const filter = new Filter();

function addComment(req, res){
    if (!req.session.isLoggedIn) {
        return res.redirect("/")
    }
    if(req.session.user.username !== req.body.username)
        return res.sendStatus(400);
    const {userID} = usersModel.getUserByUsername(req.body.username);
    const {musicID} = req.body;
    let {message} = req.body;

    message = filter.clean(message);
    
    if (commentModel.addComment(musicID, message, userID))
        return res.sendStatus(200);
    else
        return res.sendStatus(400);
}

module.exports = {
    addComment,
}