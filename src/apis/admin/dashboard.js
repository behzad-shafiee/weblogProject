const express = require('express');
const router = express.Router();

const Blogger = require('../../../module/blogger');
const controlers = require('../../contrlores/controlers');
const middlewares = require('../../middlewares/middlewares');

const articles = require('./articles');


router.get('/', controlers.showDashboardUser);

//articles
router.use('/articles', articles);


router.get('/seeBloggers', controlers.showBloggers);
router.post('/changePassBlogger', controlers.doChangePassBlogger);


module.exports = router;