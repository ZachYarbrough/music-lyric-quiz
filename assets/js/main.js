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
//let cors = 'https://cors-anywhere.herokuapp.com/';
let url = 'https://api.musixmatch.com/ws/1.1/';
let format = '?format=json';
let fetchGenre = 'music.genres.get';
let apiKey = '&apikey=16c39b57637be8d9dd6b64b98dfdae10'

//Genre ids and names that can be changed/used outside of the fetch request for html elements
let genres = [{
    name: 'Rock',
    id: 21
}, {
    name: 'R&B/Soul',
    id: 15
},{
    name: 'Country',
    id: 6
},{
    name: 'Hip Hop/Rap',
    id: 18
}];

let trackId;

let storedTracks = [];

//Fetches the entire music genre list
fetch(url + fetchGenre + format + apiKey).then(function(response) {
    return response.json();
}).then(function(data) {
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

    for(var i = 0; i < genres.length; i++) {

        let filterGenres = '&f_music_genre_id=' + genres[i].id;

        //fetches tracks from one of the four genres
        fetch(url + 'track.search' + format + filterGenres + '&f_lyrics_language=en&f_has_lyrics=1' + apiKey).then(function(response) {
            return response.json();
        }).then(function(data) {
            //loops through the tracks to find a song with lyrics
            for(var i = 0; i < data.message.body.track_list.length; i++) {
                if(data.message.body.track_list[i].track.has_lyrics === 1) {
                    trackId = data.message.body.track_list[i].track.track_id;
                    storedTracks.push(data.message.body.track_list[i]);
                }
            }
        })
    }
})

//FETCHING DATA ENDS
//All of these are temp variables until we fetch the data
let genreBtns = document.querySelectorAll('.answers');
let correctGenre;

if(timerEl) {
    resetTimer(15);
}

//Checks if there is a timer element

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


let questionCap = 0;
let usedLyrics = [];

//Changes the lyrics when the user inputs an answer or time runs out
function updateLyrics() {
    if(questionCap >= 11) {
        console.log('Game Finished');
        return;
    }
    console.log(questionCap)
    let track = storedTracks[Math.floor(Math.random() * storedTracks.length)].track;
    let trackId = track.track_id;
    let trackGenre = track.primary_genres.music_genre_list[0].music_genre.music_genre_name;
    if(track.primary_genres.music_genre_list.length > 1) {
        for(var i = 0; i < track.primary_genres.music_genre_list.length; i++) {
            for(var j = 0; j < genres.length; j++) {
                if(track.primary_genres.music_genre_list[i].music_genre.music_genre_id === genres[j].id) {
                    trackGenre = track.primary_genres.music_genre_list[i].music_genre.music_genre_name;
                }
            }
        }
    }
    correctGenre = trackGenre;
    //fetches a snippet from the track with lyrics
    fetch(url + 'track.snippet.get' + format + '&track_id=' + trackId + apiKey).then(function(response) {
        return response.json()
    }).then(function(data) {
        for(var i = 0; i < usedLyrics.length; i++) {
            if(data.message.body.snippet.snippet_body === usedLyrics[i]) {
                console.log('repeat');
                return updateLyrics();
            }
        }
        questionEl.textContent = data.message.body.snippet.snippet_body;
        usedLyrics.push(data.message.body.snippet.snippet_body);
        resetTimer(15);
        updateScore();
        questionCap++;
    })
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
        if(timeRemaining <= 0) {
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
