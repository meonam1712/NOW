'use strict';

var express = require('express'),
	app = express(),
	http = require('http'),
	bodyParser = require('body-parser'),
	errorHandler = require('errorhandler'),
	cookieParser = require('cookie-parser'),
	textSearch = require('mongoose-text-search'),
	url = require('url'),
	cons = require ('consolidate'),
    dust = require('dustjs-linkedin');
    
app.engine('dust', cons.dust);
app.set('view engine', 'dust');
app.set('views', './app/view');
app.use("/public", express.static(__dirname + '/public'));
app.use(bodyParser());
app.use(cookieParser());

require('./app/routes/admin.js')(app);
require('./app/routes/customer.js')(app);
  	

http.createServer(app).listen(3000, function() {
	console.log('START SERVER');
});


