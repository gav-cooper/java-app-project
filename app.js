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
const recommendationController = require("./Controllers/recommendationController");

// Validators
const usersValidator = require("./Validators/usersValidator");
	
// File uploads
const fileUpload = require("./fileUpload");

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.redirect('/login')
});
app.get("/uploadSong", (req, res) => {
  let user = req.session.user
  if (!user)
    return res.redirect("/login");
  res.render('uploadSong',{user})
});
app.get("/account", (req, res) => {
  let user = req.session.user
  if (!user)
    return res.redirect("/login")
  res.render('Account',{user})
});
app.get("/recommendation", (req, res) => {
  let user = req.session.user
  res.render('recommendation', {user})
});
app.get("/users/:username/uploads", usersController.uploadFiles);

app.post("/register", usersValidator.validateRegistration, usersController.createNewUser);
app.post("/login",usersValidator.validateLogin,usersController.login);
app.post("/logout",usersController.logout);
app.post("/testSession",usersController.testSession);
app.post("/users/:userID/recommendation", recommendationController.getReccomend);
app.post("/users/:userID/pfp", 
  fileUpload.pfp.single("pfp"),
  usersController.setPfp);
app.post("/users/:userID/file", 
  fileUpload.music.single("music"),
  musicController.makePost);
app.post("/users/:userID/link", 
  fileUpload.music.single("music"),
  musicController.makePost);
app.delete("/users/:user", usersController.removeAccount);
module.exports = app;
app.delete("/users/:username", musicController.deletePost);