const express = require('express');
const multer = require('multer');
const {signUp_post,login_post} = require('../../apicontroller/authController');


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


router.route('/signup').post(upload,signUp_post);
router.route('/login').post(login_post);

module.exports = router;
