// Initialize variables and constants
let timer;
let timeRemaining;
let genreRap = 18;
let genreRnB = 15;
let genreCountry = 6;
let genreRock = 21;
let score = 0;
let apiKey = "65151b10d06c1827c4ec097955298402";
let formatURL = "?format=json&callback=callback";
let hasLyrics = "&f_has_lyrics=";
let musicGenre = "&f_music_genre_id=";
let language = "&f_lyrics_language=";

//All of these are temp variables until we fetch the data
let genreBtns = document.querySelectorAll('.answers');
let correctGenre = 'Answer Option';

//Gets highscores from local storage or makes an empty array
let highScores = JSON.parse(localStorage.getItem("highscores") || "[]");
let timeEl = document.querySelector('#timerEl');
let scoreEl = document.querySelector('#pointsEl');
let highScoreNameEl = document.querySelectorAll('.highscore');
let highScoreScoreEl = document.querySelectorAll('.score');

//Checks if there is a timer element
if(timeEl) {
    resetTimer(20);
}

genreBtns.forEach(genre => {
    genre.addEventListener('click', () => {
        if(genre.childNodes[3].textContent === correctGenre) {
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
    updateScore();
}

function updateScore() {
    if(score > 100) {
        score = 100;
    }
    scoreEl.textContent = score + '/100';
}

//Timer counts down until it hits zero or the function is called again
function resetTimer(seconds) {
    timeRemaining = seconds;
    timeEl.textContent = timeRemaining;
    clearInterval(timer);
    timer = setInterval(function(){
        timeRemaining--;
        timeEl.textContent = timeRemaining;
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

//Checks if there is a highscore element
if(highScoreNameEl) {
    sortLeaderboard();
    displayHighScore();
}

//Sorts highscores based on highest scores
function sortLeaderboard() {
    let temp = 0;
    for (let i = 0; i < highScores.length; i++) {
      for (let j = i; j < highScores.length; j++) {
        if (highScores[j].score > highScores[i].score) {
          temp = highScores[j];
          highScores[j] = highScores[i];
          highScores[i] = temp;
        }
      }
    }
  }

//Displays highscores from local storage
function displayHighScore() {
    for(let i = 0; i < highScores.length; i++) {
        if(i < 5) {
            highScoreNameEl[i].textContent = highScores[i].name;
            highScoreScoreEl[i].textContent = highScores[i].score;
        }
    }
}

$.ajax({
    data: {
        apikey: apiKey,
        f_music_genre_id: 6,
        //f_lyrics_language: en,
        //f_has_lyrics: true,

    },
    url: "http://api.musixmatch.com/ws/1.1/track.get?api",
    dataType: "jsonp",
    contentType: 'application/json',
    success: function(data) {
        console.log(json);
        alert("Success");        
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
        alert(errorThrown + " " + jqXHR + " " + textStatus);
    }
});