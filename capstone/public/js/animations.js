var play_button = document.getElementById("play-button");
var note_one = document.getElementById("note_whole");
var santa = document.getElementById("santa");

//note_one.style.opacity="0";

play_button.addEventListener("click", function(){
    note_one.style.animation="music 1.5s infinite";

    //need to put this in conditional for when 'christmas' is selected
    santa.style.opacity="1";
 });