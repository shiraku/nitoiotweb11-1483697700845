/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------
// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// require middle ware
const app = express();
var http = require('http').createServer(app);
const bodyParser = require('body-parser');
var appEnv = cfenv.getAppEnv();

console.log(appEnv);


//Modelの読み込み
var db = require('./model/database');
//Controlの読み込み
var routes = require('./routes');
var index = require('./routes/index');
var api = require('./routes/api');



//Views,テンプレートエンジンの設定
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');



//body-parserの設定
app.use(bodyParser.urlencoded({
  extended:true
}));



//ルーティング
//index
app.get('/',routes.index);
//api
app.get('/api/',api.api);


// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));



//http.listen(8080);
http.listen(appEnv.port);
/*
app.listen(appEnv.port, appEnv.host, function() {
  // print a message when the server starts listening
  //console.log("server starting on " + appEnv.url);
  console.log("server starting on " + appEnv.host + ":" + appEnv.port);  
});
*/
