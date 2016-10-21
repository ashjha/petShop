var express = require('express');
var path = require('path');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var app = express();

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/pet', function(err) {
    if (err) throw err;
    else console.log('Mongo db connnected');
});


var session = require('express-session'); 
app.use(session({
    secret : 'petanimal',
    saveUninitialized : true,
    resave : true,
    cookie : {
		maxAge : 12 * 60 * 60 * 1000,
	}
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

module.exports = app;