
var cradle = require('cradle');
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();

//cloudantに接続
var credential = appEnv.getServices('cloudantNoSQLDB');
console.log(credential);

cradle.setup({
  host: credential.host,
  cache: true
});

var c = new(cradle.Connection);

//my_sample_dbに接続
exports.my_sample_db = function(){
  var my_sample_db = c.database('my_sample_db');

  console.log('credential:');
  console.log(credential);
  console.log('my_sample_db:');
  console.log(my_sample_db);

  return my_sample_db;
} 