var postal = require('postal');
var ee2 = require('eventemitter2').EventEmitter2;
var ee3 = require('eventemitter3');
var e2 = new ee3();
//var e2 = new ee2();

var channel = postal.channel("orders");

var counter1 = 0;
var counter2 = 0;

var count = 10000;

if (!1) {
    var p_start = process.hrtime();

    var subscription = channel.subscribe("item.add", function (data, envelope) {
        //console.log(data);
        counter1 += 1;
        if (counter1 === count) {
            var p_end = process.hrtime(p_start);
            console.log('postal:', count / p_end[1]);
        }
    });
    for (var i = 0; i < count; i += 1) {
        channel.publish("item.add", {
            data: 1
        });
    }

} else {
    var e_start = process.hrtime();

    e2.on('event', function (value1, value2) {
        counter2 += 1;
        if (counter2 === count) {
            var e_end = process.hrtime(e_start);
            console.log('EE:', count / e_end[1]);
            console.log('EE:', e_end[1]);
        }
    });

    for (var i = 0; i < count; i += 1) {
        e2.emit('event', {
            data: (new Date()).getTime()
        });
    }
}