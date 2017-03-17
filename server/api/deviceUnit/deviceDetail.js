/**
 * デバイスリスト file
 */

'use strict';
var express = require('express');
var fs = require('fs');
var cloudantUtil = require('./../../lib/cloudantUtil');
var app = express();

var deviceDetail = {
  //show device
  getInfo : function(req,res) {
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
module.exports = deviceDetail;