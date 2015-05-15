'use strcit'

var Queue = require('../queue.js');
var child_process = require('child_process');

var Q = new Queue();
var count = 5;

for (var i = 0; i < count; i += 1) {
    var child = child_process.fork('child.js');
    //    child.on('message', function (d) {
    //        console.log(d);
    // });
    Q.addAdapter('event.ipc', child);

}
var counter = 0;
Q.on('system', function (d) {
    console.log(d);
    counter++;
    if (counter === count) {
        Q.emit('child-event', {
            data: 'all-ready'
        });
    }
});

Q.on('my-event', function (d) {
    console.log('(L1) my event:', d);
});

Q.on('my-event', function (d) {
    console.log('(L2) my event:', d);
});

Q.emit('my-event', {
    data: 'd'
});

Q.listenTask('my-task', function (d) {
    return d.num + 1;
});

Q.listenTask('my-task', function (d) {
    return d.num - 1;
});

Q.addTask('my-task', {
    num: 1
}).then(function (d) {
    console.log(d);
});


Q.addTask('my-task', {
    num: 1
}).then(function (d) {
    console.log(d);
});