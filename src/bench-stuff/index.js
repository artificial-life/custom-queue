var len = 250;
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
var count = 1000000;

for (var i = 0; i < count * 10; i += 1) {
    var item = parseInt(Math.random() * len);
    var r1 = findA('k' + item);
    var r2 = findH('k' + item);
}

var s = process.hrtime();

for (var i = 0; i < count; i += 1) {
    var item = parseInt(Math.random() * len);
    var r = findH('k' + item);
}
console.log(process.hrtime(s));

s = process.hrtime();

for (var i = 0; i < count; i += 1) {
    var item = parseInt(Math.random() * len);
    var r = findA('k' + item);
}
console.log(process.hrtime(s));