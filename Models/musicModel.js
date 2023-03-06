"use strict";

const db = require("./db");

const crypto = require("crypto");
const argon2 = require('argon2');

async function addSong (fileType, name, path, uploader, artist=uploader, genre) {
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

module.exports = {
    addSong
}