'use strict'

let Queue = require('./queue.js');

describe('Queue', () => {
  let queue;

  beforeEach(() => {
    queue = new Queue();
  });
  it('#constructor', () => {
    expect(queue).to.be.an.instanceof(Queue);
  });

  describe('methods', () => {
    it('publish-subscribe', (done) => {
      let counter = 0;
      let cb = function(data) {
        counter++;
        if (counter == 2) {
          expect(counter).to.be.equal(2);
          done();
        }
      };

      queue.on('system', cb);
      queue.on('system', cb);

      queue.emit('system', {
        state: 'ready'
      });

    });
    for (let test = 5; test < 10; test++) {
      let fib = function(n) {
        return n <= 1 ? n : fib(n - 1) + fib(n - 2);
      };
      let expected = fib(test);

      it('task-response fib(' + test + ')=' + expected, function(d) {
        let result = 0;
        queue.listenTask('fib', (data) => {
          return fib(data);
        });
        queue.addTask('fib', test).then((r) => {
          result = r;
          expect(result).to.be.equal(expected);
          d();
        })
      });
    }
  });

});