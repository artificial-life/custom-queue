'use strict'


class AbstractQueue {
	constructor(method1, method2) {
		this.adapter = false;
		this.methods = [method1, method2];
		this.route = {};
		this.route[method1] = [];
		this.route[method2] = [];
	}
	addAdapter(pubsub) {
		this.adapter = pubsub;
		this.adapter.onMessage((event_name, data) => this._emit(event_name, data))
	}
	addRouter(router) {
		this.parseRouter(this.methods[0], router);
		this.parseRouter(this.methods[1], router);
	}
	parseRouter(method, router) {
		var fn = router[method];
		(fn instanceof Function) && this.route[method].push(fn.bind(router));
	}
	applyRoutes(method, event_name, data) {
		let routers = this.route[method];
		let len = routers.length;
		let real = event_name;

		while (len--) {
			real = routers[len](real, data)
		}

		return real;
	}
}
module.exports = AbstractQueue;
