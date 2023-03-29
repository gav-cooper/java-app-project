"use strict";

const recommendModel = require("../Models/recomandationModel");

// to get the recommendation music
async function getReccomend(req, res){
    const {music} = req.body;
    if(!(await recommendModel.recommandation())){
        return res.sendStatus(409);
    }
    res.sendStatus(201);
}

module.exports = {
    getReccomend
}