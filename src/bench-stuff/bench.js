var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

var len = 4;
var keys = [];
var hash = {};
var values = [];
for (var i = 0; i < len; i += 1) {
    keys.push('k' + (i));
}
console.log(keys);
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



// add tests
suite.add('findH', function () {
        var item = parseInt(Math.random() * len);
        var r = findH('k' + item);
    })
    .add('findA', function () {
        var item = parseInt(Math.random() * len);
        var r = findA('k' + item);

    })
    .add('findI', function () {
        var item = parseInt(Math.random() * len);
        var r = findI(item);
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').pluck('name'));
    })
    .run({
        'async': false
    });