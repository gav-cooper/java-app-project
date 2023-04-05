"use strict";

const recommendModel = require("../Models/recomandationModel");
const userModel = require("../Models/usersModel");

// to get the recommendation music
function getReccomend(req, res){
    if (!req.session.isLoggedIn){
        return res.redirect("/");
    }
    if (req.params.username !== req.session.user.username){
        return res.redirect("/");
    }

    const user = usersModel.getUserByUsername(req.params.username);
    music = recommendModel.recommandation(req.params.username);
    return res.render("recommendation.ejs", {user}, {music})
}

function setPreference(req, res){
    const {preference, music} = req.body;
    const user = usersModel.getUserByUsername(req.params.username)
    const genre = recommendModel.getGenre(music);
    if(!(recommendModel.addRecommend(genre, preference, user))){
        return res.sendStatus(409);
    }
    res.sendStatus(201);
}

module.exports = {
    getReccomend,
    setPreference
}