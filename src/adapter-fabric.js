'use strict'

var addFnMaker = function (queue_type, queue) {

    return function (type, params) {
        var adapterModel;

        try {
            adapterModel = require('./' + queue_type + '-queue/adapters/' + type + '.js');
        } catch (e) {
            return false;
        }

        var adapter = new adapterModel(params);
        queue.addAdapter(adapter);

        return true;
    }
};


var fabric = function (eventq, taskq) {
    var addTask = addFnMaker('task', taskq);
    var addEvent = addFnMaker('event', eventq);

    return {
        addAdapter: function (type, params) {
            var tp = type.split('.');
            var queue_type = tp.length === 2 ? tp[0].toLowerCase() : '*';
            var adapter_type = tp.length === 2 ? tp[1] : tp[0];

            switch (queue_type) {
            case 'event':
                return addEvent(adapter_type, params);
            case 'task':
                return addTask(adapter_type, params);
            default:
                var r = [];
                r[0] = addEvent(adapter_type, params);
                r[1] = addTask(adapter_type, params);
                return r;
            }
        }
    }
};

module.exports = fabric;