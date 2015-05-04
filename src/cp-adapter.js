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

var ParentToChildAdapter = function (child_process) {
    this.queue = null;
    this.events = [];
    this.child_process = child_process;
    this.id = 'adapter-' + process.pid;
    var self = this;

    child_process.on('message', function (message) {
        switch (message.type) {
        case 'adapter.system':
            if (self.events.indexOf(message.body.event) !== -1) break;
            self.events.push(message.body.event);
            var send = sendFn(message.body.event, self.child_process);
            self.queue.on(message.body.event, send, true);
            break;
        case 'adapter.event_transport':
            if (!self.queue) break;
            message.body.data._emitter = self.id;
            self.queue.emit(message.body.event, message.body.data);
            break;
        }

    });
};


ParentToChildAdapter.prototype.setEmitter = function (queue) {
    this.queue = queue;
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



module.exports = ParentToChildAdapter;