const express = require('express');
const router = express.Router();

const Blogger = require('../../../models/blogger');
const controlers = require('../../controllers/controlers');
const middlewares = require('../../middlewares/middlewares');
const tools = require('../../tools/tools');


const articles = require('./articles');
const uploadUpdateAvatar = tools.upload.single('updateAvatar');

router.get('/', controlers.showDashboardUser);

//articles
router.use('/articles', articles);


router.get('/seeBloggers', controlers.showBloggers);
router.post('/seeBloggers/changePassBlogger', controlers.doChangePassBlogger);
router.post('/seeBloggers/deleteBlogger', controlers.doDeleteBlogger);

router.post('/avatar/update', uploadUpdateAvatar, controlers.doUpdateAvatar);

module.exports = router;