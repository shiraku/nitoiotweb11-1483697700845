'use strict';
var path = require('path');

// Development specific configuration
// ==================================
module.exports = {
  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  /*/ //nitoiotweb11-cloudantNoSQLDB
  //Fill Cloudant connection credentials
   CHOST: "293adb3b-1a21-4933-a5b3-757ae3299f16-bluemix.cloudant.com",
   CPORT: "443",
   CUSER: "293adb3b-1a21-4933-a5b3-757ae3299f16-bluemix",
   CPASSWORD: "3964bf57dc7304fd04f72d2c9b38cb8ee84263a62f2bc0676a9fd293f4c3c221",
   CURL: "https://293adb3b-1a21-4933-a5b3-757ae3299f16-bluemix:3964bf57dc7304fd04f72d2c9b38cb8ee84263a62f2bc0676a9fd293f4c3c221@293adb3b-1a21-4933-a5b3-757ae3299f16-bluemix.cloudant.com"
   
  /*/ //nitoiotweb01-cloudantNoSQLDB
    CUSER: "62ea1b2c-ff5c-44e4-9e5a-5992c9cc72a5-bluemix",
    CPASSWORD: "b08a6d9483a32ebd7a92e3f2975fdb1b43b948457d810c8a5e48941f5e6fc1bb",
    CHOST: "62ea1b2c-ff5c-44e4-9e5a-5992c9cc72a5-bluemix.cloudant.com",
    CPORT: 443,
    CURL: "https://62ea1b2c-ff5c-44e4-9e5a-5992c9cc72a5-bluemix:b08a6d9483a32ebd7a92e3f2975fdb1b43b948457d810c8a5e48941f5e6fc1bb@62ea1b2c-ff5c-44e4-9e5a-5992c9cc72a5-bluemix.cloudant.com"
  //*/

};
