var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/penny');
var merge = require('merge');

var helper = {};

/*
 * data structure
 * data = {
 * fromCategory:[],
 * amount: 23,
 * description: "",
 * toCategory: [],
 * date: ,
 * }
 */
helper.setTransaction = function(data){
  db.collection('transactions').insert( {
    fromCategory: data.fromCategory[0],
    amount:       data.amount,
    description:  data.description,
    toCategory:   data.toCategory[0],
    date:         new Date(data.date)
  }, function(err, result) {
    if (err) throw err;
    console.log("db entry added:");
    console.log(result);
  });
}

/*
 * convert this:
 *
 *[ { _id: 'iitbCanara | bank', balances: 2321 },
 *  { _id: 'Express', balances: 84622 } ]
 *
 * to this:
 *
 * { 'iitbCanara | bank': 2321,
 *   Express: 84622 }
 *
 */
helper.aggregateArrayToObject = function(array, callback){
  var result = array.map(function(item){ 
    var obj = {};
    obj[item._id] = item.balances;
    return obj;
  }).reduce(function(merged, next){
    return merge(merged, next); 
  });
  callback(null, result);
}

helper.getFromCategories = function(callback){
  db.collection('transactions').distinct('fromCategory', function(err, result){
    callback(err, result);
  });
}

helper.getToCategories = function(callback){
  db.collection('transactions').distinct('toCategory', function(err, result){
    callback(err, result);
  });
}

// used with async.map
helper.updateTxns = function(item,callback){
  db.collection('transactions').updateById(item,{
      $set: {
        fromCategory: this.fromCategory[0],
      },
    }, function(err, result){
      if (err) throw err;
      callback(err,result);
  });
}

module.exports = helper;
