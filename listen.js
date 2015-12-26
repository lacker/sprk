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

// Normalizes a bit. Maybe this is strange.
function get(buffer, i) {
  return round(buffer[0][i] * 100);
}

// begin and end work like in STL - end is one past the end
function average(buffer, begin, end) {
  if (end <= begin) {
    throw 'end <= begin';
  }
  let sum = 0.0;
  for (let i = begin; i < end; i++) {
    sum += buffer[0][i];
  }
  return sum / (end - begin);
}

let info = {
  active: false,
};

// Input seems to be a 1x24 matrix of numbers.
let average = 0.0;
let decay = 0.1;
let upperThreshold = 3.0;
let lowerThreshold = 2.0;

function processAudio(input) {
  let delta = Math.abs(get(input, 0) + get(input, 1) + get(input, 2)) / 3;
  average = (1 - decay) * average + decay * delta;
  if (average > upperThreshold) {
    info.active = true;
  } else if (info.active && average < lowerThreshold) {
    info.active = false;
  }

  console.log(info.active ? 'ON' : '--', '     ', average);
}
 
function processSample() {
  let sample = engine.read();
  processAudio(sample);
}

module.exports = {
  info,
  processSample,
};

function main() {
  let start = (new Date()).getTime();
  processSample();
  let elapsed = (new Date()).getTime() - start;
  console.log('processing took', elapsed, 'ms');
  process.nextTick(main);
}

if (require.main === module) {
  main();
}
