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
var deviceUnit = require('./api/device/deviceUnit');
var comment = require('./api/device/comment');
var user = require('./api/user/user');
var dataDownload = require('./api/analysis/data_download');
var auth;


module.exports = function(app) {
  
  
  auth = new Auth(app);
  

  // All undefined asset or api routes should return a 404
  app.route('/:url(auth|components|app|bower_components|public|assets)/*')
   .get(errors[404]);

  


    /**
   * ログイン関連のapi
   * メソッドによって処理が変わる
   * get:ログイン画面の表示
   * post:ログイン認証
   */
  app.get('/login',function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'),{query: req.query.query});
    });
  
  //ログイン認証　POST処理
  app.post('/login',function(req, res, next) {
    //IDまたはパスワードいずれかが見入力だった場合
    if(!req.body.userId || !req.body.password){
      return res.send({ authStat:false,   message: 'ユーザーIDとパスワードを入力してください。'});
    }
//      console.log("IDまたはパスワード");
//      console.log(req.body.userId, req.body.password);
    //認証チェック
    auth.authenticate('local', function(err, user, info) {
//      console.log("err, user, info@authenticate");
//      console.log(err, user, info);
      req.logIn(user, function(err) {
//      console.log("user, err, info@logIn");
//      console.log(user, err);
        //パスワードが間違っていた場合
        if (!user && !err) {
          console.log('error message');
          return res.send({ authStat:false, message: info.message});
        }
        //cloudantエラーまたは該当ユーザーが見つからない場合
        if (err) { 
          console.log('dont match id');
          return res.send({ authStat:false,   message: 'ユーザーIDが正しくありません。'});
        }
        //認証が取れた場合。パラメータのURLにリダイレクト
        //リダイレクト先がない場合はデバイス一覧へ
        var adminFlg = user.admin_mflg || false
        res.cookie('admin_mflg', adminFlg);
        res.cookie('user_id', user._id.split('_')[1]);
        if(!req.body.query) {
          console.log('login success');
          return res.status(200).send({ redirect:'/user_' + user._id.split('_')[1], authStat:true});
        }
        var url = decodeURIComponent(req.body.query);
          console.log('login success');
//        console.log(req.body);
        return res.status(200).send({ redirect:url, authStat:true});
      });
    })(req, res, next);
 });
  

  app.get('/logout',function(req, res) {
      req.logout();
      res.redirect('/');
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
    /**
   * アカウント関連のapi
   * メソッドによりCRADを判断
   * get:取得
   * post:追加・更新
   * delete:削除
   */
  app.get('/api/user/',function(req, res) {
      if(!req.user) res.status(500).json({ error: "ログインされていません" });
      user.getUser(req,res);
    });
  app.post('/api/user/',function(req, res) {
      user.updateUser(req,res);
    });
  
    /**
   * メール送信先関連のapi
   * メソッドによりCRADを判断
   * get:取得
   * post:追加・更新
   * delete:削除
   */
  //読み込み
  app.get('/api/user/sendto/',function(req, res) {
      user.getSendtoUser(req,res);
    });
  //追加・更新
  app.post('/api/user/sendto/check/',function(req, res) {
      user.checkSendtoUser(req,res);
    });
  //追加・更新
  app.post('/api/user/sendto/',function(req, res) {
      user.saveSendtoUser(req,res);
    });
  //削除
  app.delete('/api/user/sendto/:key',function(req, res) {
      user.deleteSendtoUser(req,res);
    }); 
  
  
    /**
   * デバイス一覧関連のapi
   * 紐づいているデバイスの最新情報をまとめて返す
   * グラフ情報を別API（/api/device_history_eq/:id）
   */
  //show
  app.get('/api/device_list',function(req, res) {
      deviceList.getList(req,res);
    });
  app.get('/api/device_list/logdate/:id/:date/:type',function(req, res) {
      deviceList.getListLogDate(req,res);
    });
  
//  
//  //デバイス一覧履歴取得API
//  //一覧での履歴取得ができないためコメントアウト
//  //履歴情報は/api/device_history_:type/:idにてデバイス毎に取得
//  //show
//  app.get('/api/device_history_eq',function(req, res) {
//      deviceList.getHistory(req,res);
//    });
  
  
    /**
   * デバイス単体関連のapi
   * デバイスの基本情報と最新情報を返す
   * 履歴は別API（/api/device_history_:type/:id）
   */
  //show
  app.get('/api/device_detail/:id',function(req, res) {
      deviceUnit.getDeviceDetail(req,res);
    });
    /**
   * デバイス単体の特定日付のログデータapi
   * デバイスの特定日付の情報を返す
   * 履歴は別API（/api/device_history_:type/:id）
   */
  //show
  app.get('/api/device_detail_data/:id/:date/:type',function(req, res) {
      deviceUnit.getDeviceDetailDate(req,res);
    });
  
    /**
   * デバイス単体関連のapi
   * デバイスの基本情報のみを返す
   * 履歴は別API（/api/device_history_:type/:id）
   */
  //show
  app.get('/api/device_basicinfo/:id',function(req, res) {
      deviceUnit.getDeviceBasicInfo(req,res);
    });
  //show
  app.post('/api/device_basicinfo/:id',function(req, res) {
      deviceUnit.updateDeviceBasicInfo(req,res);
    });
  

    /**
   * 履歴関連のapi
   * リクエスト日から１年前までのデータを返却する
   * prams:type eq=地震 fl=雷
   * prams:id デバイスID（５桁の数字）
   */
  //show
  app.get('/api/device_history_:type/:id',function(req, res) {
      deviceUnit.getHistory(req,res);
    });

  
  
    /**
   * デバイスのの登録されているメールアドレスapi
   * デバイスに紐づいているすべてのメールアドレスを返却する
   * prams:id デバイスID（５桁の数字）
   */
  app.get('/api/device_sender_list/:id',function(req, res) {
      deviceUnit.getSenderList(req,res);
    });
  
  
  
    /**
   * 環境センサーのデータを取得するapi
   * 環境センサーのデバイスIDを元にデータを返却する
   * prams:id デバイスID（５桁の数字）
   */
  app.get('/api/device_env_latest/:id',function(req, res) {
      deviceUnit.getEnvLatest(req,res);
    });
  app.get('/api/device_env_forcast/:latlon',function(req, res) {
      deviceUnit.getEnvForcast(req,res);
    });
  
  
    /**
   * コメント関連のapi
   * 感知日IDを元にコメントを取得、投稿する
   * prams:id 感知日ID（yyyymmddhhmmss）
   * メソッドによりCRADを判断
   * get:取得
   * post:追加・更新
   */
  app.get('/api/comment/related/:id',function(req, res) {
      comment.getRelatedComment(req,res);
    });
  app.get('/api/comment/:id',function(req, res) {
      comment.getComment(req,res);
    });
  app.post('/api/comment/:id',function(req, res) {
      comment.saveComment(req,res);
    });


    /**
   * グラフイメージのapi
   * 合成加速度のイメージを返却
   * prams:id データ履歴ID（デバイスID＋データ発生時間）
   */
  //show
  app.get('/api/chart_acceleration/:id',function(req, res) {
      deviceUnit.getChartImage(req,res);
    });

    /**
   * 環境センサーのグラフイメージのapi
   * id:デバイス番号（00014)だけ入れてあります）
   * type:グラフの種類
   *  TEMP    温度、湿度
   *  DISC    不快指数
   *  NOIS     騒音
   *  PRES   気圧
   *  UVI       紫外線
   */
  //show
  app.get('/api/chart_env_:id/:type',function(req, res) {
      deviceUnit.getEnvChartImage(req,res);
    });


    /**
   * アラート設定のapi
   * アラート閾値の設定と設定値を返却
   * prams:id ユーザーID（U数字３桁）
   */
  //show
  app.get('/api/alert/',function(req, res) {
      user.getAlert(req,res);
    });
  app.post('/api/alert/',function(req, res) {
      user.updateAlert(req,res);
    });
  


    /**
   * CSVダウンロードのapi
   * パメータのtypeに対応したCSVデータを返却
   * prams:type データ種別
   * prams:st 開始日
   * prams:et 終了日
   */
  //show
  app.get('/api/csv/:dev/:type/st_:st/et_:et',function(req, res) {
      dataDownload.getCSV(req,res);
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
