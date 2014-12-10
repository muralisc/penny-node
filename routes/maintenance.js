var express = require('express');
var csvparse = require('csv-parse');
var router = express.Router();
var util = require("util");
var fs = require("fs");
var mongoskin = require('mongoskin');
var path = require('path');
var async = require('async');
var dbhelper = require('./dbhelper.js');


var db = mongoskin.db('mongodb://localhost:27017/penny');

router.get('/upload', function(req, res) {
  res.render("uploadPage", {title: "I love files!"});
});

router.get("/seedb", function(req, res) {
  var retString = "";
  db.collection('transactions').find().toArray(function(err, result) {
    if (err) throw err;
    result.forEach( function(line){
      retString += line.email + ",";
      retString += line.amount + ",";
      retString += line.fromCategory + ",";
      retString += line.description + ",";
      retString += line.toCategory + ",";
      retString += line.time +"\n";
    });
    fs.unlink('message.txt');
    fs.appendFile('message.txt', retString, function (err) {
      if (err) throw err;
      res.sendFile(path.resolve(__dirname + '/../message.txt'));
    });
  });
});

router.get("/aggregate", function(req, res) {
  net = {}
  db.collection('transactions').aggregate([{
    $group:{
      _id: "$fromCategory",
      count: { $sum : "$amount" }
    }
  }], function(err, from) {
    if (err) throw err;
    db.collection('transactions').aggregate([{
      $group:{
        _id: "$toCategory",
        count: { $sum : "$amount" }
      }
    }], function( err, to){
      if (err) throw err;
      to_1 = {};
      from_1 = {}
      to.forEach(function(item){
        to_1[item._id] = item.count;
      });
      from.forEach(function(item){
        from_1[item._id] = item.count;
      });
      send = []
      for( var prop in to_1){
        if( prop.indexOf("bank") > -1)
          send.push( prop + "\t"+(to_1[prop] - from_1[prop]) );
      }
      res.render("uploadPage1", {result: send});
    });
  });
});

router.post("/upload", function(req, res, next){
  if (req.files) {
    // console.log(util.inspect(req.files));
    if (req.files.myFile.size === 0) {
      return next(new Error("Hey, first would you select a file?"));
    }
    fs.exists(req.files.myFile.path, function(exists) {
      if(exists) {
        res.end("Got your file!");
        populateDbFromCsv(req.files.myFile.path);
      } else {
        res.end("Well, there is no magic for those who don’t believe in it!");
      }
    });
  }
});

function populateDbFromCsv(filepath){
  fs.readFile(filepath, {encoding: "utf8"}, function (err, data) {
    if (err) throw err;
    categories = {};
    csvparse(data,function(err, output){
      output.forEach(function(line){
        // helper function to insert he database
        dbhelper.setTransaction({
          // email:        line[0],
          fromCategory: [ line[2] ],
          amount:       parseFloat(line[1]),
          description:  line[3],
          toCategory:   [ line[4] ],
          date:         new Date(line[5])
        });
      });
    });
  });
}

module.exports = router;
