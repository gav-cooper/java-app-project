"use strict";

const musicModel = require("../Models/musicModel");
const argon2 = require("argon2");

/*
    Allows the user to upload a file or post a link.
    If a user uploads a file, it is assumed they are the artist of the song.
    If a user posts a link, they can specify who the artist is if it isn't them.
*/
function makePost (req, res) {
    if (!req.session.isLoggedIn)
        return res.sendStatus(403);
    
    const {name, genre} = req.body;
    const uploader = req.session.user.username;
    let {artist, path} = req.body
    let type = 1;

    // User is uploading a file, set parameters
    if (!!req.file === true) {
        artist = uploader;
        path = `/music/${req.file.filename}`;
        type = 0;
    }
    musicModel.addSong(type, name, path, uploader, artist, genre);
    return res.redirect(`/post`);
}

function deletePost (req, res) {
    if (!req.session.isLoggedIn)
        return res.sendStatus(403);
    if (req.session.user.username != req.params.username)
        return res.sendStatus(403);
    
    const {username} = req.session.user;
    const {song} = req.body;

    musicModel.deleteSong(username, song);
    return res.sendStatus(200);
}

function likePost(req, res) {
    if (!req.session.isLoggedIn) {
        return res.sendStatus(403);
    }
    if (!musicModel.getSong(req.params.musicID)) {
        return res.sendStatus(404);
    }
    const {musicID} = req.params;
    const {userID} = req.session.user;

    // Increment if user hasn't liked the song, decrement otherwise.
    if (!musicModel.checkLikes(musicID, userID)) {
        musicModel.incLikes(musicID, userID);
    } else {
        musicModel.decLikes(musicID, userID);
    }
    res.sendStatus(200);
}

module.exports = {
    makePost,
    deletePost,
    likePost
}