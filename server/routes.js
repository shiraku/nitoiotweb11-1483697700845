/**
 * 各ページへのルーティングを定義
 */

'use strict';

var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');
var errors = require('./components/errors');
var Auth = require('./components/auth');
//var cloudantUtil = require('./../../lib/cloudantUtil');
var deviceList = require('./api/device/deviceList');
var deviceDetail = require('./api/deviceUnit/deviceDetail');
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
  //アカウント情報取得API
  app.get('/api/user/',function(req, res) {
      if(!req.user) res.status(500).json({ error: "ログインされていません" });
      var obj = new Object();
      obj["device"] = req.user.device;
      obj["sendto"] = req.user.sendto;
      res.status(200).json(obj);
    });
  
  //デバイス一覧情報取得API
  //show
  app.get('/api/device_list',function(req, res) {
      deviceList.getList(req,res);
    });
  
//  
//  //デバイス一覧履歴取得API
//  //一覧での履歴取得ができないためコメントアウト
//  //履歴情報は/api/device_history_:type/:idにてデバイス毎に取得
//  //show
//  app.get('/api/device_history_eq',function(req, res) {
//      deviceList.getHistory(req,res);
//    });
  
  
  //デバイス情報取得API
  //show
  app.get('/api/device_detail/:id',function(req, res) {
      deviceDetail.getInfo(req,res);
    });
  

  //地震、雷履歴取得API
  //show
  app.get('/api/device_history_:type/:id',function(req, res) {
      deviceDetail.getHistory(req,res);
    });

  //合成加速度イメージ取得API
  //show
  app.get('/api/chart_acceleration/:id',function(req, res) {
      deviceDetail.getChartImage(req,res);
    });
  
  // All other routes should redirect to the index.html
  app.get('/*',function(req, res) {
      if(auth.isLogined(req, res)){
        res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
      }else{
        var url = encodeURIComponent(req.path);
        res.redirect('/login?query=' + url);
      }
//        res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
  

};
