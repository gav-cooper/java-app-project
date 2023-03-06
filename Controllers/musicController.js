"use strict";

const musicModel = require("../Models/musicModel");
const argon2 = require("argon2");

function test (req, res) {
    console.log(req.body);
    console.log(req.file);
}

module.exports = {
    test
}