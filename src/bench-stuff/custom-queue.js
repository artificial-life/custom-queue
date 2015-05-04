var Queue = require('../event-queue.js');

var count = 10000;
var counter = 0;
var q = new Queue();
q.on('event', function (d) {
    counter += 1;
    if (count === counter) {
        var e = process.hrtime(s);
        console.log(count / e[1]);
    }
});
var s = process.hrtime();
for (var i = 0; i < count; i += 1) {
    q.emit('event', 1);
}