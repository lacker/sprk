'use strict';

let Cylon = require('cylon');

let listen = require('./listen');

Cylon.robot({
  connections: {
    sphero: { adaptor: 'sphero', port: '/dev/tty.Sphero-POR-AMP-SPP' }
  },

  devices: {
    sphero: { driver: 'sphero' }
  },

  work: function(my) {
    every((0.1).second(), () => {
      listen.processSample();
    });

    every((1).second(), () => {
      let amount = 0;
      let dir = 0;
      if (listen.info.active) {
        amount = 50;
        dir = Math.floor(Math.random() * 360);
      }
      console.log('work ' + amount + ' -> ' + dir);
      my.sphero.roll(amount, dir);
    });
  }
}).start();

console.log('started');

