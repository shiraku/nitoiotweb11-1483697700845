'use strict';
var path = require('path');

// Test specific configuration
// ===========================
module.exports = {
  // Root path of server
  root: path.normalize(__dirname + '/../../..'),
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/nitoiotweb11-test'
  }
};