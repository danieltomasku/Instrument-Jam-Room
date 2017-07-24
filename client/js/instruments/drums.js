'use strict';
var axios = require('axios');
// var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

var file = require('../../assets/drum-samples/drums-clap.wav');

console.log(file);

var drumFiles = [
  require('../../assets/drum-samples/drums-clap.wav'),
  require('../../assets/drum-samples/drums-crash.wav'),
  require('../../assets/drum-samples/drums-hat.wav'),
  require('../../assets/drum-samples/drums-kick.wav')
  // '/assets/drum-samples/simplerBear.mp3',
  // '/assets/drum-samples/drums-clap.wav',
  // '/assets/drum-samples/drums-crash.wav',
  // '/assets/drum-samples/drums-hat.wav',
  // '/assets/drum-samples/drums-kick.wav'
];

var drums = {
  audio: new Audio(),
  loadAllFiles() {
    drumFiles.map((file) => {
      this.loadSoundFile(file);
    });
  },

  loadSoundFile(file) {
    // var xhr = new XMLHttpRequest();
    // xhr.open('GET', document.origin + file, true);
    // xhr.responseType = 'arraybuffer';
    // xhr.onload = function() {
    //   console.log(this.response);
    //   // audioCtx.decodeAudioData(this.response, function(buffer) {
    //   //   console.log(buffer);
    //   //     // playSoundBuffer = buffer;
    //   //     // playSound(); // don't start processing it before the response is there!
    //   // }, function(error) {
    //   //     console.error('decodeAudioData error', error);
    //   // });
    //   audioCtx.decodeAudioData(this.response).then(function(decodedData) {
    //     console.log('test');
    //     // drumAudioBuffer.push(decodedData);
    //   }).catch((e) => {
    //     console.log('error', e);
    //   });

    // };
    // xhr.send();
    // axios({
    //   method:'get',
    //   url: document.origin + file,
    //   responseType:'arraybuffer'
    // })
    // .then(function(response) {
    //   console.log(response);

    //   respose.data.onload(() => {

    //   });
      // if (response.data) {
      //   audioCtx.decodeAudioData(response.data).then(function(decodedData) {
      //     console.log(decodedData);
      //     // drumAudioBuffer.push(decodedData);
      //   }).catch((e) => {
      //     console.log('error', e);
      //   });
      // }
      
      // }, 2000);
  
    // });
  },

  playSound(data) {
    // console.log(data);
    var a = this.audio;
    a.src = '';

    if (data.b0 === 1) {
        a.src = drumFiles[0];
        a.play();
    }

    if (data.b1 === 1) {
      a.src = drumFiles[1];
      a.play();
    }

    if (data.b2 === 1) {
      a.src = drumFiles[2];
      a.play();
    }

    if (data.b3 === 1) {
      a.src = drumFiles[3];
      a.play();
    }
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
