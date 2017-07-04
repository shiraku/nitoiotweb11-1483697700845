'use strict';

// Production specific configuration
// =================================
var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
module.exports = {
  /*/ //nitoiotweb11-cloudantNoSQLDB
   CHOST: vcapServices.cloudantNoSQLDB[0].credentials.host,
   CPORT: vcapServices.cloudantNoSQLDB[0].credentials.port,
   CUSER: vcapServices.cloudantNoSQLDB[0].credentials.username,
   CPASSWORD: vcapServices.cloudantNoSQLDB[0].credentials.password,
   CURL: vcapServices.cloudantNoSQLDB[0].credentials.url
  /*/ //nitoiotweb01-cloudantNoSQLDB
   CHOST: vcapServices.cloudantNoSQLDB[1].credentials.host,
   CPORT: vcapServices.cloudantNoSQLDB[1].credentials.port,
   CUSER: vcapServices.cloudantNoSQLDB[1].credentials.username,
   CPASSWORD: vcapServices.cloudantNoSQLDB[1].credentials.password,
   CURL: vcapServices.cloudantNoSQLDB[1].credentials.url
  //*/
};