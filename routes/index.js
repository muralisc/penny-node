var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

// router.get('/categories', function(req, res) {
//   res.json({ title: ['Express'] });
// });

// router.post('/categories', function(req, res) {
//   res.json(req.body);
// });


router.get('/summary', function(req, res) {
  res.render('summary');
});

module.exports = router;
