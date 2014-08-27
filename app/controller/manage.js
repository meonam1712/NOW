var User = require('../scheme/user.js'),
	Product = require('../scheme/product.js'),
	Order = require('../scheme/order.js');
	
module.exports = {

	managePage: function(req, res) {

		if (req.cookies['admin']!=null) {
			res.render('./admin/managepage', {
				admin : req.cookies['admin']
			});
		}

	}
}