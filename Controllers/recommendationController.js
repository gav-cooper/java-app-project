"use strict";

const recommendModel = require("../Models/recomandationModel");
const usersModel = require("../Models/usersModel");


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
    if(music == "The database is empty please upload the music"){
        res.render("main.html")
    }
    return res.render("recommendation.ejs", {user, music})
}

// to get the preference
async function setPreference(req, res){
    const {username, music, rate} = req.body;
    const user = usersModel.getUserByUsername(username)
    const genre = recommendModel.getGenre(music);
    const value = rate;
    if(!(await recommendModel.addPreference(user, genre, value))){
        return res.sendStatus(409);
    }
    res.redirect("/recommendation");
}

module.exports = {
    getReccomend,
    setPreference
}