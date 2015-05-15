console.log('parent', process.pid);
var child_process = require('child_process');

var Adapter = require('./adapters/ipc.js');
var Taskq = require('./task-queue.js');

var q = new Taskq();
for (var i = 0; i < 5; i += 1) {
    var child = child_process.fork('./test.js');
    var adapter = new Adapter(child);

    q.addAdapter(adapter);
}

var counter = 0;

setInterval(function () {
    q.emit('some-task', {
            num: 20 + counter
        })
        .then(function (d) {
            console.log(process.pid, d);
        }).catch(function (d) {
            console.log(d);
        });
    counter++;
    if (counter > 10) {
        console.log('exit');
        process.exit();
    }
}, 1000);