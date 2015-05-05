var Promise = require('bluebird');
var W_queue = require('../work-queue.js');
var q = new W_queue();

q.on('task1', function (id, data) {
    return 1;
});

q.on('task1', function (id, data) {
    return Promise.resolve(2).delay(2000);
});

q.emit('task1').then(function (d) {
    console.log(d);
});
q.emit('task1').then(function (d) {
    console.log(d);
});
q.emit('task1').then(function (d) {
    console.log(d);
});