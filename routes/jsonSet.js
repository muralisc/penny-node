var express = require('express');
var router = express.Router();
var mongoskin = require('mongoskin');
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


router.post("/updateTxn",function(req,res, next){
  console.log(req.body.update.fromCategory[0]);
  db.collection('transactions').updateById(req.body.ids[0],{
      $set: {
        fromCategory: req.body.update.fromCategory[0],
      },
    }, function(err, result){
      if (err) throw err;
      res.json(result);
  });
});

router.get('/', function(req, res) {
  res.json({ title: ['Express'] });
});


module.exports = router;
