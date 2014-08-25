var User = require('../scheme/user.js'),
	Product = require('../scheme/product.js'),
	Order = require('../scheme/order.js');
	
module.exports = {

	productPage: function(req, res) {
		if (req.cookies['admin']!=null) {
			res.send('<img src="../../public/lozi.jpg" alt="Smiley face" height="42" width="42">'
				+ 'Welcome ' + req.cookies['admin'] 
				+ '<br><a href="/admin/manage/product">PRODUCT | </a>'
				+ '<a href="/admin/manage/order">ORDER</a>' 
				+ '<br><a href="/admin/manage/product/add">Thêm sản phẩm  </a>'
				+ '<br><a href="/admin/manage/product/view">Xem sản phẩm</a>'
				+'<br><a href="/admin/manage/product/search">Tìm kiếm sản phẩm</a>');
		} 
	},

	addProduct: function(req, res) {
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
	},

	addnew: function(req, res) {
	
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
	});
	},

	view: function(req, res) {
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
	},

	modifyPage: function (req, res) {
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
	},

	modified: function (req, res) {
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
	},

	search: function(req, res) {
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
	},

	searchShow: function (req, res) { 
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
				.exec(function(err, products) {
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
	
	}
}