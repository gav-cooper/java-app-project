"use strict"

// const e = require("express");

function buttonColor(){
    var clicked = document.getElementById("heart");
    if (clicked.style.filter == "hue-rotate(180deg)"){
        clicked.style.filter = "hue-rotate(0deg)"
    } else {
        clicked.style.filter = "hue-rotate(180deg)"
    }
}

