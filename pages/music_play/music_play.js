/* eslint-disable */
$(function() {
  $("#card-body-image").append('<img class="img-fluid pad" style="width:100%;" src='+sessionStorage.getItem("song-img")+' alt="Photo">');
  $("#album-art").append('<img src="https://s3.us-east-2.amazonaws.com/color-and-sound/disk.jpg"'+' class="active" id="_1"><div id="buffer-box">Buffering ...</div>');
  let counter = 0;
  let player = "";
  var playerTrack = $("#player-track"),
    bgArtwork = $('#bg-artwork'),
    bgArtworkUrl, albumName = $('#album-name'),
    trackName = $('#track-name'),
    albumArt = $('#album-art'),
    sArea = $('#s-area'),
    seekBar = $('#seek-bar'),
    trackTime = $('#track-time'),
    insTime = $('#ins-time'),
    sHover = $('#s-hover'),
    playPauseButton = $("#play-pause-button"),
    i = playPauseButton.find('i'),
    tProgress = $('#current-time'),
    tTime = $('#track-length'),
    seekT, seekLoc, seekBarPos, cM, ctMinutes, ctSeconds, curMinutes, curSeconds, durMinutes, durSeconds, playProgress, bTime, nTime = 0,
    buffInterval = null,
    tFlag = false,
    albums = [sessionStorage.getItem("playSongName")],
    trackNames = [sessionStorage.getItem("playSongArtist")],
    albumArtworks = ['_1'],
    trackUrl = ['http://k003.kiwi6.com/hotlink/hshjwmwndw/2.mp3'],
    currIndex = -1;


  window.onSpotifyWebPlaybackSDKReady = () => {
    const token = sessionStorage.getItem("token");
    player = new Spotify.Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(token); }
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });

    // Ready
    player.addListener('ready', () => {
      play({
        playerInstance: player,
        spotify_uri: sessionStorage.getItem("playSongUri"),
      });

      player.pause().then(() => {
        player.resume().then(()=>{
          playPause();
        });
      });
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();


  };

  const play = ({
                  spotify_uri,
                  playerInstance: {
                    _options: {
                      getOAuthToken,
                      id
                    }
                  }
                }) => {
    getOAuthToken(access_token => {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [spotify_uri] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      });
    });
  };

  function playPause()
  {
    console.log("play pause is triggered");
    setTimeout(function()
    {
      if(audio.paused)
      {
        playerTrack.addClass('active');
        albumArt.addClass('active');
        checkBuffering();
        i.attr('class','fas fa-pause');
        audio.volume = 0;
        audio.play();
      }
      else
      {
        playerTrack.removeClass('active');
        albumArt.removeClass('active');
        clearInterval(buffInterval);
        albumArt.removeClass('buffering');
        i.attr('class','fas fa-play');
        audio.pause();
      }
      if(counter > 0){
        player.togglePlay().then(() => {
          console.log('Toggled playback!');
        });
      }
      counter++;
    },300);
  }


  function showHover(event)
  {
    seekBarPos = sArea.offset();
    seekT = event.clientX - seekBarPos.left;
    seekLoc = audio.duration * (seekT / sArea.outerWidth());

    sHover.width(seekT);

    cM = seekLoc / 60;

    ctMinutes = Math.floor(cM);
    ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

    if( (ctMinutes < 0) || (ctSeconds < 0) )
      return;

    if( (ctMinutes < 0) || (ctSeconds < 0) )
      return;

    if(ctMinutes < 10)
      ctMinutes = '0'+ctMinutes;
    if(ctSeconds < 10)
      ctSeconds = '0'+ctSeconds;

    if( isNaN(ctMinutes) || isNaN(ctSeconds) )
      insTime.text('--:--');
    else
      insTime.text(ctMinutes+':'+ctSeconds);

    insTime.css({'left':seekT,'margin-left':'-21px'}).fadeIn(0);

  }

  function hideHover()
  {
    sHover.width(0);
    insTime.text('00:00').css({'left':'0px','margin-left':'0px'}).fadeOut(0);
  }

  function playFromClickedPos()
  {
    audio.currentTime = seekLoc;
    seekBar.width(seekT);
    hideHover();
  }

  function updateCurrTime()
  {
    nTime = new Date();
    nTime = nTime.getTime();

    if( !tFlag )
    {
      tFlag = true;
      trackTime.addClass('active');
    }

    curMinutes = Math.floor(audio.currentTime / 60);
    curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

    durMinutes = Math.floor(audio.duration / 60);
    durSeconds = Math.floor(audio.duration - durMinutes * 60);

    playProgress = (audio.currentTime / audio.duration) * 100;

    if(curMinutes < 10)
      curMinutes = '0'+curMinutes;
    if(curSeconds < 10)
      curSeconds = '0'+curSeconds;

    if(durMinutes < 10)
      durMinutes = '0'+durMinutes;
    if(durSeconds < 10)
      durSeconds = '0'+durSeconds;

    if( isNaN(curMinutes) || isNaN(curSeconds) )
      tProgress.text('00:00');
    else
      tProgress.text(curMinutes+':'+curSeconds);

    if( isNaN(durMinutes) || isNaN(durSeconds) )
      tTime.text('00:00');
    else
      tTime.text(durMinutes+':'+durSeconds);

    if( isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds) )
      trackTime.removeClass('active');
    else
      trackTime.addClass('active');


    seekBar.width(playProgress+'%');

    if( playProgress == 100 )
    {
      i.attr('class','fa fa-play');
      seekBar.width(0);
      tProgress.text('00:00');
      albumArt.removeClass('buffering').removeClass('active');
      clearInterval(buffInterval);
    }
  }

  function checkBuffering()
  {
    clearInterval(buffInterval);
    buffInterval = setInterval(function()
    {
      if( (nTime == 0) || (bTime - nTime) > 1000  )
        albumArt.addClass('buffering');
      else
        albumArt.removeClass('buffering');

      bTime = new Date();
      bTime = bTime.getTime();

    },100);
  }

  function selectTrack(flag)
  {
    if( flag == 0 || flag == 1 )
      ++currIndex;
    else
      --currIndex;

    if( (currIndex > -1) && (currIndex < albumArtworks.length) )
    {
      if( flag == 0 )
        i.attr('class','fa fa-play');
      else
      {
        albumArt.removeClass('buffering');
        i.attr('class','fa fa-pause');
      }

      seekBar.width(0);
      trackTime.removeClass('active');
      tProgress.text('00:00');
      tTime.text('00:00');

      currAlbum = albums[currIndex];
      currTrackName = trackNames[currIndex];
      currArtwork = albumArtworks[currIndex];

      audio.src = trackUrl[currIndex];

      nTime = 0;
      bTime = new Date();
      bTime = bTime.getTime();

      if(flag != 0)
      {
        audio.play();
        playerTrack.addClass('active');
        albumArt.addClass('active');

        clearInterval(buffInterval);
        checkBuffering();
      }

      albumName.text(currAlbum);
      trackName.text(currTrackName);
      albumArt.find('img.active').removeClass('active');
      $('#'+currArtwork).addClass('active');

      bgArtworkUrl = $('#'+currArtwork).attr('src');

      bgArtwork.css({'background-image':'url('+bgArtworkUrl+')'});
    }
    else
    {
      if( flag == 0 || flag == 1 )
        --currIndex;
      else
        ++currIndex;
    }
  }

  function initPlayer()
  {
    audio = new Audio();

    selectTrack(0);

    audio.loop = false;

    playPauseButton.on('click',playPause);

    sArea.mousemove(function(event){ showHover(event); });

    sArea.mouseout(hideHover);

    sArea.on('click',playFromClickedPos);

    $(audio).on('timeupdate',updateCurrTime);

    // playPreviousTrackButton.on('click',function(){ selectTrack(-1);} );
    // playNextTrackButton.on('click',function(){ selectTrack(1);});
  }

  initPlayer();
});

document.getElementById('shareMusic').addEventListener('click', function() {
  const now = new Date();
  var param = {
    data: {
      useremail:  sessionStorage.getItem('login_user'),
      songuri: sessionStorage.getItem("playSongUri"),
      artistname: sessionStorage.getItem("playSongArtist"),
      songname: sessionStorage.getItem("playSongName"),
      s3url: sessionStorage.getItem("song-img"),
      time: now.getTime()+""
    }
  };
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://46sekle1gj.execute-api.us-east-2.amazonaws.com/firstStage/channel");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function (event) {
    var data = JSON.parse(xhr.response);
    console.log(data);
    alert("Share success! Redirect to Channel :D");
    window.location.href = '../public_channel/public_channel.html';

  };
  xhr.send(JSON.stringify(param));

});
