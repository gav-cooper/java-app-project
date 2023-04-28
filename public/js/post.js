"use strict"

// const { likePost } = require("../../Controllers/musicController");

// const e = require("express");


// const likePost = document.getElementById("likePost")

    // var clicked = document.querySelector(".likePost");
    // if (clicked.style.filter == "hue-rotate(180deg)"){
    //     clicked.style.filter = "hue-rotate(0deg)"
    // } else {
    //     clicked.style.filter = "hue-rotate(180deg)"
    // }

// // @whoami9613
function buttonColor(){
    
    var clicked = document.querySelector("img[src='./images/heart.png]'");
    if (clicked.style.filter == "hue-rotate(180deg)"){
        clicked.style.filter = "hue-rotate(0deg)"
    } else {
        clicked.style.filter = "hue-rotate(180deg)"
    }
}

document.querySelector(".likePost").addEventListener("submit", function(event){
    event.preventDefault();
  });



// $('.likePost').on('click', function(event){
//     event.preventDefault();
//    });