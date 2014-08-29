'use strict';

var Product = require('../scheme/product.js');
	
module.exports = {

	productPage: function(req, res) {
		res.render('./admin/product/productpage', {
			admin: req.session.addProduct
		});
	},

	addProduct: function(req, res) {
		
		res.render('./admin/product/add', {
			admin: req.session.admin
		}); 
	},

	addnew: function(req, res) {
	
		var name = req.body.name,
			amount = req.body.amount,
			detail = req.body.detail,
			url = req.body.url,
			category = req.body.category, 
			createdAt = new Date(),
			addedByAdmin = req.session.admin;

		Product.addProduct({
							 'name': name, 
							 'amount': amount, 
							 'detail': detail, 
							 'url': url, 
							 'category': category, 
							 'createdAt': createdAt, 
							 'addedByAdmin': addedByAdmin
							},
						function(err, name) {
							if (err) {
                                throw (err);
                            }
							res.redirect('/admin/manage/product/add');
						}
		);

	},

	view: function(req, res) {
		
		var skip = 0,
			limit = 2;

		if (req.query.skip) {
			skip = req.query.skip;
		} 

		Product.find({}, {}, {skip: skip*limit , limit: limit})
			   .exec(function(err, products) {

			   		var exp = [],
			   			continueS = 1;

		   			products.forEach( function(product) {

		   				exp.push({

		   					name: product.name,
		   					category: product.category,
		   					_id: product._id,
		   					amount: product.amount,
		   					detail: product.detail,
		   					url: product.url,
		   					createdAt: product.createdAt,
		   					addedByAdmin: product.addedByAdmin,
		   					urlDelel: '?action=del&&id=' + product._id ,
		   					urlModify: './view/modify?id=' + product._id 

		   				});

		   			});

			   		if (exp.length === 0) {
			   				continueS = 0;
			   		}

					res.render('./admin/product/view', {
						exp: exp,
						skip: skip,
						continueS: continueS
					});

		   		});
			
		if (req.query.action === 'del') {
			Product.remove({_id: req.query.id}, function(err) {

			});	
		} 

	},

	modifyPage: function (req, res) {

		var productId = req.query.id;

		Product.findOne({_id:productId})
			   .exec( function(err, product) {
			   		res.render('./admin/product/modify', {
			   			admin: req.session.admin,
			   			name: product.name,
			 			category: product.category,
			 			amount: product.amount,
			 			detail: product.detail,
			 			url: product.url,
			 			_id: product._id
		  			});

			});
	},

	modified: function (req, res) {

		var productId = req.body.id,
			name = req.body.name,
			amount = req.body.amount,
			detail = req.body.detail,
			url = req.body.url,
			category = req.body.category;

		Product.update({_id: productId},  
						{ 
							$set: { 
								name: name, 
								amount: amount, 
								detail: detail,
								url : url,
								category : category
							}
						},{},function (err) {}
					);
		res.redirect('/admin/manage/product/view');

	},

	search: function(req, res) {

			res.render('./admin/product/search', {
				admin: req.session.admin
			});

	},

	searchShow: function (req, res) { 
		
		var skip = 0,
			limit = 2;

		if (req.query.skip) {
			skip = req.query.skip;
		} 

		Product.find( {name : req.body.name}, {}, {skip: skip*limit , limit: limit})
			   .exec(function(err, products) {
		
					var exp = [],
						continueS = 1;

					products.forEach( function(product) {
							exp.push({
								admin: req.session.admin,
		   						name: product.name,
		   						category: product.category,
		   						_id: product._id,
		   						amount: product.amount,
		   						detail: product.detail,
		   						url: product.url,
		   						createdAt: product.createdAt,
		   						addedByAdmin: product.addedByAdmin,
		   						urlDelel: '?action=del&&id=' + product._id ,
		   						urlModify: './view/modify?id=' + product._id 
		   					});
					});

					res.render('./admin/product/searchshow', {
						exp: exp,
						skip: skip,
						continueS: continueS
					});
				
				});
			   
	}
};