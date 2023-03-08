"use strict";

const musicModel = require("../Models/musicModel");
const argon2 = require("argon2");


//addSong (fileType, name, path, uploader, artist, genre)
function test (req, res) {
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

module.exports = {
    test
}