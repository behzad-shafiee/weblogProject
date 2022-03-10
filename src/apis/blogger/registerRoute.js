const express = require('express');
const router = express.Router();

const controlers = require('../../controllers/controlers');
const validatores = require('../../validators/validatores');
const middlewares = require('../../middlewares/middlewares');

const tools=require('../../tools/tools');







const upload = tools.upload.single('avatar');

router.get('/page', middlewares.checkSession, controlers.showRegisterPage);

router.post('/page/doing',upload,validatores.arrOfvalidateRegister(),validatores.doValidateRegister,controlers.doRegister );








module.exports = router;