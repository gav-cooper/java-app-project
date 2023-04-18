"use strict";

const db = require("./db");

function getUserByUsername(user){
    const sql = 'SELECT * FROM Users WHERE username=@user';
    const stmt = db.prepare(sql);
    const record = stmt.get({
        user
    });
    return record;
}

// work little bit wrong
function getPreferenceRock(userID){
    const sql = `SELECT rock FROM Preferences WHERE userID = @userID`;
    const stmt = db.prepare(sql);
    const record = stmt.get({userID});
    console.log(record)
    return record;
}

function getPreferenceHiphop(userID){
    const sql = `SELECT hiphop FROM Preferences WHERE userID = @userID`;
    const stmt = db.prepare(sql);
    const record = stmt.get({userID});
    return record;
}

function getPreferenceClassic(userID){
    const sql = `SELECT classic FROM Preferences WHERE userID = @userID`;
    const stmt = db.prepare(sql);
    const record = stmt.get({userID});
    return record;
}

function recommandation (user){
    // to get the number of the user like
    const userInfo = getUserByUsername(user);
    
    // to get the number of preference
    let getRock = getPreferenceRock(userInfo.userID);
    let getHiphop = getPreferenceHiphop(userInfo.userID);
    let getClassic = getPreferenceClassic(userInfo.userID);

    console.log(getRock)

    // to set number in average
    if(getRock == undefined){
        getRock = 1;
    }
    if(getHiphop == undefined){
        getHiphop = 1;
    }
    if(getClassic == undefined){
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

async function addPreference(user, genre, value){
    const userID = getUserByUsername(user);

    const sql = `
                SELECT @genre FROM Preferences WHERE userID = @userID
                `;
    const stmt2 = db.prepare(sql);
    let like = stmt2.get({genre, userID})

    like = like + value;

    let sql1;
    if(genre = "rock"){
        sql1 = `
                UPDATE Preferences SET rock = @like 
                WHERE userID = @userID
                `;
    }
    else if(genre = "hiphop"){
        sql1 = `
                UPDATE Preferences SET hiphop = @like 
                WHERE userID = @userID
                `;
    }
    else if(genre = "classic"){
        sql1 = `
                UPDATE Preferences SET classic = @like 
                WHERE userID = @userID
                `;
    }

    const stmt3 = db.prepare(sql1);

    try {
        stmt3.run({
            userID,
            like
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

function getGenre(music){
    const sql = `SELECT genre FROM Music WHERE originalName = @music`
    const stmt = db.prepare(sql);
    const result = stmt.get({
        music
    })
    return result;
}

module.exports = {
    recommandation,
    musicPlay,
    sendMusic,
    addPreference,
    getGenre
}