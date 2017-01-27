'use strict'

let Queue = require('./queue.js');

let fib = function(n) {
  return n <= 1 ? n : fib(n - 1) + fib(n - 2);
};
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
  describe('features', () => {
    it('apply domain', (d) => {
      queue.addRouter({
        domain: 'default',
        do: function(event, data) {
          return this.domain + '/' + event;
        },
        act: function(event) {
          return this.domain + '/' + event;
        }
      });
      queue.listenTask('fib', (data) => {
        return fib(data);
      });
      let expected = fib(1);
      queue.do('fib', 1).then((result) => {
        expect(result).to.be.equal(expected);
        d();
      })
    });

    it('apply domain event', (d) => {
      queue.addRouter({
        domain: 'default',
        emit: function(event, data) {
          return this.domain + '/' + event;
        },
        on: function(event) {
          return this.domain + '/' + event;
        }
      });
      queue.on('fib', (data) => {
        expect(data).to.be.equal(100);
        d();
      });

      queue.emit('fib', 100);
    });

    it('use plugin', (d) => {
      let store = 'nope'
      queue.addPlugin({
        emit: (event, data) => store = event,
        on: (event) => true,
        do: () => true,
        act: () => true
      });

      queue.on('fib', (data) => {
        expect(store).to.be.equal('fib');
        d();
      });

      queue.emit('fib', 100);
    })
  });
});
