const express = require('express');
const router = express.Router();


const controlers = require('../../contrlores/controlers');
const validatores = require('../../validatores/validatores');
const middlewares = require('../../middlewares/middlewares');



router.get('/',controlers.doLogout);






module.exports = router;