const express = require('express');
const router = express.Router();


const controlers = require('../../controllers/controllers');
const validatores = require('../../validators/validatores');
const middlewares = require('../../middlewares/middlewares');



router.get('/',controlers.doLogout);






module.exports = router;