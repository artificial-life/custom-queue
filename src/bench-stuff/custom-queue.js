var Queue = require('../event-queue.js');

var count = 100000;

var counter = 0;
var q = new Queue();
q.on('event', function (d) {
    counter += 1;
    if (count === counter) {
        var e = process.hrtime(s);
        console.log(count / e[1]);
        console.log(e[1]);

    }
});
var s = process.hrtime();
for (var i = 0; i < count; i += 1) {
    q.emit('event', 1);
}

var W_Queue = function () {
    var q = new Queue();
    var on = function (e, c) {
        q.on(e, c);
    };
    var emit = function (e, d) {
        q.emit(e, d);
    };
    return {
        on: on,
        emit: emit
    }
};

var counter = 0;
var q = new W_Queue();
q.on('event', function (d) {
    counter += 1;
    if (count === counter) {
        var e = process.hrtime(s);
        console.log(count / e[1]);
        console.log(e[1]);
    }
});
var s = process.hrtime();
for (var i = 0; i < count; i += 1) {
    q.emit('event', 1);
}