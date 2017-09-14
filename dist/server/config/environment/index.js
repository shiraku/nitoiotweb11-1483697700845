'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
//  env: process.env.NODE_ENV,


  // Server port
//  port: process.env.VCAP_APP_PORT || 9000,
//
//  // Server IP
//  ip: process.env.VCAP_APP_HOST || '0.0.0.0',

  // Should we populate the DB with sample data
//  seedDB: false, //this is replaced by seedDB in development.js

  // Secret for session, you will want to change this and make it an environment variable
//  secrets: 'sessions',

  // List of user roles
//  userRoles: ['guest', 'user', 'admin']

};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {}
  );
