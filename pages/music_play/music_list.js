/* eslint-disable */
(function() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://46sekle1gj.execute-api.us-east-2.amazonaws.com/firstStage/search?mood="+sessionStorage.getItem("emotion1"));
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function (event) {
    var data = JSON.parse(xhr.response);
    // var clientCode = data.token;
    // sessionStorage.setItem("token",clientCode);
    data = data.playlist;
    for(var index in data){
      var songInfo = data[index];
      var newRow = '<tr><td>'+(index+1)+'</td><td>'+songInfo.songname+'</td><td>'+songInfo.artistname+'</td><td><button type="button" id='+index+' class="btn btn-block btn-outline-success btn-sm">Listen</button></td></tr>';
      $("#table-songs").append(newRow);
    }
    var classname = document.getElementsByClassName('btn-outline-success');
    Array.from(classname).forEach(function(element) {
      element.addEventListener('click', function() {
        var index = element.getAttribute("id");
        sessionStorage.setItem("playSongUri", data[index].songuri);
        sessionStorage.setItem("playSongName", data[index].songname);
        sessionStorage.setItem("playSongArtist", data[index].artistname);
        window.location.href = 'music_play.html';
      });
    });

  };
  xhr.send();
}());
