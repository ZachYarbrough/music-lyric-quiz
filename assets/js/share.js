//copies to clipboard
let text = 'https://zachyarbrough.github.io/music-lyric-quiz/';
let shareButtonEl = document.querySelector('#shareEl');

shareButtonEl.addEventListener('click', ()=>{
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
      }, function(err) {
        console.error('Async: Could not copy text: ', err);
      });
});