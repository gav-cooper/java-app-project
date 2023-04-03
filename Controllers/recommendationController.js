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
    return res.render("recommendation.ejs", {user})
}

module.exports = {
    getReccomend
}