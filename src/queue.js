'use strict'

const _ = require('lodash');

const Taskq = require('./task-queue/task-queue.js');
const Eventq = require('./event-queue/event-queue.js');
const ALL_QUEUES = ['event', 'task'];

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
		return this.task_q.do(task_name, data);
	}
	listenTask(task_name, cb) {
		return this.task_q.act(task_name, cb);
	}
	do(task_name, data) {
		//@NOTE: same as addTask
		return this.task_q.do(task_name, data);
	}
	command(task_name, data) {
		return this.task_q.command(task_name, data);
	}
	act(task_name, cb) {
		//@NOTE: same as listenTask
		return this.task_q.act(task_name, cb);
	}
	addAdapter(type, adapter) {
		this.applyMethod('addAdapter', type, adapter);
	}
	addRouter(type, router) {
		this.applyMethod('addRouter', type, router);
	}
	applyMethod(method, type, param) {
		let queues = !!param ? _.castArray(type) : ALL_QUEUES;
		let entity = param || type;

		_.forEach(queues, queue_name => {
			let queue = this[`${queue_name}_q`];
			queue[method].call(queue, entity);
		});
	}

}

module.exports = Queue;
