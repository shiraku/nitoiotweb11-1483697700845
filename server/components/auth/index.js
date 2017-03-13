/**
 * ログイン認証 file
 */

'use strict';
var express = require('express');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var cloudantUtil = require('./../../lib/cloudantUtil');
var app = express();

var Auth = function(){
  this.init();
};

//passportの初初期化
Auth.prototype.init = function(){
//  cloudantUtil.init();
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(new localStrategy(
    {
      usernameField: 'userId',
      passwordField: 'password'
    },
    function(userId, password, done) {
      cloudantUtil.M_userEntitity.getUser(userId, function(err, user){
        if(err) {return done(err);}
        if(!user) {
          return done(null, false, {message:'ユーザーIDが正しくありません。' });
        }
        if(password !== user.password){
          return done(null, false, {message:'パスワードが正しくありません。' });
        }
        return done(null, user);
      });
    }
  ));
  
  //セッションをシリアライズ
  passport.serializeUser(function(user, done){
    done(null, {userId: user._id});
  });
  
  //セッションをディシリアライズ
  passport.deserializeUser(function(serializeUser, done){
    cloudantUtil.M_userEntitity.getUser(serializeUser.userId.split('_')[1], function(err, user){
        done(err, user);
    });
  });
};

//ログイン済みか検証
Auth.prototype.isLogined = function(req, res){
  if(req.isAuthenticated()) {　//ログイン済み
    return true;
  } else {　//見ログイン
    return false;
  }
};

//認証チェック　passportのメソッド
Auth.prototype.authenticate = function(strategy, options, callback) {
  return passport.authenticate(strategy, options, callback);
};

module.exports = Auth;