const path = require('path');
const multer = require('multer');

const tools = {};





//multerTools
tools.avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('hello');
        cb(null, path.join(__dirname, '../public/img'));

    },
    filename: (req, file, cb) => {
        console.log(file);
        const fileName= Date.now()+file.originalname;
        cb(null,fileName);
    }
})

tools.upload = multer({
    storage: tools.avatarStorage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb('invalid type filenam', false)
        };
        cb(null, true)
    }
});





module.exports = tools;