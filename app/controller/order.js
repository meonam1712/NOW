'use strict';

var Order = require('../scheme/order.js');
	
module.exports = {

	orderPage: 	function(req, res) {

		res.render('./admin/order/order', {
			admin: req.cookies.admin
		});

	},

	view: function(req, res) {

		var skip = 0,
			limit = 2;

		if (req.query.skip) {
			skip = req.query.skip;
		} 
		
		Order.find({}, {}, {skip: skip*limit , limit: limit})
	   	   .exec(function(err, orders) {

   		   		var ors = [],
   		   			continueS = 1;

		   		orders.forEach( function(order) {

		   			ors.push({
		   				_id: order._id,
		   				name: order.name,
		   				address: order.address,
		   				phone: order.phone,
		   				deliveryDate: order.deliveryDate,
		   				note: order.note,
		   				products: JSON.stringify(order.products),
		   				createdAt: order.createdAt,
		   				status: order.status,
		   				urlDel: '?action=del&&id=' + order._id ,
		   				urlCheck: '?action=modify&&id=' + order._id
		   			});
		   			
				});

				if (ors.length === 0) {
			   				continueS = 0;
			   	}

				res.render('./admin/order/view',{
					admin: req.cookies.admin,
					orders: ors,
					continueS: continueS,
					skip: skip
				});

		   });

		if (req.query.action === 'del') {
			Order.remove({_id: req.query.id}, function(err) {

			});
		} else {
			Order.update({_id: req.query.id}, {status: 'YES'}, function(err) {

			});
		}
		
	}
};