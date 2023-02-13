"use strict";

const db = require("./db");

const crypto = require("crypto");
const argon2 = require('argon2');

// Sessions
const redis = require('redis');
const session = require("express-session");
const { getMaxListeners } = require("process");
//

async function addUser (username, email, password) {
    const uuid = crypto.randomUUID();
    const hash = await argon2.hash(password);

    const count = `
        SELECT * FROM Users
        `;
    const checkCount = db.prepare(count).get()
    let adminAccount = 0;

    console.log(!!checkCount)
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

module.exports = {
    addUser,
    getUserByUsername,
    getUserByEmail
}