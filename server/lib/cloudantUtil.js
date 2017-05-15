/**
 * Created by tangross on 15/8/15.
 */
'use restrict'

// Set default node environment to development; Bluemix runtime is production
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('../config/environment')
var cradle = require('cradle');
var Cloudant = require('cloudant');
var fs = require('fs');
require('date-utils');
//var dbName = config.ROOT_DB,
var chost = config.CHOST,
    cport = config.CPORT,
    cuser = config.CUSER,
    cpassword = config.CPASSWORD,
    curl = config.CURL;
var rootDoc = config.ROOT_DOC;
var db;
var cloudant;

/**
 * cradleとnodejs-cloudant双方でDB接続可能
 * 追加でquery indexによる検索が必要になったためnodejs-cloudantを後から追加した
 * db = cradle
 * cloudant = nodejs-cloudant
 */
function connectDoc(dbName) {

  var con = new (cradle.Connection)(chost, cport, {
      secure: true,
      auth: {username: cuser, password: cpassword}
  });


  /* cradle code */
  db = con.database(dbName);
  db.exists(function (err, exists) {
      if (err) {
          console.log(err);
      }
      else if (exists) {
          console.log("#### Database " + dbName + " already exists.");
      }
      else {
          // if (config.seedDB) {
          //     console.log("#### Seeding DB: Creating database. " + dbName + "...");
          //     db.create(function (err) {
          //         if (err) {
          //             console.log(err);
          //         }
          //         console.log("#### Seeding DB: Inserting root document.");
          //         fs.readFile(__dirname + '/seed.json', 'utf8', function (err, data) {
          //             if (err) {
          //                 return console.log(err);
          //             }
          //             var docs = JSON.parse(data);
          //             db.save(rootDoc, docs, function (err) {
          //                 if (err) {
          //                     return console.log(err);
          //                 }
          //                 return console.log("Insertion completion");
          //             })
          //         })
          //     })
          // }
      }
  });
  
  var cloudantCon = Cloudant({account:cuser, password:cpassword});
  cloudant = cloudantCon.db.use(dbName);
};

/**
 * m_userへのアクセス
 * ユーザー情報に関するデータベース
 * getUser：ユーザーIDからユーザー情報をGETし返却する
 * updateUser：渡された値をアップデートまたは追加登録する
 */
exports.M_userEntitity = {
  
  /**
 * ユーザーIDからユーザー情報をGETし返却する
 * prams:query U+数字５桁のuser_ID配列または文字列
 * prams:callback コールバック
 */
  getUser : function(query, callback){
    connectDoc('m_user');
    db.get('muser_' + query, function(err, doc) {
      if(err){
        return callback(err);
      }
//      console.log(doc);
      return callback(err,doc);
    });
  },
  
  /**
 * 渡された値をアップデートまたは追加登録する
 * prams:query muser_U+数字５桁の文字列
 * prams:data アップデートするデータ（Objecrt）
 * prams:callback コールバック
 */
  updateUser : function(query, data, callback){
    connectDoc('m_user');
//    console.log("query, data@updateUser");
//    console.log(query, data);
    db.merge(query, data , function(err, doc) {
    console.log("err@updateUser");
    console.log(err);
//    console.log("doc@updateUser");
//    console.log(doc);
      if(err){
        return callback(err,doc);
      }
//      console.log(doc);
      return callback(err,doc);
    });
  },
  
  /**
 * 渡された値をアップデートまたは追加登録する
 * prams:query 数字５桁の文字列
 * prams:callback コールバック
 */
  getSenderList : function(query, callback){
    connectDoc('m_user');
//    console.log("query, data@updateUser");
//    console.log(query, data);
    cloudant.search("search_m_user", "search_devices_mails", {q:'device:'+query +'<string>'}, function(err, doc) {
    console.log("err@getSenderList");
    console.log(err);
//    console.log("doc@getSenderList");
//    console.log(doc);
      if(err){
        return callback(err,doc);
      }
//      console.log(doc);
      return callback(err,doc);
    });
  }
  

};



/**
 * M_deviceへのアクセス
 * ユーザー情報に関するデータベース
 * getDevice：デバイスIDからユーザー情報をGETし返却する
 * updateUser：渡された値をアップデートまたは追加登録する
 */
