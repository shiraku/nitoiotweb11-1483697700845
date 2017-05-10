/**
 * Main application file
 */

'use strict';

// Set default node environment to development; Bluemix runtime is production
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');

// Setup server
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// bootstrap bluemix
var host = (process.env.VCAP_APP_HOST || 'localhost');
var port = (process.env.VCAP_APP_PORT || 9000);

if (host !== 'localhost') app.set('env', 'production');



require('./config/express')(app);
require('./routes')(app);
 
//socket.io
io.on('connection', function(socket){
  console.log('a use connected');
  //キャストイベント
  socket.on('update', function(dat){
    io.emit('update', dat);
  });
  socket.on('cansel', function(msg){
    console.log(socket.id + ' : ' + msg);
    io.emit('cansel', socket.id);
  });
})

// Original Start server
//server.listen(config.port, config.ip, function () {
//  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
//});


// app.post('/login', function(req, res) {
//     console.log('Processing request...');
//     res.sendFile('/success.html');
// });
//app.post('/login', function(req, res) {
//    // console.log(req.body.desc);
//    console.log("hello");
//    res.end();
//});
// Cloudant用アクセス・モジュール「cradle」設定
// var cradle = require('cradle');
//
// // Cloudant DB接続情報取得
// var services = JSON.parse(process.env.VCAP_SERVICES);
// var credentials = services['cloudantNoSQLDB'][0].credentials;
// var host = credentials.host;
// var port = credentials.port;
// var options = {
//  cache : true,
//  raw : false,
//  secure : true,
//  auth : {
//  username : credentials.username,
//  password : credentials.password
//  }
// };
// // データベース接続
// var db = new (cradle.Connection)(host, port, options).database('sample_db');
//
// //「全件表示」ボタンの id=getAll, ui_item.jsの url:'/getAll'でcall
// app.post('/getAll', function(req, res){
//  returnTable(res);
// });
//
// var returnTable = function(res) {
//  // 全件検索を、作成したview名 items_view にて実行
//  db.view('/sample_db', function (err, rows) {
//  if (!err) {
//  rows.forEach(function (id, row) {
//  console.log("key: %s, row: %s", id, JSON.stringify(row));
//  });
//  } else { console.log("app.js returnTable error: " + err); }
//
//  res.send(rows);
//  });
// };

// // 「追加」ボタンの id=add, ui_item.jsの url:'/add'でcall
// app.post('/add', function(req, res){
//  var date = new Date();
//  var now = date.toFormat("YYYY/MM/DD HH24:MI:SS");
//  req.body.date = now;
//
//  // 項目の保存
//  db.save(now, req.body);
//  console.log('app.js saved: ' + JSON.stringify(req.body));
//
//  res.send(req.body);
// });

// //「全件削除」ボタンの id=removeAll, ui_item.jsの url:'/removeAll'でcall
// app.post('/removeAll', function(req, res){
//
//  // 全件検索を、作成したview名 items_view にて実行
//  db.view('items/items_view', function (err, rows) {
//  if (!err) {
//  rows.forEach(function (id, row) {
//  db.remove(id);
//  console.log("removed key is: %s", id);
//  });
//  } else { console.log("app.js db.remove error: " + err); }
//
//  });
//
//  res.send({});
// });




// //環境変数にポート番号が無ければ、port=3000 設定
// var port = (process.env.VCAP_APP_PORT || 3000);
// // サーバー開始
// app.listen(port);
// console.log('App started on port ' + port);




// https://293adb3b-1a21-4933-a5b3-757ae3299f16-bluemix.cloudant.com/sample_db/_all_docs?limit=100

// Start server
app.listen(port, host);
console.log('App started on port ' + port);
console.log(app.get('env'));
console.log(config);

// Expose app
exports = module.exports = app;
