var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/penny');

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
    date:         data.date
  }, function(err, result) {
    if (err) throw err;
    console.log("db entry added:");
    console.log(result);
  });
}

module.exports = helper;
