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
function getPreference(userID){
    const sql = `SELECT * FROM Preferences WHERE userID = @userID`;
    const stmt = db.prepare(sql);
    const record = stmt.get({userID});
    return record;
}


function  updateValue(userID, rock, hiphop, classic){
    const sql = `INSERT INTO Preferences
                    (userID, rock, hiphop, classic)
                 VALUES
                    (@userID, @rock, @hiphop, @classic)
                    `;
    //const sql = `SELECT * FROM Preferences`
    const stmt = db.prepare(sql);

    try {
        stmt.run({
            "userID":userID,
            "rock":rock,
            "hiphop":hiphop,
            "classic":classic
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }

}

function recommandation (user){
    // to get the number of the user like
    const userInfo = getUserByUsername(user);
    
    // to get the number of preference
    let getPreferenceOfUser = getPreference(userInfo.userID);

    let getRock, getHiphop, getClassic;

    // to set number in average
    if(getPreferenceOfUser.rock == undefined || 
       getPreferenceOfUser.hiphop == undefined || 
       getPreferenceOfUser.classic == undefined){
        const value = 5;
        getRock = value;
        getHiphop = value;
        getClassic = value;
        updateValue(userInfo.userID, value, value, value);
    }
    else{
        getRock = getPreferenceOfUser.rock;
        getHiphop = getPreferenceOfUser.hiphop;
        getClassic = getPreferenceOfUser.classic;
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


function addPreference(userID, genre, value){
    const sql = 'SELECT * FROM Preferences WHERE userID = @userID'
    const stmt2 = db.prepare(sql);
    let like = stmt2.get({genre, userID});
    let number = 0;

    if(genre = "rock"){
        number = like.rock;
    }
    else if(genre = "hiphop"){
        number = like.hiphop;
    }
    else if(genre = "classic"){
        number = like.classic;
    }

    if(number + value - 3 < 0){
        like = 1;
    }
    else{
        like = number + value - 3;
    }
    

    console.log(like);

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