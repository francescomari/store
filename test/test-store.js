var temp = require('temp');
var rimraf = require('rimraf');
var store = require('../lib/store');

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
    rimraf(this.root, done);
  },

  testReadWrite: function (test) {
    var root = this.root;

    store.write(root, 'key', 'value', 'utf8', onContentWritten);

    function onContentWritten(error) {
      test.ifError(error);
      store.read(root, 'key', 'utf8', onContentRead);
    }

    function onContentRead(error, exists, value) {
      test.ifError(error);
      test.ok(exists);
      test.equal(value, 'value');
      test.done();
    }
  },

  testWriteTwice: function (test) {
    var root = this.root;

    store.write(root, 'key', 'value', 'utf8', onFirstContentWritten);

    function onFirstContentWritten(error) {
      test.ifError(error);
      store.write(root, 'key', 'value', 'utf8', onSecondContentWritten);
    }

    function onSecondContentWritten(error) {
      test.ifError(error);
      test.done();
    }
  },

  testReadNonExistent: function (test) {
    var root = this.root;

    store.read(root, 'key', 'utf8', onContentRead);

    function onContentRead(error, exists, content) {
      test.ifError(error);
      test.equal(exists, false);
      test.done();
    }
  }
};
