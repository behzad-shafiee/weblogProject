
const express = require('express');
const router = express.Router();


const path = require('path');
const multer = require('multer');

const tools = {};






const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('hello');
        cb(null, path.join(__dirname, '../../../public/img'));

    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now()+file.originalname)
    }
})

const uploadTmp = multer({
    storage: avatarStorage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb('invalid type filenam', false)
        };
        cb(null, true)
    }
});



router.get('/img', (req, res) => {

    res.render('test',{msg:null});
});

router.post('/img', (req, res) => {

    const upload=uploadTmp.single('avatar');

    upload(req, res, (err) => {

        if (err) {
            return res.status(500).json({
                msg: `err of multer:${err}`
            });
        };

        console.log(path.join(__dirname,`../../public/img/${req.file.originalname}`));

       
        return     res.render('test',{msg:'ok'});
    });
  
});






module.exports = router;