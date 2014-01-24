var temp = require('temp');
var util = require('util');
var async = require('async');
var rimraf = require('rimraf');
var crypto = require('crypto');
var store = require('../lib/store');

function writer(root) {
  return function (n, done) {
    store.write(root, crypto.randomBytes(32), crypto.randomBytes(256), null, done);
  };
}

function writers(root, times) {
  return function (done) {
    async.times(times, writer(root), done);
  };
}

function test(times) {
  return function (test) {
    var label = util.format('write %d values', times);

    console.log(label);
    console.time(label);

    writers(this.root, times)(onWritersDone);

    function onWritersDone(error) {
      console.timeEnd(label);
      test.done();
    }
  };
};

module.exports = {
  setUp: function (done) {
    var self = this;

    temp.mkdir('root', function (error, root) {
      if (error) {
        return done(error);
      }

      self.root = root;

      done();
    });
  },

  tearDown: function (done) {
    rimraf(this.root, done.bind(null, null));
  }
};

var i;

for (i = 1000; i <= 100000; i *= 10) {
  module.exports['test' + i] = test(i);
}
