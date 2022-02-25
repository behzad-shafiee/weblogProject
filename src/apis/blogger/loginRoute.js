const express = require('express');
const router = express.Router();

const controlers = require('../../contrlores/controlers');
const validatores = require('../../validatores/validatores');
const middlewares = require('../../middlewares/middlewares');





router.get('/page', middlewares.checkSession, controlers.showLoginPage);

router.post('/page/doing',validatores.arrOfvalidateLogin(),validatores.doValidateLogin, controlers.doLogin);





module.exports = router;