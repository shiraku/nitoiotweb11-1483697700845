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
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.status(404).send('Not Found'); }
    return res.json(thing);
  });
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
