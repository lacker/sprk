'use strict';

let Cylon = require('cylon');

let going = true;

function go() {
  going = true;
}

function stop() {
  going = false;
}

Cylon.robot({
  connections: {
    sphero: { adaptor: 'sphero', port: '/dev/tty.Sphero-POR-AMP-SPP' }
  },

  devices: {
    sphero: { driver: 'sphero' }
  },

  work: function(my) {
    every((1).second(), () => {
      if (going) {
        // Go
        my.sphero.roll(60, Math.floor(Math.random() * 360));
      } else {
        // Stop
        my.sphero.roll(0, 0);
      }
    });
  }
}).start();

console.log('started');

// TODO: listen for voice, stop or go accordingly
