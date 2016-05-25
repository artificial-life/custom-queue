'use strict'

let Promise = require('bluebird');
let uuid = require('node-uuid');
let _ = require('lodash');

var Queue = function (name, options) {
	var workers = {};
	var outer_adapter = false;
	return {
		on: function (event_name, cb) {
			if (!workers.hasOwnProperty(event_name)) workers[event_name] = {
				items: [],
				cursor: 0
			};
			workers[event_name].items.push(cb);

			if (outer_adapter) outer_adapter.listenTask(event_name, cb)
		},
		emit: function (event_name, data) {
			let d = this.perform(event_name, data);

			if (!_.isError(d)) return Promise.resolve(d);

			return !outer_adapter ? Promise.reject(d) : outer_adapter.addTask(event_name, data);
		},
		perform(event_name, data) {
			var wrks = workers[event_name];

			if (!wrks) return new Error("No workers for " + event_name);

			var len = wrks.items.length;
			var p = wrks.items[wrks.cursor].call(null, data);
			wrks.cursor = (wrks.cursor + 1) % len;

			return p;
		},
		command: function (event_name, data) {
			let d = this.perform(event_name, data);

			if (!_.isError(d)) return true;

			return !outer_adapter ? Promise.reject(d) : outer_adapter.command(event_name, data);
		},
		addAdapter: function (adapter) {
			outer_adapter = adapter;
		}
	}
};

module.exports = Queue;
