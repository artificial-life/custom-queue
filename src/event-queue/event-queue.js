'use strict'

var Queue = function (name, options) {
	let local_subs = {};
	let adapter = false;
	return {
		_on: function (event_name, cb) {
			if (!local_subs.hasOwnProperty(event_name)) local_subs[event_name] = [];
			local_subs[event_name].push(cb);
		},
		on: function (event_name, cb) {
			this._on(event_name, cb);

			adapter && adapter.subscribe(event_name);
		},
		emit: function (event_name, data) {
			adapter && adapter.emit(event_name, data);

			this._emit(event_name, data)
		},
		_emit: function (event_name, data) {
			let subs = local_subs[event_name];
			if (!subs) return;
			let i;
			let len = subs.length;

			for (i = 0; i < len; i += 1) {
				subs[i].call(null, data);
			}
		},
		addAdapter: function (pubsub) {
			adapter = pubsub;
			adapter.onMessage((event_name, data) => this._emit(event_name, data))
		}
	}
};

module.exports = Queue;
