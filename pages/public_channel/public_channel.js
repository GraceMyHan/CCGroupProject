/* eslint-disable */
var channel=null;
$(function(){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://46sekle1gj.execute-api.us-east-2.amazonaws.com/firstStage/channel");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function (event) {
    var data = JSON.parse(xhr.response);
    channel=JSON.parse(data.body);
    console.log(channel);
    for(var index in channel) {
      console.log(channel[index]);
      var shareMsg = '\n' +
        '<div class="direct-chat-msg">\n' +
        '<div class="direct-chat-info clearfix">\n' +
        '<span class="direct-chat-name float-left">'+channel[index].useremail+'</span>\n' +
        '<span class="direct-chat-timestamp float-right">'+new Date(channel[index].time).toLocaleDateString("en-US")+'</span>\n' +
        '</div>\n' +
        '<img class="direct-chat-img" src="../../dist/img/user3-128x128.jpg" alt="Message User Image">\n' +
        '<div class="direct-chat-text">\n' +
        '<div class="attachment-block clearfix" style="background: transparent;border: none;">\n' +
        '<img class="attachment-img" src='+ channel[index].s3url+' alt="Attachment Image">\n' +
        '<div class="attachment-pushed">\n' +
        '<h4 class="attachment-heading">'+channel[index].songname+'</h4>\n' +
        '<div class="attachment-text">\n' +
        'Singer: '+channel[index].artistname+'<br>\n' +
        '<button type="button" class="btn btn-default btn-sm mybtn" id='+index+'><i class="fa fa-music"></i> Listen</button>' +
        '</div>\n' +
        '</div>\n' +
        '</div>\n' +
        '</div>\n' +
        '</div>';

      $("#shareBoard").append(shareMsg);

      var classname = document.getElementsByClassName('mybtn');
      Array.from(classname).forEach(function(element) {
        element.addEventListener('click', function() {
          var index = element.getAttribute("id");
          sessionStorage.setItem("playSongUri", channel[index].songuri);
          sessionStorage.setItem("playSongName", channel[index].songname);
          sessionStorage.setItem("playSongArtist", channel[index].artistname);
          sessionStorage.setItem("song-img",channel[index].s3url);
          window.location.href = '../music_play/music_play.html';
        });
      });
    }
  };
  xhr.send();

});
