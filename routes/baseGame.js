var express = require('express');
var router = express.Router();

/* GET baseGame page. */
router.get('/', function(req, res, next) {
  res.render('baseGame', { title: 'GW2 LeyLine:: The Base Game' });
});

module.exports = router;
