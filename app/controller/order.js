'use strict';

var Order = require('../scheme/order.js');
	
module.exports = {

	orderPage: 	function(req, res) {

		if (req.cookies.admin != null) {
			res.render('./admin/order/order', {
				admin: req.cookies.admin
			});
		} 

	},

	view: function(req, res) {
		if (req.cookies.admin != null) {

			Order.find({})
	   		   .exec(function(err, orders) {

	   		   		var ors = [];

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

					res.render('./admin/order/view',{
						admin: req.cookies.admin,
						orders: ors
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
	}
};