exports.M_deviceEntitity = {
  /**
 * ユーザーIDからユーザー情報をGETし返却する
 * prams:query U+数字５桁のuser_ID配列または文字列
 * prams:callback コールバック
 */
  getDevice : function(query, callback){
    var q;
    if(typeof query == "object" || typeof query == "array"){
//      console.log('query is type of array');
      q = [];
      for(var i =0; i < query.length; i++){
        q.push('DEV_' + query[i].id);
      }
    }else{
//      console.log('query isnt type of array');
      q = 'DEV_' + query;
//      console.log(q);
    }
//      console.log('クエリ情報@M_deviceEntitity');
//      console.log(q);
    connectDoc('m_device');
    db.get(q, function(err, doc) {
      if(err){
        return callback(err,doc);
      }
//      console.log('デバイス情報@M_deviceEntitity');
//      console.log(doc);
      return callback(err,doc);
    });
  },
  
  updateDevice : function(query, data, callback){
    connectDoc('m_device');
//    console.log("query, data@updateDevice");
//    console.log(query, data);
    db.merge(query, data , function(err, doc) {
    console.log("err@updateUser");
    console.log(err);
//    console.log("doc@updateUser");
//    console.log(doc);
      if(err){
        return callback(err);
      }
      return callback(err,doc);
    });
  }
};



/**
 * Eq_dへのアクセス
 * 地震情報に関するデータベース
 * getLatest：デバイスIDから１日以内に起きた最新の感知データを返却する
 * getHistory：デバイスIDから１年前までの感知データを返却する
 */
exports.Eq_dEntitity = {
  /**
 * デバイスIDから１日以内に起きた最新の感知データを返却する
 * prams:query U+数字５桁のuser_ID配列または文字列
 * prams:callback コールバック
 */
  getLatest : function(query, callback){
    var q, option;
    if(typeof query == "object" || typeof query == "array"){
//      console.log('query is type of array');
      q = [];
      for(var i =0; i < query.length; i++){
        q.push(query[i].id);
      }
      option = {keys: q,  descending:true};
    }else{
      option = {key: query,  descending:true};
    }
//      console.log('クエリ情報@M_deviceEntitity');
//      console.log(option);
    connectDoc('eq_d');
      db.view('sc003/latest', option , function (err, res) {
        console.log('err object @getLatest');
        console.log(err);
//        console.log('row object @getLatest');
//        console.log(res);
//        
      return callback(err,res)
    });
  },
  
  //デバイスIDから１年前までの感知データをget
  getHistory : function(query, callback){
    var option;
    var d = new Date();
    
    //スタート時間を取得　アクセス時間から１年前の日付を作成
    var toDoubleDigits = function(num) {
      num += "";
      if (num.length === 1) {
        num = "0" + num;
      }
     return num;     
    };
    var sd = String((d.getFullYear() - 1)) + 
        String(toDoubleDigits(d.getMonth()+1)) + 
        String(toDoubleDigits(d.getDate()));
    var today = String((d.getFullYear())) + 
        String(toDoubleDigits(d.getMonth()+1)) + 
        String(toDoubleDigits(d.getDate()));
//    
//    var sd = new Date(d.getFullYear() - 1,d.getMonth(),d.getDate());
    
    option = {startkey: [query, today], endkey:[query, sd], limit:2000,  descending:true};
//    console.log("query@getLatest");
//    console.log(option);
    connectDoc('eq_d');
    
      db.view('sc001/dlist', option , function (err, res) {
//        console.log('err object @getHistory');
//        console.log(err);
//        console.log('row object @getHistory');
//        console.log(res);
        if(!res) return callback({error:"データが取得できませんでした。"});
        var obj = new Object();
        var di = '';
        for(var i = 0; i < res.length; i++ ){
          if(di == '' || di != res[i].key[0]) {
            di = res[i].key[0];
            obj["device_id"] = di;
            obj["data"] = new Array();
          }
          obj.data.push(res[i].value);
        }
      return callback(err,obj)
    });
  },
  
  getLogDate : function(query, callback){
    //リクエスト時間の計算
    var dt = new Date();
    dt.setFullYear(query.substr(0,4));
    dt.setMonth(parseInt(query.substr(4,2)) - 1);
    dt.setDate(query.substr(6,2));
    dt.setHours(query.substr(8,2));
    dt.setMinutes(query.substr(10,2));
    dt.setSeconds(query.substr(12,2));
    var sd = new Date(dt.clone().setSeconds(dt.getSeconds() - 150));
    var ed = new Date(dt.clone().setSeconds(dt.getSeconds() + 150));
    var startDate = sd.toFormat('YYYYMMDDHH24MISS');
    var endDate = ed.toFormat('YYYYMMDDHH24MISS');
    
    
    
    option = {startkey: startDate, endkey:endDate, limit:1000};
//    console.log("option@getLogDate");
//    console.log(option);
    connectDoc('eq_d');
    db.view('sc002/wlist', option , function (err, res) {
//    console.log("res@getLogDate");
//    console.log(res);
      return callback(err,res)
    });
  }
};



