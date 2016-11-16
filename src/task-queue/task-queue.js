'use strict'

const Promise = require('bluebird');

const Queue = function (name, options) {
	let workers = {};
	let outer_adapter = false;
	let route = {
		act: [],
		do: []
	};


	return {
		act(event_name, cb) {
			let real_name = this.applyRoutes('act', event_name);

			if (!workers.real_name) workers[real_name] = {
				items: [],
				cursor: 0
			};
			workers[real_name].items.push(cb);

			if (outer_adapter) outer_adapter.act(real_name, cb)
		},
		do(event_name, data) {
			let real_name = this.applyRoutes('do', event_name, data);
			let d = this.perform(real_name, data);

			if (!d || d.constructor != Error) return Promise.resolve(d);

			return !outer_adapter ? Promise.reject(d) : outer_adapter.do(real_name, data);
		},
		perform(event_name, data) {
			var wrks = workers[event_name];

			if (!wrks) return new Error("No workers for " + event_name);

			var len = wrks.items.length;
			var p = wrks.items[wrks.cursor].call(null, data);
			wrks.cursor = (wrks.cursor + 1) % len;

			return p;
		},
		command(event_name, data) {
			return this.do(event_name, data).then(result => true)
		},
		addAdapter(adapter) {
			outer_adapter = adapter;
		},
		addRouter(router) {
			this.parseRouter('act', router);
			this.parseRouter('do', router);
		},
		parseRouter(method, router) {
			var fn = router[method];
			(fn instanceof Function) && route[method].push(fn.bind(router));
		},
		applyRoutes(method, event_name, data) {
			let routers = route[method];
			let len = routers.length;
			let real = event_name;

			while (len--) {
				real = routers[len](real, data)
			}

			return real;
		}
	}
};

module.exports = Queue;
