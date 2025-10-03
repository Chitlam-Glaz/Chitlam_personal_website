var title = document.querySelector("h1");
title.innerHTML = "This is another title from js.code";

//fetch the button from the DOM
var button = document.querySelector("#cv");

//attach and event when the user clicks it
button.addEventListener("click", myfunction);

//create 
function myfunction(){
    alert("Let me tell you more about myself!")
}