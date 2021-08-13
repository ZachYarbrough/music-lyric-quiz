// Initialize variables and constants
let timer;
let timeRemaining;

let score = 0;

//Gets highscores from local storage or makes an empty array
let highScores = JSON.parse(localStorage.getItem("highscores") || "[]");
let timeEl = document.querySelector('#timerEl');
let scoreEl = document.querySelector('#pointsEl');
let highScoreNameEl = document.querySelectorAll('.highscore');
let highScoreScoreEl = document.querySelectorAll('.scores');

let finalScore = document.querySelector('#pointsEl');
let username = document.querySelector('#username');
let saveBtn = document.querySelector('#saveScoreBtn');

//Data for the actual fetch request
//let cors = 'https://cors-anywhere.herokuapp.com/';
let cors = 'https://api.allorigins.win/get?raw&url='
let url = 'https://api.musixmatch.com/ws/1.1/';
let fetchGenre = 'music.genres.get';
let apiKey = 'apikey=16c39b57637be8d9dd6b64b98dfdae10';

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

//All of these are temp variables until we fetch the data
let genreBtns = document.querySelectorAll('.answers');
let correctGenre;

let genreStart = document.querySelector('#genreSelector');

let questionCap = 0;
let usedLyrics = [];

if(timeEl) {
    //Fetches the entire music genre list
fetch(cors + encodeURIComponent(url + fetchGenre + '?' + apiKey)).then(function(response) {
    return response.json();
}).then(function(data) {
    let jsonData = JSON.parse(data.contents);
    //Assigns genre button elements to a genre name
    for(var i = 0; i < genreBtns.length; i++) {
        genreBtns[i].childNodes[3].textContent = genres[i].name;
    }
    let genreArr = [];
    //Loops through the music genres and finds the genres based on the genres array's ids
    for(var i = 0; i < jsonData.message.body.music_genre_list.length; i++) {
        switch (jsonData.message.body.music_genre_list[i].music_genre.music_genre_id) {
            case genres[0].id:
                genreArr.push(jsonData.message.body.music_genre_list[i].music_genre);
                break;
            case genres[1].id:
                genreArr.push(jsonData.message.body.music_genre_list[i].music_genre);
                break;
            case genres[2].id:
                genreArr.push(jsonData.message.body.music_genre_list[i].music_genre);
                break;
            case genres[3].id:
                genreArr.push(jsonData.message.body.music_genre_list[i].music_genre);
                break;
        }
    }
    for(var i = 0; i < genres.length; i++) {

        let filterGenres = '&f_music_genre_id=' + genres[i].id;

        //fetches tracks from one of the four genres
        fetch(cors + encodeURIComponent(url + 'track.search' + filterGenres + '&f_lyrics_language=en&f_has_lyrics=1' + '&' + apiKey)).then(function(response) {
            return response.json();
        }).then(function(data) {
            let jsonData = JSON.parse(data.contents);
            //loops through the tracks to find a song with lyrics
            for(var j = 0; j < jsonData.message.body.track_list.length; j++) {
                if(jsonData.message.body.track_list[j].track.has_lyrics === 1) {
                    trackId = jsonData.message.body.track_list[j].track.track_id;
                    storedTracks.push(jsonData.message.body.track_list[j]);
                }
            }
            updateLyrics();
        })
    }
})
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

} else if(username) {
    console.log(questionCap)
    finalScore.childNodes[1].textContent = JSON.parse(localStorage.getItem('currScore'));
    displayGif(JSON.parse(localStorage.getItem('currScore')))
    username.addEventListener('keyup', () => {
        saveBtn.disabled = !username.value;
    });
    saveBtn.addEventListener('click', (event)=> {
        event.preventDefault();
        setHighScore(username.value, finalScore.childNodes[1].textContent);
        window.location.assign('../high-scores.html/high-scores.html')
    })
} else if(highScoreNameEl) {
    sortLeaderboard();
    displayHighScore();
}

function displayGif(totalScore){
    let gifEl = document.querySelector('#pointsEl');
    let gifImg = document.createElement('img');
    if(totalScore >= 70) {
        fetch('https://api.giphy.com/v1/gifs/search?q=victory&api_key=HvaacROi9w5oQCDYHSIk42eiDSIXH3FN').then(function(response) {
            return response.json();
        }).then(function(data) {
            gifImg.setAttribute('src', data.data[Math.floor(Math.random()*data.data.length)].images.fixed_height.url);
        });
    } else if(totalScore >= 50 && totalScore < 70) {
        fetch('https://api.giphy.com/v1/gifs/search?q=good&api_key=HvaacROi9w5oQCDYHSIk42eiDSIXH3FN').then(function(response) {
            return response.json();
        }).then(function(data) {
            gifImg.setAttribute('src', data.data[Math.floor(Math.random()*data.data.length)].images.fixed_height.url);
        });
    } else if (totalScore >= 0 && totalScore < 50) {
        fetch('https://api.giphy.com/v1/gifs/search?q=defeat&api_key=HvaacROi9w5oQCDYHSIk42eiDSIXH3FN').then(function(response) {
            return response.json();
        }).then(function(data) {
            gifImg.setAttribute('src', data.data[Math.floor(Math.random()*data.data.length)].images.fixed_height.url);
        });
    }
    gifEl.append(gifImg);
}

//Changes the lyrics when the user inputs an answer or time runs out
function updateLyrics() {
    if(questionCap >= 11) {
        localStorage.setItem('currScore', JSON.stringify(score));
        window.location.assign('../end.html/end.html');
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
    fetch(cors + encodeURIComponent(url + 'track.snippet.get' + '?track_id=' + trackId + '&' + apiKey)).then(function(response) {
        return response.json()
    }).then(function(data) {
        let jsonData = JSON.parse(data.contents);
        for(var i = 0; i < usedLyrics.length; i++) {
            if(jsonData.message.body.snippet.snippet_body === usedLyrics[i] && jsonData.message.body.snippet.snippet_body === '') {
                return updateLyrics();
            }
        }
        questionEl.textContent = jsonData.message.body.snippet.snippet_body;
        usedLyrics.push(jsonData.message.body.snippet.snippet_body);
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