let timer;
let timeRemaining = 10;

//Timer counts down until it hits zero or the function is called again
function resetTimer(seconds) {
    timeRemaining = seconds;
    clearInterval(timer);
    timer = setInterval(function(){
        timeRemaining--;
        console.log(timeRemaining);
        if(timeRemaining === 0) {
            clearInterval(timer);
            updateLyrics();
        }
    }, 1000);
}