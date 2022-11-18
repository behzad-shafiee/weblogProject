const express = require('express');
const router = express.Router();

const controlers = require('../../controllers/controllers');
const validatores = require('../../validators/validatores');
const middlewares = require('../../middlewares/middlewares');

const tools=require('../../tools/tools');







const upload = tools.upload.single('avatar');

router.get('/', middlewares.checkSession, controlers.showRegisterPage);

router.post('/doing',upload,validatores.arrOfvalidateRegister(),validatores.doValidateRegister,controlers.doRegister );








module.exports = router;