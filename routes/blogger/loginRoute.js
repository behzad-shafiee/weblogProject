const express = require('express');
const router = express.Router();

const controlers = require('../../controllers/controllers');
const validatores = require('../../validators/validatores');
const middlewares = require('../../middlewares/middlewares');





router.get('/', middlewares.checkSession, controlers.showLoginPage);

router.post('/doing',validatores.arrOfvalidateLogin(),validatores.doValidateLogin, controlers.doLogin);





module.exports = router;