/**
 * Created by Emwykyu on 13/03/2016.
 */

//server.js

//set-up ================================================

var express = require('express');
var app = express;
var port = _process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parse');
var bodyParser = require('body-parse');
var session = require('express-session');

var configDB = require('./config/database.js;'); //CHANGE PATH IF NOT WORKING!

//config ==================================================

//require('./config/passport')(passport); //pass passport for configuration

//set up express application
app.use(morgan('dev')); //log every request to console
app.use(cookieParser()); //read cookies (for auth)
app.use(bodyParser()); //get information from html forms

app.set('view engine', 'ejs'); //set ejs for templating

//required for passport
app.use(session({ secret: 'gw2fyp' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('auth listening on port:  ' + port);