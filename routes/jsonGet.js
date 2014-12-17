var express = require('express');
var router = express.Router();
var async = require('async');
var dbhelper = require('./dbhelper.js');
var merge = require('merge');



router.get('/categories', function(req, res) {
  async.parallel([
    dbhelper.getFromCategories.bind(req),
    // comma above because this is an array
  ],
  function(err, results){
    res.json(results[0]);
  });
});

router.get('/toCategories', function(req, res) {
  async.parallel([
    dbhelper.getToCategories.bind(req),
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
      req.db.collection('transactions').aggregate(
        [{
            $group: {
                _id: "$fromCategory",
                balances: {$sum: "$amount"}
                }
        }] , callback             // will be called as callback(err, result)
      );
    },
    to  : function(callback){
      req.db.collection('transactions').aggregate(
        [{
            $group: {
                _id: "$toCategory",
                balances: {$sum: "$amount"}
                }
        }] , callback             // will be called as callback(err, result)
      );
    },
    fromCategories: dbhelper.getFromCategories.bind(req),
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
      req.db.collection('transactions').aggregate(
        [{
            $group: {
                _id: "$fromCategory",
                balances: {$sum: "$amount"}
                }
        }] , callback             // will be called as callback(err, result)
      );
    },
    to  : function(callback){
      req.db.collection('transactions').aggregate(
        [{
            $group: {
                _id: "$toCategory",
                balances: {$sum: "$amount"}
                }
        }] , callback             // will be called as callback(err, result)
      );
    },
    toCategories: dbhelper.getToCategories.bind(req),
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
  console.log(req.body.query);
  req.body.query.fromCategory = new RegExp(req.body.query.fromCategory);
  req.body.query.toCategory = new RegExp(req.body.query.toCategory);
  if( req.body.query.description == '<empty>'){
    req.body.query.description = '';
  }
  else
    req.body.query.description = new RegExp(req.body.query.description);
  if(Object.keys(req.body.query.date).length >0)
  {
    if(req.body.query.date.$gte != undefined)
      req.body.query.date.$gte = new Date(req.body.query.date.$gte);
    else
      req.body.query.date.$gte = new Date(0);
    if(req.body.query.date.$lte != undefined)
      req.body.query.date.$lte = new Date(req.body.query.date.$lte);
    else
      req.body.query.date.$lte = new Date();
  }
  else
  {
    delete req.body.query.date;
  }
  console.log(req.body.query);
  req.db.collection('transactions').find(req.body.query).limit(req.body.limit).toArray(function(err, result){
    res.json(result);
  });
});

module.exports = router;
