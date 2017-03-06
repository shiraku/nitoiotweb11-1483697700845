/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
// var Thing; // this is not implemented yet. It should obtain Thing objection from cloudantUtil.
var Thing = require('../../lib/cloudantUtil');

// Below is a mock object; need to replaced by real implementation GET /things --> index
exports.index = function (req, res) {
        // return res.json([
        //     {
        //         "key": "1",
        //         "name": 'live feed 1',
        //         "info": "DBaSS, MBaSS, IoT"
        //     }, {
        //         "key": "2",
        //         "name": "live feed 2",
        //         "info": "mobilefirst, urbancode, bluemix"
        //     }
        // ])
        Thing.getLiveData(req,res,function(err, thing){
          if(err) { return handleError(res, err); }
          if(!thing) { return res.status(404).send('Not Found'); }
          return res.json(thing);
        });
    }


// Get a single thing
exports.show = function(req, res) {
  return res.json([
      {
          "key": "1",
          "name": 'live feed 1',
          "info": "DBaSS, MBaSS, IoT"
      }, {
          "key": "2",
          "name": "live feed 2",
          "info": "mobilefirst, urbancode, bluemix"
      }
  ])
  // Thing.findById(req.params.id, function (err, thing) {
  //   if(err) { return handleError(res, err); }
  //   if(!thing) { return res.status(404).send('Not Found'); }
  //   return res.json(thing);
  // });
};
/* Sample code
// Creates a new thing in the DB.
exports.create = function(req, res) {
  Thing.create(req.body, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(thing);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Thing.findById(req.params.id, function (err, thing) {
    if (err) { return handleError(res, err); }
    if(!thing) { return res.status(404).send('Not Found'); }
    var updated = _.merge(thing, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(thing);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.status(404).send('Not Found'); }
    thing.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};*/

function handleError(res, err) {
  return res.status(500).send(err);
}


// // //作っていただきたいAPI一覧 (get)// // // // // // // // // // // // //


//  ①ユーザー情報、デバイス一覧を取得するAPI
//  使用画面  ： デバイス一覧画面,グループ一覧
// 　Input   :   ユーザーID(グループID)
//  Output  :   ユーザー(グループ)情報
//  userInfo = [
// {
//   "userId": "",
//   "userName":"田中まさし",                      //TODO いる？？
//   "groupID":"",
//   "deviceList": [
//     {
//       "deviceId": "user000",
//       "deviceName": "デバイス１"
//     },
//     {
//       "deviceId": "user000",
//       "deviceName": "デバイス１"
//     },
//     {
//       "deviceId": "user000",
//       "deviceName": "デバイス１"
//     }
//   ],
// 'sendto':[
//   { 'name':'山田　修',
//     'id':'001',
//     'mailId':'yamada@nito.co.jp'
//   },
//   { 'name':'小林　武',
//     'id':'002',
//     'mailId':'kobayashi@nito.co.jp'
//   },
//   { 'name':'湯浅　あさみ',
//     'id':'003',
//     'mailId':'yuasa@nito.co.jp'
//   },
//   { 'name':'本田　宗太郎',
//     'id':'004',
//     'mailId':'honda@nito.co.jp'
//   }
// ]
// }]


//  ②デバイス詳細情報リストを取得するAPI
//  使用画面  ： デバイス一覧画面
// 　Input   :  デバイスIDのリスト
//  Output  :   デバイスの詳細情報リスト
//  deviceList = [
// {
//   "_id": "DEV_00000",
//   "_rev": "1-666b2d74c67adaba617389492ea782ea",  //不要
//   "deviceName": "デバイス0",
//   "responsiblePerson": "",
//   "telNo": "000-0000-0000",
//   "address": "000-0000-0000",                    //高塚さんのメモにはなかったが、表示に必要な情報
//   "memo": "000-0000-0000",                       //高塚さんのメモにはなかったが、表示に必要な情報
//   "sendto": [                                    //今回のページだと不要・・・TODO
//     {
//       "id": "user000",
//       "mailid": "nito_nems02@yahoo.co.jp",
//       "name": "デバイス０"
//     }
//   ],
//   "latitude": 35.6061776,
//   "longitude": 139.7167039
// }]


//  ③デバイスの最新ステータスを取得するAPI
//  使用画面  ： デバイス一覧画面
// 　Input   :  デバイスIDのリスト
//  Output  :   デバイスの最新ステータスリスト
//  statusList = [
// {
//   "_id": "DEV_00000",
//   "_rev": "1-666b2d74c67adaba617389492ea782ea",  //不要
//   "device_id": "00000",
//   "data": {
//     "type": "AL",
//     "date": "2017/2/16 10:55",
//     "v": 0,
//     "status":"1",
//      "type":"earthquake",
//      "seismicIntensity":"5.4",
//      'power':'大',                               //雷の場合
//      'leakage':'',                               //雷の場合
//      "slope":"",                                 //地震の場合
//      "commercialBlackout":"",
//      "equipmentAbnormality":"",
//     "datas": [
//       {
//         "name": "デバイス状態",
//         "value": ""
//       }
//     ]
//   }
// }


