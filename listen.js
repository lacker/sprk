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

// The sum of absolute values of this range of the vector.
function L1(buffer, begin, end) {
  if (end <= begin) {
    throw 'end <= begin';
  }
  let answer = 0.0;
  for (let i = begin; i < end; i++) {
    answer += Math.abs(buffer[0][i]);
  }
  return answer;
}

// The average index that L1 weight is at. Kind of the "center of gravity"
function cog(buffer, begin, end) {
  let total = 0.0;
  let weight = 0.0;
  for (let i = begin; i < end; i++) {
    let value = Math.abs(buffer[0][i]) + 0.000001;
    weight += value;
    total += i * value;
  }
  return total / weight;
}

// Second moment kind of - RMS of diff from avg
function noiseLevel(buffer, begin, end) {
  let mean = 0;
  for (let i = begin; i < end; i++) {
    mean += buffer[0][i];
  }
  mean /= (end - begin);
  
  let squareSum = 0;
  for (let i = begin; i < end; i++) {
    let diff = buffer[0][i] - mean;
    squareSum += diff * diff;
  }
  return Math.sqrt(squareSum / (end - begin));
}

let info = {
  active: false,
};

// Input seems to be a 1x24 matrix of numbers.
let accum = 0.0;
let decay = 0.1;
let upperThreshold = 3.0;
let lowerThreshold = 2.0;

function processAudio(input) {
  let delta = Math.abs(get(input, 0) + get(input, 1) + get(input, 2)) / 3;
  accum = (1 - decay) * accum + decay * delta;
  if (accum > upperThreshold) {
    info.active = true;
  } else if (info.active && accum < lowerThreshold) {
    info.active = false;
  }

  // Log amplitude in 8 chunks
  console.log(info.active ? 'ON' : '--',
              'A', L1(input, 0, 128).toFixed(0),
              'B', L1(input, 128, 256).toFixed(0),
              'C', L1(input, 256, 384).toFixed(0),
              'D', L1(input, 384, 512).toFixed(0),
              'E', L1(input, 512, 640).toFixed(0),
              'F', L1(input, 640, 768).toFixed(0),
              'G', L1(input, 768, 896).toFixed(0),
              'H', L1(input, 896, 1024).toFixed(0),
              '');
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
  let frames = 20;
  for (let i = 0; i < frames; i++) {
    processSample();
  }
  let elapsed = (new Date()).getTime() - start;
  console.log('processing', frames, 'frames took', elapsed, 'ms');
  process.nextTick(main);
}

if (require.main === module) {
  main();
}
