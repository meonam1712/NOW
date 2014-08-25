var admin = require('../controller/admin.js'),
	product = require('../controller/product.js'),
	manage = require('../controller/manage.js'),
	order = require('../controller/order.js');

module.exports = function(app) { 

  	app.get('/admin', admin.adminPage );
	app.post('/signin', admin.signin);
	app.get('/admin/manage', manage.managePage);
	app.get('/admin/manage/product', product.productPage);
	app.get('/admin/manage/product/add', product.addProduct);
	app.post('/add-new', product.addnew);
	app.get('/admin/manage/product/view', product.view );
	app.get('/admin/manage/product/view/modify', product.modifyPage);
	app.post('/admin/manage/product/view/modify/modified', product.modified );
	app.get('/admin/manage/product/search', product.search );
	app.post('/admin/manage/product/search/show', product.searchShow);

	app.get('/admin/manage/order', order.orderPage);
	app.get('/admin/manage/order/view', order.view );

}