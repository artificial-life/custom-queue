var Queue = function (name, options) {
    var transport = ['kafka', 'inner', 'cross-porcess'];
    var local_subs = {};
    var adapters = [];
    return {
        on: function (event_name, cb, im_adapter) {
            if (!local_subs.hasOwnProperty(event_name)) local_subs[event_name] = [];
            local_subs[event_name].push(cb);
            if (!im_adapter)
                this.notifyAdapters(event_name);
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
        notifyAdapters: function (event_name) {
            for (var i = 0; i < adapters.length; i += 1) {
                adapters[i].linkEvent(event_name);
            }
        },
        addAdapter: function (adapter) {
            adapters.push(adapter);
            adapter.setEmitter(this);
        }
    }
};

module.exports = Queue;