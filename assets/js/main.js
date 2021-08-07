let timer;
let timeRemaining;

let score = 0;

//All of these are temp variables until we fetch the data
let genreBtns = document.querySelectorAll('.answers');
let correctGenre = 'Country';

//Gets highscores from local storage or makes an empty array
let highScores = JSON.parse(localStorage.getItem("highscores") || "[]");

genreBtns.forEach(genre => {
    genre.addEventListener('click', () => {
        if(genre.textContent === correctGenre) {
            //If the answer is correct then the user gets 10 points
            console.log('Correct Answer');
            score += 10;
            updateLyrics();
        } else {
            //If it is wrong then the lyrics update and the game moves on without awarding points
            console.log('Wrong Answer');
            timeRemaining -= 5;
        }
    })
});

//Changes the lyrics when the user inputs an answer or time runs out
function updateLyrics() {
    console.log('Change lyrics');
    resetTimer(20);
}
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

//Sets highscore to an array of objects with names and scores.
function setHighScore(name, score) {
    highScores.push({
        name: name,
        score: score
    });
    localStorage.setItem('highscores', JSON.stringify(highScores));
}
