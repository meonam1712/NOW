var User = require('../scheme/user.js'),
	Product = require('../scheme/product.js'),
	Order = require('../scheme/order.js'),
	fs = require('fs');
	
module.exports = {
	
	adminPage: function(req, res) {
		res.render('./admin/index', {
			title: 'Login Admin'
		});
	},

	signin: function(req, res) {
				console.log("ddddđ"+req.body.username);
				var username = req.body.username,
					password = req.body.password;

				User.findOne({username: username}, {'password': 1})
					.exec( function (err, pass) {
						if (pass!= null) {
							if (password == pass.password) {
								console.log('OKKKKKKKKKKKKKKKKK');
								res.cookie('admin', username,  { expires: new Date(Date.now() + 60*60*1000), httpOnly: true });
								res.redirect('/admin/manage');
							} else {
								console.log('FAILLLLLLLLLEDDD');
								res.redirect('/admin');
							}
						} else {
							console.log('USER NOT EXISTS');
							res.redirect('/admin');
						}
					});
	}
	
}