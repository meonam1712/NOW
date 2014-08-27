var User = require('../scheme/user.js'),
	Product = require('../scheme/product.js'),
	Order = require('../scheme/order.js');
	
module.exports = {

	productPage: function(req, res) {

		if (req.cookies['admin']!=null) {
			res.render('./admin/product/productpage', {
				admin: req.cookies['admin']
			})
		} 

	},

	addProduct: function(req, res) {

		if (req.cookies['admin']!=null) {
			res.render('./admin/product/add', {
				admin: req.cookies['admin']
			})
		} 

	},

	addnew: function(req, res) {
	
		var name = req.body.name,
			amount = req.body.amount,
			detail = req.body.detail,
			url = req.body.url,
			category = req.body.category,
			createdAt = new Date(),
			addedByAdmin = req.cookies['admin'];

		Product.addProduct(name, amount, detail, url, category, createdAt, addedByAdmin, function(err, name) {
			if (err) throw (err);
			res.redirect('/admin/manage/product/add');
		});

	},

	view: function(req, res) {

		if (req.cookies['admin']!=null) {
			Product.find({})
				   .exec(function(err, products) {
			  
			   			var exp = [];

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
			   					url_del: "/admin/manage/product/view?action=del&&id=" + product._id ,
			   					url_modify: "/admin/manage/product/view/modify?id=" + product._id 

			   				})

			   			});

						res.render('./admin/product/view', {
							exp: exp
						})

			   		});
			
			if (req.query.action == 'del') {
				Product.remove({_id: req.query.id}, function(err) {

				});	
			} 
		}

	},

	modifyPage: function (req, res) {

		if (req.cookies['admin']!=null) {

			var productId = req.query.id;

			Product.findOne({_id:productId})
				   .exec( function(err, product) {

			   			res.render('./admin/product/modify', {
			   				admin: req.cookies['admin'],
			   				name: product.name,
			   				category: product.category,
			   				amount: product.amount,
			   				detail: product.detail,
			   				url: product.url
			   			});

			   		});
		} 
	},

	modified: function (req, res) {
		if (req.cookies['admin']!=null) {

			var productId = req.body.id,
				name = req.body.name,
				amount = req.body.amount,
				detail = req.body.detail,
				url = req.body.url,
				category = req.body.category;
			
			Product.update({_id: productId},  
								{ $set: {
									name: name, 
									amount: amount, 
									detail: detail,
									url : url,
									category : category
								}
							},{},function (err) {}
						);
			res.redirect('/admin/manage/product/view');

		}
	},

	search: function(req, res) {
		if (req.cookies['admin']!=null) {

			res.render('./admin/product/search', {
				admin: req.cookies['admin']
			});

		}
	},

	searchShow: function (req, res) { 
		if (req.cookies['admin']!=null) {
			
			Product.find( {name : req.body.name})
				   .exec(function(err, products) {
			
						var exp = [];

						products.forEach( function(product) {
								exp.push({
									admin: req.cookies['admin'],
			   						name: product.name,
			   						category: product.category,
			   						_id: product._id,
			   						amount: product.amount,
			   						detail: product.detail,
			   						url: product.url,
			   						createdAt: product.createdAt,
			   						addedByAdmin: product.addedByAdmin,
			   						url_del: "/admin/manage/product/view?action=del&&id=" + product._id ,
			   						url_modify: "/admin/manage/product/view/modify?id=" + product._id 
			   					})
						});

						res.render('./admin/product/searchshow', {
							exp: exp
						});
					
   					});
	
		}
	}
}