'use strict'

var Promise = require('bluebird');
var uuid = require('node-uuid');


var Queue = function(name, options) {
	var workers = {};
	var adapters = [];
	return {
		_on: function(event_name, cb) {
			if(!workers.hasOwnProperty(event_name)) workers[event_name] = {
				items: [],
				cursor: 0
			};
			workers[event_name].items.push(cb);
		},
		on: function(event_name, cb) {
			this._on(event_name, cb);

			var i;
			for(i = 0; i < adapters.length; i += 1) {
				adapters[i].workerArrived(event_name);
			}
		},
		emit: function(event_name, data) {
			var wrks = workers[event_name];
			if(!wrks) return Promise.reject('no_workers');
			var len = wrks.items.length;
			var p = wrks.items[wrks.cursor].call(null, data);
			wrks.cursor = (wrks.cursor + 1) % len;

			return Promise.resolve(p);
		},
		addAdapter: function(adapter) {
			adapters.push(adapter);
			adapter.attach(this);

			for(var event_name in workers) {
				adapter.workerArrived(event_name);
			}
		}
	}
};

module.exports = Queue;