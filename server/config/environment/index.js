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

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),
  
  //Fill Cloudant connection credentials
   CHOST: "293adb3b-1a21-4933-a5b3-757ae3299f16-bluemix.cloudant.com",
   CPORT: "443",
   CUSER: "293adb3b-1a21-4933-a5b3-757ae3299f16-bluemix",
   CPASSWORD: "3964bf57dc7304fd04f72d2c9b38cb8ee84263a62f2bc0676a9fd293f4c3c221",
   CURL: "https://293adb3b-1a21-4933-a5b3-757ae3299f16-bluemix:3964bf57dc7304fd04f72d2c9b38cb8ee84263a62f2bc0676a9fd293f4c3c221@293adb3b-1a21-4933-a5b3-757ae3299f16-bluemix.cloudant.com"

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
  all
//  require('./' + process.env.NODE_ENV + '.js') || {});
  );
