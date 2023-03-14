const express = require('express');
const multer = require('multer');
const {onlineUser_get} = require('../../apicontroller/usercontroller');
const auth = require('../../middleware/auth');

const router = express.Router();


router.route('/online').get(auth,onlineUser_get);

module.exports = router;
