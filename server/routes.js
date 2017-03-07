/**
 * 各ページへのルーティングを定義
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var cloudantUtil = require('./lib/cloudantUtil');
var passport = require('passport');
var auth = require('./components/auth');


module.exports = function(app) {
  
  cloudantUtil.init();
  
  // Insert routes below
  app.use('/api/things', require('./api/thing'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);


  // All other routes should redirect to the index.html
  app.get('/login',function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
  
  app.post('/login',function(req, res) {
      passport.authenticate('local',{
      successeRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
      })
  });
  
  // All other routes should redirect to the index.html
  app.get('/*',function(req, res) {
      if(auth.isLogined){
        res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
      }else{
        var url = encodeURIComponent(req.path);
        res.redirect('/login?query=' + url);
      }
    });
  

};
