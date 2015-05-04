var Benchmark = require('benchmark');

var postal = require('postal');
var ee2 = require('eventemitter2').EventEmitter2;

var e2 = new ee2();
var suite = new Benchmark.Suite;


var channel = postal.channel("orders");
var counter = 0;
var subscription = channel.subscribe("item.add", function (data, envelope) {
    //console.log(data);
    counter += 1;
    console.log(counter);
});

var i = 0;
var j = 0;
suite
    .add('postal', function () {
        i++;
        console.log(i);
    })
    .add('eventemitter', function () {
        j += 1;
        console.log(j);
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').pluck('name'));
    })
    // run async
    .run({
        'async': true
    });