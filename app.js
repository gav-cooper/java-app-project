"use strict";

require("dotenv").config();

// Session Management
const redis = require("redis");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);

const express = require("express");

const app = express();

const sessionConfig = {
    store: new RedisStore({ client: redis.createClient() }),
    secret: process.env.COOKIE_SECRET, 
    resave: false,
    saveUninitialized: false,
    name: "session",
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 8, // 8 hours
    }
  };
  
// Enabling session management
app.use(session(sessionConfig));


app.use(express.static("public", {index: "index.html", extensions: ["html"]}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const usersController = require("./Controllers/usersController");
	
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.send("Hello");
});


app.post("/register", usersController.createNewUser);
app.post("/login",usersController.login)

module.exports = app;