/**
 * fl_dへのアクセス
 * 雷情報に関するデータベース
 * getLatest：デバイスIDから１日以内に起きた最新の感知データを返却する
 * getHistory：デバイスIDから１年前までの感知データを返却する
 */
exports.Fl_dEntitity = {
  //デバイスIDから１日以内に起きた最新の感知データをget
  getLatest : function(query, callback){
    var q, option;
    if(typeof query == "object" || typeof query == "array"){
//      console.log('query is type of array');
      q = [];
      for(var i =0; i < query.length; i++){
        q.push(query[i].id);
      }
      option = {keys: q,  descending:true};
    }else{
      option = {key: query,  descending:true};
    }
//      console.log('クエリ情報@M_deviceEntitity');
//      console.log(option);
    connectDoc('fl_d');
      db.view('sc003/latest', option , function (err, res) {
        console.log('err object @getLatest');
        console.log(err);
//        console.log('row object @getLatest');
//        console.log(res);
        
      return callback(err,res)
    });
  },
  
  //デバイスIDから過去のの感知データをget
  getHistory : function(query, callback){
    var q, option;
    var d = new Date();
    var sd = new Date(d.getFullYear() - 1,d.getMonth(),d.getDate());
    if(typeof query == "object" || typeof query == "array"){
//      console.log('query is type of array');
      q = [];
      for(var i =0; i < query.length; i++){
        q.push(query[i].id);
      }
      option = {startkey: [q, sd], limit:2000,  descending:true};
    }else{
      option = {startkey: [query, sd], limit:2000,  descending:true};
    }
    
//    console.log("query@getLatest");
//    console.log(option);
    connectDoc('fl_d');
      db.view('sc001/dlist', option , function (err, res) {
//        console.log('err object @getHistory');
//        console.e.log('err object @getHistory');
//        console.e.log('err object @getHistory');
//        console.log(err);
//        console.log('row object @getHistory');
//        console.log(res);
        if(!res) return callback({error:"データが取得できませんでした。"});
        var obj = new Object();
        var di = '';
        for(var i = 0; i < res.length; i++ ){
          if(di == '' || di != res[i].key[0]) {
            di = res[i].key[0];
            obj["device_id"] = di;
            obj["data"] = new Array();
          }
          obj.data.push(res[i].value);
        }
      return callback(err,obj)
    });
  }
};



/**
 * i_dataへのアクセス
 * 最新情報に関するデータベース
 * getLatest：デバイスIDから１日以内に起きた最新の感知データを返却する
 */
exports.I_dataEntitity = {
  //デバイスIDからユーザー情報をGETし返却する
  getLatest : function(query, callback){
    var q = [];
    for(var i =0; i < query.length; i++){
      q.push('DEV_' + query[i].id);
    }
//      console.log('クエリ情報@M_deviceEntitity');
//      console.log(q);
    connectDoc('i_data');
    db.get(q, function(err, doc) {
      if(err){
        return callback(err,doc);
      }
//      console.log('デバイス情報@M_deviceEntitity');
//      console.log(doc);
      return callback(err,doc);
    });
  }
};



/**
 * comment_dataへのアクセス
 * コメント情報に関するデータベース
 * getComment：感知データIDに関するコメントをすべて取得し返却する
 */
exports.Comment_dataEntitity = {
  //デバイスIDから１日以内に起きた最新の感知データをget
  getComment : function(query, callback){
    var q = [];
    for(var i =0; i < query.length; i++){
      q.push('DEV_' + query[i].id);
    }
//        console.log('query @getComment');
//        console.log(q);
    connectDoc('comment_data');
      db.view('sc001/indexByDevice', {keys: q, descending:true} , function (err, res) {
        console.log('err object @getLatest');
        console.log(err);
//        console.log('row object @getComment');
//        console.log(res);
      return callback(err,res)
    });
  },
  getRelatedComment : function(query, callback){
//        console.log('query @getComment');
//        console.log(q);
    connectDoc('comment_data');
      db.view('sc001/indexByRelated', {key: query, descending:true} , function (err, res) {
        console.log('err object @getLatest');
        console.log(err);
//        console.log('row object @getComment');
//        console.log(res);
      return callback(err,res)
    });
  },
  saveComment : function(query, data, callback){
    connectDoc('comment_data');
//    console.log("query, data@updateDevice");
//    console.log(query, data);
    db.save(query, data , function(err, doc) {
    console.log("err@updateUser");
    console.log(err);
//    console.log("doc@updateUser");
//    console.log(doc);
      if(err){
        return callback(err);
      }
      return callback(err,doc);
    });
  }
};





