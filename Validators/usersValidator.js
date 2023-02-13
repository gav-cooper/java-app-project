"use strict";

const userModel = require("../Models/userModel");

async function createNewUser(req, res){
    const {username, email, password} = req.body;

    // User Model returns a promise that needs to be resolved
    if (!(await userModel.addUser(username,email,password))) {
        return res.sendStatus(409);
    }
    res.sendStatus(201);
} 

module.exports = {
    createNewUser
}