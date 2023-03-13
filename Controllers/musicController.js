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
        path = `/${req.file.path}`;
        type = 0;
    }
    musicModel.addSong(type, name, path, uploader, artist, genre);
    return res.redirect(`/users/${req.session.user.username}/uploads`);
}

function deletePost (req, res) {
    if (!req.sesion.isLoggedIn)
        return res.sendStatus(403);
    if (req.session.username != req.body.username)
        return res.sendStatus(403);
    
        
}

module.exports = {
    makePost
}