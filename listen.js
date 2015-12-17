'use strict';
// Listens to the microphone and prints something when it's loud.
// `npm run-script listen` to run this.

// I installed this manually rather than via package.json
let coreAudio = require('node-core-audio');

let engine = coreAudio.createNewAudioEngine();

let range = [];
for (let i = 0; i < 1024; i++) {
  range.push(i);
}

let soft = [range.map(x => 2)];
let loud = [range.map(x => 20)];

let i = -1;

// Input seems to be a 1x24 matrix of numbers.
// Returns the output buffer to play.
function processAudio(input) {
  i++;
  console.log(i, input[0][0]);
  if (i % 2 == 0) {
    return soft;
  } else {
    return loud;
  }
}
 
engine.addAudioCallback(processAudio);
