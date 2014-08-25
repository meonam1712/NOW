var User = require('../scheme/user.js'),
	Product = require('../scheme/product.js'),
	Order = require('../scheme/order.js');
	
module.exports = {

	orderPage: 	function(req, res) {
		if (req.cookies['admin']!=null) {
			res.send('<img src="../../public/lozi.jpg" alt="Smiley face" height="42" width="42">'
					+ 'Welcome ' + req.cookies['admin'] 
					+ '<br><a href="/admin/manage/product">PRODUCT | </a>'
					+ '<a href="/admin/manage/order">ORDER</a>' 
					+ '<br><a href="/admin/manage/order/view">Xem hóa đơn</a>'
					+'<br><a href="/admin/manage/order/search">Tìm kiếm hóa đơn</a>');
		} 
	},

	view: function(req, res) {
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
	}
}