/**
 * eqimageへのアクセス
 * グラフイメージ情報に関するデータベース
 * getChartImage：感知データIDから合成加速度イメージを取得し返却する
 */
exports.EqimageEntitity = {
  //感知データIDから合成加速度イメージを取得し返却する
  getChartImage : function(query, callback){
//      console.log('クエリ情報@M_deviceEntitity');
//      console.log(query);
    connectDoc('eqimage');
    db.getAttachment(query, 'eq.png', function(err, dat) {
      if(err){
        return callback(err);
      }

      var result = dat.body.toString('base64');
      callback( null, result );   
    });
    
  }
};



/**
 * 各viewへの中継
 * viewのアドレスはルーティングで設定し引数で渡す
 * getCSV：CSVデータを返却する
 */
exports.viewRelay = {
  //デバイスIDから１日以内に起きた最新の感知データをget
  getCSV : function(doc, key, option, callback){

      console.log('クエリ情報@getCSV');
      console.log(doc, key, option);
    connectDoc(doc);
      db.view(key, option , function (err, res) {
        console.log('err object @getLatest');
        console.log(err);
//        console.log('row object @getLatest');
//        console.log(res);
        
      return callback(err,res)
    });
  }
}


  
/**
 * 環境センサーなどその他のデータを取得
 */
exports.EtsTestEntitity = {
  /**
 * 渡された値をアップデートまたは追加登録する
 * prams:query 環境センサーデバイスID
 * prams:callback コールバック
 */
  getDevice : function(query, callback){
    var cloudantCon = Cloudant({account:"a9129fbe-98cf-4f4c-894b-c3f3bd6c83d3-bluemix", password:"7d79848e17a251508b3ea466c5e04d76d5b6fce57658d0c228b089af4c9d28a3"}, function(er, cloudant, reply) {
      if (er)
        throw er

      console.log('#####Connected with username: %s', reply.userCtx.name ,"###")
      cloudant = cloudantCon.db.use("etc_test");
  //    console.log("query, data@EtsTestEntitity.getDevice");
  //    console.log(query, data);
      var q = {
        "selector": {
          "$and": [
          {"deviceId": "dd4c78468628"},
          {"payload.d.memo":"OM"},
          {"payload.minTime":{"$exists":true}}
          ]
        },
        "fields": [
          "payload.minTime",
          "payload.d"
        ],
        "sort": [{"payload.minTime:number":"desc"}],
        "limit": 1
      }
      cloudant.find(q, function(err, doc) {
//      console.log("err@EtsTestEntitity.getDevice");
//      console.log(err);
//      console.log("doc@EtsTestEntitity.getDevice");
//      console.log(doc);
        if(err){
          return callback(err,doc);
        }
  //      console.log(doc);
        return callback(err,doc);
      });
    });
  }
}
  


/**
 * 天気予報データを取得
 */
exports.WeatherTestEntitity = {
  /**
 * 渡された値をアップデートまたは追加登録する
 * prams:query 環境センサーデバイスID
 * prams:callback コールバック
 */
  getDevice : function(query, callback){
    var cloudantCon = Cloudant({account:"a9129fbe-98cf-4f4c-894b-c3f3bd6c83d3-bluemix", password:"7d79848e17a251508b3ea466c5e04d76d5b6fce57658d0c228b089af4c9d28a3"}, function(er, cloudant, reply) {
      if (er)
        throw er

      console.log('#####Connected with username: %s', reply.userCtx.name ,"###")
      cloudant = cloudantCon.db.use("weather_test");
  //    console.log("query, data@EtsTestEntitity.getDevice");
  //    console.log(query, data);
      var q = {
        "selector":{"secTime":{"$exists":true}},
        "fields": [
          "secTime",
          "ctime",
          "payload"
        ],
        "sort": [{"secTime:number":"desc"}],
        "limit": 1
      }
      cloudant.find(q, function(err, doc) {
      console.log("err@EtsTestEntitity.getDevice");
      console.log(err);
      console.log("doc@EtsTestEntitity.getDevice");
      console.log(doc);
        if(err){
          return callback(err,doc);
        }
  //      console.log(doc);
        return callback(err,doc);
      });
    });
  }
}
  
function handleError(res, err) {
    return res.status(500).send(err);
}


