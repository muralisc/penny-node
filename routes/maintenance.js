var express = require('express');
var csvparse = require('csv-parse');
var router = express.Router();
var util = require("util");
var fs = require("fs");
var path = require('path');
var async = require('async');
var dbhelper = require('./dbhelper.js');



router.get('/upload', function(req, res) {
  res.render("uploadPage", {title: "I love files!"});
});

router.get("/seedb", function(req, res) {
  var retString = "";
  req.db.collection('transactions').find().toArray(function(err, result) {
    if (err) throw err;
    result.forEach( function(line){
      // retString += line.email + ",";
      retString += line.amount + ",";
      retString += line.fromCategory + ",";
      retString += line.description + ",";
      retString += line.toCategory + ",";
      retString += line.date +"\n";
    });
    fs.unlink('message.txt');
    fs.appendFile('message.txt', retString, function (err) {
      if (err) throw err;
      res.sendFile(path.resolve(__dirname + '/../message.txt'));
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
        req.db.collection('transactions').drop(function(){
          populateDbFromCsv(req.files.myFile.path);
        });
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
