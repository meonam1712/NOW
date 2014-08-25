var User = require('../scheme/user.js'),
	Product = require('../scheme/product.js'),
	Order = require('../scheme/order.js');

module.exports = {
	view: function(req, res) {
		var str = '<form action="/order" method="post">';

		str = str + '<table border="1" style="width:1000px">'
			   	+ '<tr>'
  			//+ '<td>Id</td>'
  				+ '<td>Product Name</td>'
  				+ '<td>Amount Left</td>'
  				+ '<td>Detail</td>'
  				+ '<td>Category</td>'
  				+ '<td>picture</td>'
  			//+ '<td>createdAt</td>'
  			//+ '<td>Contributor</td>'
				+ '</tr>';
			

		Product.find({})
			   .exec(function(err, products) {
			   		//console.log(arr);
			   		products.forEach( function(product) {
			   			console.log(product.amount);
			   			str = str + '<tr>'
  							//    + '<td>'+ product._id + '</td>'
  								+ '<td>'+ product.name + '</td>'
  							  	+ '<td>'+ product.amount + '</td>'
  							  	+ '<td>'+ product.detail + '</td>'
  							  	+ '<td>'+ product.category + '</td>'
  							  	+ '<td><img src='  + product.url + ' alt="Smiley face" height="42" width="42"></td>'
  						      //	+ '<td>'+ product.createdAt + '</td>'
  						      //	+ '<td>'+ product.addedByAdmin + '</td>'
  						      	+ '<td><input type="checkbox" name="check" value='+ product._id +' >Buy<br></td>'
  						      	+ '<td><input type="text" name='+ product._id +' >Số lượng muốn mua<br></td>'
						      	+ '</tr>';
					});
					str = str + '</table>'
						+'<div><input type="submit" value="Buy"/> </div>'
						+ '</form>';
					res.send(str);
			   });
			
	},

	order: function (req, res) { 
		var checks = [], str="";
	
		var str1 = '<h1> THÔNG TIN HÓA ĐƠN</h1><form action="/order/agree" method="post">'
				+'<div>	<label>Tên khác hàng:</label> <input type="text" name="name"/><br/></div>'
				+'<div><label>Địa chỉ nhận hàng:</label><input type="text" name="address"/><br/></div>'
				+'<div><label>SĐT liên lạc:</label><input type="text" name="phone"/><br/></div>'
				+'<div><label>Chú thích:</label><textarea name="note">Enter text here...</textarea></div>'
				+'<div>	<label>Ngày muốn nhận hàng:</label>	<input type="text" name="deliveryDate"/><br/></div>';
				//+'<div>	<label>Category:</label><input type="text" name="category"/><br/> </div>'
			str1 = str1 + '<table border="1" style="width:1000px">'
				+ '<tr>'
  				+ '<td>Product Name</td>'
  				+ '<td>Amount You Buy</td>'
  				+ '<td>Detail</td>'
  				+ '<td>Category</td>'
  				+ '<td>picture</td>'
				+ '</tr>';

		var i = 0,
			tmparr = '[';

		if (Array.isArray(req.body.check)) { 
			checks = req.body.check
		} else {
			checks.push(req.body.check);
		}
	

		console.log(checks);

		checks.forEach( function(check) {

			var amount = req.body[check];
			Product.update({_id: check}, { $inc: { amount : -amount} }, function(err, l) {

			});

			Product.findOne({_id: check.toString()})
			   .exec( function back (err, product) {
			   			i = i + 1;
			   			tmparr = tmparr + '{"productId":"'+ product._id + '", "amount":"'+ amount + '"}';

			   			if (i< checks.length)  {
			   				tmparr = tmparr + ',';
			   			}
			   			else {
							 tmparr = tmparr + ']';
							// str1= str1 + '<input type="hidden" name="products" value=' + tmparr + ' />'
							 console.log(tmparr);
							 res.cookie('products', tmparr);
						}
						
			   			console.log(i);
			   			str1 =  str1 + '<tr>'
  								+ '<td>'+ product.name + '</td>'
  							  	+ '<td>'+ amount + '</td>'
  							  	+ '<td>'+ product.detail + '</td>'
  							  	+ '<td>'+ product.category + '</td>'
  							  	+ '<td><img src='  + product.url + ' alt="Smiley face" height="42" width="42"></td>'
						      	+ '</tr>';

						if (i == checks.length) {
							str1 = str1 + '</table>'
								+'<div><input type="submit" value="Buy"/> </div>'
								+ '</form>';
							res.send(str1);
						}
						
			   });
	
		});

	},

	agree: function (req, res) {
		var name = req.body.name,
			address = req.body.address,
			phone = req.body.phone,
			note = req.body.note,
			deliveryDate = req.body.deliveryDate,
			products = JSON.parse(req.cookies['products']),
			createdAt = new Date(),
			status = 'NO';

		//console.log("dddd"+ products[]);

			Order.addOrder(name, address, phone, note, deliveryDate, status, products, createdAt, function(err, name) {
				if (err) throw (err);
				res.redirect('/');
			});
	}
}