"use strict";

const db = require("./db");

const crypto = require("crypto");
const argon2 = require('argon2');
const fs = require('fs');

async function addSong (fileType, name, path, uploader, artist, genre) {
    const musicID = crypto.randomUUID();

    const date = Date.now();

    const sql = `
        INSERT INTO Music 
            (musicID, uploadType, originalName, musicPath, uploader, artist, date, genre) 
        VALUES 
            (@musicID, @fileType, @name, @path, @uploader, @artist, @date, @genre)
    `;
    
    const stmt = db.prepare(sql);
    try {
        stmt.run({
            musicID,
            fileType,
            name,
            path,
            uploader,
            artist,
            date,
            genre
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

function getUsersSongsByName (uploader, name) {
    const sql = `
        SELECT * 
        FROM Music
        WHERE uploader = @uploader and originalName = @name
    `;

    const stmt = db.prepare(sql);
    return stmt.get({uploader, name})
}

function getPathByName (uploader, name) {
    const sql = `
        SELECT musicPath 
        FROM Music
        WHERE uploader = @uploader and musicID = @name
    `;

    const stmt = db.prepare(sql);
    return stmt.get({uploader, name})
}

function checkType (user, song) {
    const sql = `
        SELECT uploadType
        FROM Music
        WHERE uploader = @user AND musicID = @song
        `;

        const stmt = db.prepare(sql);

        try {
            return stmt.get({user, song});
        }
        catch (error) {
            console.log(error);
            return false;
        }
}

function allMusic () {
    try{
        const sql = `
        SELECT *
        FROM Music ORDER BY date DESC
        `;

        return db.prepare(sql).all();
    } catch (error) {
            console.log(error);
            return false;
    }
}

function deleteSong (user, song) {
    const sql = `
        DELETE FROM Music
        WHERE musicID = @song
        `;

    const stmt = db.prepare(sql);
    try {
        console.log(user, song);
        const {musicPath} = getPathByName(user, song);
        const {uploadType} = checkType(user,song);
        stmt.run({song, user});
        if (uploadType === 0) {
            fs.unlinkSync("public"+musicPath);
        }
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }

}

function incLikes (musicID, userID) {
    const sql1 = `
        UPDATE Music
        SET 
            likes = (likes + 1)
        WHERE
            musicID = @musicID
    `;

    const sql2 = `
        INSERT INTO MusicLikes
            (musicID, userID)
        VALUES
            (@musicID, @userID)
    `;

    const stmt1 = db.prepare(sql1);
    const stmt2 = db.prepare(sql2);

    try {
        stmt1.run({musicID});
        stmt2.run({musicID,userID});
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

function decLikes (musicID, userID) {
    const sql1 = `
        UPDATE Music
        SET 
            likes = (likes - 1)
        WHERE
            musicID = @musicID
    `;

    const sql2 = `
        DELETE FROM MusicLikes
        WHERE
            userID = @userID AND musicID = @musicID
    `;

    const stmt1 = db.prepare(sql1);
    const stmt2 = db.prepare(sql2);

    try {
        stmt1.run({musicID});
        stmt2.run({userID, musicID});
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

function checkLikes (musicID, userID) {
    const sql =`
        SELECT * FROM MusicLikes
        WHERE
            musicID = @musicID AND
            userID = @userID
    `;
    const stmt = db.prepare(sql);
    const like = stmt.get({musicID, userID});
    return like;
}

function getSong (musicID) {
    const sql = `
        SELECT musicID, uploadType, originalName, musicPath, artist, date, likes, username, genre FROM 
            Music
        JOIN Users on
            Music.uploader=Users.username
        WHERE
            musicID = (@musicID)
    `;
    const stmt = db.prepare(sql);
    const music = stmt.get({musicID});
    return music;
}

function getMusicByUser (username) {
    const sql = `
        SELECT musicID, uploadType, originalName, musicPath, artist, date, likes, username, genre, pfpPath FROM 
            Music
        JOIN Users on
            Music.uploader=Users.username
        WHERE
            Users.username = @username
    `;
    const stmt = db.prepare(sql);
    const music = stmt.all({username});
    return music;
}


module.exports = {
    addSong,
    deleteSong,
    allMusic,
    incLikes,
    decLikes,
    checkLikes,
    getSong,
    getMusicByUser
}