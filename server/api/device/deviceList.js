/**
 * デバイスリスト file
 */

'use strict';
var express = require('express');
var cloudantUtil = require('./../../lib/cloudantUtil');
var app = express();

var deviceList = {
  devicesJson : {},
  latestJson : {},
  latestData : {},
  latestEQJson : {},
  latestEQDate : {},
  commentJson : {},
  commentDate : new Array(),
  //show device
  getList : function(req,res) {
//    console.log('セッションユーザー情報@deviceListクラス');
//    console.log(req.user);
    if(!req.user) {
      return res.status('500').json({ error: "ログインされていません" });
    }
    var userDevice = req.user.device;
    var responseJson,devicesJson,latestJson,latestEQJson,commentJson;
    var self = this;
    var reqest = req;
    var response = res;
    cloudantUtil.M_deviceEntitity.getDevice(userDevice, function(err, devices){
      if(err) {return response.status('500').json(err);}
      self.devicesJson = devices;
//      console.log("dat@devicesJson");
//      console.log(self.devicesJson);
      cloudantUtil.I_dataEntitity.getLatest(userDevice, function(err, latest){
        if(err) {return response.status('500').json(err);}
        self.latestJson = latest;
//          console.log("dat@latestJson");
//          console.log(self.latestJson);
        cloudantUtil.Eq_dEntitity.getLatest(userDevice, function(err, latest){
          if(err) {return response.status('500').json(err);}
          self.latestEQJson = latest;
//            console.log("dat@latestEQJson");
//            console.log(self.latestEQJson);
          cloudantUtil.Comment_dataEntitity.getComment(userDevice, function(err, dat){
            if(err) {return response.status('500').json(err);}
            self.commentJson = dat;
//            console.log("dat@getComment");
//            console.log(dat);
            
            responseJson = self.createJson();
//            console.log(response);
            return response.status('200').json(responseJson);
          });
        });
      });
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
        obj["status"] = (flgSense) ? '感知あり':'感知なし';
        if(flgSense){
          obj["type"] = self.latestEQDate.value.type;
//          console.log("self.latestEQDate.datas");
//          console.log(self.latestEQDate.value.datas);
          obj["seismicIntensity"] = self.latestEQDate.value.datas.seismicIntensity;
          obj["power"] = self.latestEQDate.value.datas.power,
          obj["leakage"] = self.latestEQDate.value.datas.leakage,
          obj["slope"] = self.latestEQDate.value.datas.slope,
          obj["commercialBlackout"] = self.latestEQDate.value.datas.commercialBlackout,
          obj["equipmentAbnormality"] = self.latestEQDate.value.datas.equipmentAbnormality
        }
//        if(self.hasLatest(dat._id)){
////            console.log("self.latestDate.datas");
////            console.log(self.latestDate);
//            obj["slope"] = self.latestDate.slope;
//            obj["commercialBlackout"] = self.latestDate.commercialBlackout;
//            obj["equipmentAbnormality"] = self.latestDate.equipmentAbnormality;
//        }
        if(self.hasComment(dat._id,self.latestEQDate.value.date_id)){
//            console.log("self.commentDate");
//            console.log(self.commentDate);
            obj["commentList"] = self.commentDate;
        }
//      console.log("データ単体@createJson");
//      console.log(obj);
      responseJson.push(obj);
    });
    
//      console.log("作成データ@createJson");
//      console.log(responseJson);
    return {"device_list":responseJson};
  },
  
  hasSense : function(device){
    if(!this.latestEQJson.length) return false;
//    console.log("device@hasSense");
//    console.log(device);
    var deviceId = device.split('_')[1];
    var flg = false;
    for(var i = 0; i < this.latestEQJson.length; i++){
      if(this.latestEQJson[i].key == deviceId){
//        console.log("matchId@hasSense");
        flg =  true;
        this.latestEQDate = this.latestEQJson[i];
        break;
      }
    };
    return flg;
  },
  
  hasLatest : function(device){
//    console.log("device@hasLatest");
//    console.log(device);
    if(!this.latestEQJson.length) return false;
//    console.log("hasData@hasLatest");
    var deviceId = device.split('_')[1];
    var flg = false;
    for(var i = 0; i < this.latestJson.length; i++){
      if(this.latestJson[i].key == deviceId){
//        console.log("matchId@hasLatest");
        flg =  true;
        this.latestDate = this.latestJson[i];
        break;
      }
    }
    return flg;
  },
  
  hasComment : function(id,date){
//    console.log("date@hasComment");
//    console.log(date,id);
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