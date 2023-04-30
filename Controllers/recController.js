"use strict";

const recModel = require("../Models/recModel");
const usersModel = require("../Models/usersModel");

/*
    This recommends songs to the user by comparing their interests to other users.
*/
function recommendedSongs (req, res) {
    if (!req.session.isLoggedIn) {
        return res.redirect("/");
    }
    const {userID} = req.session.user;
    const user = usersModel.getUserByID(userID);

    const likedSongs = recModel.getLikedSongsByUserID(userID);
    const otherUsers = recModel.likedByOthers(likedSongs, userID);
    const recSongs = recModel.recommendSongs(otherUsers, likedSongs);
    if (recSongs.length <= 0)
        recSongs.recommend = false;
    else
        recSongs.recommend = true;

    res.render("recommended.ejs", {recSongs, user});

}

module.exports = {
    recommendedSongs
}