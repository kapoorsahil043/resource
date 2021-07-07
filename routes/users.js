const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = 'profile_' + file.originalname.split(' ').join('_');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

const uploadOptions = multer({ storage: storage });

router.post('/updateProfile', uploadOptions.single('image'), async (req,res) => {
    console.log('req.user',req.user);
    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    const basePath = `https://${req.get('host')}/public/uploads/`;

    if(!req.user.userId){
        return res.status(404).json({success: false , message: "Please login again!!"})
    }

    let user = await User.findByIdAndUpdate(req.user.userId,{
       image:`${basePath}${fileName}`
    }).select('-passwordHash -isAdmin');

    user.image = `${basePath}${fileName}`;

    res.send(user);
})



module.exports =router;