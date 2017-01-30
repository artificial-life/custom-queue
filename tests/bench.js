'use strict';

var Benchmark = require('benchmark');

var suite = new Benchmark.Suite;
let Queue = require('../src/queue.js');
let TestQueue = require('../src/queues/event-queue.js');
// add tests
let queue = new Queue();
let test = new TestQueue();
let c = 0;

queue.on('counter', x => c++);
test.on('counter', x => c++);

suite.add('pubsub', function () {
		queue.emit('counter', {
			x: 'test'
		});
	})
	.add('pubsub test', function () {
		test.emit('counter', {
			x: 'test'
		});
	})
	// add listeners
	.on('cycle', function (event) {
		console.log(String(event.target));
	})
	.on('complete', function () {
		console.log('Fastest is ' + this.filter('fastest').map('name'));
	})
	// run async
	.run({
		'async': true
	});
