/**
 * デバイスリスト file
 */

'use strict';
var express = require('express');
var cloudantUtil = require('./../../lib/cloudantUtil');
var Auth = require('./../../components/auth');
var auth = new Auth();
var app = express();

var deviceList = {
  devicesJson : {},
  latestJson : {},
  latestData : {},
  latestEQJson : {},
  latestEQDate : {},
  //show device
  show : function(req,res) {
//    console.log('セッションユーザー情報@deviceListクラス');
//    console.log(req.user);
    if(!req.user) {
      return { error: "ログインされていません" };
    }
    var userDevice = req.user.device;
    var responseJson,devicesJson,latestJson,latestEQJson
    var self = this;
    var reqest = req;
    var response = res;
    cloudantUtil.M_deviceEntitity.getDevice(userDevice, function(err, devices){
      if(err) {return err;}
      self.devicesJson = devices;
//      console.log("dat@devicesJson");
//      console.log(self.devicesJson);
      cloudantUtil.I_dataEntitity.getLatest(userDevice, function(err, latest){
        if(err) {return err;}
        self.latestJson = latest;
//          console.log("dat@latestJson");
//          console.log(self.latestJson);
        cloudantUtil.Eq_dEntitity.getLatest(userDevice, function(err, latest){
          if(err) {return err;}
          self.latestEQJson = latest;
//            console.log("dat@latestEQJson");
//            console.log(self.latestEQJson);
          responseJson = self.createJson();
          
//            console.log(response);
          return response.json(responseJson);
        });
      });
    });
  },
                                            
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
        obj["latitude"] = dat.latitude;
        obj["longitude"] = dat.longitude;
        obj["status"] = flgSense;
        if(flgSense){
          obj["type"] = self.latestEQDate.value.type;
//          console.log("self.latestEQDate.datas");
//          console.log(self.latestEQDate.value.datas);
          obj["seismicIntensity"] = self.latestEQDate.value.datas[0].value;
        }
        if(self.hasLatest(dat._id)){
            console.log("self.latestDate.datas");
            console.log(self.latestDate);
            obj["slope"] = self.latestDate.slope;
            obj["commercialBlackout"] = self.latestDate.commercialBlackout;
            obj["equipmentAbnormality"] = self.latestDate.equipmentAbnormality;
        }
//      if(flgSense){
//        comment = this.getComment(this.latestEQDate.data.date);
//        if(!comment.device_id)
//      }
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
  
  getComment : function(date){
    cloudantUtil.Comment_dataEntitity.getComment(date, function(err, dat){
      console.log("dat@getComment");
      console.log(dat);
      return dat;
    });
  } 
}
module.exports = deviceList;