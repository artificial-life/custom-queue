var Adapter = require('./cp-adapter.js');
var Eventq = require('./event-queue.js');

var q = new Eventq();
var adapter = new Adapter(process);
q.addAdapter(adapter);
var counter = 0;
setInterval(function () {
    q.emit('some-event', (new Date()).toLocaleTimeString());
    counter++;
    if (counter > 10) process.exit();
}, 1000);

q.on('some-event', function (data) {
    console.log('%s emitted:', process.pid, data);
});