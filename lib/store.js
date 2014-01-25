var fs = require('fs');
var path = require('path');
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

  fs.mkdir(directory, onDirectoryCreated);

  function onDirectoryCreated(error) {
    if (error && error.code !== 'EEXIST') {
      return done(error);
    }

    fs.writeFile(file, value, {encoding: encoding}, done);
  }
}

function read(root, key, encoding, done) {
  var hash = getHash(key);

  var directory = path.join(root, getDirectory(hash));
  var file = path.join(directory, getFile(hash));

  fs.readFile(file, {encoding: encoding}, onFileRead);

  function onFileRead(error, data) {
    if (error) {
      if (error.code === 'ENOENT') {
        return done(null, false);
      }
      else {
        return done(error);
      }
    }

    done(null, true, data);
  }
}
