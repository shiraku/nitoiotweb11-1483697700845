/**
 * CSVデータ関連api file
 */

'use strict';
var express = require('express');
var cloudantUtil = require('./../../lib/cloudantUtil');
var app = express();
var jconv = require('jconv');
require('date-utils');

/***********************************************
 * CSVデータ関連 user
 * getCSV:CSVデータの取得api file
 *************************************************/
var dataDownload = {
  /**
   * CSVデータの取得api file
   * prams:req express requestオブジェクト
   * prams:res express responseオブジェクト
   */
  getCSV: function (req, res) {
    if (!req.user) {
      return res.status('200').json({
        error: "ログインされていません"
      });
    }

    var csv = new Object();
    switch (req.params.type) {
    case "1":
      csv.db = 'eqdata'
      csv.url = 'd1/eq'
      csv.prefix = "";
      csv.name = "AQ";
      break;
    case "2":
      csv.db = 'eqdata';
      csv.url = 'd1/aq';
      csv.prefix = "";
      csv.name = "AQ";
      break;
    case "3":
      csv.db = 'eqdata';
      csv.url = 'd1/al';
      csv.prefix = "AL_";
      csv.name = "AL";
      break;
    case "4":
      csv.db = 'eqdata';
      csv.url = 'd1/af';
      csv.prefix = "AF_";
      csv.name = "AF";
      break;
    case "5":
      csv.db = 'fldata';
      csv.url = 'd1/fl';
      csv.prefix = "FL_";
      csv.name = "FL";
      break;
    case "6":
      csv.db = 'm_device';
      csv.url = 'd1/dv';
      csv.prefix = "DEV_";
      csv.name = "DEVICE";
      break;

    };
    var option = new Object();
    var st = new Date(req.params.st);
    var et = new Date(req.params.et);
    var deviceArr = function (dl) {
      var arr = new Array();
      dl.forEach(function (d) {
        arr.push(d.id);
      });
      return arr;
    }
    var st = new Date(req.params.st);
    var et = new Date(req.params.et);
    if(req.params.type != "6"){
      option.startkey = [st.toFormat('YYYY/MM/DD'), req.params.dev];
      option.endkey = [et.toFormat('YYYY/MM/DD'), req.params.dev];
    } else {
      option.key = "DEV_" + req.params.dev;
    }
    var self = this;
    var reqest = req;
    var response = res;


    cloudantUtil.viewRelay.getCSV(csv.db, csv.url, option, function (err, dat) {
      if (err) {
        return response.status('200').json(err);
      }
      var filterData = new Array();
      dat.forEach(function(element){
//      console.log(element);
        if(element.Did == reqest.params.dev || element.id == "DEV_" + reqest.params.dev){
          filterData.push(element);
        } 
      });
      if(!filterData.length) return response.status('200').json({error: "データが存ありません。"});
//      console.log(filterData);
      var csvData = self.createCSV(filterData);
//      console.log(csvData);
      var filename = csv.name  + '_' + st.toFormat('YYYYMMDD') + '_' + et.toFormat('YYYYMMDD') + '.csv';
      response.setHeader('Content-disposition', 'attachment; filename=' +  encodeURIComponent(filename));
      response.setHeader('Content-Type', 'text/csv; charset=Shift_JIS');


      response.write(jconv.convert("'" + csvData, 'UTF8', 'SJIS'));
      response.end();
    });
  },
  
  createCSV : 
    function (dat) {
//        console.log("Object.keys(dat)@createCSV");
//        console.log(Object.keys(dat[0]));
    var header = Object.keys(dat[0]).join(',') + "\n";

    var body = dat.map(function(d){
//        console.log("d@createCSV");
//        console.log(d);
        return Object.keys(d).map(function(key) {
//          console.log("key@createCSV");
//          console.log(key);
            return String(d[key]);
        }).join(',');
    }).join("\n");

    return header + body;
    }
}
module.exports = dataDownload;