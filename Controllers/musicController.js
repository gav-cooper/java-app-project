"use strict";

const musicModel = require("../Models/musicModel");
const commentModel = require("../Models/commentModel");
const usersModel = require("../Models/usersModel");
const argon2 = require("argon2");

/*
    Allows the user to upload a file or post a link.
    If a user uploads a file, it is assumed they are the artist of the song.
    If a user posts a link, they can specify who the artist is if it isn't them.
*/
function makePost (req, res) {
    if (!req.session.isLoggedIn)
        return res.sendStatus(403);

    // Invalid file type
    if (!!req.file == false && !!req.body.artist == false) {
        return res.sendStatus(404);
    }
    const {name, genre} = req.body;
    const uploader = req.session.user.username;
    let {artist, path} = req.body
    let type = 1;

    // User is uploading a file, set parameters
    if (!!req.file === true) {
        artist = uploader;
        path = `/music/${req.file.filename}`;
        type = 0;
    } else if (!req.body.path.includes('youtube.com/')) {
        return res.sendStatus(400);
    }
    
    musicModel.addSong(type, name, path, uploader, artist, genre);
    return res.redirect('/post');
}

/*
    Allows the user to delete a song they've uploaded
*/
function deletePost (req, res) {
    if (!req.session.isLoggedIn)
        return res.sendStatus(403);

    const {admin} = usersModel.getUserByUsername(req.session.user.username);
    if (!admin)
        return res.sendStatus(403);
    const {musicID, username} = req.params;
    musicModel.deleteAllLikesByMusicID(musicID);
    commentModel.deleteAllCommentsByMusicID(musicID);
    musicModel.deleteSong(username, musicID);
    return res.sendStatus(200);
}

/* 
    Allows a user to like a song
*/ 
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
    return res.sendStatus(200);
}

function displaySingle(req, res) {
    if (!req.session.isLoggedIn)
        return res.redirect("/");
    const {musicID} = req.params;
    if (!musicModel.checkExists(musicID))
        return res.render("error", {status:404,message:`Couldn't find /post/${req.params.musicID}`});
    const music = musicModel.getSong(musicID);

    const liked = musicModel.checkLikes(musicID, req.session.user.userID);

    const comments = commentModel.getMusicComments(musicID);
    return res.render("displaySingle", {music, liked, comments});

}

function displayAll( req, res) {
    if (!req.session.isLoggedIn)
        return res.redirect("/");
    const allPost = musicModel.allMusic();
    for (const post of allPost) {
        if (musicModel.checkLikes(post.musicID, req.session.user.userID))
            post.liked = true;
        else
            post.liked = false;
    }
    let user = req.session.user
    res.render('post', {allPost, user})
}

function displayLiked(req, res) {
    if (!req.session.isLoggedIn)
        return res.redirect("/");
    const user = req.session.user;

    const allPost = musicModel.getLikedSongs(user.userID);
    for (const post of allPost) {
        if (musicModel.checkLikes(post.musicID, req.session.user.userID))
            post.liked = true;
        else
            post.liked = false;
    }

    res.render('liked', {allPost})

}

module.exports = {
    makePost,
    deletePost,
    likePost,
    displaySingle,
    displayAll,
    displayLiked
}