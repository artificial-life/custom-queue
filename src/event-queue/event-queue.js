'use strict'

var Queue = function (name, options) {
    var local_subs = {};
    var adapters = [];
    return {
        _on: function (event_name, cb) {
            if (!local_subs.hasOwnProperty(event_name)) local_subs[event_name] = [];
            local_subs[event_name].push(cb);
            // console.log(process.pid, ':', local_subs);
        },
        on: function (event_name, cb) {
            this._on(event_name, cb);
            var i;
            for (i = 0; i < adapters.length; i += 1) {
                adapters[i].sendLinkRequest(event_name);
            }
        },
        emit: function (event_name, data) {
            var subs = local_subs[event_name];
            if (!subs) return;
            var i,
                len = subs.length;

            for (i = 0; i < len; i += 1) {
                subs[i].call(null, data);
            }
        },
        addAdapter: function (adapter) {
            adapters.push(adapter);
            adapter.attach(this);
        }
    }
};

module.exports = Queue;