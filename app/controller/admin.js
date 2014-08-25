var User = require('../scheme/user.js'),
	Product = require('../scheme/product.js'),
	Order = require('../scheme/order.js'),
	fs = require('fs');
	
module.exports = {

	adminPage: function(req, res) {
				console.log("nam");
				fs.readFile('./admin.html', function(error, content) {
				if (error) {
					res.writeHead(500);
					res.end();
				}
				else {
					res.writeHead(200, { 'Content-Type' : 'text/html' });
					res.end(content, 'utf-8');
				}

			}); } ,

	signin: function(req, res) {
				console.log("ddddđ"+req.body.username);
				var username = req.body.username,
					password = req.body.password;

				//console.log(username);
				//console.log(password);

				User.findOne({username: username}, {'password': 1})
					.exec( function (err, pass) {

					console.log(pass)
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