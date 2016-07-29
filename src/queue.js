'use strict'

let Taskq = require('./task-queue/task-queue.js');
let Eventq = require('./event-queue/event-queue.js');

class Queue {
	constructor() {
		this.task_q = new Taskq();
		this.event_q = new Eventq();
		this.task_router = null;
		this.event_router = null;
	}
	on(event_name, cb) {
		return this.event_q.on(event_name, cb);
	}
	emit(event_name, data) {
		return this.event_q.emit(event_name, data);
	}
	act(task_name, cb) {
		return this.task_q.on(task_name, cb);
	}
	do(task_name, data) {
		if (this.task_router) {
			let transform = this.task_router.transform(task_name, data);
			task_name = transform.task_name;
			data = transform.data;
		}
		return this.task_q.emit(task_name, data);
	}
	pipe(tasks, data_array, acc) {
		//??
	}
	command(task_name, data) {
		return this.task_q.command(task_name, data);
	}
	addAdapter(type, adapter) {
		if (type == 'task') return this.task_q.addAdapter(adapter);
		if (type == 'event') return this.event_q.addAdapter(adapter);
	}
	addRouter(type, router) {
		this.[type + "_router"] = router;
	}
}

module.exports = Queue;
