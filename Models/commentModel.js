"use strict";

const db = require("./db");
const crypto = require("crypto");

function addComment(musicID, message, userID){
    const commentID = crypto.randomUUID();

    const date = Date.now();

    const sql = `INSERT INTO Comments (commentID, musicID, userID, message, date) 
                VALUES (@commentID, @musicID, @userID, @message, @date)`;
    const add_comment = db.prepare(sql);

    try {
        add_comment.run({
            commentID,
            musicID,
            userID,
            message,
            date
        });
        return add_comment;
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = {
    addComment
}