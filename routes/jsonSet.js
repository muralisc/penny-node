var express = require('express');
var router = express.Router();
var mongoskin = require('mongoskin');
var async = require('async');
var db = mongoskin.db('mongodb://localhost:27017/penny');
var dbhelper = require('./dbhelper.js');


/*
 * expects as post
 * req.body = {
 * fromCategory:[],
 * amount: 23,
 * description: "",
 * toCategory: [],
 * date: ,
 * }
 */
router.post("/transaction",function(req,res, next){
  dbhelper.setTransaction(req.body);
});


router.post("/updateTxns",function(req,res, next){
  async.map(req.body.ids, dbhelper.updateTxns.bind(req.body.update), function(err, results){
    res.json(results);
  });
});

router.get('/', function(req, res) {
  res.json({ title: ['Express'] });
});


module.exports = router;
