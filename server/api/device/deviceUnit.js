/**
 * デバイスリスト file
 */

'use strict';
var express = require('express');
var fs = require('fs');
var cloudantUtil = require('./../../lib/cloudantUtil');
var app = express();

  /***********************************************
 * デバイス単体 deviceUnit
 * getDeviceDetail:メール送信先の取得api file
 * getDeviceBasicInfo:メール送信先の更新と追加api
 * getHistory:メール送信先の削除api
 * getChartImage:メール送信先の削除api
 *************************************************/
var deviceUnit = {
  /**
 * デイバス情報履歴も含めた全てのデータ
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  getDeviceDetail : function(req,res) {
//    console.log('セッションユーザー情報@deviceListクラス');
//    console.log(req.user);
    if(!req.user) {
      return res.status('500').json({ error: "ログインされていません" });
    }
    var userDevice = req.params.id;
    var self = this;
    var reqest = req;
    var response = res;
    var deviceJson;
    cloudantUtil.M_deviceEntitity.getDevice(userDevice, function(err, dat){
      if(err) {return response.status('500').json(err);}
      deviceJson = dat;
      cloudantUtil.Eq_dEntitity.getLatest(userDevice, function(err, dat){
        if(err) {return response.status('500').json(err);}
        if(dat.length){
          deviceJson["earthquakeCurrentData"] = dat[0].value;
        }
//        console.log('earthquakeCurrentData@getInfo');
//        console.log(deviceJson);
        cloudantUtil.Fl_dEntitity.getLatest(userDevice, function(err, dat){
          if(err) {return response.status('500').json(err);}
          if(dat.length){
            deviceJson["thunderCurrentData"] = dat[0].value;
          }
  //        console.log('thunderCurrentData@getInfo');
  //        console.log(deviceJson);
          return response.status('200').json(deviceJson);
        });
      });
    });
  },
  
  /**
 * デイバスの基本データのみ
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  getDeviceBasicInfo : function(req,res) {
//    console.log('セッションユーザー情報@deviceListクラス');
//    console.log(req.user);
    if(!req.user) {
      return res.status('500').json({ error: "ログインされていません" });
    }
    var userDevice = req.params.id;
    var reqest = req;
    var response = res;
    cloudantUtil.M_deviceEntitity.getDevice(userDevice, function(err, dat){
      if(err) {return response.status('500').json(err);}
      return response.status('200').json(dat);
    });
  },
  /**
 * デイバスの基本データのみ
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  updateDeviceBasicInfo : function(req,res) {
//    console.log('セッションユーザー情報@deviceListクラス');
//    console.log(req.user);
    if(!req.user) {
      return res.status('500').json({ error: "ログインされていません" });
    }
    var userDevice = 'DEV_' + req.params.id;
    var reqest = req;
    var response = res;
    var option = new Object();
    option[req.body.key] = req.body.value;
    console.log('userDevice,option@updateDeviceBasicInfo');
    console.log(userDevice,option);
    cloudantUtil.M_deviceEntitity.updateDevice(userDevice, option, function(err, dat){
//    console.log('err@updateDeviceBasicInfo');
//    console.log(err);
//    console.log('dat@updateDeviceBasicInfo');
//    console.log(dat);
      if(err) {return response.status('200').send({message:'更新できませんした。', error: true});}
      return response.status('200').send({message:'更新しました。'});
    });
  },
  
  /**
 * デイバスの履歴データのみ
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  getHistory : function(req,res){
    if(!req.user) {
      return res.status('500').json({ error: "ログインされていません" });
    }
    var userDevice = req.params.id;
    var self = this;
    var reqest = req;
    var response = res;
    if(req.params.type == 'eq'){
      cloudantUtil.Eq_dEntitity.getHistory(userDevice, function(err, dat){
        if(err) {return response.status('500').json(err);}
        return response.status('200').json(dat);
      });
    } else {
      cloudantUtil.Fl_dEntitity.getHistory(userDevice, function(err, dat){
        if(err) {return response.status('500').json(err);}
        return response.status('200').json(dat);
      });
    }
  },
  
  /**
 * 合成加速度のイメージ
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  getChartImage : function(req,res){
    if(!req.user) {
      return res.status('500').json({ error: "ログインされていません" });
    }
    var userDevice = req.params.id;
    
      console.log(userDevice);
    var self = this;
    var reqest = req;
    var response = res;
    cloudantUtil.EqimageEntitity.getChartImage(userDevice, function(err, dat){
//      console.log("dat@getChartImage");
//      console.log(dat);
      if(err) {return response.status('404').sendfile(err);}
      res.writeHead( 200, { 'Content-type': 'image/jpeg; charset=utf-8' } );
      res.end( dat );
    });
  }
  
}
module.exports = deviceUnit;