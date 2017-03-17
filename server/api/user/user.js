/**
 * ユーザー関連api file
 */

'use strict'; 
var express = require('express');
var cloudantUtil = require('./../../lib/cloudantUtil');
var app = express();

var user = {
  /**
 * メール送信先の取得api file
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  getSendtoUser : function(req,res) {
    if(!req.user) {
      return res.status('500').json({ error: "ログインされていません" });
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
      if(err) {return response.status('500').json(err);}
      return response.status('200').json(dat.sendto);
    });
  },
  /**
 * メール送信先の更新と追加api file
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  saveSendtoUser : function(req,res) {
    if(!req.user) {
      return res.status('500').json({ error: "ログインされていません" });
    }
    
//    console.log("req.user.sendto@updateSendtoUser");
//    console.log(req.user.sendto);
//    console.log("req.data@updateSendtoUser");
//    console.log(req.body);
    var prm = req.body;
    var num;
    var reqest = req;
    var response = res;
    var getMail;
    
    //更新する送信者情報を取得
    if(prm.key){
      getMail = req.user.sendto.filter(function(element,index){
        if (element.mailid == prm.key) {
          num = index;
          return element;
        }
      });
    }
    
    //メールアドレスの重複チェック
    var dupMail = req.user.sendto.filter(function(element){
          return (element.mailid == prm.mailid);
      });
    if(dupMail.length >= 1){
      return response.status('200').send({message:'メールアドレスが重複しています。', error: true});
    }
    
    //送信者情報の更新
    if(getMail.length == 1){
      if(req.body.name) req.user.sendto[num].name = req.body.name;
      if(req.body.mailid) req.user.sendto[num].mailid = req.body.mailid;
      cloudantUtil.M_userEntitity.updateUser(req.user._id, {"sendto" : req.user.sendto} , function(err, res){
  //      console.log("dat@saveSendtoUser");
  //      console.log(res);
        if(err) {return response.status('200').send({message:'登録に失敗しました。', error: true});}
        return response.status('200').send({message:'更新しました。'});
      });
    } else {
      //送信者情報の追加登録
      //必須項目のバリデーションチェック
      if(req.body.name && req.body.mailid){
        var sendto = {
          "name" : req.body.name,
          "mailid" : req.body.mailid,
          "alert" : req.user.sendto[0].alert
        }
        req.user.sendto.push(sendto);
        cloudantUtil.M_userEntitity.updateUser(req.user._id, {"sendto" : req.user.sendto} , function(err, res){
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
      return res.status('500').json({ error: "ログインされていません" });
    }
//    console.log("req.user.sendto@updateSendtoUser");
//    console.log(req.user.sendto);
//    console.log("req.data@updateSendtoUser");
//    console.log(req);
    var prm = req.params;
    var reqest = req;
    var response = res;
    var deleteNum = undefined;
    req.user.sendto.filter(function(element,index){
      if (element.mailid == prm.mailid) {
          deleteNum = index;
      }
    });
//    console.log("deleteNum@deleteSendtoUser");
//    console.log(deleteNum);
    if(deleteNum != undefined){
      req.user.sendto.splice(deleteNum, 1);
        console.log("dat@saveSendtoUser");
        console.log(req.user.sendto);
      cloudantUtil.M_userEntitity.updateUser(req.user._id, {"sendto" : req.user.sendto} , function(err, res){
        if(err) {return response.status('200').send({message:'削除できませんした。', error: true});}
        return response.status('200').send({message:'削除しました。'});
      });
    } else {
      return response.status('200').send({message:'削除できませんした。', error: true});
    }
  },
  
  updateUser : function(req,res) {
    if(!req.user) {
      return res.status('500').json({ error: "ログインされていません" });
    }
    var hasMail = req.user.sendto.filter(function(element){
      return (element == req.data.key);
    });
    console.log("hasMail@updateUser");
    console.log(hasMail);
    
    
  }
}
module.exports = user;