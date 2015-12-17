'use strcit'

let child_process = require('child_process');

let Q = require('../index.js');
let count = 5;

for (let i = 0; i < count; i += 1) {
  let child = child_process.fork('child.js');
  //    child.on('message', function (d) {
  //        console.log(d);
  // });
  Q.addAdapter('event.ipc', child);

}

let counter = 0;
Q.on('system', function(d) {
  console.log(d);
  counter++;
  if (counter === count) {
    Q.emit('child-event', {
      data: 'all-ready'
    });
  }
});

Q.on('my-event', function(d) {
  console.log('(L1) my event:', d);
});

Q.on('my-event', function(d) {
  console.log('(L2) my event:', d);
});

Q.emit('my-event', {
  data: 'd'
});

Q.listenTask('my-task', function(d) {
  return d.num + 1;
});

Q.listenTask('my-task', function(d) {
  return d.num - 1;
});

Q.addTask('my-task', {
  num: 1
}).then(function(d) {
  console.log(d);
});


Q.addTask('my-task', {
  num: 1
}).then(function(d) {
  console.log(d);
});