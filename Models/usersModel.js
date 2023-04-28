"use strict";

const db = require("./db");

const crypto = require("crypto");
const argon2 = require('argon2');

const fs = require('fs');

async function addUser (username, email, password) {
    const uuid = crypto.randomUUID();
    const hash = await argon2.hash(password);

    const count = `
        SELECT * FROM Users
        `;
    const checkCount = db.prepare(count).get()
    let adminAccount = 0;

    if (!!checkCount == false) {
        adminAccount = 1;
    }

    const sql = `
        INSERT INTO Users 
            (userID, username, email, passwordHash, admin) 
        VALUES 
            (@userID, @username, @email, @passwordHash, @adminAccount)
    `;
    
    const stmt = db.prepare(sql);
    try {
        stmt.run({
            "userID":uuid,
            "username":username,
            "email":email,
            "passwordHash":hash,
            "adminAccount":adminAccount
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

function getUserByUsername(username) {
    const sql = `
        SELECT * FROM Users WHERE username = @username;
        `;
    const stmt = db.prepare(sql);
    const record = stmt.get({
        username
    });
    
    return record;
}


function getUserByEmail(email) {
    const sql = `
        SELECT * FROM Users WHERE email = @email;
        `;
    const stmt = db.prepare(sql);
    const record = stmt.get({
        email
    });
    
    return record;
}

function updatePfp (userID, currPath, path) {
    if (currPath !== "/pfp/pfp.png") { // Remove file if not default
        fs.unlinkSync("public"+currPath);
    }
    const sql = `
        UPDATE Users SET
            pfpPath = (@path)
        WHERE
            userID = @userID
        `;
        const stmt = db.prepare(sql);
        stmt.run({userID, path});
}

function deleteUser (userID) {
    const sql = `
    DELETE FROM Users
    WHERE
        userID = @userID
    `;

    const stmt = db.prepare(sql);
    stmt.run({userID})
}

function getAllUsers () {
    try{
        const sql = `
        SELECT *
        FROM Users
        `;

        return db.prepare(sql).all();
    } catch (error) {
            console.log(error);
            return false;
    }
}

module.exports = {
    addUser,
    getUserByUsername,
    getUserByEmail,
    updatePfp,
    deleteUser,
    getAllUsers
}