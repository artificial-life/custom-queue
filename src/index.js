var child_process = require('child_process');
var Adapter = require('./cp-adapter.js');
var Eventq = require('./event-queue.js');

var q = new Eventq();

var child = child_process.fork('./test.js');
var adapter = new Adapter(child);
q.addAdapter(adapter);

setTimeout(function () {
    q.on('some-event', function (data) {
        console.log('%s received', process.pid, data);
    });
}, 2000);

q.on('other', function (data) {
    console.log('other event', data);
});