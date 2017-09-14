/**
 * デバイスリスト file
 */

'use strict';
var express = require('express');
var cloudantUtil = require('./../../lib/cloudantUtil');
var app = express();

  /***********************************************
 * デバイスリスト deviceList
 * getSendtoUser:メール送信先の取得api file
 * saveSendtoUser:メール送信先の更新と追加api
 * deleteSendtoUser:メール送信先の削除api
 *************************************************/
var deviceList = {
  devicesJson : {},
  latestJson : {},
  latestData : {},
  latestEQJson : [],
  latestEQData : {},
  commentJson : {},
  commentDate : new Array(),
  
  
  /**
 * 所有デイバス情報のリスト
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  getList : function(req,res) {
//    console.log('セッションユーザー情報@deviceListクラス');
//    console.log(req.user);
    if(!req.user) {
      return res.status('200').json({ error: "ログインされていません" });
    }
    var userDevice = req.user.device;
    var responseJson,devicesJson,latestJson,latestEQJson,commentJson;
    var self = this;
    var reqest = req;
    var response = res;
    cloudantUtil.M_deviceEntitity.getDevice(userDevice, function(err, devices){
      if(err) {return response.status('200').json(err);}
      self.devicesJson = devices;
//      console.log("dat@devicesJson");
//      console.log(self.devicesJson);
//      cloudantUtil.I_dataEntitity.getLatest(userDevice, function(err, latest){
//        if(err) {return response.status('200').json(err);}
//        self.latestJson = latest;
//          console.log("dat@latestJson");
//          console.log(self.latestJson);
        cloudantUtil.Eq_dEntitity.getLatest(userDevice, function(err, latest){
          if(err) {return response.status('200').json(err);}
          self.latestEQJson = latest.docs;
//            console.log("dat@latestEQJson");
//            console.log(self.latestEQJson);
          cloudantUtil.Comment_dataEntitity.getComment(userDevice, function(err, dat){
            if(err) {return response.status('200').json(err);}
            self.commentJson = dat;
            console.log("dat@getComment");
            console.log(dat);
            
            responseJson = self.createJson();
//            console.log(response);
            return response.status('200').json(responseJson);
          });
        });
//      });
    });
  },
  
//  getHistory : function(req,res){
//    if(!req.user) {
//      return res.status('500').json({ error: "ログインされていません" });
//    }
//    var userDevice = req.user.device;
//    var self = this;
//    var reqest = req;
//    var response = res;
//    cloudantUtil.Eq_dEntitity.getHistory(userDevice, function(err, dat){
//      if(err) {return response.json(err);}
//      return response.json(dat);
//    });
//  },
  
  /**
 * 過去の地震情報のリスト
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  getListLogDate : function(req,res) {
//    console.log('セッションユーザー情報@deviceListクラス');
//    console.log(req.user);
    if(!req.user) {
      return res.status('200').json({ error: "ログインされていません" });
    }
    var userDevice = req.params.id;
    var logdate = req.params.date;
    var type = req.params.type;
    var reqest = req;
    var response = res;
//      console.log("logdate@getListLogDate");
//      console.log(logdate);
    if(type == 'EQ' || type == 'AL'){
      cloudantUtil.Eq_dEntitity.getLogDate(logdate, function(err, dat){
        if(err) {return response.status('200').json(err);}
  //      console.log("dat@getLogDate");
  //      console.log(dat);
        return response.status('200').json(dat);
      });
    } else if(type == 'FL'){
      cloudantUtil.Fl_dEntitity.getLogDate(logdate, function(err, dat){
        if(err) {return response.status('200').json(err);}
  //      console.log("dat@getLogDate");
  //      console.log(dat);
        return response.status('200').json(dat);
      });
    }
  },
  
  
  /**
 * 所有デイバス情報のリストJSONの作成
 * return:デバイスリストオブジェクト
 */
  createJson : function(){
    var responseJson = new Array();
    var self = this;
    this.devicesJson.forEach(function (dat){
      var flgSense = (self.hasSense(dat._id)) ? 1 : 0;
      var obj = new Object();
      var comment;
        obj["deviceId"] = dat._id;
        obj["deviceName"] = dat.deviceName;
        obj["responsiblePerson"] = dat.responsiblePerson;
        obj["telNo"] = dat.telNo;
        obj["address"] = dat.address; 
        obj["memo"] = dat.memo;
        obj["latitude"] = dat.latitude;
        obj["longitude"] = dat.longitude;
        obj["envSensorFlg"] = (dat.envSensorFlg) ? dat.envSensorFlg : false;
        obj["status"] = (flgSense) ? '感知あり':'感知なし';
        if(flgSense){
          obj["type"] = self.latestEQData.data.type;
          obj["date"] = self.latestEQData.date;
          obj["seismicIntensity"] = self.latestEQData.data.datas[0].seismicIntensity || self.latestEQData.data.datas[0].value;
          obj["power"] = self.latestEQData.data.datas[0].power,
          obj["leakage"] = self.latestEQData.data.datas[0].leakage,
          obj["slope"] = self.latestEQData.data.datas[0].slope,
          obj["commercialBlackout"] = self.latestEQData.data.datas[0].commercialBlackout,
          obj["equipmentAbnormality"] = self.latestEQData.data.datas[0].equipmentAbnormality
          if(self.hasComment(dat._id,self.latestEQData.data.date_id)){
              console.log("self.commentDate");
              console.log(self.commentDate);
              obj["commentList"] = self.commentDate;
          }
        }
//        if(self.hasLatest(dat._id)){
////            console.log("self.latestDate.datas");
////            console.log(self.latestDate);
//            obj["slope"] = self.latestDate.slope;
//            obj["commercialBlackout"] = self.latestDate.commercialBlackout;
//            obj["equipmentAbnormality"] = self.latestDate.equipmentAbnormality;
//        }
//      console.log("データ単体@createJson");
//      console.log(obj);
      responseJson.push(obj);
    });
    
//      console.log("作成データ@createJson");
//      console.log(responseJson);
    return {"device_list":responseJson};
  },
  
  /**
 * 感知データがあるかのチェック
 * prams:device　デバイスID
 */
  hasSense : function(device){
//    console.log("device@hasSense");
//    console.log(device);
    var deviceId = device.split('_')[1];
    var flg = false;
    for(var i = 0; i < this.latestEQJson.length; i++){
//    console.log("device@hasSense");
//    console.log(this.latestEQJson[i].device_id);
//    console.log(deviceId);
      if(this.latestEQJson[i].device_id == deviceId){
//        console.log("matchId@hasSense");
        flg =  true;
        this.latestEQData = this.latestEQJson[i];
        break;
      }
    };
    return flg;
  },
  
  /**
 * 感知データがあるかのチェック
 * prams:device　デバイスID
 */
//  hasLatest : function(device){
////    console.log("device@hasLatest");
////    console.log(device);
//    if(!this.latestEQJson.length) return false;
////    console.log("hasData@hasLatest");
//    var deviceId = device.split('_')[1];
//    var flg = false;
//    for(var i = 0; i < this.latestJson.length; i++){
//      if(this.latestJson[i].key == deviceId){
////        console.log("matchId@hasLatest");
//        flg =  true;
//        this.latestDate = this.latestJson[i];
//        break;
//      }
//    }
//    return flg;
//  },
  
  /**
 * コメントデータがあるかのチェック
 * prams:id　デバイスID
 * prams:date　感知データID
 */
  hasComment : function(id,date){
//    console.log("date@hasComment");
//    console.log(date,id);
    this.commentDate = new Array();
    if(!this.commentJson.length) return false;
//    console.log("hasData@hasComment");
    var key = id + "_" + date;
    var flg = false;
//    console.log("this.commentJson@hasComment");
//    console.log(this.commentJson);
    for(var i = 0; i < this.commentJson.length; i++){
//      console.log("check.commentJson@hasComment");
//      console.log(this.commentJson[i].value.related_id);
//      console.log(key);
      if(this.commentJson[i].value.related_id == key){
//        console.log("matchId@hasComment");
        flg =  true;
        this.commentDate.push(this.commentJson[i].value);
        
      }
    }
    return flg;
  } 
}
module.exports = deviceList;