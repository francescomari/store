var fs = require('fs');
var path = require('path');
var async = require('async');
var crypto = require('crypto');

module.exports = {
  read: read,
  write: write
};

function getHash(key) {
  return crypto.createHash('sha1').update(key, 'utf8').digest('hex');
}

function getDirectory(hash) {
  return hash.slice(0, 2);
}

function getFile(hash) {
  return hash.slice(2);
}

function write(root, key, value, encoding, done) {
  var hash = getHash(key);
  var directory = path.join(root, getDirectory(hash));
  var file = path.join(directory, getFile(hash));

  var tasks = [
    checkDirectoryExists,
    createDirectory,
    checkFileExists,
    writeFile
  ];

  async.waterfall(tasks, done);

  function checkDirectoryExists(done) {
    fs.exists(directory, done.bind(null, null));
  }

  function createDirectory(exists, done) {
    if (exists) {
      return done();
    }

    fs.mkdir(directory, done);
  }

  function checkFileExists(done) {
    fs.exists(file, done.bind(null, null));
  }

  function writeFile(exists, done) {
    if (exists) {
      return done();
    }

    fs.writeFile(file, value, {encoding: encoding}, done);
  }
}

function read(root, key, encoding, done) {
  var hash = getHash(key);
  var file = path.join(root, getDirectory(hash), getFile(hash));

  var tasks = [
    checkFileExists,
    readFile,
    returnValue
  ];

  async.waterfall(tasks, done);

  function checkFileExists(done) {
    fs.exists(file, done.bind(null, null));
  }

  function readFile(exists, done) {
    if (!exists) {
      return done(null, false);
    }

    fs.readFile(file, {encoding: encoding}, done);
  }

  function returnValue(value, done) {
    done(null, true, value);
  }
}
