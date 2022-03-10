const express = require('express');
const router = express.Router();

const Blogger = require('../../../models/blogger');
const controlers = require('../../controllers/controlers');
const middlewares = require('../../middlewares/middlewares');

const articles = require('./articles');


router.get('/', controlers.showDashboardUser);

//articles
router.use('/articles', articles);


router.get('/seeBloggers', controlers.showBloggers);
router.post('/seeBloggers/changePassBlogger', controlers.doChangePassBlogger);
router.post('/seeBloggers/deleteBlogger', controlers.doDeleteBlogger);

module.exports = router;