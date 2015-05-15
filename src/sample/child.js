'use strcit'

var Queue = require('../queue.js');

var Q = new Queue();

Q.addAdapter('event.ipc', process);

Q.on('child-event', function (d) {
    console.log(process.pid, 'im also heared "child event"', d);
});

Q.emit('system', {
    state: 'ready',
    who: process.pid
});