//  ④デバイスのコメントを取得するAPI
//  使用画面  ：   デバイス一覧画面
// 　Input   :   デバイスID＋③で取得した発生時間statsusList-data-dateのリスト
//  Output  :    ユーザーからのコメントリスト
// 　commentList = [
// {
//   "_id": "DEV_00000_xxxxxxxxx",
//   "commentList":[
//                 {
//                   'comment':'建物に破損あり',
//                   'commentDate':'2017/01/15 10:15',
//                 },
//                 {
//                   'comment':'業務を一時停止',
//                   'commentDate':'2017/01/15 10:15',
//                 }],
//         },

//  ⑤デバイスのグラフ情報を取得するAPI
//  使用画面  ：   デバイス一覧画面
// 　Input   :   デバイスIDのリスト
//  Output  :    地震の履歴情報
// 'earthquakeHistoryList':[
//   {
//     "device_id":"00000",
//     "data":[
//       {
//       "date_id":"20170216110735",
//       "date":"2017/02/16 11:07:35",
//       "datas":
//       [{"name":"震度",
//         "value":6,
//         "values":"6_u"
//       }]},
//       {"date_id":"20170216110254","date":"2017/02/16 11:02:54","datas":[{"name":"震度","value":6,"values":"6_u"}]},
//       {"date_id":"20170216105831","date":"2017/02/16 10:58:31","datas":[{"name":"震度","value":6,"values":"6_u"}]},
//       {"date_id":"20170216105553","date":"2017/02/16 10:55:53","datas":[{"name":"震度","value":6,"values":"6_u"}]},
//       {"date_id":"20170215182055","date":"2017/02/15 18:20:55","datas":[{"name":"震度","value":6,"values":"6_u"}]},
//       {"date_id":"20170215180448","date":"2017/02/15 18:04:48","datas":[{"name":"震度","value":6,"values":"6_u"}]},
//       {"date_id":"20170215174601","date":"2017/02/15 17:46:01","datas":[{"name":"震度","value":6,"values":"6_u"}]},
//       {"date_id":"20170215172801","date":"2017/02/15 17:28:01","datas":[{"name":"震度","value":6,"values":"6_u"}]},
//       {"date_id":"20170215163422","date":"2017/02/15 16:34:22","datas":[{"name":"震度","value":6,"values":"6_u"}]},
//       {"date_id":"20170214194843","date":"2017/02/14 19:48:43","datas":[{"name":"震度","value":6.5,"values":"7"}]}
//     ]}
// ]
//
//
//


//  ⑤デバイスのグラフ情報を取得するAPI
//  使用画面  ：   デバイス詳細画面
// 　Input   :   デバイスIDのリスト
//  Output  :    雷の履歴情報
//       'thunderHistoryList':[
//         {
//           "device_id":"00000",
//           "data":[
//             {"date_id":"20161025160205",
//             "date":"2016/10/25 16:02:05",
//             "datas":[{
//               "value":2,
//               "name":"雷レベル"
//             }]},
//             {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
//             {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
//             {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
//             {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
//             {"date_id":"20161025153619","date":"2016/10/25 15:36:19","datas":[{"value":2,"name":"雷レベル"}]},
//             {"date_id":"20160830030221","date":"2016/08/30 03:02:21","datas":[{"value":3,"name":"雷レベル"}]}]}
//
//       ]
// }
// ];


// ⑥アラート閾値取得のAPI(グループ単位)
// input    : グループID  groupId
// output   :
//            震度
//            長周期地震動
//            傾き
//            雷サージ電流
//            商用停電
//            機器死活


// ⑦アラート閾値取得のAPI(デバイス単位)
// input    : デバイスID  deviceId
// output   :
//            震度
//            長周期地震動
//            傾き
//            雷サージ電流
//            商用停電
//            機器死活




// // //作っていただきたいAPI一覧 (post)// // // // // // // // // // // // //

// ①グループ名編集のAPI
// input   :  グループId groupId        //key
//            グループ名 groupName
// Output  : 結果

// ②グループのアラート通知先追加のAPI
// input   :  名前 name
//            メールアドレス mailId
// Output  : 結果

// ③グループのアラート通知先編集のAPI
// input   :  名前 name
//            メールアドレス mailId
// Output  : 結果

// ④デバイス編集のAPI
// input   :  デバイスID deviceId       //key
//            デバイス名 deviceName
//            住所      address
//            緯度      latitude
//            経度      longitude
//            メモ      memo
//            責任者    responsiblePerson
//            連絡先    telNo
// Output  : 結果

// ⑤デバイスのアラート通知先追加のAPI
// input   :  名前 name
//            メールアドレス mailId
// Output  : 結果

// ⑥デバイスのアラート通知先編集のAPI
// input   :  名前 name
//            メールアドレス mailId
// Output  : 結果

// ⑦アラート設定のAPI
// input   :  グループID groupId       //key
//            震度
//            長周期地震動
//            傾き
//            雷サージ電流
//            商用停電
//            機器死活
// Output  : 結果

// ⑦アラート設定のAPI
// input   :  デバイスID deviceId       //key
//            震度
//            長周期地震動
//            傾き
//            雷サージ電流
//            商用停電
//            機器死活
// Output  : 結果

// ⑧データダウンロード
// input   :  開始期間
//            終了期間
//            ダウンロードデータ
// Output  :  CSVファイル
