var express = require('express');
var path = require('path');

    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');

var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var mongo = require('mongodb'); //disabled for heroku compatibility
//var mongoose = require('mongoose'); //disabled for heroku compatibility

//mongoose.connect('mongodb://localhost/GW2fyp'); //disabled for heroku compatibility
//var db = mongoose.connection; //disabled for heroku compatibility

var routes = require('./routes/index');
var users = require('./routes/users');
var baseGame = require('./routes/baseGame');
var myGW2 = require('./routes/myGW2');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

    // BodyParser and CookieParser Middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));


// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


app.use('/', routes);
app.use('/users', users);
app.use('/baseGame', baseGame);
app.use('/myGW2', myGW2);

app.get('/', function(req, res) {
    res.render('baseGame.handlebars', { username: req.user.username, apiKey: req.user.apiKey});
});


// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});