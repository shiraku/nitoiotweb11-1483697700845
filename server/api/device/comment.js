/**
 * デバイスリスト file
 */

'use strict';
var express = require('express');
var fs = require('fs');
var cloudantUtil = require('./../../lib/cloudantUtil');
var moment = require('moment-timezone');
var app = express();

  /***********************************************
 * コメント　comment
 * getComment:メール送信先の取得api file
 * postComment:メール送信先の更新と追加api
 *************************************************/
var comment= {
  /**
 * 感知日のコメントを返却する
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  getComment : function(req,res) {
//    console.log('セッションユーザー情報@getComment');
//    console.log(req.user);
    if(!req.user) {
      return res.status('200').json({ error: "ログインされていません" });
    }
    var key = req.params.id;
    var self = this;
    var reqest = req;
    var response = res;
    cloudantUtil.Comment_dataEntitity.getComment(key, function(err, dat){
      if(err) {return response.status('200').json(err);}
//        console.log('earthquakeCurrentData@getInfo');
//        console.log(deviceJson);
      return response.status('200').json(dat);
    });
  },
  getRelatedComment : function(req,res) {
//    console.log('セッションユーザー情報@getComment');
//    console.log(req.user);
    if(!req.user) {
      return res.status('200').json({ error: "ログインされていません" });
    }
    var key = req.params.id;
    var self = this;
    var reqest = req;
    var response = res;
    console.log("req.params.id");
    console.log(req.params.id);
    cloudantUtil.Comment_dataEntitity.getRelatedComment(key, function(err, dat){
      if(err) {return response.status('200').json(err);}
        console.log('getRelatedComment@getRelatedComment');
        console.log(dat);
      return response.status('200').json(dat);
    });
  },
  
  /**
 * 感知日にコメントを投稿する
 * prams:req express requestオブジェクト
 * prams:res express responseオブジェクト
 */
  saveComment : function(req,res) {
//    console.log('セッションユーザー情報@deviceListクラス');
//    console.log(req.user);
    if(!req.user) {
      return res.status('200').json({ error: "ログインされていません" });
    }
    var reqest = req;
    var response = res;
    var relatedId = req.params.id;
    var relatedIdArr = relatedId.split('_');
    var d = moment(Date.now()).tz("Asia/Tokyo").format("YYYYMMDDhhmmss");
    var ts = moment(Date.now()).tz("Asia/Tokyo").format("YYYY/MM/DD hh:mm:ss");
    var id = "DEV_" + relatedIdArr[1] + "_" + d
    console.log('d@postComment');
    console.log(d);
    var option = {
      "related_id": relatedId,
      "device_id": "DEV_" + relatedIdArr[1],
      "timestamp": ts,
      "importantFlg": req.body.impFlg,
      "user": req.user._id,
      "comment": req.body.comment
    }
    console.log('option@saveComment');
    console.log(option);
    cloudantUtil.Comment_dataEntitity.saveComment(id, option, function(err, dat){
//    console.log('err@updateDeviceBasicInfo');
//    console.log(err);
//    console.log('dat@updateDeviceBasicInfo');
//    console.log(dat);
      if(err) {return response.status('200').send({message:'更新できませんした。', error: true});}
      return response.status('200').send({message:'更新しました。'});
    });
  },
  
}
module.exports = comment;