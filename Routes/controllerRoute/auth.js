const express = require('express');
const multer = require('multer');
const {signup_get,login_get,signup_post,login_post,logout_get} = require('../../controller/authController');


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

router.route('/signup').get(signup_get);
router.route('/login').get(login_get);

router.route('/signup').post(upload,signup_post);
router.route('/login').post(login_post);
router.route('/logout').get(logout_get);

module.exports = router;
