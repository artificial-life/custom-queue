'use strict'

var uuid = require('node-uuid');
var Promise = require('bluebird');
var _ = require('lodash');

var Defer = function () {
    var p, reject, resolve;

    p = new Promise(function (res, rej) {
        reject = rej;
        resolve = res;
    });

    return {
        promise: p,
        reject: reject,
        resolve: resolve
    };
};



var ParentToChildAdapter = function (child_process) {
    this.queue = null;

    this.child_process = child_process;
    this.id = 'worker-adapter-' + process.pid;
    var self = this;
    var ongoing_tasks = [];
    var tasks = [];

    var makeCallback = function (task_name) {
        return function (data) {
            var id = uuid.v1();
            var defer = new Defer();
            ongoing_tasks.push({
                id: id,
                defer: defer
            });

            child_process.send({
                type: 'adapter.task_transport',
                _task_id: id,
                body: {
                    task: task_name,
                    data: data
                }
            });
            return defer.promise;
        };
    };

    child_process.on('message', function (message) {
        switch (message.type) {
        case 'adapter.addworker':
            if (tasks.indexOf(message.body.task) !== -1) return;
            tasks.push(message.body.task);

            self.queue._on(message.body.task, makeCallback(message.body.task));
            break;
        case 'adapter.task_transport':
            self.internalRequest(message);

            break;
        case 'adapter.response_transport':
            if (!self.queue) return;

            var task_id = _.findIndex(ongoing_tasks, 'id', message._task_id);

            if (task_id === -1) return;

            var d = ongoing_tasks[task_id].defer;
            d.resolve(message.body.data);
            ongoing_tasks.splice(task_id, 1);

            break;
        }

    });
};


ParentToChildAdapter.prototype.attach = function (queue) {
    this.queue = queue;
};


ParentToChildAdapter.prototype.workerArrived = function (task_name) {
    this.child_process.send({
        type: 'adapter.addworker',
        body: {
            task: task_name,
            action: 'addworker'
        }
    });
};

ParentToChildAdapter.prototype.internalRequest = function (task) {
    var queue = this.queue;
    var id = task._task_id;
    var child_process = this.child_process;

    queue.emit(task.body.task, task.body.data).then(function (data) {
        child_process.send({
            type: 'adapter.response_transport',
            _task_id: id,
            body: {
                data: data
            }
        });
    });
}

ParentToChildAdapter.prototype.getOngoing = function (id) {

};


module.exports = ParentToChildAdapter;