'use strict';

var bassFiles = [
  require('../../assets/bass-samples/bass-1.mp3'),
  require('../../assets/bass-samples/bass-2.mp3'),
  require('../../assets/bass-samples/bass-3.mp3'),
  require('../../assets/bass-samples/bass-4.mp3')
];

var bass = {
  audio: new Audio(),
  loadAllFiles() {
    bassFiles.map((file) => {
      this.loadSoundFile(file);
    });
  },

  loadSoundFile(file) {

  },

  playSound(data) {
    var a = this.audio;
    a.src = '';

    if (data.b0 === 1) {
        a.src = bassFiles[0];
        a.play();
    }

    if (data.b1 === 1) {
      a.src = bassFiles[1];
      a.play();
    }

    if (data.b2 === 1) {
      a.src = bassFiles[2];
      a.play();
    }

    if (data.b3 === 1) {
      a.src = bassFiles[3];
      a.play();
    }
  }
};

module.exports = bass;