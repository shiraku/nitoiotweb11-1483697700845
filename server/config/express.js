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
var CloudantStore = require('connect-cloudant')(expressSession);
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
  
  
var cloudantStore = new CloudantStore({
     url: curl,
     databaseName: 'sessions',
     prefix: 'sess',             //optional
     serializer:'parse',
     operationTimeout:2000,      //optional
     connectionTimeout:2000      //optional
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
  
  app.use(expressSession({
      store: cloudantStore,
      secret: 'nito',
      cookie: {maxAge:24*60*60*1000} //stay open for 1 day of inactivity
  }));

  
  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('appPath', path.join(config.root, 'public'));
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', path.join(config.root, 'client'));
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};