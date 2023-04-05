"use strict";

const db = require("./db");


async function recommandation (username){
    // to get the number of the user like
    const userID = `
                    SELECT userID FROM Users WHERE username=@username
                    `;

    const rock = `
                    SELECT rock from Preferences
                    WHERE userID = @userID
                    `;

    const hiphop = `
                    SELECT hiphop from Preferences
                    WHERE userID = @userID
                    `;
    const classic = `
                    SELECT classic from Preferences
                    WHERE userID = @userID
                    `;

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

function sendMusic(){
    const music = recommandation();
    var data_url = new XMLHttpRequest();
    data_url.open('GET', 'localhost:8000/recommendation')
    data_url.send(music)
}

async function musicPlay(){
    const music = recommandation();

    var audio = document.createElement("audio");
    document.body.appendChild(audio);
    audio.style.width = '100%';
    audio.style.height = 'auto';
    audio.controls = true;
    audio.volume = 0.3;

    audio.src = music;

    audio.play()
}

function addPreference(genre, value, user){
    const userID = `
                    SELECT * FROM Users WHERE username=@user
                    `
    const stmt = db.prepare(userID);
    const userID_record = stmt.get({userID});
    
    const preference = `
                    SELECT * FROM Preference WHERE useID=@userID_record
                    `
    const stmt2 = db.prepare(preference);
    like = stmt2.get({genre})
    like = like + value;
    const sql = `
                UPDATE Preference SET @genre = @like 
                WHERE userID = @userID_record
                `
    const stmt3 = db.prepare(sql);
    try {
        stmt3.run({
            "userID":userID_record,
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

function getGenre(){

}

module.exports = {
    recommandation,
    musicPlay,
    sendMusic,
    addPreference,
    getGenre
}