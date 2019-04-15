/* eslint-disable */
var classname = document.getElementsByClassName('btn-outline-success');
Array.from(classname).forEach(function(element) {
  element.addEventListener('click', function() {
    window.location.href = 'music_play.html';
  });
});


var emotions=[sessionStorage.getItem('emotion1'), sessionStorage.getItem('emotion2'),sessionStorage.getItem('emotion3')];
console.log(JSON.stringify(emotions));
