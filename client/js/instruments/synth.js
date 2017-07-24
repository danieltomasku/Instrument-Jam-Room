'use strict';

var synthFiles = [
  require('../../assets/synth-samples/synth-1.mp3'),
  require('../../assets/synth-samples/synth-2.mp3'),
  require('../../assets/synth-samples/synth-3.mp3'),
  require('../../assets/synth-samples/synth-4.mp3')
];

var synth = {
  audio: new Audio(),
  loadAllFiles() {
    synthFiles.map((file) => {
      this.loadSoundFile(file);
    });
  },

  loadSoundFile(file) {

  },

  playSound(data) {
    var a = this.audio;
    a.src = '';

    if (data.b0 === 1) {
        a.src = synthFiles[0];
        a.play();
    }

    if (data.b1 === 1) {
      a.src = synthFiles[1];
      a.play();
    }

    if (data.b2 === 1) {
      a.src = synthFiles[2];
      a.play();
    }

    if (data.b3 === 1) {
      a.src = synthFiles[3];
      a.play();
    }
  }
};

module.exports = synth;