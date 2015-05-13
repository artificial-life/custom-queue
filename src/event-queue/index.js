console.log('main', process.pid);

var child_process = require('child_process');
var Adapter = require('./cp-adapter.js');
var Eventq = require('./event-queue.js');

var q = new Eventq();

var child = child_process.fork('./test.js');
var adapter = new Adapter(child);
q.addAdapter(adapter);

q.on('system', function (data) {
    console.log('sytem event', data);
    q.on('some-event', function (data) {
        console.log('%s received', process.pid, data);
    });
});