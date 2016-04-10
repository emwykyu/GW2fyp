/**
 * Created by Emwykyu on 01/04/2016.
 */
var express = require('express');
var router = express.Router();

/* GET myGW2 page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
    res.render('myGW2', { title: 'GW2 LeyLine:: MY GW2' });
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;
