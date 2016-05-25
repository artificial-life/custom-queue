'use strict'

let Taskq = require('./task-queue/task-queue.js');
let Eventq = require('./event-queue/event-queue.js');

class Queue {
	constructor() {
		this.task_q = new Taskq();
		this.event_q = new Eventq();
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
	command(task_name, data) {
		return this.task_q.command(task_name, data);
	}
	listenTask(task_name, cb) {
		return this.task_q.on(task_name, cb);
	}
	addAdapter(type, adapter) {
		if (type == 'task') return this.task_q.addAdapter(adapter);
		if (type == 'event') return this.event_q.addAdapter(adapter);
	}
}

module.exports = Queue;
