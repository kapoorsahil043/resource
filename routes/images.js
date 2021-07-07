const express = require('express');
const router = express.Router();
const multer = require('multer');
const { DrawImage } = require('../models/drawImage');

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
        const fileName = 'image_upload_' + file.originalname.split(' ').join('_');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) => {
    const list = await DrawImage.find();

    if (!list) {
        res.status(500).json({ success: false });
    }

    res.send(list);
});

router.get(`/:id`, async (req, res) => {
    const list = await DrawImage.findById(req.params.id);
    if (!list) {
        res.status(500).json({ success: false });
    }
    res.send(list);
});

router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    console.log('req.user',req.user)
    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    console.log('req.protocol',req.protocol);
    const fileName = file.filename;
    const basePath = `https://${req.get('host')}/public/uploads/`;
    
    let data = new DrawImage({
        image: `${basePath}${fileName}`,
        name: req.body.name,
        user: req.user.userId,
    });

    data = await data.save();

    if (!data) return res.status(500).send('Image cannot be uploaded');

    res.send(data);
});

router.delete('/:id', (req, res)=>{
    DrawImage.findByIdAndRemove(req.params.id).then(item =>{
        if(item) {
            return res.status(200).json({success: true, message: 'the images is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "Images not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

module.exports = router;
