'use strict';

// Production specific configuration
// =================================
var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
module.exports = {

   CHOST: vcapServices.cloudantNoSQLDB[0].credentials.host,
   CPORT: vcapServices.cloudantNoSQLDB[0].credentials.port,
   CUSER: vcapServices.cloudantNoSQLDB[0].credentials.username,
   CPASSWORD: vcapServices.cloudantNoSQLDB[0].credentials.password;,
   CURL: vcapServices.cloudantNoSQLDB[0].credentials.url
};