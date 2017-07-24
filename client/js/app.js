// VISUALIZER

var MicrophoneAudioSource = function() {
  var self = this;
  this.volume = 0;
  this.streamData = new Uint8Array(128);
  var analyser;

  var sampleAudioStream = function() {
    analyser.getByteFrequencyData(self.streamData);
    // calculate an overall volume value
    var total = 0;
    for(var i in self.streamData) {
      total += self.streamData[i];
    }
    self.volume = total;
  };

  // get the input stream from the microphone
  navigator.getMedia = (
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  );
  navigator.getMedia ( { audio: true }, function (stream) {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext);
    var mic = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    mic.connect(analyser);
    setInterval(sampleAudioStream, 20);
  }, function(){ alert("error getting microphone input."); });
};

var SoundCloudAudioSource = function(player) {
  var self = this;
  var analyser;
  var audioCtx = new (window.AudioContext || window.webkitAudioContext);

  // Create and tune analyser to pickup only decibels we're interested in, and to reduce the
  // amount of smoothing between analysis frames (or bins)
  analyser = audioCtx.createAnalyser();
  analyser.minDecibels = -65;
  analyser.smoothingTimeConstant = .5;

  // Ensure the player doesn't run into issues with CORS
  player.crossOrigin = "anonymous";

  var source = audioCtx.createMediaElementSource(player);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  var sampleAudioStream = function() {
    analyser.getByteFrequencyData(self.streamData);
    // calculate an overall volume value
    var total = 0;
    for (var i = 0; i < 80; i++) { // get the volume from the first 80 bins, else it gets too loud with treble
      total += self.streamData[i];
    }
    self.volume = total;
  };
  setInterval(sampleAudioStream, 20);
  // public properties and methods
  this.volume = 0;
  this.streamData = new Uint8Array(128);
  this.playStream = function(streamUrl) {
    // get the input stream from the audio element
    player.addEventListener('ended', function(){
      self.directStream('coasting');
    });
    player.setAttribute('src', streamUrl);
    player.play();
  }
};

var Visualizer = function() {
  var fgCanvas;
  var fgCtx;
  var audioSource;
  var highest = 0;

  var draw = function() {
    fgCtx.clearRect(0, 0, fgCanvas.width, fgCanvas.height);
    drawSquares();
    requestAnimationFrame(draw);
  };

  var drawSquares = function() {
    var numSquares = 50;
    var squareSizeX = fgCanvas.width / numSquares;
    var squareSizeY = fgCanvas.height / numSquares;

    // Find loudest sample in current frame
    audioSource.streamData.forEach(function(val) {
      if (val > highest) {
        highest = val;
      }
    });

    // Fizzle if there isn't significant frequency data
    if (highest < 1) return;

    // Build squares on x & y axes
    for (var x = 0; x < numSquares; x++) {
      for (var y = 0; y < numSquares; y++) {

        // Store top-left coord pair for current square
        var topLeft = { x: x * squareSizeX, y: y * squareSizeY };

        // Calculate alpha of current square based on freq data
        // This attempts to scale & display the freq data per the horiz pos of square
        var alpha = audioSource.streamData[Math.round(
          (x / numSquares) * audioSource.streamData.length
        )] / highest;

        // Square styles
        fgCtx.lineWidth = 2;
        fgCtx.strokeStyle = 'rgba(' + 255 + ', ' + 255 + ', ' + 255 + ', ' + alpha + ')';

        // Begin square
        fgCtx.beginPath();

        // Top left
        fgCtx.moveTo(topLeft.x, topLeft.y);

        // Top right
        fgCtx.lineTo(topLeft.x + squareSizeX, topLeft.y);

        // Bottom right
        fgCtx.lineTo(topLeft.x + squareSizeX, topLeft.y + squareSizeY);

        // Bottom left
        fgCtx.lineTo(topLeft.x, topLeft.y + squareSizeY);

        // Top left
        fgCtx.lineTo(topLeft.x, topLeft.y);

        // Draw square
        fgCtx.closePath();
        fgCtx.stroke();
      }
    }
  };

  var resizeCanvas = function() {
    if (fgCanvas) {
      fgCanvas.width = window.innerWidth;
      fgCanvas.height = window.innerHeight;
    }
  };

  this.init = function(options) {
    audioSource = options.audioSource;
    var container = document.getElementById(options.containerId);

    // foreground hexagons layer
    fgCanvas = document.createElement('canvas');
    fgCanvas.setAttribute('style', 'position: absolute; z-index: 10');
    fgCtx = fgCanvas.getContext("2d");
    container.appendChild(fgCanvas);

    resizeCanvas();
    draw();

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
  };
};

