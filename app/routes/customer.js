var customer = require('../controller/customer.js');

module.exports = function(app) {

	app.get('/', customer.view);

	app.post('/order', customer.order);
	app.post('/order/agree', customer.agree );

}