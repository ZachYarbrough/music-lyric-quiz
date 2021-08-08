// Initialize variables and constants
let timer;
let timeRemaining;

let score = 0;

//Gets highscores from local storage or makes an empty array
let highScores = JSON.parse(localStorage.getItem("highscores") || "[]");
let timeEl = document.querySelector('#timerEl');
let scoreEl = document.querySelector('#pointsEl');
let highScoreNameEl = document.querySelectorAll('.highscore');
let highScoreScoreEl = document.querySelectorAll('.score');

//FETCHING DATA STARTS
let url = 'https://api.musixmatch.com/ws/1.1/';
let formatGenre = '?format=jsonp&callback=genreCallback';
let formatLyrics = '?format=jsonp&callback=lyricCallback';
let trackLyrics = 'music.genres.get';
let apiKey = '&apikey=65151b10d06c1827c4ec097955298402'
let genres = [{
    name: 'Orchestral',
    id: 18
}, {
    name: 'Stories',
    id: 12
},{
    name: 'Percussion',
    id: 34
},{
    name: 'Oratorio',
    id: 26
}];
let randomGenre = genres[Math.floor(Math.random() * genres.length)];
let filterGenres = '&f_music_genre_id=' + randomGenre.id;

function genreCallback (data) {
    //Loads json objects
    for(var i = 0; i < genreBtns.length; i++) {
        genreBtns[i].childNodes[3].textContent = data.message.body.music_genre_list[genres[i].id].music_genre.music_genre_name;
    }
}

function lyricCallback (data) {
    //Loads json objects
    console.log(data.message.body.track_list);
}

var genreScript =  document.createElement('script');
genreScript.src = url + trackLyrics + formatGenre + apiKey;
document.body.appendChild(genreScript);

var lyricScript =  document.createElement('script');
lyricScript.src = url + 'track.search' + formatLyrics + filterGenres + apiKey;
document.body.appendChild(lyricScript);

//FETCHING DATA ENDS

//All of these are temp variables until we fetch the data
let genreBtns = document.querySelectorAll('.answers');
let correctGenre = randomGenre.name;

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
if(highScoreNameEl > 0) {
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