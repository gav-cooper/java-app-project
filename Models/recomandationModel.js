"use strict";

const db = require("/.db");

async function recommandation (){
    // to get the number of the user like
    const rock = `
                    SELECT rock FROM Preferences 
                    WHERE userID = ` + userID `:`;

    const hiphop = `
                    SELECT hiphop FROM Preferences 
                    WHERE userID = ` + userID;
    const classic = `
                    SELECT classic FROM Preferences 
                    WHERE userID = ` + userID;

    // to get the number from database
    const getRock = db.prepare(rock).get();
    const getHiphop = db.prepare(hiphop).get();
    const getClassic = db.prepare(classic).get();

    // to calculate the amount of sum
    amount = getRock + getHiphop + getClassic;

    // to calculate the percentege of the preference
    if(aount != 0){
        rockPercent = getRock / amount;
        hiphopPercent = getHiphop / amount;
        classicPercent = getClassic / amount;
    }
    else{
        rockPercent = 100 / 3;
        hiphopPercent = 100 / 3;
        classicPercent = (100 / 3) + 1;
    }
    

    // to get the random number 0 - 1
    recommend = Math.random();

    // to choose the recommandation music
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

    // to return the music
    return recommandMusic;
}

module.exports = {
    recommandation
}