'use strict';

var express = require('express'),
	fs = require('fs'),
	app = express(),
	http = require('http'),
	User = require('./app/scheme/User.js'),
	Product = require('./app/scheme/Product.js'),
	Order = require('./app/scheme/Order.js'),
	bodyParser = require('body-parser'),
	errorHandler = require('errorhandler'),
	cookieParser = require('cookie-parser'),
	textSearch = require('mongoose-text-search'),
	url = require('url');

app.use("/public", express.static(__dirname + '/public'));
app.use(bodyParser());
app.use(cookieParser());

http.createServer(app).listen(3000, function() {
	console.log('START SERVER');
});

app.get('/admin', function(req, res) {
	console.log("nam");
	fs.readFile('./admin.html', function(error, content) {
		if (error) {
			res.writeHead(500);
			res.end();
		}
		else {
			res.writeHead(200, { 'Content-Type' : 'text/html' });
			res.end(content, 'utf-8');
		}

	});
});

app.post('/signin', function(req, res) {
	
	var username = req.body.username,
		password = req.body.password;

	console.log(username);
	console.log(password);

	User.findOne({username: username}, {'password': 1})
		.exec( function (err, pass) {

			console.log(pass)
			if (pass!= null)
			{
				if (password == pass.password) {
					console.log('OKKKKKKKKKKKKKKKKK');
					res.cookie('admin', username,  { expires: new Date(Date.now() + 60*60*1000), httpOnly: true });
					res.redirect('/admin/manage');
				} else {
					console.log('FAILLLLLLLLLEDDD');
					res.redirect('/admin');
				}
			} else {
				console.log('USER NOT EXISTS');
				res.redirect('/admin');
			}


		});

});


app.get('/admin/manage', function(req, res) {
	if (req.cookies['admin']!=null) {
		res.send('<img src="../public/lozi.jpg" alt="Smiley face" height="42" width="42">'
			+ 'Welcome' + req.cookies['admin'] 
			+ '<br><a href="/admin/manage/product">PRODUCT | </a>'
			+ '<a href="/admin/manage/order">ORDER</a>');
	} 
});

app.get('/admin/manage/product', function(req, res) {
	if (req.cookies['admin']!=null) {
		res.send('<img src="../../public/lozi.jpg" alt="Smiley face" height="42" width="42">'
			+ 'Welcome ' + req.cookies['admin'] 
			+ '<br><a href="/admin/manage/product">PRODUCT | </a>'
			+ '<a href="/admin/manage/order">ORDER</a>' 
			+ '<br><a href="/admin/manage/product/add">Thêm sản phẩm  </a>'
			+ '<br><a href="/admin/manage/product/view">Xem sản phẩm</a>'
			+'<br><a href="/admin/manage/product/search">Tìm kiếm sản phẩm</a>');
	} 
});

app.get('/admin/manage/product/add', function(req, res) {
	if (req.cookies['admin']!=null) {
		res.send('<img src="../../../public/lozi.jpg" alt="Smiley face" height="42" width="42">'
			+ 'Welcome ' + req.cookies['admin'] 
			+ '<br><a href="/admin/manage/product">PRODUCT | </a>'
			+ '<a href="/admin/manage/order">ORDER</a>' 
			+ '<br><a href="/admin/manage/product/add">Thêm sản phẩm  </a>'
			+ '<br><a href="/admin/manage/product/view">Xem sản phẩm</a>'
			+'<br><a href="/admin/manage/product/search">Tìm kiếm sản phẩm</a>'
			+ '<br/><form action="/add-new" method="post">'
			+'<div>	<label>Product Name:</label> <input type="text" name="name"/><br/></div>'
			+'<div><label>Amount:</label><input type="text" name="amount"/><br/></div>'
			+'<div><label>Detail:</label><textarea name="detail">Enter text here...</textarea></div>'
			+'<div>	<label>Url for picture:</label>	<input type="text" name="url"/><br/></div>'
			+'<div>	<label>Category:</label><input type="text" name="category"/><br/> </div>'
			+'<div><input type="submit" value="Add new"/> </div>'
			+ '</form>');
	} 
});

app.post('/add-new', function(req, res) {
	
	var name = req.body.name,
		amount = req.body.amount,
		detail = req.body.detail,
		url = req.body.url,
		category = req.body.category,
		createdAt = new Date(),
		addedByAdmin = req.cookies['admin'];

		Product.addProduct(name, amount, detail, url, category, createdAt, addedByAdmin, function(err, name) {
		if (err) throw (err);
		res.redirect('/admin/manage/product/add');
	}) 
});


