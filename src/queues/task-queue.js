'use strict'

const Promise = require('bluebird');

const AbstractQueue = require('./abstract-queue.js');

class TaskQueue extends AbstractQueue {
  constructor() {
    super('act', 'do');
    this.workers = {};
  }
  act(event_name, cb) {
    this.notifyPlugins('act', event_name);

    let transformed_name = this.applyRoutes('act', event_name);

    (this.workers[transformed_name] || (this.workers[transformed_name] = {
      items: [],
      cursor: 0
    })).items.push(cb);

    (!!this.adapter) && this.adapter.act(transformed_name, cb)
  }
  do(event_name, data, needcallback == true) {
    this.notifyPlugins(needcallback ? 'do' : 'command', event_name, data);

    let transformed_name = this.applyRoutes('do', event_name, data);
    let d = this.perform(transformed_name, data);

    if (!d || d.constructor != Error) return Promise.resolve(d);

    return !this.adapter ? Promise.reject(d) : this.adapter.do(transformed_name, data);
  }
  perform(event_name, data) {
    var wrks = this.workers[event_name];

    if (!wrks) return new Error("No this.workers for " + event_name);

    var len = wrks.items.length;
    var p = wrks.items[wrks.cursor].call(null, data);
    wrks.cursor = (wrks.cursor + 1) % len;

    return p;
  }
  command(event_name, data) {
    return this.do(event_name, data, false).then(result => true)
  }
}

module.exports = TaskQueue;
