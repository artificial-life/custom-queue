'use strict'


class AbstractQueue {
  constructor(method1, method2) {
    this.adapter = false;
    this.methods = [method1, method2];
    this.route = {};
    this.route[method1] = [];
    this.route[method2] = [];
    this.plugins = [];
  }
  addAdapter(pubsub) {
    this.adapter = pubsub;
    this.adapter.onMessage((event_name, data) => this._emit(event_name, data))
  }
  addRouter(router) {
    this.parseRouter(this.methods[0], router);
    this.parseRouter(this.methods[1], router);
  }
  addPlugin(plugin) {
    let [method1, method2] = this.methods;

    if (plugin[method1].constructor != Function) throw new Error(`incomplete plugin: ${method1}`);
    if (plugin[method2].constructor != Function) throw new Error(`incomplete plugin: ${method2}`);

    this.plugins.push(plugin);
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
  notifyPlugins(method, event_name, data = null) {
    let len = this.plugins.length;
    let plug;

    while (len--) {
      plug = this.plugins[len];
      plug[method].call(plug, event_name, data);
    }

  }
}

module.exports = AbstractQueue;
