var admin = require('../controller/admin.js'),
	product = require('../controller/product.js'),
	manage = require('../controller/manage.js'),
	order = require('../controller/order.js');

module.exports = function(app) { 

  	app.get('/admin', admin.adminPage);
	app.post('/signin', admin.signin);
	app.get('/admin/manage', check, manage.managePage);
	app.get('/admin/manage/product', check, product.productPage);
	app.get('/admin/manage/product/add', check, product.addProduct);
	app.post('/add-new', check, product.addnew);
	app.get('/admin/manage/product/view', check, product.view );
	app.get('/admin/manage/product/view/modify', check, product.modifyPage);
	app.post('/admin/manage/product/view/modify/modified', check, product.modified );
	app.get('/admin/manage/product/search', check, product.search );
	app.post('/admin/manage/product/search/show', check, product.searchShow);

	app.get('/admin/manage/order', check, order.orderPage);
	app.get('/admin/manage/order/view', check, order.view );

	function check(req, res, next) {
		if (req.session.admin) {
			next();
		}
	}
	
}