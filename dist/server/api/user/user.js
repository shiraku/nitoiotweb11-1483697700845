/**
 * ユーザー関連api file
 */

'use strict'; 
var express = require('express');
var cloudantUtil = require('./../../lib/cloudantUtil');
var app = express();

  /***********************************************
 * ユーザー関連 user
 * getSendtoUser:メール送信先の取得api file
 * saveSendtoUser:メール送信先の更新と追加api
 * deleteSendtoUser:メール送信先の削除api
 * getAlert:閾値の取得api
 * updateAlert:閾値の更新api
 *************************************************/
var user = {
  /**
 * ユーザー情報の取得
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  getUser : function(req,res) {
    if(!req.user) {
      return res.status('200').json({ error: "ログインされていません" });
    }
    
//    console.log("req.user.sendto@updateSendtoUser");
//    console.log(req.user.sendto);
//    console.log("req.body@updateUser");
//    console.log(req.body);
    var userId = req.user._id;
    var reqest = req;
    var response = res;
    
    cloudantUtil.M_userEntitity.getUser(userId, function(err, dat){
      if(err) {return response.status('200').json(err);}
      return response.status('200').json(dat);
    });
  },
  /**
 * ユーザー情報の更新と追加api file
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  updateUser : function(req,res) {
    if(!req.user) {
      return res.status('200').json({ error: "ログインされていません" });
    }
    
//    console.log("req.user.sendto@updateSendtoUser");
//    console.log(req.user.sendto);
//    console.log("req.body@updateUser");
//    console.log(req.body);
    var prm = req.body;
    var num;
    var reqest = req;
    var response = res;
    var getMail;
    
    Object.keys(prm).forEach(function(prop){
      if(!req.user.hasOwnProperty(prop)) return response.status('200').send({message:'該当する項目がありません。', error: true});
    });
    
    
    //送信者情報の更新
//    console.log("prm@updateUser");
//    console.log(prm);
    cloudantUtil.M_userEntitity.updateUser(req.user._id, prm , function(err, res){
//      console.log("dat@saveSendtoUser");
//      console.log(res);
      if(err) {return response.status('200').send({message:'登録に失敗しました。', error: true});}
      return response.status('200').send({message:'更新しました。'});
    });
  },
  
  
  /**
 * メール送信先の取得api file
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  getSendtoUser : function(req,res) {
    if(!req.user) {
      return res.status('200').json({ error: "ログインされていません" });
    }
    
//    console.log("req.user.sendto@updateSendtoUser");
//    console.log(req.user.sendto);
//    console.log("req.data@updateSendtoUser");
//    console.log(req.body);
    var userId = req.user._id;
    var self = this;
    var reqest = req;
    var response = res;
    cloudantUtil.M_userEntitity.getUser(userId, function(err, dat){
      if(err) {return response.status('200').json(err);}
      return response.status('200').json(dat.sendto);
    });
  },
  /**
 * メール送信アドレスの重複チェックapi file
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  checkSendtoUser : function(req,res){
    if(!req.user) {
      return res.status('200').json({ error: "ログインされていません" });
    }
    var prm = req.body;
    var num;
    var getMail;
    var self = this;
    
//    console.log("prm@checkSendtoUser");
//    console.log(prm);
    console.log("req.user.sendto@checkSendtoUser");
    console.log(req.user);
    
    if(prm.adminFlg && prm.key){
      prm.key.split('_');
//    console.log("prm.key@saveSendtoUser");
//    console.log(prm.key);
      cloudantUtil.M_userEntitity.getUser(prm.key.split('_')[1], function(err, dat){
        //メールアドレスの重複チェック
        var dupMail = dat.sendto.filter(function(element){
              return (element.mailid == prm.mailid);
          });
    //    console.log("dupMail");
    //    console.log(dupMail);
        if(dupMail.length >= 1){
          return res.status('200').send({dupFlag:true, postDat:req.body});
        } else {
          self.saveSendtoUser(req,res);
        }
      });
    } else {
      //メールアドレスの重複チェック
      if(!req.user.sendto) req.user["sendto"] = new Array();
      var dupMail = req.user.sendto.filter(function(element){
            return (element.mailid == prm.mailid);
        });
//      console.log("dupMail");
//      console.log(dupMail);
      if(dupMail.length >= 1){
        return res.status('200').send({dupFlag:true, postDat:req.body});
      } else {
        self.saveSendtoUser(req,res);
      }
    }
    
    
  },
  /**
 * メール送信先の更新と追加api file
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  saveSendtoUser : function(req,res) {
    if(!req.user) {
      return res.status('200').json({ error: "ログインされていません" });
    }
    
//    console.log("req.user.sendto@updateSendtoUser");
//    console.log(req.user.sendto);
//    console.log("req.data@updateSendtoUser");
//    console.log(req.body);
    var prm = req.body;
    var reqest = req;
    var response = res;
    var self  = this;
    
    //更新する送信者情報を取得
//    if(prm.key){
//      getMail = req.user.sendto.filter(function(element,index){
//      console.log("element.mailid",element.mailid);
//        if (element.mailid == prm.key) {
//          num = index;
//          return element;
//        }
//      });
//    }
//    console.log("adminFlg@saveSendtoUser");
//    console.log(prm.adminFlg);
    if(prm.adminFlg && prm.key){
      prm.key.split('_');
//    console.log("prm.key@saveSendtoUser");
//    console.log(prm.key);
      cloudantUtil.M_userEntitity.getUser(prm.key.split('_')[1], function(err, res){
        self.saveSendtoUserExe(res, prm, response);
      });
    } else {
      self.saveSendtoUserExe(req.user, prm, response);
    }
  },
  
  saveSendtoUserExe : function(userDat, prm, response){
    var getMail;
    var num;
    console.log("userDat@saveSendtoUserExe");
    console.log(userDat);
//    console.log("prm@saveSendtoUserExe");
//    console.log(prm);
    if(prm.key){
      getMail = userDat.sendto.filter(function(element,index){
//        console.log("userDat.sendto.filter");
//        console.log(element.id, prm.key);
        if (element.id == prm.key) {
          num = index;
          return element;
        }
      });
    }
    
    //送信者情報の更新
//        console.log("getMail@saveSendtoUser");
//        console.log(getMail);
//        console.log(num);
    if(prm.key){
      if(prm.name) userDat.sendto[num].name = prm.name;
      if(prm.mailid) userDat.sendto[num].mailid = prm.mailid;
//        console.log("userDat.sendto@saveSendtoUser");
//        console.log(userDat.sendto);
      cloudantUtil.M_userEntitity.updateUser(userDat._id, {"sendto" : userDat.sendto} , function(err, res){
  //      console.log("dat@saveSendtoUser");
  //      console.log(res);
        if(err) {return response.status('200').send({message:'登録に失敗しました。', error: true});}
        return response.status('200').send({message:'更新しました。'});
      });
    } else {
      //送信者情報の追加登録
      //必須項目のバリデーションチェック
      
      //閾値(alert)設定がされていない場合の初期設定
      var defaultAlert = {
        "seismicIntensityFlg": true,
        "seismicIntensity": 3,
        "siFlg": false,
        "si": 4,
        "lightningSurge": true,
        "lpgm": 2,
        "slope": true,
        "commercialBlackout": true,
        "equipmentAbnormality": true
      };
      
      if(prm.name && prm.mailid){
        var sendto = {
          "id" : userDat._id + "_sendto" + (userDat.sendto.length + 1),
          "name" : prm.name,
          "mailid" : prm.mailid,
          "alert" : (userDat.sendto.length) ? userDat.sendto[0].alert : defaultAlert
        }
        userDat.sendto.push(sendto);
        cloudantUtil.M_userEntitity.updateUser(userDat._id, {"sendto" : userDat.sendto} , function(err, res){
    //      console.log("dat@saveSendtoUser");
    //      console.log(res);
          if(err) {return response.status('200').send({message:'登録に失敗しました。', error: true});}
          return response.status('200').send({message:'登録しました。'});
        });
      }else{
        return response.status('200').send({message:'名前とメールアドレスを入力してください。', error: true});
      }
    }
  },
  
  
  /**
 * メール送信先の削除api file
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  deleteSendtoUser : function(req,res) {
    if(!req.user) {
      return res.status('200').json({ error: "ログインされていません" });
    }
//    console.log("req.user.sendto@updateSendtoUser");
//    console.log(req.user.sendto);
//    console.log("req.data@updateSendtoUser");
//    console.log(req);
    var prm = req.params;
    var reqest = req;
    var response = res;
    var deleteNum = undefined;
//    console.log("key@req.user.sendto.filter");
//    console.log(prm.key);
    req.user.sendto.filter(function(element,index){
//    console.log(element.id);
      if (element.id == prm.key) {
          deleteNum = index;
      }
    });
//    console.log("deleteNum@deleteSendtoUser");
//    console.log(deleteNum);
    if(deleteNum != undefined){
      req.user.sendto.splice(deleteNum, 1);
      req.user.sendto.forEach(function(elm,index){
        elm.id = req.user._id + "_sendto" + index;
      });
//        console.log("dat@saveSendtoUser");
//        console.log(req.user.sendto);
      cloudantUtil.M_userEntitity.updateUser(req.user._id, {"sendto" : req.user.sendto} , function(err, res){
        if(err) {return response.status('200').send({message:'削除できませんした。', error: true});}
        return response.status('200').send({message:'削除しました。'});
      });
    } else {
      return response.status('200').send({message:'削除できませんした。', error: true});
    }
  },
  /**
 * アラート閾値の取得api file
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  getAlert : function(req,res) {
    if(!req.user) {
      return res.status('200').json({ error: "ログインされていません" });
    }
    
//      console.log(req.user._id);
    var reqest = req;
    var response = res;
    cloudantUtil.M_userEntitity.getUser(req.user._id.split('_')[1], function(err, dat){
//      console.log("dat@getAlert");
//      console.log(dat);
      if(err) {return response.status('200').json(err);}
      return response.status('200').json(dat.sendto[0].alert);
    });
  },
  /**
 * アラート閾値の更新と追加api file
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  updateAlert : function(req,res) {
    if(!req.user) {
      return res.status('200').json({ error: "ログインされていません" });
    }
    
    var reqest = req;
    var response = res;
    var param = {
        "seismicIntensityFlg": (!req.body.switchSI) ? req.body.seismicIntensityFlg : false,
        "seismicIntensity": req.body.seismicIntensity,
        "siFlg": (req.body.switchSI) ? req.body.siFlg : false,
        "si": req.body.si,
        "lightningSurge": req.body.lightningSurge,
        "lpgm": req.body.lpgm,
        "slope": req.body.slope,
        "commercialBlackout": req.body.commercialBlackout,
        "equipmentAbnormality": req.body.equipmentAbnormality
    }
    var option = req.user.sendto.slice();
    option.forEach(function(sender){
      sender.alert = param;
    });
    
    //送信者情報の更新
    cloudantUtil.M_userEntitity.updateUser(req.user._id, {"sendto" : option} , function(err, res){
//      console.log("dat@saveSendtoUser");
//      console.log(res);
      if(err) {return response.status('200').send({message:'登録に失敗しました。', error: true});}
      return response.status('200').send({message:'更新しました。'});
    });
  }
}
module.exports = user;