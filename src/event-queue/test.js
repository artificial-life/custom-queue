console.log('child', process.pid);

var Adapter = require('./cp-adapter.js');
var Eventq = require('./event-queue.js');

var q = new Eventq();
var adapter = new Adapter(process);

q.addAdapter(adapter);
var counter = 0;

setInterval(function () {
    q.emit('some-event', {
        date: (new Date()).toLocaleTimeString()
    });
    counter++;
    if (counter > 5) {
        console.log('exit');
        process.exit();
    }
}, 1000);

q.emit('system', {
    state: 'ready'
});