'use strict';
//
var express = require('express');
var controller = require('./thing.controller');
var router = express.Router();
//
// var controller = require('../../lib/cloudantUtil');
// obtain sample live feed data from cloudant
router.get('/', controller.index);
router.get('/show', controller.show);
// router.get('/', controller.getLiveData);
// router.get('/show', controller.getLiveData);
// // router.get('/show', controller.show);
//
// //Below will be implemented later
// //router.get('/:id', controller.show);
// //router.post('/', controller.create);
// //router.put('/:id', controller.update);
// //router.patch('/:id', controller.update);
// //router.delete('/:id', controller.destroy);
 module.exports = router;
//
// // router.post('/login', controller.getLiveData);
// // router.post('/login', function(req, res) {
// //     // console.log(req.body.desc);
// //     console.log("hello");
// //     res.end();
// // });
/**
 * Module dependencies.
 */
