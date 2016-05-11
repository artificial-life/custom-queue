'use strict'

var Promise = require('bluebird');
var uuid = require('node-uuid');


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
			var wrks = workers[event_name];

			if (!wrks) return !outer_adapter ? Promise.reject(new Error("No workers for " + event_name)) : outer_adapter.addTask(event_name, data);

			var len = wrks.items.length;
			var p = wrks.items[wrks.cursor].call(null, data);
			wrks.cursor = (wrks.cursor + 1) % len;

			return Promise.resolve(p);
		},
		addAdapter: function (adapter) {
			outer_adapter = adapter;
		}
	}
};

module.exports = Queue;
