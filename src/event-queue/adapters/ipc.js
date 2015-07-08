'use strict'

var sendFn = function (event_name, child_process) {
    var id = 'adapter-' + process.pid;
    return function (data) {
        if (id === data._emitter) return;
        child_process.send({
            type: 'adapter.event_transport',
            body: {
                event: event_name,
                data: data
            }
        });
    }
};

var EventAdapter = function (child_process) {
    this.queue = null;
    var events = [];
    this.child_process = child_process;
    this.id = 'adapter-' + process.pid;
    var self = this;

    this.linkExt = function (event) {
        if (events.indexOf(event) !== -1) return;
        events.push(event);
        var send = sendFn(event, child_process);
        self.queue._on(event, send);
    };

    child_process.on('message', function (message) {
        switch (message.type) {
        case 'adapter.linkevent':
            self.linkExt(message.body.event);
            break;
        case 'adapter.event_transport':
            if (!self.queue) break;
            message.body.data._emitter = self.id;
            self.queue.emit(message.body.event, message.body.data);

            break;
        }

    });
};


EventAdapter.prototype.attach = function (queue) {
    this.queue = queue;
    this.linkExt('system.child_process.' + this.child_process.pid);
};


EventAdapter.prototype.sendLinkRequest = function (event_name) {
    this.child_process.send({
        type: 'adapter.linkevent',
        body: {
            event: event_name,
            action: 'link'
        }
    });
};



module.exports = EventAdapter;