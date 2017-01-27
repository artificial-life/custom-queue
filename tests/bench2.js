'use strict';

const Benchmark = require('benchmark');

const suite = new Benchmark.Suite;
const Queue = require('../src/queue.js');
const TestQueue = require('../src/queues/event-queue.js');
const EE2 = require('eventemitter2').EventEmitter2;
const EventEmitter = require('events');
// add tests
const queue = new Queue();
const test = new TestQueue();
const ee = new EE2();
const eclassic = new EventEmitter();

queue.on('counter', x => 1 == 1);
ee.on('counter', x => 1 == 1)

suite.add('wrapped queue', {
    fn: function() {
      queue.emit('counter', 'data');
    }
  })

  .add('ee2', {

    fn: function() {
      ee.emit('counter', 'data');
    }
  })

  // add listeners
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({
    'async': !0
  });
