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

function addOrder(name, address, phone, note, deliveryDate, status, products, createdAt, callback) {
	var order = new MyOrder();

	order.name = name;
	order.address = address;
	order.phone = phone;
	order.note = note;
	order.deliveryDate = deliveryDate;
	order.products = products;
	order.createdAt = createdAt;
	order.status = status;

	order.save( function(err) {
		if (err) {
			callback(err);
		} else
		{
			callback(null, order)
		}
	})
}