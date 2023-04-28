"use strict";

const db = require("./db");
const crypto = require("crypto");

function addComment(musicID, message, userID, username){
    const commentID = crypto.randomUUID();

    const date = Date.now();

    const sql = `INSERT INTO Comments (commentID, musicID, userID, username, message, date) 
                VALUES (@commentID, @musicID, @userID, @username, @message, @date)`;
    const add_comment = db.prepare(sql);

    try {
        add_comment.run({
            commentID,
            musicID,
            userID,
            username,
            message,
            date
        });
        return add_comment;
    } catch (error) {
        console.error(error);
        return false;
    }
}

function getMusicComments(musicID) {
    const sql = `SELECT * FROM Comments WHERE musicID = @musicID ORDER BY date DESC`;

    const stmt = db.prepare(sql);

    const comments = stmt.all({musicID});
    
    if (comments) 
        return comments;
    else
        return false;
}

module.exports = {
    addComment,
    getMusicComments
}