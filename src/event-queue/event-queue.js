'use strict'

const Queue = function (name, options) {
	let local_subs = {};
	let adapter = false;
	let route = {
		on: [],
		emit: []
	};

	return {
		_on(event_name, cb) {
			if (!local_subs.hasOwnProperty(event_name)) local_subs[event_name] = [];
			local_subs[event_name].push(cb);
		},
		on(event_name, cb) {
			let real_name = this.applyRoutes('on', event_name);
			this._on(real_name, cb);

			adapter && adapter.subscribe(real_name);
		},
		emit(event_name, data) {
			let real_name = this.applyRoutes('emit', event_name, data);
			adapter && adapter.emit(real_name, data);

			this._emit(real_name, data)
		},
		_emit(event_name, data) {
			let subs = local_subs[event_name];
			if (!subs) return;

			let len = subs.length;
			while (len--) {
				subs[len].call(null, data);
			}
		},
		addAdapter(pubsub) {
			adapter = pubsub;
			adapter.onMessage((event_name, data) => this._emit(event_name, data))
		},
		addRouter(router) {
			this.parseRouter('on', router);
			this.parseRouter('emit', router);
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
