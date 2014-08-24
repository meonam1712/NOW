var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

module.exports.mongoose = mongoose;
module.exports.Schema = Schema;

var username = 'namlozi',
	password = 'namlozi1712',
	address = '@ds063809.mongolab.com:63809/now';

function connect() {
	var url = 'mongodb://' +  username + ':' + password + address;
	mongoose.connect(url);
}

function disconnect() {
	mongoose.disconnect();
}

connect();