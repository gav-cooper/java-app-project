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

// Controllers
const usersController = require("./Controllers/usersController");
const musicController = require("./Controllers/musicController");

// Validators
const usersValidator = require("./Validators/usersValidator");
	
// File uploads
const fileUpload = require("./fileUpload");

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.redirect('/login')
});
app.get("/users/:username/uploads", usersController.uploadFiles)

app.post("/register", usersValidator.validateRegistration, usersController.createNewUser);
app.post("/login",usersValidator.validateLogin,usersController.login);
app.post("/logout",usersController.logout);
app.post("/testSession",usersController.testSession);
app.post("/users/:userID/pfp", 
  fileUpload.pfp.single("pfp"),
  usersController.setPfp);
app.post("/users/:userID/music", 
  fileUpload.music.single("music"),
  musicController.test);

module.exports = app;