app.get('/admin/manage/product/view', function(req, res) {
	if (req.cookies['admin']!=null) {
		var str = '<img src="../../../public/lozi.jpg" alt="Smiley face" height="42" width="42">'
			+ 'Welcome ' + req.cookies['admin'] 
			+ '<br><a href="/admin/manage/product">PRODUCT | </a>'
			+ '<a href="/admin/manage/order">ORDER</a>' 
			+ '<br><a href="/admin/manage/product/add">Thêm sản phẩm  </a>'
			+ '<br><a href="/admin/manage/product/view">Xem sản phẩm</a>'
			+'<br><a href="/admin/manage/product/search">Tìm kiếm sản phẩm</a>';

		str = str + '<table border="1" style="width:1000px">'
			+ '<tr>'
  			+ '<td>Id</td>'
  			+ '<td>Product Name</td>'
  			+ '<td>Amount</td>'
  			+ '<td>Detail</td>'
  			+ '<td>Category</td>'
  			+ '<td>picture</td>'
  			+ '<td>createdAt</td>'
  			+ '<td>Contributor</td>'
			+ '</tr>';
			

		Product.find({})
			   .exec(function(err, products) {
			   		//console.log(arr);
			   		products.forEach( function(product) {
			   			console.log(product.amount);
			   			str = str + '<tr>'
  							    + '<td>'+ product._id + '</td>'
  								+ '<td>'+ product.name + '</td>'
  							  	+ '<td>'+ product.amount + '</td>'
  							  	+ '<td>'+ product.detail + '</td>'
  							  	+ '<td>'+ product.category + '</td>'
  							  	+ '<td><img src='  + product.url + ' alt="Smiley face" height="42" width="42"></td>'
  						      	+ '<td>'+ product.createdAt + '</td>'
  						      	+ '<td>'+ product.addedByAdmin + '</td>'
  						      	+ '<td><a href="/admin/manage/product/view?action=del&&id=' +product._id +'">Xóa</a></td>'
  						      	+ '<td><a href="/admin/manage/product/view/modify?id=' +product._id +'">Chỉnh sửa</a></td>'
						      	+ '</tr>';
					});
					str = str + '</table>';
					res.send(str);
			   });
	console.log(req.query.id);
	if (req.query.action == 'del') {
		Product.remove({_id: req.query.id}, function(err) {

		});
	} 
		
	}
});

app.get('/admin/manage/product/view/modify', function (req, res) {
	if (req.cookies['admin']!=null) {

		var productId = req.query.id,
			str = '<img src="../../../../public/lozi.jpg" alt="Smiley face" height="42" width="42">'
			+ 'Welcome ' + req.cookies['admin'] 
			+ '<br><a href="/admin/manage/product">PRODUCT | </a>'
			+ '<a href="/admin/manage/order">ORDER</a>' 
			+ '<br><a href="/admin/manage/product/add">Thêm sản phẩm  </a>'
			+ '<br><a href="/admin/manage/product/view">Xem sản phẩm</a>'
			+'<br><a href="/admin/manage/product/search">Tìm kiếm sản phẩm</a>';

		Product.findOne({_id:productId})
			   .exec( function(err, product) {
			   		str = str + '<br/><form action="/admin/manage/product/view/modify/modified" method="post">'
						+'<div>	<label>Product Name:</label> <input type="text" name="name" value='+ product.name + ' /><br/></div>'
						+'<div><label>Amount:</label><input type="text" name="amount" value='+ product.amount + ' /><br/></div>'
						+'<div><label>Detail:</label><textarea name="detail">'+ product.detail + '</textarea></div>'
						+'<div>	<label>Url for picture:</label>	<input type="text" name="url" value='+ product.url+ ' /><br/></div>'
						+'<div>	<label>Category:</label><input type="text" name="category" value='+ product.category + ' /><br/> </div>'
						+ '<input type="hidden" name="id" value='+ product._id + ' />'
						+'<div><input type="submit" value="Update"/> </div>'
						+ '</form>';
			   		res.send(str);
			   });
	} 
});

app.post('/admin/manage/product/view/modify/modified', function (req, res) {
	if (req.cookies['admin']!=null) {
		var productId = req.body.id,
			name = req.body.name,
			amount = req.body.amount,
			detail = req.body.detail,
			url = req.body.url,
			category = req.body.category;
		console.log(productId);
		Product.update({_id: productId},  
							{ $set: {
								name: name, 
								amount: amount, 
								detail: detail,
								url : url,
								category : category
							}
						},{},function (err) {}
						);
		res.redirect('/admin/manage/product/view');
	}
});

app.get('/admin/manage/product/search', function(req, res) {
	if (req.cookies['admin']!=null) {

		var 
			str = '<img src="../../../../public/lozi.jpg" alt="Smiley face" height="42" width="42">'
			+ 'Welcome ' + req.cookies['admin'] 
			+ '<br><a href="/admin/manage/product">PRODUCT | </a>'
			+ '<a href="/admin/manage/order">ORDER</a>' 
			+ '<br><a href="/admin/manage/product/add">Thêm sản phẩm  </a>'
			+ '<br><a href="/admin/manage/product/view">Xem sản phẩm</a>'
			+'<br><a href="/admin/manage/product/search">Tìm kiếm sản phẩm</a>'
			+ '<br/><form action="/admin/manage/product/search/show" method="post">'
			+'<div>	<label>Search By Product Name:</label> <input type="text" name="name" /><br/></div>'
			+'<div><input type="submit" value="Search"/> </div>'
			+ '</form>';
		
		res.send(str);
	}
});

