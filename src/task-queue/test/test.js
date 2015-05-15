console.log('child', process.pid);

function fib(n) {
    return n <= 1 ? n : fib(n - 1) + fib(n - 2);
}

var Adapter = require('./wcp-adapter.js');
var Taskq = require('./task-queue.js');

var q = new Taskq();

var adapter = new Adapter(process);
q.addAdapter(adapter);


setTimeout(function () {
    q.on('some-task', function (data) {
        return fib(data.num) + ' complited by ' + process.pid;
    });
}, 1000);