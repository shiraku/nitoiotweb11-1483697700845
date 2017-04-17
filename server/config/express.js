/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var expressSession = require('express-session');
//var CloudantStore = require('connect-cloudant')(expressSession);
var CloudantStore = require('sessionstore-cloudant');
var path = require('path');
var config = require('./environment');

  //var dbName = config.ROOT_DB,
  var curl = config.CURL;
  var chost = config.CHOST;
  var cport = config.CPORT;
  var cuser = config.CUSER;
  var cpassword = config.CPASSWORD;


module.exports = function(app) {
  var env = app.get('env');
  
  
//var cloudantStore = new CloudantStore({
//     url: curl,
//     databaseName: 'sessions'
//});
  
  var cloudantStore = CloudantStore.createSessionStore({
        type: 'couchdb',
        host: 'https://' + chost,
        port: cport,
        dbName: 'sessions',
        options: {
		auth: {
			username: cuser,
			password: cpassword
		},
		cache: false
	}
});

  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
//  app.use(expressSession({secret: 'nito'}));
  
//  cloudantStore.on('connect', function() {
//    app.use(expressSession({
//        secret: 'nito',
//       // store: cloudantStore,
//        cookie: {maxAge:24*60*60*1000}
//    }));
//  });
    app.use(expressSession({
        secret: 'nito',
        store: cloudantStore,
        cookie: {maxAge:24*60*60*1000}
    }));

  
  if ('production' === env) {
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', path.join(config.root, 'client'));
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }

  if ('development' === env || 'test' === env) {
//    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', path.join(config.root, 'client'));
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};