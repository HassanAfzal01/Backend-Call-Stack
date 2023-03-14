const express = require('express');
const multer = require('multer');
const {onlineUser_get} = require('../../controller/userController');
const {ensureAuthenticated} = require('../../middleware/ensureAuthenticated');

// For File Upload
const storage = multer.diskStorage({
     destination: (req, file, cb) => {
         cb(null, "./public/profileImage");
     },
     filename: (req, file, cb) => {
         cb(null, Date.now() + file.originalname);
     }
});
   
const fileFilter = (req, file, cb) => {
     if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/heif" || file.mimetype == "image/heic") {
         cb(null, true);
     } else {
         cb(null, false);
     }
};
   
const upload = multer({storage: storage, fileFilter: fileFilter}).single("image");


const router = express.Router();

router.route('/online').get(ensureAuthenticated,onlineUser_get);
// router.route('/login').get(login_get);

// router.route('/signup').post(upload,signup_post);
// router.route('/login').post(login_post);

module.exports = router;
