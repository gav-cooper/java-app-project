"use strict";

const db = require("/.db");

async function recommandation (userID){
    const rock = `
                    SELECT rock FROM Preferences 
                    WHERE userID = ` + userID `:`;

    const hiphop = `
                    SELECT hiphop FROM Preferences 
                    WHERE userID = ` + userID;
    const classic = `
                    SELECT classic FROM Preferences 
                    WHERE userID = ` + userID;

    const getRock = db.prepare(rock).get();
    const getHiphop = db.prepare(hiphop).get();
    const getClassic = db.prepare(classic).get();

    amount = getRock + getHiphop + getClassic;

    rockPercent = getRock / amount;
    hiphopPercent = getHiphop / amount;
    classicPercent = getClassic / amount;

    recommend = Math.random();
    if(recommend = Range(0-rock)){
        music = 'SELECT top(1) * FROM Music WHERE genre = rock order by NEWID()'
        recommandMusic = db.prepare(music).get();
    }else if(reccomend = Range(rock - rock + hiphop)){
        music = 'SELECT top(1) * FROM Music WHERE genre = hiphop order by NEWID()'
        recommandMusic = db.prepare(music).get();
    }else{
        music = 'SELECT top(1) * FROM Music WHERE genre = classic order by NEWID()'
        recommandMusic = db.prepare(music).get();
    }

    return recommandMusic;
}

module.exports = {
    recommandation
}