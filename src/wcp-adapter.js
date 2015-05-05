var uuid = require('node-uuid');

var ParentToChildAdapter = function (child_process) {
    this.queue = null;

    this.child_process = child_process;
    this.id = 'worker-adapter-' + process.pid;
    var self = this;
    var ongoing_jobs = [];

    child_process.on('message', function (message) {
        switch (message.type) {
        case 'adapter.addworker':
            if (self.events.indexOf(message.body.event) !== -1) break;
            self.events.push(message.body.event);
            //--->var resendFn = function () {};
            self.queue._on(message.body.task, function (data) {
                var id = uuid.v1();
                data._job_id = id;
                var defer = new Defer();
                ongoing_jobs.push({
                    id: id,
                    defer: defer
                });

                child_process.send({
                    type: 'adapter.event_transport',
                    body: {
                        job: message.body.task,
                        data: data
                    }
                });

                return defer.promise;
            });
            break;
        case 'adapter.job_transport':
            if (!self.queue) break;
            //search in ongoing jobs 
            //resolve promise    
            //delete from ongoing

            //            self.queue.emit(message.body.event, message.body.data);

            break;
        }

    });
};


ParentToChildAdapter.prototype.setEmitter = function (queue) {
    this.queue = queue;
};


ParentToChildAdapter.prototype.workerArrived = function (task_name) {
    this.child_process.send({
        type: 'adapter.addworker',
        body: {
            task: task_name,
            action: 'addworker'
        }
    });
};



module.exports = ParentToChildAdapter;