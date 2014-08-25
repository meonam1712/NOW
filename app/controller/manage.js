var User = require('../scheme/user.js'),
	Product = require('../scheme/product.js'),
	Order = require('../scheme/order.js');
	
module.exports = {

	managePage: function(req, res) {
					if (req.cookies['admin']!=null) {
						res.send('<img src="../public/lozi.jpg" alt="Smiley face" height="42" width="42">'
								+ 'Welcome' + req.cookies['admin'] 
								+ '<br><a href="/admin/manage/product">PRODUCT | </a>'
								+ '<a href="/admin/manage/order">ORDER</a>');
					}
	} 

}