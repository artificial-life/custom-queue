var _ = require('lodash');

var ParentToChildAdapter = function (child_process) {
    this.emitter = null;
    this.events = ['app.system'];
    this.child_process = child_process;
    var self = this;
    child_process.on('message', function (message) {
        switch (message.type) {
        case 'adapter.system':
            if (self.events.indexOf(message.body.event) !== -1) break;
            self.events.push(message.body.event);

            //            if (!self.emitter) break;
            //                self.emitter.notifyAdapters(
            break;
        case 'adapter.event_transport':
            if (!self.emitter) break;
            self.emitter.fanout(message.body.event, message.body.data, self);
            break;
        }

    });
};


ParentToChildAdapter.prototype.setEmitter = function (emitter) {
    this.emitter = emitter;
};

ParentToChildAdapter.prototype.linkEvent = function (event_name) {
    this.child_process.send({
        type: 'adapter.system',
        body: {
            event: event_name,
            action: 'link'
        }
    });
};

ParentToChildAdapter.prototype.emit = function (event_name, data) {
    if (this.events.indexOf(event_name) === -1) return;

    this.child_process.send({
        type: 'adapter.event_transport',
        body: {
            event: event_name,
            data: data
        }
    });
};

module.exports = ParentToChildAdapter;