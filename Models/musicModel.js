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
        WHERE uploader = @uploader and originalName = @name
    `;

    const stmt = db.prepare(sql);
    return stmt.get({uploader, name})
}

function checkType (user, song) {
    const sql = `
        SELECT uploadType
        FROM Music
        WHERE uploader = @user AND originalName = @song
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

function deleteSong (user, song) {
    const sql = `
        DELETE FROM Music
        WHERE originalName = @song AND uploader = @user
        `;

    const stmt = db.prepare(sql);
    try {
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

module.exports = {
    addSong,
    deleteSong
}