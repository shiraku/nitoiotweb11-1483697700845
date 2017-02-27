/**
 * 各ページへのルーティングを定義
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/things', require('./api/thing'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
  //UC000	ログイン
  app.route('/login')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
  //UC001	メニュー画面
  app.route('/menu')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
  //UC002	デバイス一覧画面
  app.route('/device')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
          //UC003	一覧グラフ画面
          app.route('/device/deviceGraph')
            .get(function(req, res) {
              res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
            });
          //UC004	一覧マップ画面
          app.route('/device/deviceMap')
            .get(function(req, res) {
              res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
            });
          //UC005	デバイス詳細画面
          app.route('/device/deviceDetail')
            .get(function(req, res) {
              res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
            });
                  //UC006	デバイスマップ
                  app.route('/device/deviceDetail/deviceDetailMap')
                    .get(function(req, res) {
                      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
                    });
                  //UC007	デバイスグラフ
                  app.route('/device/deviceDetail/deviceDetailGraph')
                    .get(function(req, res) {
                      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
                    });
  //UC009	デバイスグループ画面
  app.route('/deviceManagement')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
          //UC010	グループ名編集画面
          app.route('/deviceManagement/deviceNameEdit')
            .get(function(req, res) {
              res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
            });
          //UC011	デバイス情報編集画面
          app.route('/deviceManagement/deviceInfoEdit')
            .get(function(req, res) {
              res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
            });
          //UC012	緯度経度入力補完マップ（モーダル）
          app.route('/deviceManagement/latLonInputMap')
            .get(function(req, res) {
              res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
            });
          //UC015	メール送信者追加画面
          app.route('/deviceManagement/mailSenderAdd')
            .get(function(req, res) {
              res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
            });
          //UC016	メール送信者編集画面
          app.route('/deviceManagement/mailSenderEdit')
            .get(function(req, res) {
              res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
            });
          //UC017	メール送信者削除（モーダル）
          app.route('/deviceManagement/mailSenderDelete')
            .get(function(req, res) {
              res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
            });
          //UC018	アラート設定画面
          app.route('/deviceManagement/alertSetting')
            .get(function(req, res) {
              res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
            });
  //UC019	ダウンロードCSV項目設定画面
  app.route('/downloadCSV')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });


};