app.post('/admin/manage/product/search/show', function (req, res) { 
	//Product.plugin(textSearch);
	//Product.index({name : 'text'});
	var str =  '<table border="1" style="width:1000px">'
			+ '<tr>'
  			+ '<td>Id</td>'
  			+ '<td>Product Name</td>'
  			+ '<td>Amount</td>'
  			+ '<td>Detail</td>'
  			+ '<td>Category</td>'
  			+ '<td>picture</td>'
  			+ '<td>createdAt</td>'
  			+ '<td>Contributor</td>'
			+ '</tr>';
	Product.find( {name : req.body.name})
			.exec(function(err, products){
				console.log(req.body.name);
		products.forEach( function(product) {
			str = str + '<tr>'
  					  + '<td>'+ product._id + '</td>'
  					  + '<td>'+ product.name + '</td>'
  					  + '<td>'+ product.amount + '</td>'
  					  + '<td>'+ product.detail + '</td>'
  					  + '<td>'+ product.category + '</td>'
  					  + '<td><img src='  + product.url + ' alt="Smiley face" height="42" width="42"></td>'
  					  + '<td>'+ product.createdAt + '</td>'
  					  + '<td>'+ product.addedByAdmin + '</td>'
  					  + '<td><a href="/admin/manage/product/view?action=del&&id=?action=del&&id=' +product._id +'">Xóa</a></td>'
  					  + '<td><a href="/admin/manage/product/view/modify?id=' +product._id +'">Chỉnh sửa</a></td>'
					  + '</tr>';
		});

		str = str + '</table>';
		res.send(str);
   });
	

});


app.get('/', function(req, res) {
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
			
});

app.post('/order', function (req, res) { 
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

		})
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

});

app.post('/order/agree', function (req, res) {
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
});

app.get('/admin/manage/order', function(req, res) {
	if (req.cookies['admin']!=null) {
		res.send('<img src="../../public/lozi.jpg" alt="Smiley face" height="42" width="42">'
			+ 'Welcome ' + req.cookies['admin'] 
			+ '<br><a href="/admin/manage/product">PRODUCT | </a>'
			+ '<a href="/admin/manage/order">ORDER</a>' 
			+ '<br><a href="/admin/manage/order/view">Xem hóa đơn</a>'
			+'<br><a href="/admin/manage/order/search">Tìm kiếm hóa đơn</a>');
	} 
});

app.get('/admin/manage/order/view', function(req, res) {
	if (req.cookies['admin']!=null) {
		var str = '<img src="../../../public/lozi.jpg" alt="Smiley face" height="42" width="42">'
			+ 'Welcome ' + req.cookies['admin'] 
			+ '<br><a href="/admin/manage/product">PRODUCT | </a>'
			+ '<a href="/admin/manage/order">ORDER</a>' 
			+ '<br><a href="/admin/manage/order/view">Xem hóa đơn</a>'
			+'<br><a href="/admin/manage/order/search">Tìm kiếm hóa đơn</a>';

		str = str + '<table border="1" style="width:1000px">'
			+ '<tr>'
  			+ '<td>Id</td>'
  			+ '<td>Tên khách hàng</td>'
  			+ '<td>Địa chỉ</td>'
  			+ '<td>Số điện thoại</td>'
  			+ '<td>Ngày giao hàng</td>'
  			+ '<td>Chú thích</td>'
  			+ '<td>Sản phẩm mua</td>'
  			+ '<td>createdAt</td>'
  			+ '<td>Trạng thái</td>'
			+ '</tr>';
			

		Order.find({})
			   .exec(function(err, orders) {
			   		//console.log(arr);
			   		orders.forEach( function(order) {
			   			//console.log(product.amount);
			   			str = str + '<tr>'
  							    + '<td>'+ order._id + '</td>'
  								+ '<td>'+ order.name + '</td>'
  							  	+ '<td>'+ order.address + '</td>'
  							  	+ '<td>'+ order.phone + '</td>'
  							  	+ '<td>'+ order.deliveryDate + '</td>'
  							  	+ '<td>'+ order.note + '</td>'
  							  	+ '<td>'+ JSON.stringify(order.products) + '</td>'

  							  	//+ '<td><img src='  + product.url + ' alt="Smiley face" height="42" width="42"></td>'
  						      	+ '<td>'+ order.createdAt + '</td>'
  						      	+ '<td>'+ order.status + '</td>'
  						      	+ '<td><a href="/admin/manage/order/view?action=del&&id=' +order._id +'">Xóa</a></td>'
  						      	+ '<td><a href="/admin/manage/order/view?action=modify&&id=' +order._id +'">Duyệt hóa đơn</a></td>'
						      	+ '</tr>';
					});
					str = str + '</table>';
					res.send(str);
			   });
	console.log(req.query.id);
	if (req.query.action == 'del') {
		Order.remove({_id: req.query.id}, function(err) {

		});
	} else {
		Order.update({_id: req.query.id}, {status: 'YES'}, function(err) {

		});
	}
		
	}
});
