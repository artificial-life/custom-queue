var uuid = require('node-uuid');
var _ = require('lodash');
var count = 100;
var keys = [],
    values = [];
var kv = {};

var search = [];

var arraySearch = function (key) {
    return values[keys.indexOf(key)];
};

var objSearch = function (key) {
    return kv[key];
};

for (var j = 0; j < count; j += 1) {
    var u = uuid.v1();
    var value = parseInt(Math.random() * 100);
    kv[u] = value;
    keys.push(u);
    values.push(value);
    search.push(u);
}
//_.shuffle(search);
console.log('start bench');
var start = process.hrtime();
for (var i = 0; i < count; i += 1) {
    // var key = search[i];
    var r = arraySearch(i);
}
var end = process.hrtime(start);
console.log(end);


var start2 = process.hrtime();
for (var i = 0; i < count; i += 1) {
    var z = search[i];
    var r = objSearch(z);
}
var end2 = process.hrtime(start2);
console.log(end2);