/**
* Makes a request to the Soundcloud API and returns the JSON data.
*/
var SoundcloudLoader = function(player,uiUpdater) {
  var self = this;
  var client_id = "895695f1e584f8c793a31dde0ffd33e4"; // to get an ID go to http://developers.soundcloud.com/
  this.sound = {};
  this.streamUrl = "";
  this.errorMessage = "";
  this.player = player;
  this.uiUpdater = uiUpdater;

  /**
  * Loads the JSON stream data object from the URL of the track (as given in the location bar of the browser when browsing Soundcloud),
  * and on success it calls the callback passed to it (for example, used to then send the stream_url to the audiosource object).
  * @param track_url
  * @param callback
  */
  this.loadStream = function(track_url, successCallback, errorCallback) {
    SC.initialize({
      client_id: client_id
    });
    SC.get('/resolve', { url: track_url }, function(sound) {
      if (sound.errors) {
        self.errorMessage = "";
        for (var i = 0; i < sound.errors.length; i++) {
          self.errorMessage += sound.errors[i].error_message + '<br>';
        }
        self.errorMessage += 'Make sure the URL has the correct format: https://soundcloud.com/user/title-of-the-track';
        errorCallback();
      } else {

        if(sound.kind=="playlist"){
          self.sound = sound;
          self.streamPlaylistIndex = 0;
          self.streamUrl = function(){
            return sound.tracks[self.streamPlaylistIndex].stream_url + '?client_id=' + client_id;
          };
          successCallback();
        }else{
          self.sound = sound;
          self.streamUrl = function(){ return sound.stream_url + '?client_id=' + client_id; };
          successCallback();
        }
      }
    });
  };


  this.directStream = function(direction){
    if(direction=='toggle'){
      if (this.player.paused) {
        this.player.play();
      } else {
        this.player.pause();
      }
    }
    else if(this.sound.kind=="playlist"){
      if(direction=='coasting') {
        this.streamPlaylistIndex++;
      }else if(direction=='forward') {
        if(this.streamPlaylistIndex>=this.sound.track_count-1) this.streamPlaylistIndex = 0;
        else this.streamPlaylistIndex++;
      }else{
        if(this.streamPlaylistIndex<=0) this.streamPlaylistIndex = this.sound.track_count-1;
        else this.streamPlaylistIndex--;
      }
      if(this.streamPlaylistIndex>=0 && this.streamPlaylistIndex<=this.sound.track_count-1) {
        this.player.setAttribute('src',this.streamUrl());
        this.uiUpdater.update(this);
        this.player.play();
      }
    }
  }


};

