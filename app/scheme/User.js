var db = require('../lib/connectdb.js'),

	UserSchema = new db.Schema({
		username : {type: String, unique: true},
		password : String,
		salt: String,
		hash: String
	});

module.exports = db.mongoose.model('User', UserSchema);
