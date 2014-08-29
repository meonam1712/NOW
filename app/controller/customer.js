'use strict';

var Product = require('../scheme/product.js'),
	Order = require('../scheme/order.js');

module.exports = {

	view: function(req, res) {

		var skip = 0,
			limit = 2;

		if (req.query.skip) {
			skip = req.query.skip;
		} 
		
		Product.find({}, {}, {skip: skip*limit , limit: limit})
			   .exec(function(err, products) {

			   		var customer = [],
			   			continueS = 1;

			   		products.forEach( function(product) {

			   			customer.push({
			   				_id: product._id,
			   				name: product.name,
			   				amount: product.amount,
			   				detail: product.detail,
			   				category: product.category,
			   				url: product.url
			   			});

					});
			   		
			   		if (products.length === 0) {
			   				continueS = 0;
			   		}

					res.render('./user/view',{
						customer: customer,
						skip: skip,
						continueS: continueS
					});

			   });
			
	},
	
	order: function (req, res) { 

		var checks = [],
			i = 0,
			tmparr = '[',
			pro = [];

		if (Array.isArray(req.body.check)) { 
			checks = req.body.check;
		} else {
			checks.push(req.body.check);
		}

		checks.forEach( function(check) {

			var amount = req.body[check];
			

			Product.findOne({_id: check.toString()})
				   .exec( function back (err, product) {

				   		i = i + 1;

				  		if (product.amount >= amount && amount > 0) {

			   				pro.push({
		   						name: product.name,
		   						amount: amount,
		   						detail: product.detail,
		   						category: product.category,
		   						url: product.url
		   					});

		   				
		   					tmparr = tmparr + '{"productId":"' + product._id +
                            	             '", "amount":"' + amount + '"}';
                  		} 

		   				if (i< checks.length)  {
			   				tmparr = tmparr + ',';
		   				}
		   				else {
						 	tmparr = tmparr + ']';
						 	res.cookie('products', tmparr);
						}
					
						if (i === checks.length) {
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
			products = JSON.parse(req.cookies.products),
			createdAt = new Date(),
			status = 'NO';

			products.forEach( function(check) {			
				console.log(check);
				Product.findOne({_id: check.productId})
					   .exec( function back (err, product) {
					   		product.amount = product.amount - check.amount;
					   		product.save(function(err) {});
					   });

			});
				   		
			Order.addOrder({
							'name': name, 
							'address': address, 
							'phone': phone, 
							'note': note, 
							'deliveryDate': deliveryDate, 
							'status': status, 
							'products': products, 
							'createdAt': createdAt
						   }, 
						   function(err, name) {
								res.redirect('/');
							}
			);
			
	}
};