/**
* Class to update the UI when a new sound is loaded
* @constructor
*/
var UiUpdater = function() {
  var controlPanel = document.getElementById('controlPanel');
  var trackInfoPanel = document.getElementById('trackInfoPanel');
  var infoImage = document.getElementById('infoImage');
  var infoArtist = document.getElementById('infoArtist');
  var infoTrack = document.getElementById('infoTrack');
  var messageBox = document.getElementById('messageBox');

  this.clearInfoPanel = function() {
    // first clear the current contents
    infoArtist.innerHTML = "";
    infoTrack.innerHTML = "";
    trackInfoPanel.className = 'hidden';
  };
  this.update = function(loader) {
    // update the track and artist into in the controlPanel
    var artistLink = document.createElement('a');
    artistLink.setAttribute('href', loader.sound.user.permalink_url);
    artistLink.innerHTML = loader.sound.user.username;
    var trackLink = document.createElement('a');
    trackLink.setAttribute('href', loader.sound.permalink_url);

    if(loader.sound.kind=="playlist"){
      trackLink.innerHTML = "<p>" + loader.sound.tracks[loader.streamPlaylistIndex].title + "</p>" + "<p>"+loader.sound.title+"</p>";
    }else{
      trackLink.innerHTML = loader.sound.title;
    }

    var image = loader.sound.artwork_url ? loader.sound.artwork_url : loader.sound.user.avatar_url; // if no track artwork exists, use the user's avatar.
    infoImage.setAttribute('src', image);

    infoArtist.innerHTML = '';
    infoArtist.appendChild(artistLink);

    infoTrack.innerHTML = '';
    infoTrack.appendChild(trackLink);

    // display the track info panel
    trackInfoPanel.className = '';

    // add a hash to the URL so it can be shared or saved
    var trackToken = loader.sound.permalink_url.substr(22);
    window.location = '#' + trackToken;
  };
  this.toggleControlPanel = function() {
    if (controlPanel.className.indexOf('hidden') === 0) {
      controlPanel.className = '';
    } else {
      controlPanel.className = 'hidden';
    }
  };
  this.displayMessage = function(title, message) {
    messageBox.innerHTML = ''; // reset the contents

    var titleElement = document.createElement('h3');
    titleElement.innerHTML = title;

    var messageElement = document.createElement('p');
    messageElement.innerHTML = message;

    var closeButton = document.createElement('a');
    closeButton.setAttribute('href', '#');
    closeButton.innerHTML = 'close';
    closeButton.addEventListener('click', function(e) {
      e.preventDefault();
      messageBox.className = 'hidden';
    });

    messageBox.className = '';
    // stick them into the container div
    messageBox.appendChild(titleElement);
    messageBox.appendChild(messageElement);
    messageBox.appendChild(closeButton);
  };
};

window.onload = function init() {

  var visualizer = new Visualizer();
  var player =  document.getElementById('player');
  var uiUpdater = new UiUpdater();
  var loader = new SoundcloudLoader(player,uiUpdater);

  var audioSource = new SoundCloudAudioSource(player);
  var form = document.getElementById('form');
  var loadAndUpdate = function(trackUrl) {
    loader.loadStream(trackUrl,
      function() {
        uiUpdater.clearInfoPanel();
        audioSource.playStream(loader.streamUrl());
        uiUpdater.update(loader);
        setTimeout(uiUpdater.toggleControlPanel, 3000); // auto-hide the control panel
      },
      function() {
        uiUpdater.displayMessage("Error", loader.errorMessage);
      });
    };

    visualizer.init({
      containerId: 'visualizer',
      audioSource: audioSource
    });


    uiUpdater.toggleControlPanel();
    // on load, check to see if there is a track token in the URL, and if so, load that automatically
    if (window.location.hash) {
      var trackUrl = 'https://soundcloud.com/' + window.location.hash.substr(1);
      loadAndUpdate(trackUrl);
    }

    // handle the form submit event to load the new URL
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var trackUrl = document.getElementById('input').value;
      loadAndUpdate(trackUrl);
    });

    var loadButtons = [
      document.getElementById('debug-song-load-one'),
      document.getElementById('debug-song-load-two'),
      document.getElementById('debug-song-load-three')
    ];
    loadButtons.forEach(function(btn, index, allButtons) {
      btn.addEventListener('click', function(e) {
        document.getElementById('input').value = e.target.dataset.src;
        loadAndUpdate(e.target.dataset.src);
      });
    })

    var toggleButton = document.getElementById('toggleButton')
    toggleButton.addEventListener('click', function(e) {
      e.preventDefault();
      uiUpdater.toggleControlPanel();
    });

    var aboutButton = document.getElementById('credit');
    aboutButton.addEventListener('click', function(e) {
      e.preventDefault();
      var message = document.getElementById('info').innerHTML;
      uiUpdater.displayMessage("About", message);
    });

    window.addEventListener("keydown", keyControls, false);

    function keyControls(e) {
      switch(e.keyCode) {
        case 32:
        // spacebar pressed
        loader.directStream('toggle');
        break;
        case 37:
        // left key pressed
        loader.directStream('backward');
        break;
        case 39:
        // right key pressed
        loader.directStream('forward');
        break;
      }
    }


  };
=======
'use strict';

var ready = require('document-ready');
// var socket = require('socket.io-client');

var app = {
	init() {
		console.log('init');
	}
};

ready(function () {
	app.init();
});
