//Modelの読み込み
var db = require('../model/database');
var my_sample_db = db.my_sample_db;

//GETリクエスト
exports.api = function(req,res){
      console.log(my_sample_db());
  
      res.render('index',{'title':'ステージ'});
  
};

