'use strict';

let Cylon = require('cylon');

Cylon.robot({
  connections: {
    sphero: { adaptor: 'sphero', port: '/dev/tty.Sphero-POR-AMP-SPP' }
  },

  devices: {
    sphero: { driver: 'sphero' }
  },

  work: function(my) {
    every((1).second(), () => {
      my.sphero.roll(60, Math.floor(Math.random() * 360));
    });
  }
}).start();
