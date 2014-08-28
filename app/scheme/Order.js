var db = require('../lib/connectdb.js'),

	OrderSchema = new db.Schema({
		name : String,
		address : String,
		phone : String,
		note : String,
		deliveryDate : String,
		status : String,
		products : [
					   	{ 
							productId : String,
							amount : String
				   	   	} 
				   ],
		createdAt: Date
	}),
	MyOrder = db.mongoose.model('Order', OrderSchema);

module.exports = db.mongoose.model('Order', OrderSchema);
module.exports.addOrder = addOrder;

function addOrder(ors, callback) {
	var order = new MyOrder();

	order.name = ors.name;
	order.address = ors.address;
	order.phone = ors.phone;
	order.note = ors.note;
	order.deliveryDate = ors.deliveryDate;
	order.products = ors.products;
	order.createdAt = ors.createdAt;
	order.status = ors.status;

	order.save( function(err) {
		if (err) {
			callback(err);
		} else
		{
			callback(null, order)
		}
	});
}