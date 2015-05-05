var Promise = require('bluebird');
var uuid = require('node-uuid');

//var defer = function () {
//    var resolve, reject;
//    var promise = new Promise(function (res, rej) {
//        resolve = res;
//        reject = rej;
//    });
//    return {
//        resolve: resolve,
//        reject: reject,
//        promise: promise
//    }
//}
var Queue = function (name, options) {
    var workers = {};
    var adapters = [];
    return {
        _on: function (event_name, cb) {
            if (!workers.hasOwnProperty(event_name)) workers[event_name] = {
                items: [],
                cursor: 0
            };
            workers[event_name].items.push(cb);
        },
        on: function (event_name, cb) {
            this._on(event_name, cb);
        },
        emit: function (event_name, data) {
            var wrks = workers[event_name];
            if (!wrks) return;
            var len = wrks.items.length;
            var p = wrks.items[wrks.cursor].call(null, data);
            wrks.cursor = (wrks.cursor + 1) % len;
            return Promise.resolve(p);
        },
        addAdapter: function (adapter) {
            adapters.push(adapter);
            adapter.setEmitter(this);
        }
    }
};

module.exports = Queue;