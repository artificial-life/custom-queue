'use strict'

var Taskq = require('./task-queue/task-queue.js');
var Eventq = require('./event-queue/event-queue.js');
var Fabric = require('./adapter-fabric.js');

var Queue = function () {
    var task_q = new Taskq();
    var event_q = new Eventq();
    var fabric = new Fabric(event_q, task_q);

    return {
        on: function (event_name, cb) {
            return event_q.on(event_name, cb);
        },
        emit: function (event_name, data) {
            return event_q.emit(event_name, data);
        },
        addTask: function (task_name, data) {
            return task_q.emit(task_name, data);
        },
        listenTask: function (task_name, cb) {
            return task_q.on(task_name, cb);
        },
        addAdapter: function (type, params) {
            return fabric.addAdapter(type, params);
        }
    };
}

module.exports = Queue;