'use strict';

module.exports = {

	managePage: function(req, res) {

		if (req.cookies.admin != null) {
			res.render('./admin/managepage', {
				admin : req.cookies.admin
			});
		}

	}
};