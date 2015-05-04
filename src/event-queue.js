var _ = require('lodash');

var Queue = function (name, options) {
    var transport = ['kafka', 'inner', 'cross-porcess'];

    return {
        subscribers: {},
        adapters: [],
        emitLocal: function (event_name, data) {
            var subs = this.subscribers[event_name];
            if (!subs) return;
            var i,
                len = subs.length;

            for (i = 0; i < len; i += 1) {
                subs[i].call(null, data);
            }
        },
        emit: function (event_name, data) {
            this.emitLocal(event_name, data);
            var i,
                len = this.adapters.length;
            for (i = 0; i < len; i += 1) {
                this.adapters[i].emit(event_name, data);
            }
        },
        fanout: function (event_name, data, exclude) {
            this.emitLocal(event_name, data);
            var i,
                len = this.adapters.length;
            for (i = 0; i < len; i += 1) {
                var adapter = this.adapters[i];
                if (adapter === exclude) continue;
                adapter.emit(event_name, data);
            }
        },
        on: function (event_name, cb) {
            if (!this.subscribers.hasOwnProperty(event_name)) this.subscribers[event_name] = [];
            this.subscribers[event_name].push(cb);

            this.notifyAdapters(event_name);
        },
        notifyAdapters: function (event_name) {
            for (var i = 0; i < this.adapters.length; i += 1) {
                this.adapters[i].linkEvent(event_name);
            }
        },
        addAdapter: function (adapter) {
            this.adapters.push(adapter);
            adapter.setEmitter(this);
        }
    }
}
module.exports = Queue;