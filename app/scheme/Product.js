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

	textSearch = require('mongoose-text-search'),

	MyProduct = db.mongoose.model('Product', ProductSchema);

ProductSchema.plugin(textSearch);
ProductSchema.index({ name : 'text'});
module.exports = db.mongoose.model('Product', ProductSchema);
module.exports.addProduct = addProduct;

function addProduct(name, amount, detail, url, category, createdAt, addedByAdmin, callback) {
	var pro = new MyProduct();
	pro.name = name;
	pro.amount = amount;
	pro.detail = detail;
	pro.url = url;
	pro.category = category;
	pro.createdAt = createdAt;
	pro.addedByAdmin = addedByAdmin;
	pro.save( function(err) {
		if (err) {
			callback(err);
		} else
		{
			callback(null, pro)
		}
	})
}