'use strict';

module.exports = {

	managePage: function(req, res) {

			res.render('./admin/managepage', {
				admin : req.cookies.admin
			});
			
	}
};