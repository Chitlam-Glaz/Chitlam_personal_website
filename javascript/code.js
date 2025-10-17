var title = document.querySelector("h1");
title.innerHTML = "This is another title from js.code";

//fetch the button from the DOM
var button = document.querySelector("#cv");

//attach and event when the user clicks it
button.addEventListener("click", myfunction);

function myfunction(){
    alert("Let me tell you more about myself!")
}

var button = document.querySelector("#welcome");

button.addEventListener("click", welcomefunction);

function welcomefunction(){
    alert("Welcome to my Personal Webpage!")
}

var mynode = document.createElement("div");

 //change basic attributes
mynode.id = "my_works";
mynode.innerHTML = "The work is exhibitions";
mynode.style.color = "blue";

//add event listener
//mynode.addEventListener("click", welcomeToWork1);
//document.querySelector("#my_works").appendChild(mynode);

//function welcomeToWork1(){
    //mynode.innerHTML = "Thank you for your interest in my work1!"
//}
