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
    music = recommendModel.recommandation(req.params.userID);
    return res.render("recommendation.ejs", {user}, {music})
}

module.exports = {
    getReccomend
}