var express = require("express");
var router = express.Router();
const {ensureAuthenticated} = require('../middleware/ensureAuthenticated');

/* GET home page. */
router.get("/",ensureAuthenticated, function(req, res) {
	res.redirect('/api/v1/user/online');
});

module.exports = router;
