var express = require('express');
var router = express.Router();
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/penny');
var dbhelper = require('./dbhelper.js');



router.get('/categories', function(req, res) {
  db.collection('transactions').distinct('fromCategory', function(err, result){
    console.log(result);
    res.json(result);
  });
});


module.exports = router;
