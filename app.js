"use strict";

require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const usersController = require("./Controllers/usersController");
	
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

module.exports = app;