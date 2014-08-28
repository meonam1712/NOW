'use strict';

var User = require('../scheme/user.js');
	
module.exports = {
	
	adminPage: function(req, res) {
		res.render('./admin/index', {
			title: 'Login Admin'
		});
	},

	signin: function(req, res) {
				
		var username = req.body.username,
			password = req.body.password;

		User.findOne({username: username}, {'password': 1})
			.exec( function (err, pass) {
				if (err)  throw err
				pass.comparePassword(password, function(err, isMatch) {
					if (err)  throw err;
					if (isMatch) {
						req.session.admin = username;
						res.redirect('/admin/manage');
					} else {
						res.redirect('/admin');
					}
				}) ;
			});
	}
	
};