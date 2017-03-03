/**
 * ログイン認証 file
 */

'use strict';
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

module.exports = function(){
  passport.use(new localStrategy(
    function(username,password, done) {
      User.findOne({ username: username},fuction(err, user){
        if(err) {return done(err);}
        if(!user){
          return done(null, false, {message: 'ユーザーIDが正しくありません。'});
        }
      if(!user.validPassword(password)){
        return done(null,false, {message: 'パスワードが正しくありません。'});
      }
      return done(null, user);
      });
    }
  ));
  
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, done){
      done(err, user);
    });
  });
}

exports.isLogined = function(req, res, next){
  if(req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login?url=' + url');
  }
}