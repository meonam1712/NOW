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
				if (pass != null) {
					if (password === pass.password) {
						res.cookie('admin', username,  
                                   { 
                                       expires: new Date(Date.now() + 60*60*1000),
                                       httpOnly: true 
                                   });
						res.redirect('/admin/manage');
					} else {
						res.redirect('/admin');
					}
				} else {
					res.redirect('/admin');
				}
			});
	}
	
};