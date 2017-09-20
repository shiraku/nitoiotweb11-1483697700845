/**
 * ログイン認証 file
 */

'use strict';
//var express = require('express');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var cloudantUtil = require('./../../lib/cloudantUtil');
var app;

var Auth = function(ap){
  app = ap;
  this.init();
};

//passportの初初期化
Auth.prototype.init = function(){
//  cloudantUtil.init();
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  
  passport.use(new localStrategy(
    {
      usernameField: 'userId',
      passwordField: 'password'
    },
    function(userId, password, done) {
      cloudantUtil.M_userEntitity.getUser(userId, function(err, user){
          console.log("cloudantUtil.M_userEntitity.getUser");
          console.log(err);
          console.log(user);
        if(err) {return done(err);}
        if(!user) {
          return done(null, false, {message:'ユーザーIDが正しくありません。' });
        }
        if(password !== user.password){
//          return done(null, false, {message:'パスワードが正しくありません。' });
          return done(null, false, {message:'パスワードが正しくありません。' });
        }
        return done(null, user);
      });
    }
  ));
  
  //セッションをシリアライズ
  passport.serializeUser(function(user, done){
    console.log("serializeUser");
//    console.log(done);
    console.log(user);
    done(null, user);
  });
  
  
  //セッションをディシリアライズ
  passport.deserializeUser(function(serializeUser, done){
    console.log("deserializeUser");
//    console.log(done);
    console.log(serializeUser);
    done(null, serializeUser);
//      cloudantUtil.M_userEntitity.getUser(serializeUser._id.split("_")[1], function(err, user){
//          console.log("cloudantUtil.M_userEntitity.getUser");
//          console.log(err);
//          console.log(user);
//          done(err, user);
//      });
  });
};

//ログイン済みか検証
Auth.prototype.isLogined = function(req, res){

//  console.log("req.user@Auth.prototype.isLogined");
//  console.log(req.user);
//  console.log(req.isAuthenticated());
  
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