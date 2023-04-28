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
const commentController = require("./Controllers/commentController");

// Validators
const usersValidator = require("./Validators/usersValidator");
	
// File uploads
const fileUpload = require("./fileUpload");
const musicModel = require("./Models/musicModel");
const recommendationModel = require("./Models/recomandationModel");
const { music } = require("./fileUpload");

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    if (!req.session.isLoggedIn)
      res.redirect('/login');
    else
      res.redirect('/post');
});

app.get("/uploadSong", (req, res) => {
  let user = req.session.user
  if (!user)
    return res.redirect("/login");
  res.render('uploadSong',{user})
});

app.get("/account/", usersController.accountRedirect);

app.get("/account/:username", usersController.accountPage);

app.get("/fileUploadTest", (req, res) => {
  let user = req.session.user
  res.render('fileUploadTest',{user})
});

app.get("/post", musicController.displayAll)

app.get("/recommendation", (req, res) => {
  let user = req.session.user
  const music = recommendationModel.recommandation(user.username);

  // music is undefined, this is why it is not working; will need to check Model
  console.log(music)
  req.session.music = music
  res.render('recommendation', {user, music})
});

app.get("/users/:username/uploads", usersController.uploadFiles);
// app.get("/recommendation", recommendationController.getReccomend);
app.get("/users/:username/uploads", usersController.uploadFiles);
app.get("/post/:musicID", musicController.displaySingle);
app.get("/users", usersController.displayAllUsers);
app.get("/users/:username", usersController.displaySingleUser);


app.post("/register", usersValidator.validateRegistration, usersController.createNewUser);
app.post("/login",usersValidator.validateLogin,usersController.login);
app.post("/logout",usersController.logout);
app.post("/testSession",usersController.testSession);
app.post("/recommendation", (req, res) => {
  let user = req.session.user;
  let music = req.session.music;
  let rate = req.body.rate;
  recommendationController.setPreference(user.userID, music.genre, rate)
  res.redirect("/recommendation");
  }, 
);


app.post("/account/:username/pfp", 
  fileUpload.pfp.single("pfp"),
  usersController.setPfp);
app.post("/songs/file", 
  fileUpload.music.single("music"),
  musicController.makePost);
app.post("/songs/link", 
  fileUpload.music.single("music"),
  musicController.makePost);
app.post("/post/:musicID/like", musicController.likePost);

app.delete("/users/:user", usersController.removeAccount);

app.delete("/music/:musicID/:username", musicController.deletePost);

app.post("/post/comment/:musicID", commentController.addComment);
module.exports = app;