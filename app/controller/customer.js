var User = require('../scheme/user.js'),
	Product = require('../scheme/product.js'),
	Order = require('../scheme/order.js');

module.exports = {

	view: function(req, res) {

		Product.find({})
			   .exec(function(err, products) {

			   		var customer = [];

			   		products.forEach( function(product) {

			   			customer.push({
			   				_id: product._id,
			   				name: product.name,
			   				amount: product.amount,
			   				detail: product.detail,
			   				category: product.category,
			   				url: product.url,
			   			});

					});

					res.render('./user/view',{
						customer: customer
					});

			   });
			
	},
	
	order: function (req, res) { 

		var checks = [],
			i = 0,
			tmparr = '[';

		if (Array.isArray(req.body.check)) { 
			checks = req.body.check
		} else {
			checks.push(req.body.check);
		}

		checks.forEach( function(check) {

			var amount = req.body[check],
				pro = [];

			Product.update({_id: check}, { $inc: { amount : -amount} }, function(err, l) {

			});

			Product.findOne({_id: check.toString()})
				   .exec( function back (err, product) {

			   			pro.push({
		   					name: product.name,
		   					amount: amount,
		   					detail: product.detail,
		   					category: product.category,
		   					url: product.url
		   				});

		   				i = i + 1;
		   				tmparr = tmparr + '{"productId":"'+ product._id + '", "amount":"'+ amount + '"}';

		   				if (i< checks.length)  {
			   				tmparr = tmparr + ',';
		   				}
		   				else {
						 	tmparr = tmparr + ']';
						 	res.cookie('products', tmparr);
						}
					
						if (i == checks.length) {
							res.render('./user/order', {
								products: pro
							});
						}
					
		   			});
	
		});

	},

	agree: function (req, res) {

		var name = req.body.name,
			address = req.body.address,
			phone = req.body.phone,
			note = req.body.note,
			deliveryDate = req.body.deliveryDate,
			products = JSON.parse(req.cookies['products']),
			createdAt = new Date(),
			status = 'NO';

			Order.addOrder(name, address, phone, note, deliveryDate, status, products, createdAt, function(err, name) {
				if (err) throw (err);
				res.redirect('/');
			});
			
	}

}