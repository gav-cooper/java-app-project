"use strict";

const option = document.getElementById("choice-select");
const file_wrapper = document.querySelector(".file");

option.addEventListener("change", (event) => {
    console.log(true)
    if (event.target.value === "file") {
        document.querySelector(".link-wrapper").style.display = "None";
        document.querySelector(".file-wrapper").style.display = "flex";
    }
    if (event.target.value === "link") {
        document.querySelector(".file-wrapper").style.display = "None";
        document.querySelector(".link-wrapper").style.display = "flex";
    }
});