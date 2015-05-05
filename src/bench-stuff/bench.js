var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

var len = 10;
var keys = [];
var hash = {};
var values = [];

var workers = {};
var w_len = {};
var workers2 = {};

for (var i = 0; i < len; i += 1) {
    keys.push('k' + (i));
    workers['w' + i] = [1, 2, 3, 4, 5];
    workers2['w' + i] = {
        len: 0,
        w: [1, 2, 3, 4, 5]
    };
    for (var j = 0; j < parseInt(Math.random() * 10 + 1); j += 1) {
        workers['w' + i].push(j);
        workers2['w' + i].w.push(parseInt(Math.random() * 10 + 1));
    }
    workers2['w' + i].len = workers2['w' + i].w.length;
    w_len['w' + i] = workers['w' + i].length;
}
for (var k in keys) {
    var key = keys[k];
    hash[key] = [];
    for (var i = 1; i < 10; i++) {
        var temp = parseInt(Math.random() * 100);
        hash[key].push(temp);
    }
    values.push(hash[key]);
}

var findH = function (id) {
    return hash[id];
}

var findA = function (id) {
    var i = keys.indexOf(id);
    return values[i];
}

var findI = function (id) {
    return values[id];
}

console.log(workers2);

// add tests
suite.add('1', function () {
        var worker_name = 'w' + parseInt(Math.random() * len);
        var worker = workers[worker_name];
        var len = w_len[worker_name];
    })
    .add('2', function () {
        var item = 'w' + parseInt(Math.random() * len);
        var worker2 = workers2[item].w;
        var len2 = workers2[item].len;
    })
    .add('3', function () {
        var item2 = 'w' + parseInt(Math.random() * len);
        var worker3 = workers[item2];
        var len3 = worker3.length;
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').pluck('name'));
    })
    .run({
        'async': true
    });