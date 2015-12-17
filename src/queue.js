'use strict'

let Taskq = require('./task-queue/task-queue.js');
let Eventq = require('./event-queue/event-queue.js');
let Fabric = require('./adapter-fabric.js');

class Queue {
  constructor() {
    this.task_q = new Taskq();
    this.event_q = new Eventq();
    this.fabric = new Fabric(this.event_q, this.task_q);
  }
  on(event_name, cb) {
    return this.event_q.on(event_name, cb);
  }
  emit(event_name, data) {
    return this.event_q.emit(event_name, data);
  }
  addTask(task_name, data) {
    return this.task_q.emit(task_name, data);
  }
  listenTask(task_name, cb) {
    return this.task_q.on(task_name, cb);
  }
  addAdapter(type, params) {
    return this.fabric.addAdapter(type, params);
  }
}

module.exports = Queue;