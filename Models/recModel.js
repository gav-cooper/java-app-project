"use strict";

const db = require("./db");


/* 
    Finds all the songs liked by a certain user
*/
function getLikedSongsByUserID (userID) {
    const sql = `SELECT * 
                FROM MusicLikes
                Likes JOIN Music 
                ON Likes.musicID = Music.musicID
                WHERE userID = @userID`;
    const stmt = db.prepare(sql);
    const likedSongs = stmt.all({userID}).map(row => row.musicID);
    return likedSongs;
}

/*
    Finds all users who like the same songs as a user
*/
function likedByOthers (likedSongs, userID) {
    const sql= `SELECT DISTINCT userID 
                FROM MusicLikes 
                WHERE musicID IN (${likedSongs.map(() => '?').join(',')}) 
                AND userID != ?
                `;
    const stmt = db.prepare(sql);
    const otherUsers = stmt.all([...likedSongs, userID]).map(row => row.userID);
    return otherUsers;
}

/*
    Returns a unique list of songs that a user may like based on other users who
    like similar songs
*/
function recommendSongs (otherUsers, likedSongs) {
    const sql = `SELECT DISTINCT * 
                 FROM MusicLikes 
                 JOIN Music ON MusicLikes.musicID = Music.musicID
                 WHERE userID IN (${otherUsers.map(() => '?').join(',')}) 
                 AND MusicLikes.musicID NOT IN (${likedSongs.map(() => '?').join(',')})
                `;
    const stmt = db.prepare(sql);
    const recommendedSongs = stmt.all([...otherUsers,...likedSongs]);
    return recommendedSongs;
}

module.exports = {
    getLikedSongsByUserID,
    likedByOthers,
    recommendSongs
}