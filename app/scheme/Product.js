var db = require('../lib/connectdb.js'),

	ProductSchema = new db.Schema({
		name : {type: String, unique: true},
		amount : Number,
		detail : String,
		url : String,
		category : String,
		createdAt : Date,
		addedByAdmin : String
	}),

	MyProduct = db.mongoose.model('Product', ProductSchema);

module.exports = db.mongoose.model('Product', ProductSchema);
module.exports.addProduct = addProduct;
module.exports = MyProduct;

function addProduct(product, callback) {
	var pro = new MyProduct();
	pro.name = product.name;
	pro.amount = product.amount;
	pro.detail = product.detail;
	pro.url = product.url;
	pro.category = product.category;
	pro.createdAt = product.createdAt;
	pro.addedByAdmin = product.addedByAdmin;
	pro.save( function(err) {
		if (err) {
			callback(err);
		} else
		{
			callback(null, pro)
		}
	});
}