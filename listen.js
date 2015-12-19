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

let zero = [range.map(x => 0)];
let soft = [range.map(x => 2)];
let loud = [range.map(x => 20)];

function round(num) {
  let answer = Math.round(num);
  // Avoid annoying-looking negative zero
  if (answer === 0) {
    answer = 0;
  }
  return answer;
}

function get(buffer, i) {
  return round(buffer[0][i] * 100);
}

// Input seems to be a 1x24 matrix of numbers.
let average = 0.0;
function processAudio(input) {
  let delta = Math.abs(get(input, 0) + get(input, 1) + get(input, 2)) / 3;
  average = 0.9 * average + 0.1 * delta;
  console.log(average);
}
 
while (true) {
  let sample = engine.read();
  processAudio(sample);
}
