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
//Data for the actual fetch request
let url = 'https://api.musixmatch.com/ws/1.1/';
let format = '?format=json';
let fetchGenre = 'music.genres.get';
let apiKey = '&apikey=16c39b57637be8d9dd6b64b98dfdae10'

//Genre ids and names that can be changed/used outside of the fetch request for html elements
let genres = [{
    name: 'Rock',
    id: 3
}, {
    name: 'Rock',
    id: 11
},{
    name: 'Country',
    id: 1037
},{
    name: 'Hip Hop',
    id: 18
}];

//Picks a random genre to fetch
let randomGenre = genres[Math.floor(Math.random() * genres.length)]

let trackId;

//Fetches the entire music genre list
fetch(url + fetchGenre + format + apiKey).then(function(response) {
    return response.json();
}).then(function(data) {
    console.log(data.message.body.music_genre_list);
    //Assigns genre button elements to a genre name
    for(var i = 0; i < genreBtns.length; i++) {
        genreBtns[i].childNodes[3].textContent = genres[i].name;
    }
    let genreArr = [];
    //Loops through the music genres and finds the genres based on the genres array's ids
    for(var i = 0; i < data.message.body.music_genre_list.length; i++) {
        switch (data.message.body.music_genre_list[i].music_genre.music_genre_id) {
            case genres[0].id:
                genreArr.push(data.message.body.music_genre_list[i].music_genre);
                break;
            case genres[1].id:
                genreArr.push(data.message.body.music_genre_list[i].music_genre);
                break;
            case genres[2].id:
                genreArr.push(data.message.body.music_genre_list[i].music_genre);
                break;
            case genres[3].id:
                genreArr.push(data.message.body.music_genre_list[i].music_genre);
                break;
        }
    }

    let filterGenres = '&f_music_genre_id=' + randomGenre.id;
    //fetches 10 tracks from one of the four genres
    fetch(url + 'track.search' + format + filterGenres + apiKey).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data.message.body.track_list[0]);
        //loops through the tracks to find a song with lyrics
        for(var i = 0; i < data.message.body.track_list.length; i++) {
            if(data.message.body.track_list[i].track.has_lyrics === 1) {
                trackId = data.message.body.track_list[i].track.track_id;
            }
        }
        //fetches a snippet from the track with lyrics
        fetch(url + 'track.snippet.get' + format + '&track_id=' + trackId + apiKey).then(function(response) {
            return response.json()
        }).then(function(data) {
            console.log(data.message.body);
            questionEl.textContent = data.message.body.snippet.snippet_body;
        })
    })
})

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