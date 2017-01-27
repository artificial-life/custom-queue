'use strict'

const AbstractQueue = require('./abstract-queue.js');

class EventQueue extends AbstractQueue {
  constructor() {
    super('on', 'emit');
    this.local_subs = {};
  }
  _on(event_name, cb) {
    (this.local_subs[event_name] || (this.local_subs[event_name] = [])).push(cb);
  }
  on(event_name, cb) {
    this.notifyPlugins('on', event_name);

    let transformed_name = this.applyRoutes('on', event_name);
    this._on(transformed_name, cb);

    (!!this.adapter) && this.adapter.subscribe(transformed_name);
  }
  off(event_name) {
    this.notifyPlugins('off', event_name);

    this.local_subs[event_name] = [];
  }
  emit(event_name, data) {
    this.notifyPlugins('emit', event_name);

    let transformed_name = this.applyRoutes('emit', event_name, data);
    (!!this.adapter) && this.adapter.emit(transformed_name, data);

    this._emit(transformed_name, data)
  }
  _emit(event_name, data) {
    let subs = this.local_subs[event_name];
    if (!subs) return;

    let len = subs.length;
    while (len--) {
      subs[len].call(null, data);
    }
  }
}

module.exports = EventQueue;
