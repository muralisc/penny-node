var express = require('express');
var router = express.Router();
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/penny');


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
  setTransaction(req.body);
});

router.get('/', function(req, res) {
  res.json({ title: ['Express'] });
});


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
function setTransaction(data){
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

module.exports = router;
