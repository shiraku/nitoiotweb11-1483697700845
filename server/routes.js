/**
 * 各ページへのルーティングを定義
 */

'use strict';

var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');
var errors = require('./components/errors');
var Auth = require('./components/auth');
var deviceList = require('./api/device/deviceList');
var auth = new Auth();


module.exports = function(app) {
  
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  

  // All undefined asset or api routes should return a 404
  app.route('/:url(auth|components|app|bower_components|assets)/*')
   .get(errors[404]);


  // All other routes should redirect to the index.html
  app.get('/login',function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'),{query: req.query.query});
    });
  
  //ログイン認証　POST処理
  app.post('/login',function(req, res, next) {
    //IDまたはパスワードいずれかが見入力だった場合
    if(!req.body.userId || !req.body.password){
      return res.status(302).send({ redirect:'/login', authStat:false,   message: 'ユーザーIDとパスワードを入力してください。'});
    }
    //認証チェック
    auth.authenticate('local', function(err, user, info) {
      req.logIn(user, function(err) {
        //パスワードが間違っていた場合
        if (!user && !err) {
//          console.log('dont match password');
          return res.status(302).send({ redirect:'/login',   authStat:false, message: info.message});
        }
        //cloudantエラーまたは該当ユーザーが見つからない場合
        if (err) { 
//          console.log('dont match id');
          return res.status(302).send({ redirect:'/login', authStat:false,   message: 'ユーザーIDが正しくありません。'}); 
        }
        //認証が取れた場合。パラメータのURLにリダイレクト
        //リダイレクト先がない場合はデバイス一覧へ
        if(!req.body.query) return res.status(200).send({ redirect:'/user_' + req.body.userId, authStat:true});
        var url = decodeURIComponent(req.body.query);
//        console.log(req.body);
        return res.status(200).send({ redirect:url, authStat:true});
      });
    })(req, res, next);
 });
  
  app.get('/status', function(req, res) {
    if (!req.isAuthenticated()) {
      return res.status(200).json({
        status: false
      });
    }
    res.status(200).json({
      status: true
    });
  });
  
  
  //APIは認証チェック対象外
  //デバイス情報取得API
  //show
  app.get('/api/device_list',function(req, res) {
      deviceList.show(req,res);
//      if(!dat.device_list) {
//        return res.status(500).send(dat);
//      } else {
//        return res.status(200).send(dat);
//      }
    });
  
  //create
  
  
  //updata
  
  
  //delete
  
  
  // All other routes should redirect to the index.html
  app.get('/*',function(req, res) {
      if(auth.isLogined(req, res)){
        res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
      }else{
        var url = encodeURIComponent(req.path);
        res.redirect('/login?query=' + url);
      }
    });
  

};
