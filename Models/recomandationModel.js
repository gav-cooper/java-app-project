"use strict";


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

    amount = rock + hiphop + classic;

    rockPercent = rock / amount;
    hiphopPercent = hiphop / amount;
    classicPercent = classic / amount;

    recommend = Math.random();
    if(recommend = Range(0-rock)){
        music = 'SELECT top(1) * FROM Music WHERE genre = rock order by NEWID()'
    }else if(reccomend = Range(rock - rock + hiphop)){
        music = 'SELECT top(1) * FROM Music WHERE genre = hiphop order by NEWID()'
    }else{
        music = 'SELECT top(1) * FROM Music WHERE genre = classic order by NEWID()'
    }
}

module.exports = {
    recommandation
}