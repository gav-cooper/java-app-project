"use strict";

const db = require("./db");

function getUserIDByUsername(user){
    const sql = 'SELECT userID FROM Users WHERE username=@user';
    const stmt = db.prepare(sql);
    const record = stmt.get({
        user
    });
    return record;
}

function getPreferenceRock(userID){
    const sql = `SELECT rock FROM Preferences WHERE userID = @userID`;
    const stmt = db.prepare(sql);
    const record = stmt.get(userID);
    return record;
}

function getPreferenceHiphop(userID){
    const sql = `SELECT hiphop FROM Preferences WHERE userID = @userID`;
    const stmt = db.prepare(sql);
    const record = stmt.get(userID);
    return record;
}

function getPreferenceClassic(userID){
    const sql = `SELECT classic FROM Preferences WHERE userID = @userID`;
    const stmt = db.prepare(sql);
    const record = stmt.get(userID);
    return record;
}

function recommandation (user){
    // to get the number of the user like
    const userID = getUserIDByUsername(user);
    
    // to get the number of preference
    let getRock = getPreferenceRock(userID);
    let getHiphop = getPreferenceHiphop(userID);
    let getClassic = getPreferenceClassic(userID);

    // to set number in average
    if(getRock == 0){
        getRock = 1;
    }else if(getHiphop == 0){
        getHiphop = 1;
    }else if(getClassic == 0){
        getClassic = 1;
    }

    // to calculate the amount of sum
    let amount = getRock + getHiphop + getClassic;

    let rockPercent;
    let hiphopPercent;
    let classicPercent;

    // to calculate the percentege of the preference
    rockPercent = getRock / amount;
    hiphopPercent = getHiphop / amount;
    classicPercent = getClassic / amount;

    // to get the random number 0 - 1
    const recommend = Math.random();

    // to get the music path
    let recommandMusic
    let music

    // to choose the recommandation music
    if(recommend > 0 && recommend < rockPercent){
        music = `SELECT * FROM Music WHERE genre = 'rock' ORDER BY RANDOM() LIMIT 1`;
        recommandMusic = db.prepare(music).get();
    }else if(recommend >rockPercent && recommend < rockPercent + hiphopPercent){
        music = `SELECT * FROM Music WHERE genre = 'hiphop' ORDER BY RANDOM() LIMIT 1`;
        recommandMusic = db.prepare(music).get();
    }else{
        //music = 'SELECT * FROM Music ORDER BY RANDOM() LIMIT 1';
        music = `SELECT * FROM Music WHERE genre = 'classic' ORDER BY RANDOM() LIMIT 1`;
        recommandMusic = db.prepare(music).get();
    }
    if(recommandMusic == ""){
        recommandMusic = "The database is empty please upload the music"
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

function getGenre(music){
    
}

module.exports = {
    recommandation,
    musicPlay,
    sendMusic,
    addPreference,
    getGenre
}