/**
 * Created by tangross on 15/8/15.
 */
'use restrict'

var config = require('../config/environment/development');
var cradle = require('cradle');
var fs = require('fs');
var dbName = config.ROOT_DB,
    chost = config.CHOST,
    cport = config.CPORT,
    cuser = config.CUSER,
    cpassword = config.CPASSWORD,
    curl = config.CURL;
var rootDoc = config.ROOT_DOC;
var db;

exports.init = function () {
    if (process.env.VCAP_SERVICES) {
        var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
        if (vcapServices.cloudantNoSQLDB) {
            chost = vcapServices.cloudantNoSQLDB[0].credentials.host;
            cport = vcapServices.cloudantNoSQLDB[0].credentials.port;
            cuser = vcapServices.cloudantNoSQLDB[0].credentials.username;
            cpassword = vcapServices.cloudantNoSQLDB[0].credentials.password;
            curl = vcapServices.cloudantNoSQLDB[0].credentials.url;
        }
        console.log('VCAP Services: ' + JSON.stringify(process.env.VCAP_SERVICES));
    }

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
    })
};

// Get root doc
exports.getLiveData = function (req, res) {
  // db.get(rootDoc, function (err, doc) {
  //     if (err) {
  //         return handleError(res, err);
  //     }
  //     return res.status(200).json(doc.attributes);
  // })
  var id = 'muser_u000';
  // var key = request.query.key;
    db.get('muser_u000', function (err, doc) {
        if (err) {
            return handleError(res, err);
        }
        return res.status(200).json(doc);
    })
};

//Get m_user doc
exports.M_userEntitity = {
  q : {
    "selector": {
      "_id": {
        "$eq": 'muer'
      }
    }
  },
  
  getUser : function(query){
    this.q.selector._id.$eq = 'muer' + query;
    db.get(this.q, function(err, doc) {
      if(err){
        return handleError(res, err);
      }
      return res.status(200).json(doc);
    });
  }
  
};

function handleError(res, err) {
    return res.status(500).send(err);
}
