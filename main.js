'use strict';

let rl = require('readline');
let Cylon = require('cylon');

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
      let dir = Math.floor(Math.random() * 360);
      console.log('dir: ' + dir);
      my.sphero.roll(10, dir);
    });
  }
}).start();

console.log('started');

var i = rl.createInterface(process.sdtin, process.stdout, null);
i.on('line', (cmd) => {
  console.log('cmd: ' + cmd);
});

