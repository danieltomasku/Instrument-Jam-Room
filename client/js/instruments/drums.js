'use strict';

var drumFiles = [
  '/assets/drum-samples/drums-clap.wav',
  '/assets/drum-samples/drums-crash.wav',
  '/assets/drum-samples/drums-hat.wav',
  '/assets/drum-samples/drums-kick.wav'
];


bassSynthAudioBuffer = {};


var drums = {
  loadAllFiles() {
    drumFiles.map((file) => {
      this.loadSoundFile(file);
    });
  },

  loadSoundFile(file) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', document.origin + file, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
    this.initSound(this.response); // this.response is an ArrayBuffer.
    };
    xhr.send();
  },

  initSound(response) {
    console.log(response);
  }
};

module.exports = drums;

// var BassSynth = window.BassSynth = function(ctx, analyser) {
//   // Create an audio context.
//   this.ctx = ctx;
//   this.analyser = analyser;
// };

// BassSynth.loadAllFiles = function(ctx){
//   for (var key in bassSynthFiles) {
//     BassSynth.loadSoundFile(bassSynthFiles[key], key, ctx);
//   }
// }

// BassSynth.loadSoundFile = function(url, freq, ctx) {
//   var xhr = new XMLHttpRequest();
//   //http://localhost:8080 local hosting!
//   //http://whatsgroovy.herokuapp.com  heroku hosting!
//   xhr.open('GET', hostUrl + url, true);
//   xhr.responseType = 'arraybuffer';
//   xhr.onload = function(e) {
//     BassSynth.initSound(this.response, freq, ctx); // this.response is an ArrayBuffer.
//   };
//   xhr.send();
// };


// BassSynth.initSound = function(arrayBuffer, freq, ctx) {
//   ctx.decodeAudioData(arrayBuffer, function(buffer) {
//     bassSynthAudioBuffer[freq] = buffer;
//   }, function(e) {
//     console.log('Error decoding file', e);
//   });
// }

// BassSynth.prototype.updateFrequency = function(row) {
//   this.frequency = row;
// }

// BassSynth.prototype.playSound = function() {
//   // source is global so we can call .noteOff() later.
//   var now = this.ctx.currentTime;
//   var timeToPlay = (Math.floor(now/.125) + 1) * .125;
//   var gainNode = this.ctx.createGain();
//   var source = this.ctx.createBufferSource();
//   var panner = this.ctx.createPanner();
//   panner.panningModel = 'equalpower';
//   var xPan = panning['BassSynth'];
//   panner.setPosition(xPan, 0, 1 - Math.abs(xPan));
  
//   source.buffer = bassSynthAudioBuffer[this.frequency];
//   source.loop = false;

//   gainNode.gain.setTargetAtTime(instrumentGains['BassSynth'], timeToPlay, 0.01);
//   gainNode.gain.setTargetAtTime(0.0, timeToPlay + .5, 0.1);

//   source.connect(panner);
//   panner.connect(gainNode);
//   gainNode.connect(this.analyser);
//   this.analyser.connect(this.ctx.destination);

//   source.start(timeToPlay); // Play immediately.
// }
