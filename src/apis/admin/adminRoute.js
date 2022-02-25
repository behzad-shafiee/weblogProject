const express = require('express');
const router = express.Router();

const Blogger = require('../../../module/blogger');
const controlers=require('../../contrlores/controlers');

const { body, validationResult } = require('express-validator');
const _ = require('lodash');
const bcrypt = require('bcrypt');



router.get('/dashboard',controlers.showBloggers);





module.exports = router;