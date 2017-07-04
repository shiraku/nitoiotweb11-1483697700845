/**
 * デバイスリスト file
 */

'use strict';
var express = require('express');
var fs = require('fs');
var request = require('request');
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
      return res.status('200').json({ error: "ログインされていません" });
    }
    var userDevice = req.params.id;
    var self = this;
    var reqest = req;
    var response = res;
    var deviceJson;
    cloudantUtil.M_deviceEntitity.getDevice(userDevice, function(err, dat){
      if(err) {return response.status('200').json(err);}
      deviceJson = dat;
      
//        console.log('M_deviceEntitity.getDevice@getDeviceDetail');
//        console.log(deviceJson);
      cloudantUtil.Eq_dEntitity.getLatest(userDevice, function(err, dat){
        if(err) {return response.status('200').json(err);}
//        console.log("Eq_dEntitity.getLatest.dat");
//        console.log(dat.docs);
        if(dat.docs.length){
          if(!dat.docs[0].data.datas[0].seismicIntensity) dat.docs[0].data.datas[0]["seismicIntensity"] = dat.docs[0].data.datas[0].value;
          deviceJson["earthquakeCurrentData"] = dat.docs[0];
        }
//        console.log('earthquakeCurrentData@getDeviceDetail');
//        console.log(deviceJson);
        cloudantUtil.Fl_dEntitity.getLatest(userDevice, function(err, dat){
          if(err) {return response.status('200').json(err);}
          if(dat.length){
            deviceJson["thunderCurrentData"] = dat[0].value;
          }
//          console.log('thunderCurrentData@getDeviceDetail');
//          console.log(deviceJson);
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
      return res.status('200').json({ error: "ログインされていません" });
    }
    var userDevice = req.params.id;
    var reqest = req;
    var response = res;
    cloudantUtil.M_deviceEntitity.getDevice(userDevice, function(err, dat){
      if(err) {return response.status('200').json(err);}
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
      return res.status('200').json({ error: "ログインされていません" });
    }
    var userDevice = 'DEV_' + req.params.id;
    var reqest = req;
    var response = res;
    var option = new Object();
    Object.keys(req.body).forEach(function(key){
      option[key] = req.body[key];
    });
//    console.log('userDevice,option@updateDeviceBasicInfo');
//    console.log(userDevice,option);
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
 * デイバスに紐づいたすべてのメールアドレス
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  getSenderList : function(req,res) {
//    console.log('セッションユーザー情報@deviceListクラス');
//    console.log(req.user);
    if(!req.user) {
      return res.status('200').json({ error: "ログインされていません" });
    }
    var deviceId = req.params.id;
    var reqest = req;
    var response = res;
//    console.log('deviceId@getSenderList');
//    console.log(deviceId);
    cloudantUtil.M_userEntitity.getSenderList(deviceId, function(err, dat){
//    console.log('err@getSenderList');
//    console.log(err);
//    console.log('dat@getSenderList');
//    console.log(dat);
        if(err) {return response.status('200').json(err);}
        var resDat = [], id=[], name=[], mailid=[];
      //レスポンスからメールアドレス情報を抽出
        dat.rows.forEach(function(elme){
//          Array.prototype.push.apply(id, elme.fields.mail_id);
//          Array.prototype.push.apply(name, elme.fields.name);
//          Array.prototype.push.apply(mailid, elme.fields.mail);
          id = id.concat(elme.fields.mail_id);
          name = name.concat(elme.fields.name);
          mailid = mailid.concat(elme.fields.mail);
        });
//    console.log('obj@getSenderList');
//    console.log(id);
//    console.log(name);
//    console.log(mailid);
      //メールアドレス情報をレスポンスデータ用に整形
        if(Array.isArray(id)){
          id.forEach(function(i){
            resDat.push({id:i});
          });
          name.forEach(function(n,index){
            resDat[index]['name'] = n;
          });
          mailid.forEach(function(m,index){
            resDat[index]['mailid'] = m;
          });
        } else {
            resDat.push({
              id:id,
              name:name,
              mailid:mailid
            });
        }

//      console.log('resDat@getSenderList');
//      console.log(resDat);
        return response.status('200').json({"sendto":resDat});
    });
  },
  
  /**
 * デイバスの履歴データのみ
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  getHistory : function(req,res){
    if(!req.user) {
      return res.status('200').json({ error: "ログインされていません" });
    }
    var userDevice = req.params.id;
    var self = this;
    var reqest = req;
    var response = res;
    if(req.params.type == 'eq'){
      cloudantUtil.Eq_dEntitity.getHistory(userDevice, function(err, dat){
        if(err) {return response.status('200').json(err);}
        console.log("Eq_dEntitity.getHistory.dat@getHistory");
        console.log(dat);
        return response.status('200').json(dat);
      });
    } else {
      cloudantUtil.Fl_dEntitity.getHistory(userDevice, function(err, dat){
        if(err) {return response.status('200').json(err);}
        return response.status('200').json(dat);
      });
    }
  },
  
  /**
 * 環境センサーデータ
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  getEnvLatest : function(req,res){
    if(!req.user) {
      return res.status('200').json({ error: "ログインされていません" });
    }
    var envDevice = req.params.id;
    var self = this;
    var reqest = req;
    var response = res;
    cloudantUtil.EtsTestEntitity.getDevice(envDevice, function(err, dat){
      if(err) {return response.status('200').json(err);}
      return response.status('200').json(dat);
    });
  },
  
  /**
 * 天気予報データ
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  getEnvForcast : function(req,res){
    if(!req.user) {
      return res.status('200').json({ error: "ログインされていません" });
    }
    var latlon = req.params.latlon;
    var latlonArr = latlon.split('_');
    var self = this;
    var reqest = req;
    var res = res;
//    cloudantUtil.WeatherTestEntitity.getDevice(latlon, function(err, dat){
//      if(err) {return response.status('200').json(err);}
//      return response.status('200').json(dat);
//    });
    var url = "http://nitoiotdst02.mybluemix.net/api/forcast?lat=" + latlonArr[0] + "&lon=" + latlonArr[1];
    
//    console.log("url@getEnvForcast");
//    console.log(url);
    
    request(url, function (err, response, body) {
//      console.log("err, dat, body@getEnvForcast");
//      console.log(err);
//      console.log(response);
//      console.log(body);
      if(err) {return res.status('200').json(err);}
      return res.status('200').json(JSON.parse(body));
    })
  },
  
  /**
 * 合成加速度のイメージ
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  getChartImage : function(req,res){
    if(!req.user) {
      return res.status('200').json({ error: "ログインされていません" });
    }
    var userDevice = req.params.id;
    
//      console.log(userDevice);
    var self = this;
    var reqest = req;
    var response = res;
    cloudantUtil.EqimageEntitity.getChartImage(userDevice, function(err, dat){
//      console.log("dat@getChartImage");
//      console.log(dat);
      if(err) {return response.status('200').sendfile(err);}
      res.writeHead( 200, { 'Content-type': 'image/jpeg; charset=utf-8' } );
      res.end( dat );
    });
  }
  
}
module.exports = deviceUnit;