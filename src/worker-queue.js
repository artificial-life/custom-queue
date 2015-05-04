var _ = require('lodash');

var WorkQueue = function (name, options) {
    var transport = ['kafka', 'inner', 'cross-porcess'];

    return {
        workers: [],
        tasks: [],
        worker: 0,
        worker_count: 0,
        adapters: [],
        task: function (task_name, data) {
            var w = this.workers[task_name];
            if (!w) return;
            var i = this.worker = (this.worker + 1) % w.length;
            w[i].call(null, data);
        },
        addWorker: function (task_name, cb) {
            if (!this.workers.hasOwnProperty(task_name)) this.workers[task_name] = [];
            this.workers[task_name].push(cb);
            this.worker_count += 1;
        },
        addAdapter: function (adapter) {
            this.adapters.push(adapter);
            adapter.link(emiter);
        }
    }
}

var q = new Queue();
var counter = 0;
var count = 10000;
var start = process.hrtime();


q.addWorker('task', function () {
    counter += 1;
    if (counter == count) {
        var end = process.hrtime(start);
        console.log(count / end[1]);
        console.log(end[1]);
    }
});



for (var i = 0; i < count; i += 1) {
    q.task('task', 1);
}