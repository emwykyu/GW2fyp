/**
 * Created by Emwykyu on 01/04/2016.
 */
var express = require('express');
var router = express.Router();

/* GET myGW2 page. */
router.get('/', function(req, res, next) {
    res.render('myGW2', { title: 'GW2 LeyLine:: MY GW2' });
});

module.exports = router;
