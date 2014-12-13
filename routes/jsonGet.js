var express = require('express');
var router = express.Router();
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/penny');
var async = require('async');
var dbhelper = require('./dbhelper.js');
var merge = require('merge');



router.get('/categories', function(req, res) {
  async.parallel([
    dbhelper.getFromCategories,
    // comma above because this is an array
  ],
  function(err, results){
    res.json(results[0]);
  });
});

/*
 *db.bands.aggregate(
 *[
 *    { $match: {
 *                email: /@/ ,
 *                fromCategory: /SBI/
 *                }
 *    }, {
 *        $group: {
 *            _id: "$fromCategory",
 *            count: {$sum: "$amount"}
 *            }
 *        }
 *]
 *)
 *
 */
router.get('/balances', function(req, res) {
  async.parallel({
    from: function(callback){
      db.collection('transactions').aggregate(
        [{
            $group: {
                _id: "$fromCategory",
                balances: {$sum: "$amount"}
                }
        }] , callback             // will be called as callback(err, result)
      );
    },
    to  : function(callback){
      db.collection('transactions').aggregate(
        [{
            $group: {
                _id: "$toCategory",
                balances: {$sum: "$amount"}
                }
        }] , callback             // will be called as callback(err, result)
      );
    },
    fromCategories: dbhelper.getFromCategories,
  }, 
  function(err, results){
    // now convert the results to consumable form
    async.parallel({
      from: function(callback){
        dbhelper.aggregateArrayToObject(results.from,callback);
      },
      to : function(callback){
        dbhelper.aggregateArrayToObject(results.to, callback);
      }
    },function(err, results1){
      res.json( results.fromCategories.map(function(item){
        var obj = {};
        obj[item] = (results1.to[item]?results1.to[item]:0)-results1.from[item];
        return obj;
      }).reduce(function(merged, next){
        return merge(merged, next); 
      }));
    });
  });
});

router.get('/expenses', function(req, res) {
  async.parallel({
    from: function(callback){
      db.collection('transactions').aggregate(
        [{
            $group: {
                _id: "$fromCategory",
                balances: {$sum: "$amount"}
                }
        }] , callback             // will be called as callback(err, result)
      );
    },
    to  : function(callback){
      db.collection('transactions').aggregate(
        [{
            $group: {
                _id: "$toCategory",
                balances: {$sum: "$amount"}
                }
        }] , callback             // will be called as callback(err, result)
      );
    },
    toCategories: dbhelper.getToCategories,
  }, 
  function(err, results){
    // now convert the results to consumable form
    async.parallel({
      from: function(callback){
        dbhelper.aggregateArrayToObject(results.from,callback);
      },
      to : function(callback){
        dbhelper.aggregateArrayToObject(results.to, callback);
      }
    },function(err, results1){
      res.json( results.toCategories.map(function(item){
        var obj = {};
        if( item.search('expense') > 0)
          obj[item] = results1.to[item] - (results1.from[item]?results1.from[item]:0);
        return obj;
      }).reduce(function(merged, next){
        return merge(merged, next); 
      }));
    });
  });
});


router.post('/transactions', function(req, res) {
  req.body.query.description = new RegExp(req.body.query.description);
  console.log(req.body);
  db.collection('transactions').find(req.body.query).limit(5).toArray(function(err, result){
    res.json(result);
  });
});

module.exports = router;
